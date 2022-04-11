// TODO: Figure out how this import even works. Do not try installing! Breaks activitiy retry
// eslint-disable-next-line import/no-extraneous-dependencies
import { Connection, WorkflowClient } from '@temporalio/client';

let workflowClient: WorkflowClient;

/**
 * simple factory for getting a temporal workflow client.  it currently
 * is just being a singleton for whatever app is using it.
 */
export function getWorkflowClient(): WorkflowClient {
  if (!workflowClient) {

    const address = process.env.TEMPORAL_ADDRESS ?? 'localhost:7233';
    const connection = new Connection({
      address,
    });

    // This is optional but we leave this here to remind you there is a gRPC connection being established.
    workflowClient = new WorkflowClient(connection.service, {
      // In production you will likely specify `namespace` here; it is 'default' if omitted
    });
  }

  return workflowClient;
};