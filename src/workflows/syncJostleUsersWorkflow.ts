// eslint-disable-next-line import/no-extraneous-dependencies
import { proxyActivities } from '@temporalio/workflow';
import * as activities from '../activities'

const { getJostleUsers } = proxyActivities<typeof activities>({
  startToCloseTimeout: '1 minute',
  retry: {
    initialInterval: '10s',
    maximumAttempts: 3,
  }
})

export async function syncJostleUsersWorkflow(): Promise<void> {
  await getJostleUsers()
}