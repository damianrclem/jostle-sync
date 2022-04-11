// TODO: Figure out how this import even works. Do not try installing! Breaks activitiy retry
// eslint-disable-next-line import/no-extraneous-dependencies
import { Worker, Core } from '@temporalio/worker';
import 'dotenv/config';
import { createConnection } from 'typeorm';
import * as activities from '../activities';
import { createUdnOrderActivityFactory } from '../activities/createUdnOrderActivity';

async function run() {
  applyAxiosS3Logger();

  // without having this here, using `createConnection` without any parameters does not work!
  // eslint-disable-next-line no-unused-vars
  const connection = await createConnection();

  // create creditplus client
  const creditPlusClient = createCreditPlusClient();

  // create encompass client
  const encompassClient = createEncompassClient();

  // create s3 client
  const s3Client = getClient();

  const sendGridClient = createSendGridProxyClient();

  const address = process.env.TEMPORAL_ADDRESS ?? 'localhost:7233';

  await Core.install({
    serverOptions: {
      namespace: 'default',
      address,
    },
  });

  // NOTE: how does this connect to temporal? https://github.com/temporalio/sdk-typescript/blob/a7e87946a2644765b12f377d4b53c0bff312992e/packages/test/src/load/worker.ts#L43
  const worker = await Worker.create({
    workflowsPath: require.resolve('../workflows'),
    // eslint-disable-next-line prefer-object-spread
    activities: Object.assign(
      {},
      activities,
      createUdnOrderActivityFactory(creditPlusClient),
      createUdnOrderDbSaveActivityFactory(),
      getEncompassLoanFactory(encompassClient),
      getUdnOrderActivityFactory(creditPlusClient, s3Client),
      uploadUdnOrderFactory(encompassClient, s3Client),
      sendEmailFactory(sendGridClient),
    ),
    taskQueue: 'credit-plus',
  });
  await worker.run();

  connection.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
