import { MicrosoftGraphClient } from '../clients/microsoft-graph';
import { mapJostleUserToSharepointUser } from '../helpers/jostleUserToSharepointUser';
import {
  JostleUser,
  ListFieldColumnValueSet,
  UsersManagerListResponse,
  UpdatedSharepointUsersResponse,
} from '../types';
import { EnvironmentConfigurationError } from '../errors';

export const updateSharepointUserFactory = (microsoftGraphApiClient: MicrosoftGraphClient) => ({
  updateSharepointUserList: async (
    jostleUsers: Array<JostleUser>,
    sharepointUsersList: Array<UsersManagerListResponse>,
  ) => {
    if (!process.env.MS_GRAPH_API_SITE_ID) {
      throw new EnvironmentConfigurationError('Missing MS_GRAPH_API_SITE_ID env variable');
    }

    if (!process.env.MS_GRAPH_API_LIST_ID) {
      throw new EnvironmentConfigurationError('Missing MS_GRAPH_API_LIST_ID env variable');
    }

    const siteId = process.env.MS_GRAPH_API_SITE_ID;
    const listId = process.env.MS_GRAPH_API_LIST_ID;
    const sharepointUsersUpdated = [];
    const sharepointUsersNotUpdates = [];

    for (let i = 0; i < jostleUsers.length; i += 1) {
      const jostleUser = mapJostleUserToSharepointUser(jostleUsers[i]);

      const sharepointUser = sharepointUsersList.find(
        (spUser) => spUser.userPrincipalName === jostleUser.userPrincipalName,
      );

      if (sharepointUser) {
        const fieldValues: ListFieldColumnValueSet = {
          LicensedStates: jostleUser.licensedState || '',
          FulltimeParttime: jostleUser.fulltimeParttime || '',
          NMLS: jostleUser.NMLS || '',
          field_4: jostleUser.department || '',
        };
        await microsoftGraphApiClient.updateListItem(siteId, listId, sharepointUser.id, fieldValues);

        sharepointUsersUpdated.push({
          user: `${jostleUsers[i].FirstName} ${jostleUsers[i].LastName}`,
        });
      } else {
        sharepointUsersNotUpdates.push({
          user: `${jostleUsers[i].FirstName} ${jostleUsers[i].LastName}`,
        });
      }
    }
  },
});
