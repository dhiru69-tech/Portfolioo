import { useEffect, useState } from "react";

export type MotionTier = "mobile" | "tablet" | "desktop" | "reduced";

/**
 * Responsive animation intensity.
 *
 * Motion is never fully disabled by screen size — only scaled down, so tablet
 * and mobile keep fades, slides and scroll reveals while skipping the
 * expensive work. `prefers-reduced-motion` is the only tier that stops motion.
 *
 *   desktop 1.0 · tablet 0.7 · mobile 0.4 · reduced 0
 */
export function useMotionIntensity() {
  const [tier, setTier] = useState<MotionTier>("desktop");

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = window.matchMedia("(max-width: 640px)");
    const tablet = window.matchMedia("(max-width: 1024px)");

    const update = () => {
      if (reduced.matches) setTier("reduced");
      else if (mobile.matches) setTier("mobile");
      else if (tablet.matches) setTier("tablet");
      else setTier("desktop");
    };

    update();
    const queries = [reduced, mobile, tablet];
    queries.forEach((q) => q.addEventListener("change", update));
    return () => queries.forEach((q) => q.removeEventListener("change", update));
  }, []);

  const intensity = tier === "reduced" ? 0 : tier === "mobile" ? 0.4 : tier === "tablet" ? 0.7 : 1;

  return {
    tier,
    intensity,
    reduced: tier === "reduced",
    /** Heavy effects (WebGL/canvas density, parallax, custom cursor). */
    heavy: tier === "desktop",
    isTouchClass: tier === "mobile" || tier === "tablet",
  };
}
