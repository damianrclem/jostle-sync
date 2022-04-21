import { MicrosoftGraphClient } from '../clients/microsoft-graph';

export const updateUsersManagerFactory = (microsoftGraphApiClient: MicrosoftGraphClient) => ({
  updateUsersManager: async (userId: string, managerId: string) => {
    await microsoftGraphApiClient.updateUsersManager(userId, managerId);
  },
});
