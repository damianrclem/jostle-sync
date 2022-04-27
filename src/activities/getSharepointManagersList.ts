import { MicrosoftGraphClient } from '../clients/microsoft-graph';
import { UsersManagerListResponse } from '../types';
import { EnvironmentConfigurationError } from '../errors';

export const getSharepointManagersListFactory = (microsoftGraphApiClient: MicrosoftGraphClient) => ({
  getSharepointManagersList: async (): Promise<Array<UsersManagerListResponse> | undefined> => {
    if (!process.env.MS_GRAPH_API_SITE_ID) {
      throw new EnvironmentConfigurationError('Missing MS_GRAPH_API_SITE_ID env variable');
    }

    if (!process.env.MS_GRAPH_API_LIST_ID) {
      throw new EnvironmentConfigurationError('Missing MS_GRAPH_API_LIST_ID env variable');
    }

    const siteId = process.env.MS_GRAPH_API_SITE_ID;
    const listId = process.env.MS_GRAPH_API_LIST_ID;

    const response = await microsoftGraphApiClient.getSharepointList(siteId, listId);

    if (!response?.value) {
      return undefined;
    }

    // Build readable object to work with
    // TODO: the field properties for the returned list will need updated

    return response?.value.map((user) => ({
      displayName: user.fields.field_6,
      userId: user.fields.field_16,
      managerLookupId: user.fields.Assigned_x0020_ManagerLookupId!,
    }));
  },
});