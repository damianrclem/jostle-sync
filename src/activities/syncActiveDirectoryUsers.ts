import { MicrosoftGraphClient } from "../clients/microsoft-graph";
import { JostleUser } from "../types";

export const syncActiveDirectoryUsers = async (jostleUsers: Array<JostleUser>) => {
  const client = new MicrosoftGraphClient({
    baseUrl: 'https://graph.microsoft.com'
  });

  const response = await client.getUsers();
  console.log(response)
}