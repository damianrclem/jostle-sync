import axios from "axios";

interface MicrosoftAuthClientArgs {
  baseUrl: string;
  tenantId: string;
  clientId: string;
  clientSecret: string;
  scope: string;
}

export class MicrosoftAuthClient {
  private readonly baseUrl: string;

  private readonly tenantId: string;

  private readonly clientId: string;

  private readonly clientSecret: string;

  private readonly scope: string;

  constructor(args: MicrosoftAuthClientArgs) {
    this.baseUrl = args.baseUrl;
    this.tenantId =  args.tenantId;
    this.clientId = args.clientId;
    this.clientSecret = args.clientSecret;
    this.scope = args.scope;
  }

  authenticate = async (): Promise<string> => {
    const response = await axios.post(`${this.baseUrl}/${this.tenantId}/oauth2/v2.0/token`, {
      client_secret: this.clientSecret,
      client_id: this.clientId,
      grant_type: "client_credentials",
      scope: this.scope
    });

    const { data } = response;

    return data.access_token as string;
  }
}