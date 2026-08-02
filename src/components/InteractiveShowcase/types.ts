import type { ComponentType, ReactNode } from "react";

/** Media rendered inside the floating preview plate. */
export type ShowcaseMedia =
  | { type: "image"; src: string; alt?: string }
  | { type: "video"; src: string; poster?: string; alt?: string }
  | { type: "logo"; src: string; alt?: string }
  | { type: "component"; render: ComponentType<{ isActive: boolean }> }
  | { type: "lottie"; data: unknown; loop?: boolean };

export interface ShowcaseItem {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  category?: string;
  /** Small meta chips, e.g. year / location / stack. */
  tags?: string[];
  link?: { href: string; label?: string };
  media?: ShowcaseMedia;
  /** Per-item accent override (any CSS color). */
  accentColor?: string;
}

export type ShowcaseTheme = "dark" | "light";
export type PreviewSize = "sm" | "md" | "lg";

/** Renders `media.type === "lottie"` payloads. Injected so the
 *  component stays dependency-free. */
export type LottieRenderer = ComponentType<{ data: unknown; loop?: boolean }>;

export interface InteractiveShowcaseProps {
  items: ShowcaseItem[];
  /** Uncontrolled starting index. */
  defaultIndex?: number;
  /** Controlled index. */
  index?: number;
  onIndexChange?: (index: number, item: ShowcaseItem) => void;
  onItemSelect?: (item: ShowcaseItem) => void;
  theme?: ShowcaseTheme;
  /** Any CSS color; drives glow, rail and accents. */
  accentColor?: string;
  /** 1 = default. 0.6 = slower, 1.6 = snappier. */
  animationSpeed?: number;
  previewSize?: PreviewSize;
  soundEnabled?: boolean;
  soundVolume?: number;
  /** Change active item on hover (desktop only). */
  activateOnHover?: boolean;
  /** Wheel over the list steps through items. */
  scrollToNavigate?: boolean;
  loop?: boolean;
  showCursor?: boolean;
  showProgress?: boolean;
  showNavigation?: boolean;
  hint?: ReactNode;
  label?: string;
  className?: string;
  lottieRenderer?: LottieRenderer;
}