import { MicrosoftGraphClient } from '../clients/microsoft-graph';

interface GetManagerResponse {
  displayName: string;
  id: string;
}

export const getManagerIdFactory = (microsoftGraphApiClient: MicrosoftGraphClient) => ({
  getManagerId: async (principalName: string): Promise<GetManagerResponse | undefined> => {
    const response = await microsoftGraphApiClient.getUser(principalName);

    if (!response?.id || !response?.displayName) {
      return undefined;
    }

    return {
      displayName: response.displayName,
      id: response.id,
    } as GetManagerResponse;
  },
});
