import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Robust ambient (autoplay / muted / loop) background video.
 *
 * Fixes the "video silently stops after a while" class of bugs without the
 * usual sledgehammer of calling play() every frame:
 *
 *  - only plays while the element is actually in the viewport (IntersectionObserver)
 *  - re-syncs on tab visibility change and on bfcache restore (`pageshow`)
 *  - recovers from unexpected `pause`/`stalled`/`suspend` events, throttled
 *  - hard-loops on `ended` for browsers that drop the loop flag after a stall
 *  - never enters a reload loop: recovery attempts are rate limited and give up
 *    into a static poster fallback after repeated failures
 */
export function useAmbientVideo({ enabled = true }: { enabled?: boolean } = {}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const visibleRef = useRef(false);
  const lastAttemptRef = useRef(0);
  const failuresRef = useRef(0);
  const [failed, setFailed] = useState(false);

  const attemptPlay = useCallback(() => {
    const video = videoRef.current;
    if (!video || !enabled || failuresRef.current > 6) return;
    if (!visibleRef.current || document.hidden) return;
    if (!video.paused && !video.ended) return;

    const now = Date.now();
    if (now - lastAttemptRef.current < 600) return;
    lastAttemptRef.current = now;

    const promise = video.play();
    if (promise && typeof promise.catch === "function") {
      promise
        .then(() => {
          failuresRef.current = 0;
        })
        .catch(() => {
          failuresRef.current += 1;
          if (failuresRef.current > 6) setFailed(true);
        });
    }
  }, [enabled]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!enabled) {
      video.pause();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting) attemptPlay();
        else video.pause();
      },
      { threshold: 0.05 },
    );
    observer.observe(video);

    const onEnded = () => {
      // Some engines drop the loop flag after a network stall.
      try {
        video.currentTime = 0;
      } catch {
        /* seeking can throw before metadata */
      }
      attemptPlay();
    };
    const onError = () => setFailed(true);

    const events: Array<[keyof HTMLMediaElementEventMap, EventListener]> = [
      ["pause", attemptPlay as EventListener],
      ["stalled", attemptPlay as EventListener],
      ["suspend", attemptPlay as EventListener],
      ["waiting", attemptPlay as EventListener],
      ["loadeddata", attemptPlay as EventListener],
      ["ended", onEnded as EventListener],
      ["error", onError as EventListener],
    ];
    events.forEach(([name, handler]) => video.addEventListener(name, handler));

    const onVisibility = () => {
      if (document.hidden) video.pause();
      else attemptPlay();
    };
    const onPageShow = () => {
      failuresRef.current = 0;
      attemptPlay();
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pageshow", onPageShow);
    window.addEventListener("focus", onPageShow);

    // Low-frequency watchdog: catches silent stops browsers never report.
    const watchdog = window.setInterval(attemptPlay, 4000);

    attemptPlay();

    return () => {
      observer.disconnect();
      events.forEach(([name, handler]) => video.removeEventListener(name, handler));
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pageshow", onPageShow);
      window.removeEventListener("focus", onPageShow);
      window.clearInterval(watchdog);
    };
  }, [enabled, attemptPlay]);

  return { videoRef, failed };
}
