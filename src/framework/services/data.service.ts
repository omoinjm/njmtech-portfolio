import { logger } from '@/framework/utils/logger';

export default class DataService {
  private static API_URL: string = this.getApiUrl();

  private static HTTP_OPTIONS: Record<string, string> = {
    'Content-Type': 'application/json;charset=utf-8',
    Accept: 'application/json',
  };

  /**
   * Get the base API URL, with fallback to window location for client-side
   */
  private static getApiUrl(): string {
    // During server-side rendering, use environment variable
    if (typeof window === 'undefined') {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
      if (!siteUrl) {
        logger.warn('NEXT_PUBLIC_SITE_URL not set, using default');
        return 'https://njmtech.vercel.app/api/';
      }
      return `${siteUrl}/api/`;
    }

    // Client-side: construct from current origin
    return `${window.location.origin}/api/`;
  }

  public static async get_call(action: string, parameters?: URLSearchParams | null) {
    try {
      const url = parameters
        ? this.get_full_api_path(action) + '?' + parameters.toString()
        : this.get_full_api_path(action);

      const response = await fetch(url, {
        method: 'GET',
        headers: this.HTTP_OPTIONS,
      });

      if (!response.ok) {
        const errorMessage = `HTTP error! status: ${response.status}`;
        logger.error(errorMessage);
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      logger.error('Fetch error in DataService.get_call', error);
      throw error;
    }
  }

  public static async post_call(action: string, parameters: object | null) {
    try {
      const response = await fetch(this.get_full_api_path(action), {
        method: 'POST',
        headers: this.HTTP_OPTIONS,
        body: JSON.stringify(parameters),
      });

      if (!response.ok) {
        const errorMessage = `HTTP error! status: ${response.status}`;
        logger.error(errorMessage);
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      logger.error('Fetch error in DataService.post_call', error);
      throw error;
    }
  }

  /**
   * Build the full API path
   */
  private static get_full_api_path(action: string) {
    return this.API_URL + action;
  }
}
