import { MicrosoftGraphClient } from "../clients/microsoft-graph";
import { JostleUser } from "../types";

export const syncActiveDirectoryUsersFactory = (microsoftGraphApiClient: MicrosoftGraphClient) => ({
  syncActiveDirectoryUsers: async (jostleUsers: Array<JostleUser>) => {
    const response = await microsoftGraphApiClient.getUsers();
    console.log(response)
  }
})