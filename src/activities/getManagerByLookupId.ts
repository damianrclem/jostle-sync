import { MicrosoftGraphClient } from '../clients/microsoft-graph';

export const getManagerByLookupIdFactory = (microsoftGraphApiClient: MicrosoftGraphClient) => ({
  getManagerByLookupId: async (managerLookupId: string) => {
    const response = await microsoftGraphApiClient.getManagerByLookupId(managerLookupId);

    if (!response) throw new Error(`response did not return any values`);

    return {
      userPrincipalName: response.fields.UserName,
      managerName: response.fields.ImnName,
    };
  },
});
