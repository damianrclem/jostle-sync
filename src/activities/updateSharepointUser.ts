import { MicrosoftGraphClient } from '../clients/microsoft-graph';
import { mapJostleUserToSharepointUser } from '../helpers/jostleUserToSharepointUser';
import { JostleUser, ListFieldValueSet, UsersManagerListResponse } from '../types';
import { EnvironmentConfigurationError } from '../errors';

export const updateSharepointUserFactory = (microsoftGraphApiClient: MicrosoftGraphClient) => ({
  updateSharepointUserList: async (
    jostleUsers: Array<JostleUser>,
    sharePointUsersList: Array<UsersManagerListResponse>,
  ) => {
    if (!process.env.MS_GRAPH_API_SITE_ID) {
      throw new EnvironmentConfigurationError('Missing MS_GRAPH_API_SITE_ID env variable');
    }

    if (!process.env.MS_GRAPH_API_LIST_ID) {
      throw new EnvironmentConfigurationError('Missing MS_GRAPH_API_LIST_ID env variable');
    }

    const siteId = process.env.MS_GRAPH_API_SITE_ID;
    const listId = process.env.MS_GRAPH_API_LIST_ID;

    for (let i = 0; i < jostleUsers.length; i += 1) {
      const jUser = mapJostleUserToSharepointUser(jostleUsers[i]);

      const sharepointUser = sharePointUsersList.find((spUser) => spUser.userPrincipalName === jUser.userPrincipalName);

      if (sharepointUser) {
        const fieldValues: ListFieldValueSet = {
          LicensedStates: jUser.licensedState || '',
          FulltimeParttime: jUser.fulltimeParttime || '',
          NMLS: jUser.NMLS || '',
        };
        await microsoftGraphApiClient.updateListItem(siteId, listId, sharepointUser.id, fieldValues);
      }
    }
  },
});
