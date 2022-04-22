import { MicrosoftGraphClient } from '../clients/microsoft-graph';

interface GetManagerResponse {
  displayName: string;
  id: string;
}

export const getManagerIdFactory = (microsoftGraphApiClient: MicrosoftGraphClient) => ({
  getManageId: async (principalName: string): Promise<GetManagerResponse | undefined> => {
    const response = await microsoftGraphApiClient.getUser(principalName);

    if (!response?.displayName || response.id) {
      return undefined;
    }

    return {
      displayName: response.displayName,
      id: response.id,
    } as GetManagerResponse;
  },
});
