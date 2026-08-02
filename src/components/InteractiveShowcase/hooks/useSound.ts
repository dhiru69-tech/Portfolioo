import { useCallback, useEffect, useRef } from "react";

import { SOUND_THROTTLE_MS } from "../constants";

interface TickRecipe {
  frequency: number;
  duration: number;
  noise: number;
}

/** Three subtle mechanical tick variations, chosen at random. */
const TICKS: TickRecipe[] = [
  { frequency: 1850, duration: 0.045, noise: 0.35 },
  { frequency: 2200, duration: 0.038, noise: 0.28 },
  { frequency: 1560, duration: 0.052, noise: 0.42 },
];

interface Options {
  enabled: boolean;
  volume?: number;
}

/**
 * Synthesised (zero-asset, zero-latency) interaction ticks.
 * Sounds never overlap and the context is created lazily on first gesture.
 */
export function useSound({ enabled, volume = 0.18 }: Options) {
  const ctxRef = useRef<AudioContext | null>(null);
  const lastRef = useRef(0);

  useEffect(
    () => () => {
      void ctxRef.current?.close();
      ctxRef.current = null;
    },
    [],
  );

  return useCallback(() => {
    if (!enabled || typeof window === "undefined") return;

    const now = performance.now();
    if (now - lastRef.current < SOUND_THROTTLE_MS) return;
    lastRef.current = now;

    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return;

    const ctx = (ctxRef.current ??= new Ctor());
    if (ctx.state === "suspended") void ctx.resume();

    const recipe =
      TICKS[Math.floor(Math.random() * TICKS.length)] ?? TICKS[0]!;
    const t = ctx.currentTime;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(volume, t + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + recipe.duration);
    gain.connect(ctx.destination);

    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(recipe.frequency, t);
    osc.frequency.exponentialRampToValueAtTime(
      recipe.frequency * 0.55,
      t + recipe.duration,
    );
    osc.connect(gain);
    osc.start(t);
    osc.stop(t + recipe.duration + 0.02);

    // Short filtered noise burst gives the tick its mechanical body.
    const frames = Math.max(1, Math.floor(ctx.sampleRate * recipe.duration));
    const buffer = ctx.createBuffer(1, frames, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < frames; i += 1) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / frames) ** 3;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = recipe.frequency * 1.4;
    filter.Q.value = 0.9;
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = volume * recipe.noise;
    noise.connect(filter).connect(noiseGain).connect(ctx.destination);
    noise.start(t);
  }, [enabled, volume]);
}