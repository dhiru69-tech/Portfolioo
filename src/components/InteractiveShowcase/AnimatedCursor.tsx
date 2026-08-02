import { memo, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

interface AnimatedCursorProps {
  containerRef: React.RefObject<HTMLElement | null>;
  visible: boolean;
}

/** Soft accent halo trailing the cursor inside the showcase surface. */
function AnimatedCursorBase({ containerRef, visible }: AnimatedCursorProps) {
  const x = useMotionValue(-500);
  const y = useMotionValue(-500);
  const sx = useSpring(x, { stiffness: 260, damping: 30, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 260, damping: 30, mass: 0.5 });

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const onMove = (event: PointerEvent) => {
      const rect = node.getBoundingClientRect();
      x.set(event.clientX - rect.left);
      y.set(event.clientY - rect.top);
    };
    node.addEventListener("pointermove", onMove);
    return () => node.removeEventListener("pointermove", onMove);
  }, [containerRef, x, y]);

  return (
    <motion.span
      aria-hidden
      className="pointer-events-none absolute left-0 top-0 z-30 size-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full will-change-transform"
      style={{
        x: sx,
        y: sy,
        background:
          "radial-gradient(circle, color-mix(in oklab, var(--isc-accent) 16%, transparent) 0%, transparent 68%)",
      }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
    />
  );
}

export const AnimatedCursor = memo(AnimatedCursorBase);