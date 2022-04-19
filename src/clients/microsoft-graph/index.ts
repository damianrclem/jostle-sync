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
}

export class MicrosoftGraphClient {
  private readonly baseUrl: string;

  private token: string;

  constructor(args: MicrosoftGraphClientArgs) {
    this.baseUrl = args.baseUrl;
  }

  private authenticate = async (): Promise<string> => {
    if (this.token) {
      return this.token;
    }

    if (!process.env.MS_GRAPH_API_TENANT_ID) {
      throw new EnvironmentConfigurationError('Missing MS_GRAPH_API_TENANT_ID env variable')
    }

    if (!process.env.MS_GRAPH_API_CLIENT_SECRET) {
      throw new EnvironmentConfigurationError('Missing MS_GRAPH_API_CLIENT_SECRET env variable')
    }

    if (!process.env.MS_GRAPH_API_CLIENT_ID) {
      throw new EnvironmentConfigurationError('Missing MS_GRAPH_API_CLIENT_ID env variable')
    }

    console.log("GETTING NEW AUTH TOKEN FOR MICROSOFT GRAPH API...")
    const params = new URLSearchParams();
    params.append("client_secret", process.env.MS_GRAPH_API_CLIENT_SECRET);
    params.append("client_id", process.env.MS_GRAPH_API_CLIENT_ID);
    params.append("grant_type", "client_credentials")
    params.append("scope", encodeURI("https://graph.microsoft.com/.default"))
    const response = await axios.post(`https://login.microsoftonline.com/${process.env.MS_GRAPH_API_TENANT_ID}/oauth2/v2.0/token`, params.toString());

    const { data } = response;
    this.token = data.access_token;
    return this.token;
  }

  getUsers = async (): Promise<GetUsersResponse | undefined> => {
    const token = await this.authenticate();
    console.log(token)
    const response = await axios.get(`${this.baseUrl}/v1.0/users`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    return response.data as GetUsersResponse;
  }
}