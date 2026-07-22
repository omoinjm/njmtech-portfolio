import { z } from "zod";

/**
 * Environment variable schema with validation
 * Ensures type safety and runtime validation of env vars
 */
const envSchema = z.object({
  // Public variables (accessible on client)
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_RESUME_URL: z.string().url().optional(),

  // Private variables (server-only — never expose to client)
  EMAIL_MAIL: z.string().email(),
  EMAIL_USER: z.string().email(),
  EMAIL_APP_PASS: z.string(),
  D1_ACCOUNT_ID: z.string().optional(),
  D1_DATABASE_ID: z.string().optional(),
  D1_API_TOKEN: z.string().optional(),
  BLOG_VOXCPM_REF_AUDIO: z.string().optional(),
  BLOG_VOXCPM_VOICE_INSTRUCTION: z.string().optional(),
  BLOG_EDGE_TTS_VOICE: z.string().optional(),
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
   * Throws if validation fails, unless in build phase
   */
  private validateEnv(): Config {
    const result = envSchema.safeParse(process.env);

    if (!result.success) {
      const missingVars = result.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join("\n");

      const errorMessage = `❌ Invalid environment variables:\n${missingVars}\n\nPlease check your .env.local file.`;

      // During build time, we might not have all environment variables (especially secrets)
      // We log a warning instead of throwing to allow the build to complete.
      // NEXT_PHASE is set by Next.js during build.
      if (process.env.NEXT_PHASE === "phase-production-build") {
        console.warn(`[Config] Build-time validation warning:\n${errorMessage}`);
        return {
          NEXT_PUBLIC_SITE_URL:
            process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
          NEXT_PUBLIC_RESUME_URL: process.env.NEXT_PUBLIC_RESUME_URL,
          EMAIL_MAIL: process.env.EMAIL_MAIL ?? "",
          EMAIL_USER: process.env.EMAIL_USER ?? "",
          EMAIL_APP_PASS: process.env.EMAIL_APP_PASS ?? "",
          D1_ACCOUNT_ID: process.env.D1_ACCOUNT_ID,
          D1_DATABASE_ID: process.env.D1_DATABASE_ID,
          D1_API_TOKEN: process.env.D1_API_TOKEN,
          BLOG_VOXCPM_REF_AUDIO: process.env.BLOG_VOXCPM_REF_AUDIO,
          BLOG_VOXCPM_VOICE_INSTRUCTION:
            process.env.BLOG_VOXCPM_VOICE_INSTRUCTION,
          BLOG_EDGE_TTS_VOICE: process.env.BLOG_EDGE_TTS_VOICE,
        };
      }

      throw new Error(errorMessage);
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
