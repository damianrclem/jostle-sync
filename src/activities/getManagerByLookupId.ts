import { MicrosoftGraphClient } from '../clients/microsoft-graph';
import { siteId, userInfoListId } from '../constants';

interface GetManagerLookupResponse {
  userPrincipalName: string;
  managerName: string;
}

export const getManagerByLookupIdFactory = (microsoftGraphApiClient: MicrosoftGraphClient) => ({
  getManagerByLookupId: async (managerLookupId: string): Promise<GetManagerLookupResponse | undefined> => {
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
