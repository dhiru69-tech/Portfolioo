"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Rounded "curve" section reveal.
 *
 * Wraps a full-bleed section so its top corners peel over the section above it.
 * Radius animates from a slightly larger value down to its resting value with a
 * subtle upward translate — no bounce, no overshoot.
 */
export function CurveSection({
  children,
  className = "",
  background = "var(--background)",
  id,
}: {
  children: ReactNode;
  className?: string;
  /** CSS color used to fill the rounded sheet so the peel has no seam. */
  background?: string;
  id?: string;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      id={id}
      initial={
        reduced
          ? false
          : {
              borderTopLeftRadius: 96,
              borderTopRightRadius: 96,
              y: 24,
              opacity: 0.85,
            }
      }
      whileInView={{
        borderTopLeftRadius: "var(--curve-radius)",
        borderTopRightRadius: "var(--curve-radius)",
        y: 0,
        opacity: 1,
      }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{ backgroundColor: background }}
      className={`curve-section relative z-10 -mt-8 overflow-hidden lg:-mt-12 ${className}`}
    >
      {children}
    </motion.div>
  );
}
