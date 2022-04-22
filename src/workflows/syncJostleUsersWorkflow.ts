// eslint-disable-next-line import/no-extraneous-dependencies
import { proxyActivities } from '@temporalio/workflow';
import * as activities from '../activities';
import { UsersManagerListResponse } from '../types';
import { syncActiveDirectoryUserFactory } from '../activities/syncActiveDirectoryUser';
import { getSharepointManagersListFactory } from '../activities/getSharepointManagersList';
import { getManagerByLookupIdFactory } from '../activities/getManagerByLookupId';
import { getManagerIdFactory } from '../activities/getManagerId';
import { updateUsersManagerFactory } from '../activities/updateUsersManager';

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

const { getManagerId } = proxyActivities<ReturnType<typeof getManagerIdFactory>>({
  startToCloseTimeout: '10 minutes',
  retry: {
    initialInterval: '10s',
    maximumAttempts: 3,
  },
});

const { updateUsersManager } = proxyActivities<ReturnType<typeof updateUsersManagerFactory>>({
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

interface UpdateUserManagerResults {
  usersNotUpdated: object;
  usersUpdatedSuccessfully: object;
}

const usersNotUpdated: object[] = [];
const usersUpdatedSuccessfully: object[] = [];

const updateUsersAdManager = async (
  managerUser: UsersManagerListResponse,
): Promise<UpdateUserManagerResults | boolean> => {
  if (!managerUser.managerLookupId) {
    return false;
  }

  // Look up manager by their lookup ID for given user
  const managerLookup = await getManagerByLookupId(managerUser.managerLookupId);
  if (!managerLookup) {
    usersNotUpdated.push({
      user: managerUser.displayName,
      userId: managerUser.userId,
    });
    return false;
  }

  // Lookup manager by their principalName to get managers id
  const manager = await getManagerId(managerLookup.userPrincipalName);
  if (!manager) {
    return false;
  }

  // Finally, update users manager in AD
  await updateUsersManager(managerUser.userId, manager.id);

  usersUpdatedSuccessfully.push({
    user: managerUser.displayName,
    userId: managerUser.userId,
    manager: manager.displayName,
    managerId: manager.id,
  });

  return {
    usersNotUpdated,
    usersUpdatedSuccessfully,
  } as UpdateUserManagerResults;
};

export async function syncJostleUsersWorkflow(): Promise<void> {
  const jostleUsers = await getJostleUsers();

  const managerUserList = await getSharepointManagersList();
  if (!managerUserList) throw new Error('Manager list is empty!');

  const userManagerUpdatedResults = await managerUserList.map((userManager) => updateUsersAdManager(userManager));

  console.log(userManagerUpdatedResults);

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
