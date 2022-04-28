import { MicrosoftGraphClient } from '../clients/microsoft-graph';
import { mapJostleUserToSharepointUser } from '../helpers/jostleUserToSharepointUser';
import { JostleUser, ListFieldValueSet, UsersManagerListResponse } from '../types';
import { EnvironmentConfigurationError } from '../errors';

export const updateSharepointUserFactory = (microsoftGraphApiClient: MicrosoftGraphClient) => ({
  updateSharepointUserList: async (jostleUser: JostleUser, sharePointUsersList: Array<UsersManagerListResponse>) => {
    if (!process.env.MS_GRAPH_API_SITE_ID) {
      throw new EnvironmentConfigurationError('Missing MS_GRAPH_API_SITE_ID env variable');
    }

    if (!process.env.MS_GRAPH_API_LIST_ID) {
      throw new EnvironmentConfigurationError('Missing MS_GRAPH_API_LIST_ID env variable');
    }

    const siteId = process.env.MS_GRAPH_API_SITE_ID;
    const listId = process.env.MS_GRAPH_API_LIST_ID;

    const user = mapJostleUserToSharepointUser(jostleUser);

    const fieldValues: ListFieldValueSet = {
      LicensedStates: user.licensedState,
      FulltimeParttime: user.userPrincipalName,
    };

    for (let i = 0; i < sharePointUsersList.length; i += 1) {
      if (user.userPrincipalName === sharePointUsersList[i].userPrincipalName) {
        await microsoftGraphApiClient.updateListItem(siteId, listId, '1', fieldValues);
      }
    }
  },
});
