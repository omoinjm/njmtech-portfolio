"use client";

import { createContext } from "react";
import type { AccentTheme, AccentThemeId } from "@/lib/accent-theme";

export type AccentThemeContextValue = {
  accentTheme: AccentTheme;
  setAccentTheme: (themeId: AccentThemeId) => void;
  themes: AccentTheme[];
};

export const AccentThemeContext =
  createContext<AccentThemeContextValue | null>(null);
