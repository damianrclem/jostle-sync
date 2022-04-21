// eslint-disable-next-line import/no-extraneous-dependencies
import { proxyActivities } from '@temporalio/workflow';
import * as activities from '../activities';
import { syncActiveDirectoryUserFactory } from '../activities/syncActiveDirectoryUser';
import { getSharepointManagersListFactory } from '../activities/getSharepointManagersList';
import { getManagerByLookupIdFactory } from '../activities/getManagerByLookupId';

const { getJostleUsers } = proxyActivities<typeof activities>({
  startToCloseTimeout: '1 minute',
});

const { getSharepointManagersList } = proxyActivities<ReturnType<typeof getSharepointManagersListFactory>>({
  startToCloseTimeout: '10 minutes',
  retry: {
    initialInterval: '10s',
    maximumAttempts: 3,
  },
});

const { syncActiveDirectoryUser } = proxyActivities<ReturnType<typeof syncActiveDirectoryUserFactory>>({
  startToCloseTimeout: '10 minutes',
  retry: {
    initialInterval: '10s',
    maximumAttempts: 3,
  },
});

const { getManagerByLookupId } = proxyActivities<ReturnType<typeof getManagerByLookupIdFactory>>({
  startToCloseTimeout: '10 minutes',
  retry: {
    initialInterval: '10s',
    maximumAttempts: 3,
  },
});

interface SyncJostleUsersResult {
  jostleUsersToSync: number;
  activeDirectoryResults: {
    usersSuccessfullyUpdated: number;
    usersFailedToUpdate: number;
  };
}

export async function syncJostleUsersWorkflow(): Promise<void> {
  const jostleUsers = await getJostleUsers();

  const managerUserList = await getSharepointManagersList();

  for (let i = 0; managerUserList.length > i; i += 1) {
    if (!managerUserList[i].managerLookupId) {
      continue;
    }

    const managerLookup = await getManagerByLookupId('15');
    // const managerLookup = await getManagerByLookupId(managerUserList[i].managerLookupId);

    console.log('matched manager: ', managerLookup);

    console.log(managerUserList[i].displayName);
    console.log(managerUserList[i].managerLookupId);
    console.log(managerUserList[i].userId);
  }

  const activeDirectorySyncResults = await Promise.allSettled(jostleUsers.map((user) => syncActiveDirectoryUser(user)));
  const activeDirectoryUsersSuccessfullyUpdated = activeDirectorySyncResults.filter(
    (result) => result.status === 'fulfilled',
  ).length;
  const activeDirectoryUsersFailedToUpdated = activeDirectorySyncResults.filter(
    (result) => result.status === 'rejected',
  ).length;

  const result: SyncJostleUsersResult = {
    jostleUsersToSync: jostleUsers.length,
    activeDirectoryResults: {
      usersSuccessfullyUpdated: activeDirectoryUsersSuccessfullyUpdated,
      usersFailedToUpdate: activeDirectoryUsersFailedToUpdated,
    },
  };

  console.log(result);
}
