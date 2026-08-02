import { useCallback, useEffect, useRef, useState } from "react";

interface Options {
  count: number;
  defaultIndex?: number;
  index?: number;
  loop?: boolean;
  onChange?: (index: number) => void;
}

/**
 * Controlled/uncontrolled active index with direction tracking
 * (direction drives the enter/exit animations).
 */
export function useActiveItem({
  count,
  defaultIndex = 0,
  index,
  loop = true,
  onChange,
}: Options) {
  const isControlled = index != null;
  const [internal, setInternal] = useState(() =>
    Math.min(Math.max(defaultIndex, 0), Math.max(count - 1, 0)),
  );
  const active = isControlled ? index : internal;
  const directionRef = useRef(1);
  const [direction, setDirection] = useState(1);

  const setActive = useCallback(
    (next: number) => {
      if (count === 0) return;
      const clamped = loop
        ? (next + count) % count
        : Math.min(Math.max(next, 0), count - 1);
      if (clamped === active) return;
      directionRef.current = clamped > active ? 1 : -1;
      setDirection(directionRef.current);
      if (!isControlled) setInternal(clamped);
      onChange?.(clamped);
    },
    [active, count, isControlled, loop, onChange],
  );

  const next = useCallback(() => setActive(active + 1), [active, setActive]);
  const previous = useCallback(() => setActive(active - 1), [active, setActive]);

  useEffect(() => {
    if (!isControlled && internal > count - 1) setInternal(Math.max(count - 1, 0));
  }, [count, internal, isControlled]);

  return { active, direction, setActive, next, previous };
}