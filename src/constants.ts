import { EnvironmentConfigurationError } from './errors';

export const DEV_TENANT_ID = 'c5ee4395-c31c-4099-b1ef-549fb907e531';

if (!process.env.MS_GRAPH_API_SITE_ID) {
  throw new EnvironmentConfigurationError('Missing MS_GRAPH_API_SITE_ID env variable');
}

if (!process.env.MS_GRAPH_API_USER_INFO_LIST_ID) {
  throw new EnvironmentConfigurationError('Missing MS_GRAPH_API_USER_INFO_LIST_ID env variable');
}

if (!process.env.MS_GRAPH_API_LIST_ID) {
  throw new EnvironmentConfigurationError('Missing MS_GRAPH_API_LIST_ID env variable');
}

export const siteId = process.env.MS_GRAPH_API_SITE_ID;
export const listId = process.env.MS_GRAPH_API_LIST_ID;
export const userInfoListId = process.env.MS_GRAPH_API_USER_INFO_LIST_ID;
