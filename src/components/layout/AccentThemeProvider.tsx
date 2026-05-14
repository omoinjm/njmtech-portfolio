"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  ACCENT_THEME_STORAGE_KEY,
  ACCENT_THEMES,
  DEFAULT_ACCENT_THEME,
  getAccentTheme,
  isAccentThemeId,
  type AccentThemeId,
} from "@/lib/accent-theme";
import { AccentThemeContext } from "@/components/layout/accent-theme-context";

export function AccentThemeProvider({ children }: { children: ReactNode }) {
  const [accentThemeId, setAccentThemeId] = useState<AccentThemeId>(
    () => {
      if (typeof document === "undefined") {
        return DEFAULT_ACCENT_THEME;
      }

      const fromDom = document.documentElement.dataset.accentTheme;
      return fromDom && isAccentThemeId(fromDom)
        ? fromDom
        : DEFAULT_ACCENT_THEME;
    },
  );

  useEffect(() => {
    document.documentElement.dataset.accentTheme = accentThemeId;
  }, [accentThemeId]);

  const setAccentTheme = useCallback((themeId: AccentThemeId) => {
    setAccentThemeId(themeId);
    window.localStorage.setItem(ACCENT_THEME_STORAGE_KEY, themeId);
  }, []);

  const value = useMemo(
    () => ({
      accentTheme: getAccentTheme(accentThemeId),
      setAccentTheme,
      themes: ACCENT_THEMES,
    }),
    [accentThemeId, setAccentTheme],
  );

  return (
    <AccentThemeContext.Provider value={value}>
      {children}
    </AccentThemeContext.Provider>
  );
}
