/**
 * Logging utility for conditional logging based on environment
 * Only logs in development, never in production
 */

export const logger = {
  debug: (message: string, data?: unknown) => {
    if (process.env.NODE_ENV === "development") {
      console.debug(`[DEBUG] ${message}`, data);
    }
  },

  info: (message: string, data?: unknown) => {
    if (process.env.NODE_ENV === "development") {
      console.info(`[INFO] ${message}`, data);
    }
  },

  warn: (message: string, data?: unknown) => {
    console.warn(`[WARN] ${message}`, data);
  },

  error: (message: string, error?: unknown) => {
    console.error(`[ERROR] ${message}`, error);
  },
};
