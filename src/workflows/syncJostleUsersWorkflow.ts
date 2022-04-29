// eslint-disable-next-line import/no-extraneous-dependencies
import { proxyActivities } from '@temporalio/workflow';
import * as activities from '../activities';
import { UsersManagerListResponse } from '../types';
import { syncActiveDirectoryUserFactory } from '../activities/syncActiveDirectoryUser';
import { updateSharepointUserFactory } from '../activities/updateSharepointUser';
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

const { updateSharepointUserList } = proxyActivities<ReturnType<typeof updateSharepointUserFactory>>({
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
  userManagersAssignedResults: {
    totalUsers: number;
    userManagersNotAssigned: {
      assignedManagers: boolean;
      total: number;
      users: string;
    };
    userManagersAssigned: {
      assignedManagers: boolean;
      total: number;
      users: string;
    };
  };
}

interface UpdateUserManagerResults {
  assignedManager: boolean;
  updateUsersManagerFor: string;
  userId: string;
  usersManager?: string;
  usersManagerId?: string;
}

const noManagerAssigned: object[] = [];
const managerAssigned: object[] = [];

const updateAdUsersManager = async (sharePointUsersList: Array<UsersManagerListResponse>) => {
  // Loop thru user's manager list
  for (let i = 0; sharePointUsersList.length > i; i += 1) {
    if (!sharePointUsersList[i].managerLookupId) {
      const updatedUserManagerResults: UpdateUserManagerResults = {
        assignedManager: false,
        updateUsersManagerFor: sharePointUsersList[i].displayName,
        userId: sharePointUsersList[i].userId,
      };

      noManagerAssigned.push(updatedUserManagerResults);
      continue;
    }

    // Look up manager by their lookup ID for given user
    const managerLookup = await getManagerByLookupId(sharePointUsersList[i].managerLookupId);
    if (!managerLookup) {
      continue;
    }

    // Lookup manager by their principalName to get managers id
    const manager = await getManagerId(managerLookup.userPrincipalName);
    if (!manager) {
      continue;
    }

    // Finally, update users manager in AD
    await updateUsersManager(sharePointUsersList[i].userId, manager.id);

    const updatedUserManagerResults: UpdateUserManagerResults = {
      assignedManager: true,
      updateUsersManagerFor: sharePointUsersList[i].displayName,
      userId: sharePointUsersList[i].userId,
      usersManager: manager.displayName,
      usersManagerId: manager.id,
    };

    managerAssigned.push(updatedUserManagerResults);
  }
};

export async function syncJostleUsersWorkflow(): Promise<void> {
  const jostleUsers = await getJostleUsers();

  const sharePointUsersList = await getSharepointManagersList();
  if (!sharePointUsersList) throw new Error('Manager list is empty!');

  console.log('UPDATING SHAREPOINT USERS LIST');

  await updateSharepointUserList(jostleUsers, sharePointUsersList);

  console.log('UPDATING USERS PROFILE');
  // const activeDirectorySyncResults = await Promise.allSettled(jostleUsers.map((user) => syncActiveDirectoryUser(user)));
  // const activeDirectoryUsersSuccessfullyUpdated = activeDirectorySyncResults.filter(
  //   (result) => result.status === 'fulfilled',
  // ).length;
  // const activeDirectoryUsersFailedToUpdated = activeDirectorySyncResults.filter(
  //   (result) => result.status === 'rejected',
  // ).length;

  // console.log('UPDATING USERS MANAGER');

  // await updateAdUsersManager(sharePointUsersList);

  // const result: SyncJostleUsersResult = {
  //   jostleUsersToSync: jostleUsers.length,
  //   activeDirectoryResults: {
  //     usersSuccessfullyUpdated: activeDirectoryUsersSuccessfullyUpdated,
  //     usersFailedToUpdate: activeDirectoryUsersFailedToUpdated,
  //   },
  //   userManagersAssignedResults: {
  //     totalUsers: sharePointUsersList.length,
  //     userManagersNotAssigned: {
  //       assignedManagers: false,
  //       total: noManagerAssigned.length,
  //       users: JSON.stringify(noManagerAssigned),
  //     },
  //     userManagersAssigned: {
  //       assignedManagers: true,
  //       total: managerAssigned.length,
  //       users: JSON.stringify(managerAssigned),
  //     },
  //   },
  // };

  // console.log(result);
}
