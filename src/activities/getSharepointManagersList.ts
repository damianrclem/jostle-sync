import { MicrosoftGraphClient } from '../clients/microsoft-graph';

interface UsersManagerListResponse {
  displayName: string;
  userId: string;
  managerLookupId: string;
}

export const getSharepointManagersListFactory = (microsoftGraphApiClient: MicrosoftGraphClient) => ({
  getSharepointManagersList: async (): Promise<Array<UsersManagerListResponse> | undefined> => {
    const response = await microsoftGraphApiClient.getSharepointManagerList();
    const userManagerList = [];

    if (!response?.value) {
      return undefined;
    }

    // Build readable object to work with
    // TODO: the field properties for the returned list will need updated
    for (let i = 0; i < response?.value.length; i += 1) {
      userManagerList.push({
        displayName: response.value[i].fields.field_6,
        userId: response.value[i].fields.field_16,
        managerLookupId: response.value[i].fields.Assigned_x0020_ManagerLookupId!,
      });
    }

    return userManagerList as Array<UsersManagerListResponse>;
  },
});
