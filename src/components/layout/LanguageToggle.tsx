"use client";

import { useEffect, useState } from "react";

const LANGUAGE_STORAGE_KEY = "njmtech-ui-language";

type LanguageCode = "es" | "en";

const LANGUAGES: Array<{ code: LanguageCode; label: string }> = [
  { code: "es", label: "ES" },
  { code: "en", label: "EN" },
];

export function LanguageToggle({ className = "" }: { className?: string }) {
  const [language, setLanguage] = useState<LanguageCode>("en");

  useEffect(() => {
    const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    const nextLanguage =
      storedLanguage === "es" || storedLanguage === "en" ? storedLanguage : "en";

    setLanguage(nextLanguage);
    document.documentElement.dataset.uiLanguage = nextLanguage;
  }, []);

  const handleSelect = (nextLanguage: LanguageCode) => {
    setLanguage(nextLanguage);
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
    document.documentElement.dataset.uiLanguage = nextLanguage;
  };

  return (
    <div
      className={`flex items-center rounded-full border border-[#7ad39b]/20 bg-[#0b2a18]/70 p-1.5 shadow-[0_10px_30px_rgba(7,31,18,0.28)] backdrop-blur-md ${className}`}
      role="group"
      aria-label="Language preference"
    >
      {LANGUAGES.map((entry) => {
        const isActive = entry.code === language;

        return (
          <button
            key={entry.code}
            type="button"
            onClick={() => handleSelect(entry.code)}
            aria-pressed={isActive}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold tracking-[0.18em] transition-all duration-200 ${
              isActive
                ? "bg-[#eff7e8] text-[#17311f] shadow-[0_0_18px_rgba(239,247,232,0.2)]"
                : "text-[#d3ead9] hover:text-white"
            }`}
          >
            {entry.label}
          </button>
        );
      })}
    </div>
  );
}
