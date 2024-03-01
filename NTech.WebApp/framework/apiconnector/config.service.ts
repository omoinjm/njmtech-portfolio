export default class ConfigService {
  static get getSubscriptionUrl(): string | undefined {
    return process.env.NEXT_PUBLIC_MAILCHIMP_URL;
  }

  static get getEmailUser(): string | undefined {
    return process.env.NEXT_PUBLIC_EMAIL_USER;
  }

  static get getSecret(): string | undefined {
    return process.env.NEXT_PUBLIC_EMAIL_APP_PASS;
  }

  static get getSendAddress(): string | undefined {
    return process.env.NEXT_PUBLIC_EMAIL_MAIL;
  }

  static get getSiteUrl(): string | undefined {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  static get getApiEndpoint(): string | undefined {
    return process.env.ASP_DOTNET_API_EMDPOINT;
  }
}
