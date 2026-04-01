import { z } from "zod";

/**
 * Environment variable schema with validation
 * Ensures type safety and runtime validation of env vars
 */
const envSchema = z.object({
  // Public variables (accessible on client)
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_EMAIL_MAIL: z.string().email(),
  NEXT_PUBLIC_EMAIL_USER: z.string().email(),
  NEXT_PUBLIC_EMAIL_APP_PASS: z.string(),
  NEXT_PUBLIC_MAILCHIMP_URL: z.string().url(),
  NEXT_PUBLIC_RESUME_URL: z.string().url().optional(),

  // Private variables (server-only)
  DATABASE_URL: z.string().optional(),
  POSTGRES_URL: z.string().optional(),
  POSTGRES_URL_NON_POOLING: z.string().optional(),
  POSTGRES_HOST: z.string().optional(),
  POSTGRES_USER: z.string().optional(),
  POSTGRES_PASSWORD: z.string().optional(),
  POSTGRES_DATABASE: z.string().optional(),
});

export type Config = z.infer<typeof envSchema>;

/**
 * Config service for environment variables
 * Provides type-safe access to environment configuration
 *
 * Usage:
 *   import { config } from '@/lib/config'
 *   const siteUrl = config.NEXT_PUBLIC_SITE_URL
 */
class ConfigService {
  private config: Config;

  constructor() {
    this.config = this.validateEnv();
  }

  /**
   * Validates environment variables against schema
   * Throws if validation fails
   */
  private validateEnv(): Config {
    const result = envSchema.safeParse(process.env);

    if (!result.success) {
      const missingVars = result.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join("\n");

      throw new Error(
        `❌ Invalid environment variables:\n${missingVars}\n\nPlease check your .env.local file.`
      );
    }

    return result.data;
  }

  /**
   * Get a config value with type safety
   */
  get<K extends keyof Config>(key: K): Config[K] {
    return this.config[key];
  }

  /**
   * Check if running in production
   */
  isProduction(): boolean {
    return process.env.NODE_ENV === "production";
  }

  /**
   * Check if running in development
   */
  isDevelopment(): boolean {
    return process.env.NODE_ENV === "development";
  }

  /**
   * Get site URL with trailing slash removed
   */
  getSiteUrl(): string {
    return this.config.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }

  /**
   * Get all config values (useful for debugging)
   */
  getAll(): Config {
    return { ...this.config };
  }
}

// Create singleton instance
const configService = new ConfigService();

export const config = configService;
