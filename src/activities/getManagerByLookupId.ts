import { MicrosoftGraphClient } from '../clients/microsoft-graph';

interface GetManagerLookupResponse {
  userPrincipalName: string;
  managerName: string;
}

export const getManagerByLookupIdFactory = (microsoftGraphApiClient: MicrosoftGraphClient) => ({
  getManagerByLookupId: async (managerLookupId: string): Promise<GetManagerLookupResponse | undefined> => {
    const response = await microsoftGraphApiClient.getManagerByLookupId(managerLookupId);

    if (!response?.fields) {
      return undefined;
    }

    return {
      userPrincipalName: response.fields.UserName,
      managerName: response.fields.ImnName,
    } as GetManagerLookupResponse;
  },
});
