import { MicrosoftGraphClient } from '../clients/microsoft-graph';
import { UsersManagerListResponse } from '../types';

export const getSharepointManagersListFactory = (microsoftGraphApiClient: MicrosoftGraphClient) => ({
  getSharepointManagersList: async (): Promise<Array<UsersManagerListResponse> | undefined> => {
    const response = await microsoftGraphApiClient.getSharepointManagerList();
    // const userManagerList = [];

    if (!response?.value) {
      return undefined;
    }

    // Build readable object to work with
    // TODO: the field properties for the returned list will need updated

    return response?.value.map((user) => ({
      displayName: user.fields.field_6,
      userId: user.fields.field_16,
      managerLookupId: user.fields.Assigned_x0020_ManagerLookupId!,
    }));
  },
});
