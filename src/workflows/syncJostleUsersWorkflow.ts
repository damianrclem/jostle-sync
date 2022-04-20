// eslint-disable-next-line import/no-extraneous-dependencies
import { proxyActivities } from '@temporalio/workflow';
import * as activities from '../activities'
import { syncActiveDirectoryUserFactory } from '../activities/syncActiveDirectoryUser';

const { getJostleUsers } = proxyActivities<typeof activities>({
  startToCloseTimeout: '1 minute'
});

const { syncActiveDirectoryUser } = proxyActivities<ReturnType<typeof syncActiveDirectoryUserFactory>>({
  startToCloseTimeout: '10 minutes',
  retry: {
    initialInterval: '10s',
    maximumAttempts: 3,
  }
});

interface SyncJostleUsersResult {
  jostleUsersToSync: number;
  activeDirectoryResults: {
    usersSuccessfullyUpdated: number;
    usersFailedToUpdate: number;
  }
}

export async function syncJostleUsersWorkflow(): Promise<void> {
  const jostleUsers = await getJostleUsers();

  const activeDirectorySyncResults = await Promise.allSettled(jostleUsers.map((user) => syncActiveDirectoryUser(user)));
  const activeDirectoryUsersSuccessfullyUpdated = activeDirectorySyncResults.filter((result) => result.status === 'fulfilled').length;
  const activeDirectoryUsersFailedToUpdated = activeDirectorySyncResults.filter((result) => result.status === 'rejected').length;

  const result: SyncJostleUsersResult = {
    jostleUsersToSync: jostleUsers.length,
    activeDirectoryResults: {
      usersSuccessfullyUpdated: activeDirectoryUsersSuccessfullyUpdated,
      usersFailedToUpdate: activeDirectoryUsersFailedToUpdated,
    }
  }

  console.log(result);
}