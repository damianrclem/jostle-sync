/* eslint-disable vars-on-top, no-var */
import 'dotenv/config';
import axios from 'axios';
import { spawn, ChildProcess, exec } from 'child_process';
import fs from 'fs';
import { mkdir } from 'fs/promises';
import waitPort from 'wait-port';
import retry from 'async-retry';
import { CleanupProcess, LaunchProcess } from './types';

declare global {
  var RM_PROCESS_CLEANUP: Array<CleanupProcess>;
}

function createProcess(process: LaunchProcess): ChildProcess {
  const p = spawn(process.command, process.args);

  // log out stdout to file
  if (process.loggingStream) {
    p.stdout.on('data', (d) => {
      process.loggingStream?.write(`${process.command}: ${d.toString()}`);
    });
    p.stderr.on('data', (d) => {
      process.loggingStream?.write(`${process.command}: ${d.toString()}`);
    });
  }

  if (process.cleanup) {
    global.RM_PROCESS_CLEANUP.push(process.overrideProcessCleanup ? process.overrideProcessCleanup : p);
  }

  return p;
}

function runProcessToCompletion(process: ChildProcess): Promise<void> {
  return new Promise((res, rej) => {
    // hook to close and wait for 0 exit code
    process.on('close', (code) => {
      if (code === 0) res();
      else rej(code);
    });
  });
}

/**
 * this is waiting for temporal to boot up.  i found random 'default namespace' errors, and even
 * used tctl command line to check if the namespace existed, and it did, but this call i pulled from
 * the browser will come back when everything seems to be up and running.
 *
 * if there is a better way to know the namespace is setup and temporal is running, replace the call below!
 */
async function waitForTemporal(): Promise<void> {
  return await retry(
    () =>
      axios.get(
        'http://localhost:8088/api/namespaces/default/workflows/closed?startTime=2021-12-20T05%3A00%3A00.000Z&endTime=2022-01-20T04%3A59%3A59.000Z',
      ),
    {
      retries: 10,
    },
  );
}

export default async () => {
  /*
  before all tests run:
  - start docker-compose
  - run db migrations
  - start worker process
  - start api
  - start creditplus mock api
  - start encompass mock api
 */
  // create reference to the process's so they can be killed after
  global.RM_PROCESS_CLEANUP = [];

  // setup a filestream for logging
  mkdir('__tests__/integration/logs').catch(() => console.log('logs folder already exists'));
  const writeStream = fs.createWriteStream(`__tests__/integration/logs/${Date.now()}.log`);

  // load up docker-compose
  createProcess({
    command: 'docker-compose',
    args: ['up', '--no-color', '-d'],
    cleanup: true,
    overrideProcessCleanup: {
      kill: () => {
        if (process.env.RM_SKIP_DOCKER_COMPOSE_CLEANUP) {
          console.warn('skipping running `docker-compose down` command');
          return;
        }
        exec('docker-compose down');
      },
    },
    loggingStream: writeStream,
  });

  // wait for db to be available
  await waitPort({
    host: 'localhost',
    port: 5432,
  });

  // wait for temporal to be working
  await waitForTemporal();

  // run migrations
  const migrationsProcess = createProcess({
    command: 'yarn',
    args: ['run', 'migration:run'],
    cleanup: false,
    loggingStream: writeStream,
  });
  await runProcessToCompletion(migrationsProcess);

  // start up worker process
  createProcess({
    command: 'ts-node',
    args: ['src/workers/worker.ts'],
    cleanup: true,
    loggingStream: writeStream,
  });

  // start up api
  createProcess({
    command: 'ts-node',
    args: ['src/api/index.ts'],
    cleanup: true,
    loggingStream: writeStream,
  });

  // start up credit plus mock server
  createProcess({
    command: 'ts-node',
    args: ['src/mock-api/credit-plus/index.ts'],
    cleanup: true,
    loggingStream: writeStream,
  });

  // start up encompass mock server
  createProcess({
    command: 'ts-node',
    args: ['src/mock-api/encompass/index.ts'],
    cleanup: true,
    loggingStream: writeStream,
  });

  createProcess({
    command: 'ts-node',
    args: ['src/mock-api/sendgrid/index.ts'],
    cleanup: true,
    loggingStream: writeStream,
  });

  // wait for ports to open up
  await Promise.all([
    // wait for api port to become available
    waitPort({
      port: 3000,
      host: 'localhost',
    }),

    // wait for credit plus mock server to come up
    waitPort({
      port: 3005,
      host: 'localhost',
    }),

    // wait for encompass mock server to come up
    waitPort({
      port: 3004,
      host: 'localhost',
    }),

    // wait for sendgrid mock server to come up
    waitPort({
      port: 3006,
      host: 'localhost',
    }),
  ]);
};
