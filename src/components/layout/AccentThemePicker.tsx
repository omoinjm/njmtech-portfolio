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
      className={`flex items-center gap-1 rounded-full border border-[#7ad39b]/20 bg-[#0b2a18]/70 p-1.5 shadow-[0_10px_30px_rgba(7,31,18,0.28)] backdrop-blur-md ${className}`}
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
                ? "border-[#9bf5be]/40 bg-[#9bf5be] text-[#0e2116] shadow-[0_0_0_1px_rgba(155,245,190,0.18),0_0_24px_rgba(112,255,182,0.3)]"
                : "border-transparent text-[#b8d7c2] hover:border-[#7ad39b]/20 hover:bg-white/5 hover:text-white"
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
