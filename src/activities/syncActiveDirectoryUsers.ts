import { MicrosoftGraphClient } from '../clients/microsoft-graph';
import { JostleUser } from '../types';

export const syncActiveDirectoryUsersFactory = (microsoftGraphApiClient: MicrosoftGraphClient) => ({
  // eslint-disable-next-line no-unused-vars
  syncActiveDirectoryUsers: async (jostleUsers: Array<JostleUser>) => {
    const response = await microsoftGraphApiClient.getUsers();
    console.log(response);
  },
});
