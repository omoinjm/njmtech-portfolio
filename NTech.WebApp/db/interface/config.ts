export default interface IConfig {
  get getSubscriptionUrl(): string | undefined;
  get getEmailUser(): string | undefined;
  get getSecret(): string | undefined;
  get getSendAddress(): string | undefined;
  get getSiteUrl(): string | undefined;
  get getApiEndpoint(): string | undefined;
}
