import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "zu"],
  defaultLocale: "en",
  localePrefix: "as-needed", // /en → /, /zu → /zu
});
