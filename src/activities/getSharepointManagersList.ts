import { MicrosoftGraphClient } from '../clients/microsoft-graph';

export const getSharepointManagersListFactory = (microsoftGraphApiClient: MicrosoftGraphClient) => ({
  getSharepointManagersList: async () => {
    const response = await microsoftGraphApiClient.getSharepointManagerList();
    const userManagerList = [];

    if (!response?.value) throw new Error(`response did not return any values`);

    // Build readable object to work with
    for (let i = 0; i < response?.value.length; i += 1) {
      userManagerList.push({
        displayName: response.value[i].fields.field_6,
        userId: response.value[i].fields.field_16,
        managerLookupId: response.value[i].fields.Assigned_x0020_ManagerLookupId,
      });
    }

    return userManagerList;
  },
});
