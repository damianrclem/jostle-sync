import { JostleUser, SharepointUserListColumns } from '../types';
import { getEmail, parseDepartment, parseFulltimeParttime, parseLicensedStates } from './utilities';

export const mapJostleUserToSharepointUser = (jostleUser: JostleUser): SharepointUserListColumns => {
  // If we are operating against the dev tenant, change the email domain to the dev domain.
  const userEmail = getEmail(jostleUser);

  const userFulltimeParttime = parseFulltimeParttime(jostleUser);
  const userLicensedStates = parseLicensedStates(jostleUser);
  const usersDepartment = parseDepartment(jostleUser);

  const sharepointUser: SharepointUserListColumns = {
    displayName: `${jostleUser.FirstName} ${jostleUser.LastName}`,
    userPrincipalName: userEmail,
    fulltimeParttime: userFulltimeParttime,
    licensedStates: userLicensedStates,
    department: usersDepartment,
    nmls: jostleUser.WorkMessagingId,
    homeAddress: jostleUser.MailingAddress1Street,
    homeCity: jostleUser.MailingAddress1City,
    homeState: jostleUser.MailingAddress1State,
    homePostalCode: jostleUser.MailingAddress1Zip,
    mobilePhone: jostleUser.PersonalMobilePhone,
  };

  return sharepointUser;
};
