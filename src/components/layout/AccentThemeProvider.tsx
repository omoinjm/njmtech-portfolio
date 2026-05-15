"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useSyncExternalStore,
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

function subscribeToStorage(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getStoredTheme(): AccentThemeId {
  try {
    const stored = localStorage.getItem(ACCENT_THEME_STORAGE_KEY);
    return stored && isAccentThemeId(stored) ? stored : DEFAULT_ACCENT_THEME;
  } catch {
    return DEFAULT_ACCENT_THEME;
  }
}

export function AccentThemeProvider({ children }: { children: ReactNode }) {
  // useSyncExternalStore reads from localStorage on the client (with SSR fallback)
  // without needing setState-in-effect, avoiding cascading renders.
  const accentThemeId = useSyncExternalStore(
    subscribeToStorage,
    getStoredTheme,
    () => DEFAULT_ACCENT_THEME,
  );

  // Keep data-accent-theme in sync with state. The boot script in <head> handles
  // the initial DOM set before React hydrates, preventing any flash.
  useEffect(() => {
    document.documentElement.dataset.accentTheme = accentThemeId;
  }, [accentThemeId]);

  const setAccentTheme = useCallback((themeId: AccentThemeId) => {
    window.localStorage.setItem(ACCENT_THEME_STORAGE_KEY, themeId);
    // Dispatch a storage event so useSyncExternalStore picks up the change
    // (storage events don't fire in the same tab that wrote the value).
    window.dispatchEvent(new StorageEvent("storage", { key: ACCENT_THEME_STORAGE_KEY, newValue: themeId }));
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
