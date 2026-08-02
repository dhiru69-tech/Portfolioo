/**
 * Tiny Web Audio "tick" click used by the split-flap text effect.
 * No audio files, no libraries — a short filtered noise burst per flip.
 */

let ctx: AudioContext | null = null;
/** Sound is always on: ticks autoplay with no mute UI. */
let muted = false;
const listeners = new Set<(muted: boolean) => void>();

export function initSoundPref() {
  muted = false;
  listeners.forEach((l) => l(muted));
}

export function isMuted() {
  return muted;
}

export function setMuted(next: boolean) {
  muted = next;
  listeners.forEach((l) => l(muted));
}

export function subscribeMuted(fn: (muted: boolean) => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/**
 * Browsers require a user gesture before audio may start. We arm the context
 * on the first pointer/scroll/key event so ticks play instantly afterwards,
 * with no delay and no toggle to click.
 */
if (typeof window !== "undefined") {
  const unlock = () => {
    getCtx();
    window.removeEventListener("pointerdown", unlock);
    window.removeEventListener("keydown", unlock);
    window.removeEventListener("wheel", unlock);
    window.removeEventListener("touchstart", unlock);
  };
  window.addEventListener("pointerdown", unlock, { passive: true });
  window.addEventListener("keydown", unlock);
  window.addEventListener("wheel", unlock, { passive: true });
  window.addEventListener("touchstart", unlock, { passive: true });
}


function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor: typeof AudioContext | undefined =
    window.AudioContext ?? (window as any).webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) ctx = new Ctor();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

/** Short mechanical flap "tick" (~60ms). */
export function playTick(volume = 0.06) {
  if (muted) return;
  const audio = getCtx();
  if (!audio) return;

  const now = audio.currentTime;
  const duration = 0.06;

  const frameCount = Math.floor(audio.sampleRate * duration);
  const buffer = audio.createBuffer(1, frameCount, audio.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < frameCount; i++) {
    const decay = Math.pow(1 - i / frameCount, 6);
    data[i] = (Math.random() * 2 - 1) * decay;
  }

  const source = audio.createBufferSource();
  source.buffer = buffer;

  const filter = audio.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 2200;
  filter.Q.value = 1.2;

  const gain = audio.createGain();
  gain.gain.setValueAtTime(volume, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  source.connect(filter).connect(gain).connect(audio.destination);
  source.start(now);
  source.stop(now + duration);
}
