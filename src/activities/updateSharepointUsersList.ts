import { MicrosoftGraphClient } from '../clients/microsoft-graph';
import { mapJostleUserToSharepointUser } from '../helpers/jostleUserToSharepointUser';
import { JostleUser, UsersListFieldColumnValueSet, SharepointUsersListResponse } from '../types';
import { EnvironmentConfigurationError } from '../errors';

export const updateSharepointUserFactory = (microsoftGraphApiClient: MicrosoftGraphClient) => ({
  updateSharepointUserList: async (
    jostleUsers: Array<JostleUser>,
    sharepointUsersList: Array<SharepointUsersListResponse>,
  ) => {
    if (!process.env.MS_GRAPH_API_SITE_ID) {
      throw new EnvironmentConfigurationError('Missing MS_GRAPH_API_SITE_ID env variable');
    }

    if (!process.env.MS_GRAPH_API_LIST_ID) {
      throw new EnvironmentConfigurationError('Missing MS_GRAPH_API_LIST_ID env variable');
    }

    const siteId = process.env.MS_GRAPH_API_SITE_ID;
    const listId = process.env.MS_GRAPH_API_LIST_ID;
    const sharepointUsersUpdated = [];
    const sharepointUsersNotUpdated = [];

    for (let i = 0; i < jostleUsers.length; i += 1) {
      const jostleUser = mapJostleUserToSharepointUser(jostleUsers[i]);

      const sharepointUser = sharepointUsersList.find(
        (spUser) => spUser.userPrincipalName === jostleUser.userPrincipalName,
      );

      //  !!! These fields will change !!!
      // TODO: the field properties for the returned list will need updated
      if (sharepointUser) {
        const fieldValues: UsersListFieldColumnValueSet = {
          LicensedStates: jostleUser.licensedStates || '',
          FulltimeParttime: jostleUser.fulltimeParttime || '',
          NMLS: jostleUser.nmls || '',
          field_4: jostleUser.department || '',
          field_27: jostleUser.homeAddress,
          field_2: jostleUser.homeCity,
          field_26: jostleUser.homeState,
          field_20: jostleUser.homePostalCode,
          field_14: jostleUser.mobilePhone,
          BPDTrackingNumber: jostleUser.bpdTrackingNumber,
          Website: jostleUser.website,
          WorkMobile: jostleUser.workMobile,
          PersonalEmail: jostleUser.personalEmail,
          Birthdate: jostleUser.birthDate,
          Fax: jostleUser.fax,
        };
        await microsoftGraphApiClient.updateListItem(siteId, listId, sharepointUser.id, fieldValues);

        sharepointUsersUpdated.push({
          user: `${jostleUsers[i].FirstName} ${jostleUsers[i].LastName}`,
        });
      } else {
        sharepointUsersNotUpdated.push({
          user: `${jostleUsers[i].FirstName} ${jostleUsers[i].LastName}`,
        });
      }
    }

    return {
      sharepointUsersUpdated,
      sharepointUsersNotUpdated,
    };
  },
});
