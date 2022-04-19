// TODO: Figure out how this import even works. Do not try installing! Breaks activitiy retry
// eslint-disable-next-line import/no-extraneous-dependencies
import { Worker, Core } from '@temporalio/worker';
import 'dotenv/config';
import * as activities from '../activities';
import { syncActiveDirectoryUsersFactory } from '../activities/syncActiveDirectoryUsers';
import { createMicrosoftGraphApiClient } from '../clients/microsoft-graph';

async function run() {

  const address = process.env.TEMPORAL_ADDRESS ?? 'localhost:7233';

  await Core.install({
    serverOptions: {
      namespace: 'default',
      address,
    },
  });

  // create microsoft graph api client
  const microsoftGraphApiClient = createMicrosoftGraphApiClient();

  // NOTE: how does this connect to temporal? https://github.com/temporalio/sdk-typescript/blob/a7e87946a2644765b12f377d4b53c0bff312992e/packages/test/src/load/worker.ts#L43
  const worker = await Worker.create({
    workflowsPath: require.resolve('../workflows'),
    // eslint-disable-next-line prefer-object-spread
    activities: Object.assign({}, activities, syncActiveDirectoryUsersFactory(microsoftGraphApiClient)),
    taskQueue: 'jostle-ad-sync',
  });
  await worker.run();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
