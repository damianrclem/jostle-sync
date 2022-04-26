import { MicrosoftGraphClient } from '../clients/microsoft-graph';
import { EnvironmentConfigurationError } from '../errors';

interface GetManagerLookupResponse {
  userPrincipalName: string;
  managerName: string;
}

export const getManagerByLookupIdFactory = (microsoftGraphApiClient: MicrosoftGraphClient) => ({
  getManagerByLookupId: async (managerLookupId: string): Promise<GetManagerLookupResponse | undefined> => {
    if (!process.env.MS_GRAPH_API_SITE_ID) {
      throw new EnvironmentConfigurationError('Missing MS_GRAPH_API_SITE_ID env variable');
    }

    if (!process.env.MS_GRAPH_API_USER_INFO_LIST_ID) {
      throw new EnvironmentConfigurationError('Missing MS_GRAPH_API_USER_INFO_LIST_ID env variable');
    }

    const siteId = process.env.MS_GRAPH_API_SITE_ID;
    const userInfoListId = process.env.MS_GRAPH_API_USER_INFO_LIST_ID;

    const response = await microsoftGraphApiClient.getUserByLookupId(managerLookupId, siteId, userInfoListId);

    if (!response?.fields) {
      return undefined;
    }

    return {
      userPrincipalName: response.fields.UserName,
      managerName: response.fields.ImnName,
    } as GetManagerLookupResponse;
  },
});
