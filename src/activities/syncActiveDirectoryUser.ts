import { MicrosoftGraphClient } from "../clients/microsoft-graph";
import { mapJostleUserToActiveDirectoryUser } from "../helpers/jostleUserToActiveDirectoryUser";
import { JostleUser } from "../types";


export const syncActiveDirectoryUserFactory = (microsoftGraphApiClient: MicrosoftGraphClient) => ({
  syncActiveDirectoryUser: async (jostleUser: JostleUser) => {
    const user = mapJostleUserToActiveDirectoryUser(jostleUser);

    await microsoftGraphApiClient.updateUser(user.userPrincipalName, user);
  }
})