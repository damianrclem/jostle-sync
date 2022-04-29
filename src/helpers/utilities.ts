import { DEV_TENANT_ID } from '../constants';
import { JostleUser } from '../types';

export const email = (jostleUser: JostleUser): string =>
  process.env.MS_GRAPH_API_TENANT_ID === DEV_TENANT_ID
    ? jostleUser.WorkEmail.replace('revolutionmortgage.com', 'devrevmtg.onmicrosoft.com')
    : jostleUser.WorkEmail;
