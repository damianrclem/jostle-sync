import { DEV_TENANT_ID } from '../constants';
import { JostleUser } from '../types';

export const getEmail = (jostleUser: JostleUser): string =>
  process.env.MS_GRAPH_API_TENANT_ID === DEV_TENANT_ID
    ? jostleUser.WorkEmail.replace('revolutionmortgage.com', 'devrevmtg.onmicrosoft.com')
    : jostleUser.WorkEmail;

export const parseDepartment = (jostleUser: JostleUser) =>
  jostleUser.CustomFilterCategory.replace(/(Full-time|Part-time|\?\?\s[A-Z]{2})/g, '')
    .replace(/\|/g, ',')
    .replace(/^,+/, '')
    .replace(/(.+?),+$/, '$1');

export const parseLicensedStates = (jostleUser: JostleUser) =>
  jostleUser.CustomFilterCategory.replace(/.*?([A-Z]{2}).*?/g, '$1,').replace(/(.*),|.*/g, '$1');

export const parseFulltimeParttime = (jostleUser: JostleUser) =>
  jostleUser.CustomFilterCategory.replace(/^(.*(Full-time|Part-time).*)$/g, '$2');

/**
 * Get column values from Jostle data
 * @param jostleUser
 * @param columnValueMatch
 * @returns
 */
export const getColumnValue = (jostleUser: JostleUser, columnValueMatch: string): string => {
  let valueMatched;
  valueMatched = jostleUser.MessagingAddress1Label === columnValueMatch ? jostleUser.MessagingAddress1 : '';
  if (!valueMatched)
    valueMatched = jostleUser.MessagingAddress2Label === columnValueMatch ? jostleUser.MessagingAddress2 : '';
  return valueMatched;
};
