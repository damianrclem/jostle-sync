import { MicrosoftGraphClient } from '../clients/microsoft-graph';
import { SharepointUsersListResponse } from '../types';
import { EnvironmentConfigurationError } from '../errors';

export const getSharepointUsersListFactory = (microsoftGraphApiClient: MicrosoftGraphClient) => ({
  getSharepointUsersList: async (): Promise<Array<SharepointUsersListResponse> | undefined> => {
    if (!process.env.MS_GRAPH_API_SITE_ID) {
      throw new EnvironmentConfigurationError('Missing MS_GRAPH_API_SITE_ID env variable');
    }

    if (!process.env.MS_GRAPH_API_LIST_ID) {
      throw new EnvironmentConfigurationError('Missing MS_GRAPH_API_LIST_ID env variable');
    }

    const siteId = process.env.MS_GRAPH_API_SITE_ID;
    const listId = process.env.MS_GRAPH_API_LIST_ID;

    const response = await microsoftGraphApiClient.getSharepointList(siteId, listId);

    console.log(response?.value[19]);

    if (!response?.value) {
      return undefined;
    }

    // Build readable object to work with
    // TODO: the field properties for the returned list will need updated

    return response?.value.map((user) => ({
      id: user.fields.id!,
      displayName: user.fields.field_6,
      userPrincipalName: user.fields.field_31,
      userId: user.fields.field_16!,
      managerLookupId: user.fields.Assigned_x0020_ManagerLookupId!,
      department: user.fields.field_4,
      homeAddress: user.fields.field_27,
      homeCity: user.fields.field_2,
      homePostalCode: user.fields.field_20,
      homeState: user.fields.field_26,
    }));
  },
});
