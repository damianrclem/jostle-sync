import { JostleUser, SharepointUserListColumns } from '../types';
import { states, departments, parttimeFulltime } from './regexLookups';
import { email } from './utilities';

export const mapJostleUserToSharepointUser = (jostleUser: JostleUser): SharepointUserListColumns => {
  // If we are operating against the dev tenant, change the email domain to the dev domain.
  const userEmail = email(jostleUser);

  const joinStates = states.join('|');
  const joinDepartments = departments.join('|');
  const joinParttimeFulltime = parttimeFulltime.join('|');

  const licensedStatesExpression = new RegExp(`(${joinStates})|[^]`, 'g');
  const departmentExpression = new RegExp(`(${joinDepartments})|[^]`, 'g');
  const parttimeFulltimeExpression = new RegExp(`(${joinParttimeFulltime})|[^]`, 'g');

  const sharepointUser: SharepointUserListColumns = {
    displayName: `${jostleUser.FirstName} ${jostleUser.LastName}`,
    userPrincipalName: userEmail,
    fulltimeParttime: jostleUser.CustomFilterCategory.replace(parttimeFulltimeExpression, '$1'),
    licensedState: jostleUser.CustomFilterCategory.replace(licensedStatesExpression, '$1 ')
      .trim()
      .split(/[ ,]+/)
      .join(','),
    department: jostleUser.CustomFilterCategory.replace(departmentExpression, '$1'),
    NMLS: jostleUser.WorkMessagingId,
  };

  return sharepointUser;
};
