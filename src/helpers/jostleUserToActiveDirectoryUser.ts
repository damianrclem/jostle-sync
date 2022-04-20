import { DEV_TENANT_ID } from "../constants";
import { ActiveDirectoryUser, JostleUser } from "../types";

export const mapJostleUserToActiveDirectoryUser = (jostleUser: JostleUser): ActiveDirectoryUser => {
  
  // If we are operating against the dev tenant, change the email domain to the dev domain.
  const email = (process.env.MS_GRAPH_API_TENANT_ID === DEV_TENANT_ID) ? jostleUser.WorkEmail.replace('revolutionmortgage.com', 'devrevmtg.onmicrosoft.com') : jostleUser.WorkEmail

  const activeDirectoryUser: ActiveDirectoryUser = {
    userPrincipalName: email,
    mail: email,
    displayName: `${jostleUser.FirstName} ${jostleUser.LastName}`,
    givenName: jostleUser.FirstName,
    surname: jostleUser.LastName,
    streetAddress: jostleUser.MailingAddress1Street || undefined,
    city: jostleUser.MailingAddress1City || undefined,
    state: jostleUser.MailingAddress1State || undefined,
    postalCode: jostleUser.MailingAddress1Zip || undefined,
    employeeId: jostleUser.EmployeeId || undefined
  };

  return activeDirectoryUser;
}