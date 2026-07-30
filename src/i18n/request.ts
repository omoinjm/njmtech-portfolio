import { getRequestConfig } from "next-intl/server";
import en from "../../messages/en.json";
import zu from "../../messages/zu.json";
import { routing } from "./routing";

const localeMessages = { en, zu } as const;

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as "en" | "zu")) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: localeMessages[locale as keyof typeof localeMessages],
  };
});
