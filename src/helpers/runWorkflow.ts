// eslint-disable-next-line import/no-extraneous-dependencies
import { proxyActivities, workflowInfo } from '@temporalio/workflow';

// Only import the activity types
import { sendEmailFactory } from '../activities/sendEmailActivity';

const { sendEmailToEngineeringSupportActivity } = proxyActivities<ReturnType<typeof sendEmailFactory>>({
  startToCloseTimeout: '1 minute',
  retry: {
    maximumAttempts: 5,
    initialInterval: '1s',
  },
});

export async function runWorkflow(workflow: Promise<unknown>): Promise<unknown> {
  try {
    return await workflow;
  } catch (error) {
    const { runId, workflowId, workflowType, namespace } = workflowInfo();
    await sendEmailToEngineeringSupportActivity({
      subject: `Workflow run ${runId} failed`,
      message: `Details:
      Run Id: ${runId}
      Workflow Id: ${workflowId}
      Workflow Type: ${workflowType}
      Namespace: ${namespace}`,
    });
    throw error;
  }
}
