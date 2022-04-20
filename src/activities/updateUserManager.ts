import { MicrosoftGraphClient } from '../clients/microsoft-graph';
import { JostleUser } from '../types';

export const syncActiveDirectoryUsersFactory = (microsoftGraphApiClient: MicrosoftGraphClient) => ({
  // eslint-disable-next-line no-unused-vars
  syncActiveDirectoryUsers: async (jostleUsers: Array<JostleUser>) => {
    // const adUsers = await microsoftGraphApiClient.getUsers();

    const SharepointManagerList = await microsoftGraphApiClient.getSharepointManagerList();
    // Get Manager List from SharePoint

    if (!SharepointManagerList?.value) throw new Error(`No SharePoint list value found. ${SharepointManagerList}`);

    for (let i = 0; i < SharepointManagerList?.value.length; i += 1) {
      // Look up users and bring back users ID.

      console.log(SharepointManagerList.value[i].fields);

      // Get Manager by Lookup ID

      //
    }
  },
});
