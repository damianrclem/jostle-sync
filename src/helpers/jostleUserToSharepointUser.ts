import { JostleUser, SharepointUserListColumns } from '../types';
import { getEmail, parseDepartment, parseFulltimeParttime, parseLicensedStates, getColumnValue } from './utilities';

export const mapJostleUserToSharepointUser = (jostleUser: JostleUser): SharepointUserListColumns => {
  // If we are operating against the dev tenant, change the email domain to the dev domain.
  const userEmail = getEmail(jostleUser);

  const userFulltimeParttime = parseFulltimeParttime(jostleUser);
  const userLicensedStates = parseLicensedStates(jostleUser);
  const usersDepartment = parseDepartment(jostleUser);

  const bpdTrackingNumber = getColumnValue(jostleUser, 'BPD Tracking #');
  const website = getColumnValue(jostleUser, 'Website');
  const fax = getColumnValue(jostleUser, 'Fax');

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
    website,
    bpdTrackingNumber,
    workMobile: jostleUser.WorkMobilePhone,
    birthDate: jostleUser.BirthDate,
    personalEmail: jostleUser.PersonalEmail,
    fax,
  };

  return sharepointUser;
};
