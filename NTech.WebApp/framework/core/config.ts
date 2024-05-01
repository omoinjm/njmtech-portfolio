export default interface IConfig {
  getSubscriptionUrl(): string | undefined;

  getEmailUser(): string | undefined;

  getSecret(): string | undefined;

  getSendAddress(): string | undefined;

  getSiteUrl(): string | undefined;

  getApiEndpoint(): string | undefined;
}
