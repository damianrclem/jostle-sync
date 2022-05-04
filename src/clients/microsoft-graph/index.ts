/* eslint-disable camelcase */
import axios from 'axios';
import { EnvironmentConfigurationError } from '../../errors';
import {
  ActiveDirectoryUser,
  UserLookupFields,
  GetManagerResponse,
  UsersListFieldColumnValueSet,
  SharepointUsersListFields,
} from '../../types';

interface GetSharepointUsersListResponse {
  value: Array<SharepointUsersListFields>;
  'odata.nextLink'?: string;
}

interface GetUsersResponse {
  value: Array<ActiveDirectoryUser>;
  'odata.nextLink'?: string;
}

interface GetUserLookupResponse {
  fields: UserLookupFields;
  'odata.nextLink'?: string;
}

interface MicrosoftGraphClientArgs {
  baseUrl: string;
  tenantId: string;
  clientId: string;
  clientSecret: string;
}

export class MicrosoftGraphClient {
  private readonly baseUrl: string;

  private readonly tenantId: string;

  private readonly clientId: string;

  private readonly clientSecret: string;

  private token: string;

  constructor(args: MicrosoftGraphClientArgs) {
    this.baseUrl = args.baseUrl;
    this.tenantId = args.tenantId;
    this.clientId = args.clientId;
    this.clientSecret = args.clientSecret;
  }

  private authenticate = async (): Promise<string> => {
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
    return data.access_token;
  };

  setToken = async () => {
    console.log(
      'NEW AUTH TOKEN FOR MICROSOFT GRAPH API WAS SET...  Send http://localhost:3000/sync in postman to start sync...',
    );
    this.token = await this.authenticate();
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

  getSharepointList = async (siteId: string, listId: string): Promise<GetSharepointUsersListResponse | undefined> => {
    const response = await axios.get(
      `${this.baseUrl}/v1.0/sites/${siteId}/lists/${listId}/items/?expand=fields,columns&top=10000`,
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      },
    );

    return response.data as GetSharepointUsersListResponse;
  };

  getUserByLookupId = async (
    userLookupId: string,
    siteId: string,
    userInfoListId: string,
  ): Promise<GetUserLookupResponse | undefined> => {
    const response = await axios.get(
      `${this.baseUrl}/v1.0/sites/${siteId}/lists/${userInfoListId}/items/${userLookupId}`,
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      },
    );

    return response.data as GetUserLookupResponse;
  };

  getUser = async (principalName: string): Promise<GetManagerResponse | undefined> => {
    const response = await axios.get(`${this.baseUrl}/v1.0/users/${principalName}`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });

    return response.data as GetManagerResponse;
  };

  updateUsersManager = async (userId: string, managerId: string): Promise<void> => {
    await axios.put(
      `${this.baseUrl}/v1.0/users/${userId}/manager/$ref`,
      {
        '@odata.id': `https://graph.microsoft.com/v1.0/users/${managerId}`,
      },
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      },
    );
  };

  updateUser = async (idOrUserPrincipalName: string, userDetails: ActiveDirectoryUser): Promise<void> => {
    await axios.patch(`${this.baseUrl}/v1.0/users/${idOrUserPrincipalName}`, userDetails, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
  };

  updateListItem = async (
    siteId: string,
    listId: string,
    itemId: string,
    fieldValueSet: UsersListFieldColumnValueSet,
  ): Promise<void> => {
    await axios.patch(`${this.baseUrl}/v1.0/sites/${siteId}/lists/${listId}/items/${itemId}/fields`, fieldValueSet, {
      headers: {
        Authorization: `Bearer ${this.token}`,
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

  return new MicrosoftGraphClient({
    baseUrl: process.env.MS_GRAPH_API_BASE_URL,
    tenantId: process.env.MS_GRAPH_API_TENANT_ID,
    clientId: process.env.MS_GRAPH_API_CLIENT_ID,
    clientSecret: process.env.MS_GRAPH_API_CLIENT_SECRET,
  });
};
