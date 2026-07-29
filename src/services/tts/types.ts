/**
 * Interface for Text-to-Speech Providers
 * Adheres to Interface Segregation and Liskov Substitution principles.
 */
export interface TtsSynthesisOptions {
  cacheKey?: string;
}

export interface ITtsProvider {
  readonly name: string;
  synthesize(text: string, options?: TtsSynthesisOptions): Promise<ArrayBuffer>;
}
