/**
 * Client-safe config - only exports NEXT_PUBLIC_* variables
 * Safe to use in browser/client components
 *
 * Usage in client components:
 *   import { publicConfig } from '@/lib/config.client'
 *   const siteUrl = publicConfig.SITE_URL
 */

export const publicConfig = {
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  EMAIL_MAIL: process.env.NEXT_PUBLIC_EMAIL_MAIL ?? "",
  EMAIL_USER: process.env.NEXT_PUBLIC_EMAIL_USER ?? "",
  EMAIL_APP_PASS: process.env.NEXT_PUBLIC_EMAIL_APP_PASS ?? "",
  MAILCHIMP_URL: process.env.NEXT_PUBLIC_MAILCHIMP_URL ?? "",
  RESUME_URL:
    process.env.NEXT_PUBLIC_RESUME_URL ??
    "https://fxw7x7luycssvogx.public.blob.vercel-storage.com/pdf/Nhlanhla_Junior_Malaza%20CV.pdf",
} as const;

export type PublicConfig = typeof publicConfig;
