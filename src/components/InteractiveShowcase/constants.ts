import type { PreviewSize } from "./types";

export const DEFAULT_ACCENT = "oklch(0.78 0.13 68)";

export const PREVIEW_SIZES: Record<PreviewSize, string> = {
  sm: "max-w-[26rem]",
  md: "max-w-[34rem]",
  lg: "max-w-[44rem]",
};

/** Max translation of the preview plate under the cursor (px). */
export const FOLLOW_DISTANCE = 12;
/** Max tilt of the preview plate under the cursor (deg). */
export const TILT_ANGLE = 4.5;

export const SPRING_FOLLOW = { stiffness: 180, damping: 26, mass: 0.6 } as const;
export const SPRING_RAIL = { stiffness: 420, damping: 42, mass: 0.9 } as const;

/** Minimum gap between ticks so sounds never overlap (ms). */
export const SOUND_THROTTLE_MS = 70;