import { JostleUser, SharepointUserListColumns } from '../types';
import { email, department, fulltimeParttime, licensedStates } from './utilities';

export const mapJostleUserToSharepointUser = (jostleUser: JostleUser): SharepointUserListColumns => {
  // If we are operating against the dev tenant, change the email domain to the dev domain.
  const userEmail = email(jostleUser);

  const userFulltimeParttime = fulltimeParttime(jostleUser);
  const userLicensedStates = licensedStates(jostleUser);
  const usersDepartment = department(jostleUser);

  const sharepointUser: SharepointUserListColumns = {
    displayName: `${jostleUser.FirstName} ${jostleUser.LastName}`,
    userPrincipalName: userEmail,
    fulltimeParttime: userFulltimeParttime,
    licensedStates: userLicensedStates,
    department: usersDepartment,
    NMLS: jostleUser.WorkMessagingId,
  };

  return sharepointUser;
};
