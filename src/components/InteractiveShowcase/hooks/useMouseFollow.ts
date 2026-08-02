import { useCallback, useRef } from "react";
import { useMotionValue, useSpring, useTransform } from "motion/react";

import { FOLLOW_DISTANCE, SPRING_FOLLOW, TILT_ANGLE } from "../constants";

interface Options {
  enabled?: boolean;
  distance?: number;
  tilt?: number;
}

/**
 * Tracks the cursor inside a container and exposes spring-interpolated
 * translation + 3D tilt motion values. Values are normalised to [-0.5, 0.5].
 */
export function useMouseFollow({
  enabled = true,
  distance = FOLLOW_DISTANCE,
  tilt = TILT_ANGLE,
}: Options = {}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const px = useMotionValue(0);
  const py = useMotionValue(0);

  const sx = useSpring(px, SPRING_FOLLOW);
  const sy = useSpring(py, SPRING_FOLLOW);

  const x = useTransform(sx, (v) => v * distance * 2);
  const y = useTransform(sy, (v) => v * distance * 2);
  const rotateY = useTransform(sx, (v) => v * tilt * 2);
  const rotateX = useTransform(sy, (v) => -v * tilt * 2);

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (!enabled || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      px.set((event.clientX - rect.left) / rect.width - 0.5);
      py.set((event.clientY - rect.top) / rect.height - 0.5);
    },
    [enabled, px, py],
  );

  const reset = useCallback(() => {
    px.set(0);
    py.set(0);
  }, [px, py]);

  return { ref, x, y, rotateX, rotateY, onPointerMove, reset };
}