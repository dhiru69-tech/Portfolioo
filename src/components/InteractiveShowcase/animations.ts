import type { Transition, Variants } from "motion/react";

/** Apple/Linear-style easing: fast out, long settle. Never bouncy. */
export const EASE_OUT = [0.22, 0.61, 0.36, 1] as const;
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;

export const scaled = (seconds: number, speed: number) =>
  seconds / Math.max(0.25, speed);

export const baseTransition = (speed: number): Transition => ({
  duration: scaled(0.45, speed),
  ease: EASE_OUT,
});

export const previewVariants: Variants = {
  enter: (dir: number) => ({
    opacity: 0,
    scale: 1.03,
    y: dir >= 0 ? 14 : -14,
    filter: "blur(14px)",
  }),
  center: { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" },
  exit: (dir: number) => ({
    opacity: 0,
    scale: 0.985,
    y: dir >= 0 ? -10 : 10,
    filter: "blur(10px)",
  }),
};

export const metaVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.05 + i * 0.045, duration: 0.4, ease: EASE_OUT },
  }),
};

export const listItemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.5, ease: EASE_OUT },
  }),
};