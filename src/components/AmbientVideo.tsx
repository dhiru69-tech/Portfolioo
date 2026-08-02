import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useAmbientVideo } from "@/hooks/useAmbientVideo";
import { useMotionIntensity } from "@/hooks/useMotionIntensity";

type Props = {
  src: string;
  poster: string;
  label?: string;
  /** Tailwind aspect utility, e.g. "aspect-video" or "aspect-square". */
  aspect?: string;
  className?: string;
  /** Subtle scroll parallax on the video itself (desktop/tablet only). */
  parallax?: boolean;
};

/**
 * Reusable cinematic ambient video panel: autoplay, muted, looped, inline,
 * poster fallback, dark overlay for text contrast, and a graceful static
 * fallback when playback is blocked or the file fails to load.
 */
export function AmbientVideo({
  src,
  poster,
  label,
  aspect = "aspect-video",
  className = "",
  parallax = true,
}: Props) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const { reduced, intensity } = useMotionIntensity();
  const { videoRef, failed } = useAmbientVideo({ enabled: true });

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start end", "end start"],
  });
  const range = parallax && !reduced ? 26 * intensity : 0;
  const y = useTransform(scrollYProgress, [0, 1], [range, -range]);

  return (
    <div
      ref={wrapperRef}
      className={`group relative overflow-hidden rounded-2xl border border-border bg-abyss ${aspect} ${className}`}
    >
      <motion.div style={{ y }} className="absolute -inset-y-[6%] inset-x-0">
        {failed ? (
          <img
            src={poster}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover"
          />
        ) : (
          <video
            ref={videoRef}
            className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.03]"
            poster={poster}
            muted
            loop
            playsInline
            autoPlay
            preload="metadata"
            disablePictureInPicture
            tabIndex={-1}
            aria-hidden="true"
          >
            <source src={src} type="video/mp4" />
          </video>
        )}
      </motion.div>

      {/* Cinematic grade: neutral wash + navy vignette + soft blue light */}
      <div className="pointer-events-none absolute inset-0 bg-black/25" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,color-mix(in_oklab,var(--abyss)_82%,transparent),transparent_58%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-70 bg-[radial-gradient(75%_60%_at_20%_15%,color-mix(in_oklab,var(--primary)_16%,transparent),transparent_70%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/8 transition-colors duration-500 group-hover:ring-primary/30"
        aria-hidden="true"
      />

      {label && <p className="label-mono absolute bottom-4 left-5">{label}</p>}
    </div>
  );
}
