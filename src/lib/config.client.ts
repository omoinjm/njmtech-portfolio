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
  RESUME_URL:
    process.env.NEXT_PUBLIC_RESUME_URL ??
    "https://fxw7x7luycssvogx.public.blob.vercel-storage.com/pdf/Nhlanhla_Junior_Malaza_CV.pdf",
} as const;

export type PublicConfig = typeof publicConfig;
