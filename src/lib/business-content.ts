import {
  WHATSAPP_DISPLAY,
  WHATSAPP_E164,
  buildWhatsAppUrl,
} from "@/lib/social-links";
import { siteConfig } from "@/utils/seo";

export const BUSINESS_CONTACT = {
  email: siteConfig.email,
  phoneE164: WHATSAPP_E164,
  phoneDisplay: WHATSAPP_DISPLAY,
  location: `${siteConfig.location.city}, ${siteConfig.location.country}`,
} as const;

export const RESPONSE_TIME = "4 business hours";

export function getGeneralQuoteUrl(): string {
  return buildWhatsAppUrl(
    "Hi NJMTECH, I came across your site and wanted to get in touch.",
  );
}
