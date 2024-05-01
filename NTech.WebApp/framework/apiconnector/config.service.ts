import IConfig from "../core/config";

export default class ConfigService implements IConfig {
  getSubscriptionUrl(): string | undefined {
    return process.env.NEXT_PUBLIC_MAILCHIMP_URL;
  }

  getEmailUser(): string | undefined {
    return process.env.NEXT_PUBLIC_EMAIL_USER;
  }

  getSecret(): string | undefined {
    return process.env.NEXT_PUBLIC_EMAIL_APP_PASS;
  }

  getSendAddress(): string | undefined {
    return process.env.NEXT_PUBLIC_EMAIL_MAIL;
  }

  getSiteUrl(): string | undefined {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  getApiEndpoint(): string | undefined {
    return process.env.ASP_DOTNET_API_EMDPOINT;
  }
}
