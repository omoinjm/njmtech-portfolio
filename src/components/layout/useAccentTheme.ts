"use client";

import { useContext } from "react";
import { AccentThemeContext } from "@/components/layout/accent-theme-context";

export function useAccentTheme() {
  const context = useContext(AccentThemeContext);

  if (!context) {
    throw new Error("useAccentTheme must be used within AccentThemeProvider.");
  }

  return context;
}
