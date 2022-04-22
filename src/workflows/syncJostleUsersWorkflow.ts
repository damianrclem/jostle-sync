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
  usersNotSuccessfullyUpdated: string;
  UserId: string;
  UsersManager?: string;
  UsersManagerId?: string;
}

interface UserManagerNotFound {
  updateUsersManager: string;
}

const returnResponse = [];

const updateUsersAdManager = async (
  managerUser: UsersManagerListResponse,
): Promise<UpdateUserManagerResults | undefined> => {
  if (!managerUser.managerLookupId) {
    returnResponse.push({
      usersNotSuccessfullyUpdated: '',
      UserId: managerUser.userId,
    });

    console.log('no lookup id found');
    return returnResponse;
  }

  // Look up manager by their lookup ID for given user
  const managerLookup = await getManagerByLookupId(managerUser.managerLookupId);
  if (!managerLookup) {
    return;
  }

  // Lookup manager by their principalName to get managers id
  const manager = await getManageId(managerLookup.userPrincipalName);
  if (!manager) {
    return;
  }

  // Finally, update users manager in AD
  await updateUsersManager(managerUser.userId, manager.id);

  console.log('do I make it here?');

  // return returnResponse;
};

export async function syncJostleUsersWorkflow(): Promise<void> {
  const jostleUsers = await getJostleUsers();

  const managerUserList = await getSharepointManagersList();
  if (!managerUserList) throw new Error('Manager list is empty!');

  await managerUserList.map((userManager) => updateUsersAdManager(userManager));

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
