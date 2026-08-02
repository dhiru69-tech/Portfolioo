import { useEffect, useState } from "react";

const query = (q: string) =>
  typeof window !== "undefined" && window.matchMedia
    ? window.matchMedia(q)
    : null;

function useMediaQuery(q: string, fallback = false) {
  const [matches, setMatches] = useState(fallback);

  useEffect(() => {
    const mql = query(q);
    if (!mql) return;
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [q]);

  return matches;
}

/** True on devices with a real pointer (mouse / trackpad). */
export function useFinePointer() {
  return useMediaQuery("(hover: hover) and (pointer: fine)");
}

export function useReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}