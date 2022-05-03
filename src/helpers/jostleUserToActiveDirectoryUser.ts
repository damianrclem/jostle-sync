import { ActiveDirectoryUser, JostleUser } from '../types';
import { getEmail, parseDepartment } from './utilities';

export const mapJostleUserToActiveDirectoryUser = (jostleUser: JostleUser): ActiveDirectoryUser => {
  // If we are operating against the dev tenant, change the email domain to the dev domain.
  const userEmail = getEmail(jostleUser);

  const usersDepartment = parseDepartment(jostleUser);

  const activeDirectoryUser: ActiveDirectoryUser = {
    userPrincipalName: userEmail,
    mail: userEmail,
    displayName: `${jostleUser.FirstName} ${jostleUser.LastName}`,
    givenName: jostleUser.FirstName,
    surname: jostleUser.LastName,
    employeeId: jostleUser.EmployeeId || undefined,
    officeLocation: jostleUser.OfficialLocation,
    jobTitle: jostleUser.PrimaryRoleName,
    department: usersDepartment,
  };

  return activeDirectoryUser;
};
