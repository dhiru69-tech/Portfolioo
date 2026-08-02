import { useEffect, useRef, useState } from "react";

type Options = {
  /** Element whose scroll range drives the video timeline. */
  containerRef: React.RefObject<HTMLElement | null>;
  /** When false the video parks on frame 0 (reduced motion). */
  enabled?: boolean;
  /** 0..1 — lower values seek less often on weaker devices. */
  intensity?: number;
};

/**
 * Maps the scroll progress of a container onto a <video> timeline.
 *
 * Robustness rules (the video must never "die" until a refresh):
 * - the <video> element is owned by the caller and never remounted here
 * - `currentTime` is always clamped to [0, duration - epsilon]
 * - the rAF loop parks when settled and is re-kicked by scroll, resize,
 *   visibilitychange, pageshow and a low-frequency watchdog
 * - a stuck `seeking` flag (dropped `seeked` event, common after a tab
 *   switch or a decoder hiccup) is force-cleared by the watchdog
 * - metadata may arrive late: readiness is re-checked on several events
 */
export function useScrollVideo({ containerRef, enabled = true, intensity = 1 }: Options) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);

  // Mutable state kept out of React so the rAF loop never re-renders.
  const target = useRef(0);
  const current = useRef(0);
  const rafId = useRef<number | null>(null);
  const seeking = useRef(false);
  const seekStartedAt = useRef(0);

  // Readiness: metadata can land before or after mount, so listen broadly.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.pause();

    const check = () => {
      if (video.duration && Number.isFinite(video.duration) && video.duration > 0) {
        setReady(true);
      }
    };

    check();
    const events = ["loadedmetadata", "loadeddata", "canplay", "durationchange"] as const;
    events.forEach((e) => video.addEventListener(e, check));

    // Some browsers drop the load when the element is created while hidden.
    const retry = window.setTimeout(() => {
      if (!video.duration || !Number.isFinite(video.duration)) video.load();
    }, 2500);

    return () => {
      events.forEach((e) => video.removeEventListener(e, check));
      window.clearTimeout(retry);
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video || !ready) return;

    // Slower lerp + coarser seek threshold on low-intensity devices.
    const lerp = 0.1 + 0.05 * intensity;
    const minDelta = 0.02 / Math.max(intensity, 0.35);

    const clampTime = (t: number) => {
      const duration = video.duration || 0;
      if (!duration) return 0;
      return Math.min(duration - 0.05, Math.max(0, t));
    };

    const onSeeked = () => {
      seeking.current = false;
    };
    const onError = () => {
      seeking.current = false;
    };
    video.addEventListener("seeked", onSeeked);
    video.addEventListener("error", onError);
    video.addEventListener("stalled", onError);
    video.addEventListener("suspend", onError);

    const computeProgress = () => {
      const rect = container.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      if (scrollable <= 0) return 0;
      return Math.min(1, Math.max(0, -rect.top / scrollable));
    };

    const tick = () => {
      const duration = video.duration || 0;
      const delta = target.current - current.current;

      // Clear a seek that never reported back (tab switch, decoder hiccup).
      if (seeking.current && performance.now() - seekStartedAt.current > 400) {
        seeking.current = false;
      }

      if (Math.abs(delta) < 0.0015 && !seeking.current) {
        current.current = target.current;
        rafId.current = null;
        return;
      }

      current.current += delta * lerp;

      if (!seeking.current && duration > 0) {
        const time = clampTime(current.current * duration);
        if (Math.abs(video.currentTime - time) > minDelta) {
          seeking.current = true;
          seekStartedAt.current = performance.now();
          try {
            video.currentTime = time;
          } catch {
            seeking.current = false;
          }
        }
      }

      rafId.current = requestAnimationFrame(tick);
    };

    const kick = () => {
      if (rafId.current === null) rafId.current = requestAnimationFrame(tick);
    };

    const sync = (snap = false) => {
      const p = computeProgress();
      target.current = p;
      setProgress(p);
      if (!enabled) {
        try {
          video.currentTime = clampTime(0);
        } catch {
          /* ignore */
        }
        return;
      }
      if (snap) {
        // Hard resync (tab restore / bfcache): jump instead of interpolating.
        current.current = p;
        seeking.current = false;
        try {
          video.currentTime = clampTime(p * (video.duration || 0));
        } catch {
          /* ignore */
        }
      }
      kick();
    };

    const onScroll = () => sync();
    const onVisibility = () => {
      if (document.visibilityState === "visible") sync(true);
    };
    const onPageShow = () => sync(true);

    sync(true);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pageshow", onPageShow);
    window.addEventListener("focus", onPageShow);

    // Watchdog: if the timeline drifts from the scroll position while the loop
    // is parked, restart it. This is the safety net against a permanent stall.
    let staleTicks = 0;
    const watchdog = window.setInterval(() => {
      if (document.visibilityState !== "visible" || !enabled) return;
      const p = computeProgress();
      target.current = p;
      const duration = video.duration || 0;
      if (!duration) return;
      const expected = clampTime(p * duration);
      const drifted = Math.abs(video.currentTime - expected) > 0.25;

      if (drifted) {
        staleTicks += 1;
        seeking.current = false;
        kick();

        // 2 consecutive misses (~2.4s) despite kicking = decoder actually stuck.
        // A normal re-seek won't fix this — force a reload + reseek.
        if (staleTicks >= 2) {
          staleTicks = 0;
          const resume = () => {
            video.removeEventListener("loadedmetadata", resume);
            current.current = target.current;
            seeking.current = false;
            try {
              video.currentTime = clampTime(target.current * (video.duration || 0));
            } catch {
              /* ignore */
            }
            kick();
          };
          video.addEventListener("loadedmetadata", resume);
          video.load();
        }
      } else {
        staleTicks = 0;
      }
    }, 1200);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pageshow", onPageShow);
      window.removeEventListener("focus", onPageShow);
      window.clearInterval(watchdog);
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("error", onError);
      video.removeEventListener("stalled", onError);
      video.removeEventListener("suspend", onError);
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
      rafId.current = null;
    };
  }, [containerRef, ready, enabled, intensity]);

  return { videoRef, progress, ready };
}
