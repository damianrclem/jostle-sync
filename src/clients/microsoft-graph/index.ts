/* eslint-disable camelcase */
import axios from 'axios';
import { EnvironmentConfigurationError } from '../../errors';
import { ActiveDirectoryUser, ManagerLookupFields, GetManagerResponse } from '../../types';

//  !!! This fields will chang !!!
// TODO: the field properties for the returned list will need updated
export interface ManagerListFields {
  fields: {
    field_6: string;
    field_16: string;
    Assigned_x0020_ManagerLookupId?: string;
  };
}

interface GetSharepointManagerListResponse {
  value: Array<ManagerListFields>;
  'odata.nextLink'?: string;
}

interface GetUsersResponse {
  value: Array<ActiveDirectoryUser>;
  'odata.nextLink'?: string;
}

interface GetManagerLookupResponse {
  fields: ManagerLookupFields;
  'odata.nextLink'?: string;
}

interface MicrosoftGraphClientArgs {
  baseUrl: string;
  tenantId: string;
  clientId: string;
  clientSecret: string;
  siteId: string;
  listId: string;
  userInfoListId: string;
}

export class MicrosoftGraphClient {
  private readonly baseUrl: string;

  private readonly tenantId: string;

  private readonly clientId: string;

  private readonly clientSecret: string;

  private readonly siteId: string;

  private readonly listId: string;

  private readonly userInfoListId: string;

  private token: string;

  constructor(args: MicrosoftGraphClientArgs) {
    this.baseUrl = args.baseUrl;
    this.tenantId = args.tenantId;
    this.clientId = args.clientId;
    this.clientSecret = args.clientSecret;
    this.siteId = args.siteId;
    this.listId = args.listId;
    this.userInfoListId = args.userInfoListId;
  }

  private authenticate = async (): Promise<string> => {
    if (this.token) {
      return this.token;
    }

    console.log('GETTING NEW AUTH TOKEN FOR MICROSOFT GRAPH API...');
    const params = new URLSearchParams();
    params.append('client_secret', this.clientSecret);
    params.append('client_id', this.clientId);
    params.append('grant_type', 'client_credentials');
    params.append('scope', encodeURI('https://graph.microsoft.com/.default'));
    const response = await axios.post(
      `https://login.microsoftonline.com/${this.tenantId}/oauth2/v2.0/token`,
      params.toString(),
    );

    const { data } = response;
    this.token = data.access_token;
    return this.token;
  };

  getUsers = async (): Promise<GetUsersResponse> => {
    const token = await this.authenticate();
    const response = await axios.get(`${this.baseUrl}/v1.0/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data as GetUsersResponse;
  };

  getSharepointManagerList = async (): Promise<GetSharepointManagerListResponse | undefined> => {
    const token = await this.authenticate();

    const response = await axios.get(
      `${this.baseUrl}/v1.0/sites/${this.siteId}/lists/${this.listId}/items/?expand=fields,columns&top=10000`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data as GetSharepointManagerListResponse;
  };

  getManagerByLookupId = async (managerLookupId: string): Promise<GetManagerLookupResponse | undefined> => {
    const token = await this.authenticate();

    const response = await axios.get(
      `${this.baseUrl}/v1.0/sites/${this.siteId}/lists/${this.userInfoListId}/items/${managerLookupId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data as GetManagerLookupResponse;
  };

  getManagerId = async (principalName: string): Promise<GetManagerResponse | undefined> => {
    const token = await this.authenticate();

    const response = await axios.get(`${this.baseUrl}/v1.0/users/${principalName}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data as GetManagerResponse;
  };

  updateUsersManager = async (userId: string, managerId: string): Promise<void> => {
    const token = await this.authenticate();

    await axios.put(
      `${this.baseUrl}/v1.0/users/${userId}/manager/$ref`,
      {
        '@odata.id': `https://graph.microsoft.com/v1.0/users/${managerId}`,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  };

  updateUser = async (idOrUserPrincipalName: string, userDetails: ActiveDirectoryUser): Promise<void> => {
    const token = await this.authenticate();
    await axios.patch(`${this.baseUrl}/v1.0/users/${idOrUserPrincipalName}`, userDetails, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
}

export const createMicrosoftGraphApiClient = (): MicrosoftGraphClient => {
  if (!process.env.MS_GRAPH_API_BASE_URL) {
    throw new EnvironmentConfigurationError('Missing MS_GRAPH_API_BASE_URL env variable');
  }

  if (!process.env.MS_GRAPH_API_TENANT_ID) {
    throw new EnvironmentConfigurationError('Missing MS_GRAPH_API_TENANT_ID env variable');
  }

  if (!process.env.MS_GRAPH_API_CLIENT_ID) {
    throw new EnvironmentConfigurationError('Missing MS_GRAPH_API_CLIENT_ID env variable');
  }

  if (!process.env.MS_GRAPH_API_CLIENT_SECRET) {
    throw new EnvironmentConfigurationError('Missing MS_GRAPH_API_CLIENT_SECRET env variable');
  }

  if (!process.env.MS_GRAPH_API_LIST_ID) {
    throw new EnvironmentConfigurationError('Missing MS_GRAPH_API_LIST_ID env variable');
  }

  if (!process.env.MS_GRAPH_API_SITE_ID) {
    throw new EnvironmentConfigurationError('Missing MS_GRAPH_API_SITE_ID env variable');
  }

  if (!process.env.MS_GRAPH_API_USER_INFO_LIST_ID) {
    throw new EnvironmentConfigurationError('Missing MS_GRAPH_API_USER_INFO_LIST_ID env variable');
  }

  return new MicrosoftGraphClient({
    baseUrl: process.env.MS_GRAPH_API_BASE_URL,
    tenantId: process.env.MS_GRAPH_API_TENANT_ID,
    clientId: process.env.MS_GRAPH_API_CLIENT_ID,
    clientSecret: process.env.MS_GRAPH_API_CLIENT_SECRET,
    listId: process.env.MS_GRAPH_API_LIST_ID,
    siteId: process.env.MS_GRAPH_API_SITE_ID,
    userInfoListId: process.env.MS_GRAPH_API_USER_INFO_LIST_ID,
  });
};
