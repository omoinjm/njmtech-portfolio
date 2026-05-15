"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { useTransition } from "react";

const LOCALES = [
  { code: "en", label: "EN" },
  { code: "zu", label: "ZU" },
] as const;

type Locale = (typeof LOCALES)[number]["code"];

export const LanguageSwitcher = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const switchLocale = (next: Locale) => {
    if (next === locale) return;

    startTransition(() => {
      const segments = pathname.split("/");
      const hasLocalePrefix = segments[1] === "en" || segments[1] === "zu";
      const rest = hasLocalePrefix ? segments.slice(2).join("/") : segments.slice(1).join("/");
      const newPath = next === "en" ? `/${rest}` : `/${next}/${rest || ""}`;
      router.push(newPath);
    });
  };

  return (
    <div
      className={`flex items-center rounded-full p-0.5 gap-0.5 bg-muted/60 border border-border/50 text-[11px] font-semibold tracking-wider transition-opacity ${
        isPending ? "opacity-60 pointer-events-none" : ""
      }`}
    >
      {LOCALES.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => switchLocale(code)}
          className={`px-2.5 py-1 rounded-full transition-all duration-200 ${
            locale === code
              ? "bg-foreground text-background shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};
