import { DEV_TENANT_ID } from '../constants';
import { JostleUser } from '../types';

export const email = (jostleUser: JostleUser): string =>
  process.env.MS_GRAPH_API_TENANT_ID === DEV_TENANT_ID
    ? jostleUser.WorkEmail.replace('revolutionmortgage.com', 'devrevmtg.onmicrosoft.com')
    : jostleUser.WorkEmail;

export const department = (jostleUser: JostleUser) =>
  jostleUser.CustomFilterCategory.replace(/(Full-time|Part-time|\?\?\s[A-Z]{2})/g, '')
    .replace(/\|/g, ',')
    .replace(/^,+/, '')
    .replace(/(.+?),+$/, '$1');

export const licensedStates = (jostleUser: JostleUser) =>
  jostleUser.CustomFilterCategory.replace(/.*?([A-Z]{2}).*?/g, '$1,').replace(/(.*),|.*/g, '$1');

export const fulltimeParttime = (jostleUser: JostleUser) =>
  jostleUser.CustomFilterCategory.replace(/^(.*(Full-time|Part-time).*)$/g, '$2');
