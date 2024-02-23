import IConfig from "../db/interface/config";

export default class ConfigService implements IConfig {
  public get getSubscriptionUrl(): string | undefined {
    return process.env.NEXT_PUBLIC_MAILCHIMP_URL;
  }
  public get getEmailUser(): string | undefined {
    return process.env.NEXT_PUBLIC_EMAIL_USER;
  }
  public get getSecret(): string | undefined {
    return process.env.NEXT_PUBLIC_EMAIL_APP_PASS;
  }
  public get getSendAddress(): string | undefined {
    return process.env.NEXT_PUBLIC_EMAIL_MAIL;
  }

  public get getSiteUrl(): string | undefined {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  public get getApiEndpoint(): string | undefined {
    return process.env.ASP_DOTNET_API_EMDPOINT;
  }
}
