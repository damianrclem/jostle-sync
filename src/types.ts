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

export interface SharepointUserListColumns {
  userPrincipalName: string;
  displayName: string;
  fulltimeParttime?: string;
  licensedStates?: string;
  department?: string;
  nmls: string;
  homeAddress: string;
  homeCity: string;
  homeState: string;
  homePostalCode: string;
  mobilePhone: string;
  website: string;
  bpdTrackingNumber: string;
  workMobile: string;
  birthDate: string;
  personalEmail: string;
  fax: string;
}

export interface UserLookupFields {
  ImnName: string;
  UserName: string;
}

export interface GetManagerResponse {
  displayName: string;
  id: string;
}

export interface SharepointUsersListResponse {
  id: string;
  userId: string;
  managerLookupId: string;
  displayName?: string;
  userPrincipalName?: string;
  homeAddress?: string;
  homeCity?: string;
  homeState?: string;
  homePostalCode?: string;
  mobilePhone?: string;
}

//  !!! These fields will change !!!
// TODO: the field properties for the returned list will need updated
export interface UsersListFieldColumnValueSet {
  id?: string; // List ID
  field_6?: string; // Display Name
  field_16?: string; // User ID
  field_31?: string; // User Principal Name
  field_4?: string; // Department
  Assigned_x0020_ManagerLookupId?: string; // Manager Lookup ID
  field_27?: string; // Home address
  field_2?: string; // Home city
  field_26?: string; // Home state
  field_20?: string; // Home postal code
  field_14?: string; // Mobile phone
  FulltimeParttime?: string;
  LicensedStates?: string;
  NMLS?: string;
  Website?: string;
  BPDTrackingNumber?: string;
  WorkMobile?: string;
  Birthdate?: string;
  PersonalEmail?: string;
  Fax?: string;
}

export interface UpdatedSharepointUsersResponse {
  user: string;
}

export interface SharepointUsersListFields {
  fields: UsersListFieldColumnValueSet;
}
