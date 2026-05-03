/**
 * Interface for Text-to-Speech Providers
 * Adheres to Interface Segregation and Liskov Substitution principles.
 */
export interface ITtsProvider {
  readonly name: string;
  synthesize(text: string): Promise<ArrayBuffer>;
}
