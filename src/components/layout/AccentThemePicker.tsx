"use client";

import {
  Compass,
  Leaf,
  Sparkles,
  SunMedium,
  type LucideIcon,
} from "lucide-react";
import { useAccentTheme } from "@/components/layout/useAccentTheme";
import type { AccentThemeId } from "@/lib/accent-theme";

type AccentThemePickerProps = {
  className?: string;
};

const THEME_ICONS: Record<AccentThemeId, LucideIcon> = {
  ocean: Compass,
  aurora: SunMedium,
  ember: Leaf,
  violet: Sparkles,
};

export function AccentThemePicker({
  className = "",
}: AccentThemePickerProps) {
  const { accentTheme, setAccentTheme, themes } = useAccentTheme();

  return (
    <div
      className={`flex items-center gap-1 rounded-full border border-primary/20 bg-background/70 p-1.5 shadow-[0_10px_30px_rgba(7,31,18,0.28)] backdrop-blur-md ${className}`}
      aria-label="Accent theme picker"
      role="group"
    >
      {themes.map((theme) => {
        const isActive = theme.id === accentTheme.id;
        const Icon = THEME_ICONS[theme.id];

        return (
          <button
            key={theme.id}
            type="button"
            onClick={() => setAccentTheme(theme.id)}
            aria-label={`Use ${theme.label} accent theme`}
            aria-pressed={isActive}
            className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-200 ${
              isActive
                ? "border-primary/40 bg-primary text-primary-foreground shadow-[0_0_0_1px_hsl(var(--primary)/0.18),0_0_24px_hsl(var(--primary)/0.3)]"
                : "border-transparent text-muted-foreground hover:border-primary/20 hover:bg-white/5 hover:text-foreground"
            }`}
            title={theme.label}
          >
            <span className="sr-only">{theme.label}</span>
            <Icon size={15} strokeWidth={2.1} />
          </button>
        );
      })}
    </div>
  );
}
