export type AccentThemeId = "ocean" | "aurora" | "ember" | "violet";

export type AccentTheme = {
  id: AccentThemeId;
  label: string;
  primary: string;
  accent: string;
  ring: string;
  gradientStart: string;
  gradientEnd: string;
  chipFrom: string;
  chipTo: string;
};

export const ACCENT_THEME_STORAGE_KEY = "njmtech-accent-theme";
export const DEFAULT_ACCENT_THEME: AccentThemeId = "ocean";

export const ACCENT_THEMES: AccentTheme[] = [
  {
    id: "ocean",
    label: "Ocean",
    primary: "175 65% 50%",
    accent: "210 70% 55%",
    ring: "175 65% 50%",
    gradientStart: "175 65% 50%",
    gradientEnd: "210 70% 55%",
    chipFrom: "#2dd4bf",
    chipTo: "#3b82f6",
  },
  {
    id: "aurora",
    label: "Aurora",
    primary: "150 72% 46%",
    accent: "188 92% 48%",
    ring: "150 72% 46%",
    gradientStart: "150 72% 46%",
    gradientEnd: "188 92% 48%",
    chipFrom: "#22c55e",
    chipTo: "#06b6d4",
  },
  {
    id: "ember",
    label: "Ember",
    primary: "18 88% 58%",
    accent: "335 82% 60%",
    ring: "18 88% 58%",
    gradientStart: "18 88% 58%",
    gradientEnd: "335 82% 60%",
    chipFrom: "#f97316",
    chipTo: "#ec4899",
  },
  {
    id: "violet",
    label: "Violet",
    primary: "268 83% 63%",
    accent: "228 88% 66%",
    ring: "268 83% 63%",
    gradientStart: "268 83% 63%",
    gradientEnd: "228 88% 66%",
    chipFrom: "#8b5cf6",
    chipTo: "#4f46e5",
  },
];

const accentThemeIds = ACCENT_THEMES.map((theme) => theme.id);

const JS_UNSAFE_CHAR_MAP: Record<string, string> = {
  "<": "\\u003C",
  ">": "\\u003E",
  "/": "\\u002F",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "\t": "\\t",
  "\0": "\\0",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029",
};

const escapeUnsafeChars = (value: string): string =>
  value.replace(/[<>\/\\\b\f\n\r\t\0\u2028\u2029]/g, (char) => JS_UNSAFE_CHAR_MAP[char] ?? char);

export const isAccentThemeId = (value: string): value is AccentThemeId =>
  accentThemeIds.includes(value as AccentThemeId);

export const getAccentTheme = (id: AccentThemeId) =>
  ACCENT_THEMES.find((theme) => theme.id === id) ?? ACCENT_THEMES[0];

export const ACCENT_THEME_BOOT_SCRIPT = `(function(){var key=${escapeUnsafeChars(JSON.stringify(ACCENT_THEME_STORAGE_KEY))};var fallback=${escapeUnsafeChars(JSON.stringify(DEFAULT_ACCENT_THEME))};var ids=${escapeUnsafeChars(JSON.stringify(accentThemeIds))};try{var value=localStorage.getItem(key);var theme=ids.indexOf(value)>-1?value:fallback;document.documentElement.dataset.accentTheme=theme;}catch(e){document.documentElement.dataset.accentTheme=fallback;}})();`;
