import { MicrosoftGraphClient } from '../clients/microsoft-graph';

export const getManagerIdFactory = (microsoftGraphApiClient: MicrosoftGraphClient) => ({
  getManageId: async (principalName: string) => {
    const response = await microsoftGraphApiClient.getManagerId(principalName);

    if (!response) throw new Error(`response did not return any values`);

    return {
      displayName: response.displayName,
      id: response.id,
    };
  },
});
