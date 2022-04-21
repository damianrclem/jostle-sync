/* eslint-disable camelcase */
export interface JostleUser {
  Username: string;
  WorkEmail: string;
  FirstName: string;
  LastName: string;
  Nickname: string;
  WorkEmailVisibility: string;
  BirthDate: string;
  Joined: string;
  OfficialLocation: string;
  SecondBadge: string;
  EmployeeId: string;
  CustomFilterCategory: string;
  CustomProfileCategory: string;
  PrimaryRoleName: string;
  PrimarySupervisorUsername: string;
  JobCategory: string;
  AllowManageRelationships: string;
  WorkOfficePhone: string;
  WorkMobilePhone: string;
  PersonalEmail: string;
  PersonalMobilePhone: string;
  HomePhone: string;
  AlternateEmail1Label: string;
  AlternateEmail1: string;
  AlternateEmail2Label: string;
  AlternateEmail2: string;
  PreferredEmail: string;
  PreferredEmailVisibility: string;
  OtherLabel: string;
  OtherValue: string;
  CustomBadge: string;
  WorkMessagingLabel: string;
  WorkMessagingId: string;
  MessagingAddress1Label: string;
  MessagingAddress1: string;
  MessagingAddress2Label: string;
  MessagingAddress2: string;
  MessagingAddress3Label: string;
  MessagingAddress3: string;
  MailingAddress1Label: string;
  MailingAddress1Street: string;
  MailingAddress1City: string;
  MailingAddress1State: string;
  MailingAddress1Zip: string;
  MailingAddress1Country: string;
  MailingAddress2Label: string;
  MailingAddress2Street: string;
  MailingAddress2City: string;
  MailingAddress2State: string;
  MailingAddress2Zip: string;
  MailingAddress2Country: string;
  PreferredPhone: string;
  PreferredPhoneVisibility: string;
  AccountState: string;
  UserType: string;
}

export interface ActiveDirectoryUser {
  userPrincipalName: string;
  mail: string;
  displayName: string;
  givenName: string;
  surname: string;
  employeeId?: string;
  officeLocation: string;
  jobTitle: string;
  department: string;
}

export interface ManagerListFields {
  fields: {
    field_6: string;
    field_16: string;
    Assigned_x0020_ManagerLookupId?: string;
  };
}

export interface ManagerLookupFields {
  ImnName: string;
  UserName: string;
}

export interface GetManagerResponse {
  displayName: string;
  id: string;
}
