import { useCallback, useEffect, useRef } from "react";

const VOLUME = 0.14;
const MIN_INTERVAL_MS = 55;

/**
 * Preloaded, low-latency "tick" for active-state changes.
 * Desktop (fine pointer) only, unlocked on the first user gesture.
 * Uses a pre-rendered WebAudio buffer so playback never overlaps or stutters.
 */
export function useTickSound() {
  const ctxRef = useRef<AudioContext | null>(null);
  const bufferRef = useRef<AudioBuffer | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const lastPlayedRef = useRef(0);
  const enabledRef = useRef(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    enabledRef.current = fine;
    if (!fine) return;

    const Ctor: typeof AudioContext | undefined =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) {
      enabledRef.current = false;
      return;
    }

    const ctx = new Ctor();
    ctxRef.current = ctx;

    // Pre-render a short, soft click once (preload equivalent).
    const length = Math.floor(ctx.sampleRate * 0.035);
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i += 1) {
      const t = i / ctx.sampleRate;
      const env = Math.exp(-t * 150);
      data[i] = (Math.sin(2 * Math.PI * 1750 * t) * 0.6 + (Math.random() * 2 - 1) * 0.4) * env;
    }
    bufferRef.current = buffer;

    const gain = ctx.createGain();
    gain.gain.value = VOLUME;
    gain.connect(ctx.destination);
    gainRef.current = gain;

    const unlock = () => {
      if (ctx.state === "suspended") void ctx.resume();
    };
    const opts = { once: true } as const;
    window.addEventListener("pointerdown", unlock, opts);
    window.addEventListener("keydown", unlock, opts);
    window.addEventListener("wheel", unlock, { once: true, passive: true });
    window.addEventListener("pointermove", unlock, opts);

    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
      window.removeEventListener("wheel", unlock);
      window.removeEventListener("pointermove", unlock);
      void ctx.close();
      ctxRef.current = null;
      bufferRef.current = null;
      gainRef.current = null;
    };
  }, []);

  return useCallback(() => {
    if (!enabledRef.current) return;
    const ctx = ctxRef.current;
    const buffer = bufferRef.current;
    const gain = gainRef.current;
    if (!ctx || !buffer || !gain || ctx.state !== "running") return;

    const now = performance.now();
    if (now - lastPlayedRef.current < MIN_INTERVAL_MS) return;
    lastPlayedRef.current = now;

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(gain);
    source.start();
  }, []);
}
