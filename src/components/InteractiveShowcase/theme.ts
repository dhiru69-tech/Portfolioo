import type { CSSProperties } from "react";

import { DEFAULT_ACCENT } from "./constants";
import type { ShowcaseTheme } from "./types";

/**
 * Scoped design tokens. They are applied as CSS variables on the component
 * root so the folder stays portable — drop it into any project and it themes
 * itself without touching global CSS.
 */
const THEMES: Record<ShowcaseTheme, Record<string, string>> = {
  dark: {
    "--isc-bg": "oklch(0.16 0.008 260)",
    "--isc-surface": "oklch(1 0 0 / 0.045)",
    "--isc-surface-strong": "oklch(1 0 0 / 0.075)",
    "--isc-border": "oklch(1 0 0 / 0.09)",
    "--isc-border-strong": "oklch(1 0 0 / 0.16)",
    "--isc-fg": "oklch(0.98 0.002 260)",
    "--isc-muted": "oklch(0.72 0.012 260 / 0.62)",
    "--isc-faint": "oklch(0.72 0.012 260 / 0.32)",
    "--isc-shadow":
      "0 1px 0 0 oklch(1 0 0 / 0.06) inset, 0 40px 90px -30px oklch(0 0 0 / 0.85), 0 8px 30px -12px oklch(0 0 0 / 0.6)",
  },
  light: {
    "--isc-bg": "oklch(0.97 0.004 260)",
    "--isc-surface": "oklch(0.2 0.01 260 / 0.04)",
    "--isc-surface-strong": "oklch(1 0 0 / 0.7)",
    "--isc-border": "oklch(0.2 0.01 260 / 0.1)",
    "--isc-border-strong": "oklch(0.2 0.01 260 / 0.22)",
    "--isc-fg": "oklch(0.19 0.01 260)",
    "--isc-muted": "oklch(0.42 0.012 260 / 0.8)",
    "--isc-faint": "oklch(0.42 0.012 260 / 0.4)",
    "--isc-shadow":
      "0 1px 0 0 oklch(1 0 0 / 0.8) inset, 0 40px 90px -40px oklch(0.2 0.02 260 / 0.35), 0 8px 30px -14px oklch(0.2 0.02 260 / 0.25)",
  },
};

export function themeStyle(
  theme: ShowcaseTheme,
  accentColor = DEFAULT_ACCENT,
): CSSProperties {
  return { ...THEMES[theme], "--isc-accent": accentColor } as CSSProperties;
}