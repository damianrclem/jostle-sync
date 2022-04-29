import { DEV_TENANT_ID } from '../constants';
import { JostleUser, SharepointUserList } from '../types';
import { states, departments } from './regexLookups';

export const mapJostleUserToSharepointUser = (jostleUser: JostleUser): SharepointUserList => {
  // If we are operating against the dev tenant, change the email domain to the dev domain.
  const email =
    process.env.MS_GRAPH_API_TENANT_ID === DEV_TENANT_ID
      ? jostleUser.WorkEmail.replace('revolutionmortgage.com', 'devrevmtg.onmicrosoft.com')
      : jostleUser.WorkEmail;

  const joinStates = states.join('|');
  const joinDepartments = departments.join('|');

  const licensedStatesExpression = new RegExp(`(${joinStates})|[^]`, 'g');

  const departmentExpression = new RegExp(`(${joinDepartments})|[^]`, 'g');

  const sharepointUser: SharepointUserList = {
    displayName: `${jostleUser.FirstName} ${jostleUser.LastName}`,
    userPrincipalName: email,
    fulltimeParttime: jostleUser.CustomFilterCategory.replace(/(Full-time|Part-time)|[^]/g, '$1'),
    licensedState: jostleUser.CustomFilterCategory.replace(licensedStatesExpression, '$1'),
    department: jostleUser.CustomFilterCategory.replace(departmentExpression, '$1'),
    NMLS: jostleUser.WorkMessagingId,
  };

  return sharepointUser;
};
