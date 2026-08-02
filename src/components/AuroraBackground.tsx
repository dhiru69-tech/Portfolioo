"use client";

import { useReducedMotion } from "motion/react";
import type { CSSProperties } from "react";

/**
 * Reusable Aurora background.
 *
 * Distilled from the Aurora showcase project's ambient light system: layered
 * soft radial gradients that drift slowly behind content. Purely decorative,
 * always `pointer-events-none`, and animated with GPU-only properties
 * (`transform` / `opacity`) so it never triggers layout or paint thrash.
 *
 * Drop it as the first child of a `position: relative` container:
 *   <div className="relative">
 *     <AuroraBackground />
 *     ...content...
 *   </div>
 */
export type AuroraBackgroundProps = {
  /** Overall strength of the effect. 0 – 1. Lower = more subtle. */
  intensity?: number;
  /** Optional accent colour for the warm secondary bloom. */
  accent?: string;
  className?: string;
};

const AURORA_STYLE_ID = "aurora-background-keyframes";

export function AuroraBackground({
  intensity = 0.45,
  accent = "oklch(0.78 0.13 68)",
  className = "",
}: AuroraBackgroundProps) {
  const reduced = useReducedMotion();
  const opacity = Math.min(Math.max(intensity, 0), 1);

  const layer = (extra: CSSProperties): CSSProperties => ({
    position: "absolute",
    inset: "-25%",
    willChange: "transform, opacity",
    transform: "translateZ(0)",
    backfaceVisibility: "hidden",
    ...extra,
  });

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={{ opacity, contain: "strict" }}
    >
      <style id={AURORA_STYLE_ID}>{`
        @keyframes aurora-drift-a {
          0%   { transform: translate3d(-4%, -2%, 0) scale(1.05) rotate(0deg); }
          50%  { transform: translate3d(5%, 3%, 0) scale(1.18) rotate(8deg); }
          100% { transform: translate3d(-4%, -2%, 0) scale(1.05) rotate(0deg); }
        }
        @keyframes aurora-drift-b {
          0%   { transform: translate3d(3%, 4%, 0) scale(1.12) rotate(0deg); }
          50%  { transform: translate3d(-5%, -3%, 0) scale(1.0) rotate(-10deg); }
          100% { transform: translate3d(3%, 4%, 0) scale(1.12) rotate(0deg); }
        }
        @keyframes aurora-breathe {
          0%, 100% { opacity: 0.55; }
          50%      { opacity: 1; }
        }
      `}</style>

      {/* Cool primary sheet */}
      <div
        style={layer({
          background:
            "radial-gradient(60% 45% at 50% 0%, oklch(0.62 0.09 250 / 0.55) 0%, transparent 70%), radial-gradient(48% 42% at 18% 78%, oklch(0.55 0.10 265 / 0.40) 0%, transparent 72%)",
          filter: "blur(70px)",
          animation: reduced ? undefined : "aurora-drift-a 26s ease-in-out infinite",
        })}
      />

      {/* Warm accent bloom */}
      <div
        style={layer({
          background: `radial-gradient(45% 40% at 84% 88%, color-mix(in oklab, ${accent} 34%, transparent) 0%, transparent 70%), radial-gradient(40% 35% at 70% 12%, color-mix(in oklab, ${accent} 18%, transparent) 0%, transparent 72%)`,
          filter: "blur(90px)",
          animation: reduced ? undefined : "aurora-drift-b 34s ease-in-out infinite",
        })}
      />

      {/* Soft breathing veil keeps it alive without distracting */}
      <div
        style={layer({
          inset: 0,
          background:
            "radial-gradient(80% 60% at 50% 50%, oklch(0.70 0.05 250 / 0.12) 0%, transparent 75%)",
          animation: reduced ? undefined : "aurora-breathe 18s ease-in-out infinite",
        })}
      />
    </div>
  );
}

export default AuroraBackground;
