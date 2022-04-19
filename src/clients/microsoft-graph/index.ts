import axios from "axios";
import { EnvironmentConfigurationError } from "../../errors";

interface User {
  userPrincipalName: string;
}

interface GetUsersResponse {
  value: Array<User>;
  "odata.nextLink"?: string;
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
    this.clientSecret =  args.clientSecret
  }

  private authenticate = async (): Promise<string> => {
    if (this.token) {
      return this.token;
    }

    console.log("GETTING NEW AUTH TOKEN FOR MICROSOFT GRAPH API...")
    const params = new URLSearchParams();
    params.append("client_secret", this.clientSecret);
    params.append("client_id", this.clientId);
    params.append("grant_type", "client_credentials")
    params.append("scope", encodeURI("https://graph.microsoft.com/.default"))
    const response = await axios.post(`https://login.microsoftonline.com/${this.tenantId}/oauth2/v2.0/token`, params.toString());

    const { data } = response;
    this.token = data.access_token;
    return this.token;
  }

  getUsers = async (): Promise<GetUsersResponse | undefined> => {
    const token = await this.authenticate();
    const response = await axios.get(`${this.baseUrl}/v1.0/users`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    return response.data as GetUsersResponse;
  }
}

export const createMicrosoftGraphApiClient = (): MicrosoftGraphClient => {
  if (!process.env.MS_GRAPH_API_BASE_URL) {
    throw new EnvironmentConfigurationError('Missing MS_GRAPH_API_BASE_URL env variable')
  }

  if (!process.env.MS_GRAPH_API_TENANT_ID) {
    throw new EnvironmentConfigurationError('Missing MS_GRAPH_API_TENANT_ID env variable')
  }

  if (!process.env.MS_GRAPH_API_CLIENT_ID) {
    throw new EnvironmentConfigurationError('Missing MS_GRAPH_API_CLIENT_ID env variable')
  }

  if (!process.env.MS_GRAPH_API_CLIENT_SECRET) {
    throw new EnvironmentConfigurationError('Missing MS_GRAPH_API_CLIENT_SECRET env variable')
  }

  return new MicrosoftGraphClient({
    baseUrl: process.env.MS_GRAPH_API_BASE_URL,
    tenantId: process.env.MS_GRAPH_API_TENANT_ID,
    clientId: process.env.MS_GRAPH_API_CLIENT_ID,
    clientSecret: process.env.MS_GRAPH_API_CLIENT_SECRET
  })
}