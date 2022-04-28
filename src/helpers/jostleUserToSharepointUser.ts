import { DEV_TENANT_ID } from '../constants';
import { JostleUser, SharepointUserList } from '../types';

export const mapJostleUserToSharepointUser = (jostleUser: JostleUser): SharepointUserList => {
  // If we are operating against the dev tenant, change the email domain to the dev domain.
  const email =
    process.env.MS_GRAPH_API_TENANT_ID === DEV_TENANT_ID
      ? jostleUser.WorkEmail.replace('revolutionmortgage.com', 'devrevmtg.onmicrosoft.com')
      : jostleUser.WorkEmail;

  const fulltimeParttime = jostleUser['Full-time/Part-time'];
  const licensedState = jostleUser['Licensed States'];

  const sharepointUser: SharepointUserList = {
    displayName: `${jostleUser.FirstName} ${jostleUser.LastName}`,
    userPrincipalName: email,
    fulltimeParttime,
    licensedState,
  };

  return sharepointUser;
};
