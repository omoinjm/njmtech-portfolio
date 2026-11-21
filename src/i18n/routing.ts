import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "zu"],
  defaultLocale: "en",
  localePrefix: "as-needed", // /en → /, /zu → /zu
  // Preference cookie only — not HttpOnly because next-intl syncs it client-side
  localeCookie: { secure: process.env.NODE_ENV === "production" },
});
