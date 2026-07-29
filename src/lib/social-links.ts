import type { FooterModel } from "@/types";

/** Canonical social profiles — LinkedIn, GitHub, Twitter (Lucide icon names). */
export const WHATSAPP_E164 = "27832766443";
export const WHATSAPP_DISPLAY = "083 276 6443";

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_E164}?text=${encodeURIComponent(message)}`;
}

export const SOCIAL_LINKS: FooterModel[] = [
  {
    id: 1,
    label: "LinkedIn",
    icon: "Linkedin",
    url: "https://www.linkedin.com/in/njmalaza",
  },
  {
    id: 2,
    label: "GitHub",
    icon: "Github",
    url: "https://github.com/omoinjm",
  },
  {
    id: 3,
    label: "Twitter",
    icon: "Twitter",
    url: "https://twitter.com/nhlanhlamalaza_",
  },
];
