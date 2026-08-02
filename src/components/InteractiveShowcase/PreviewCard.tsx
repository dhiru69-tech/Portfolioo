import { memo, useState } from "react";
import { AnimatePresence, motion, type MotionValue } from "motion/react";
import { ArrowUpRight, ImageOff } from "lucide-react";

import { cn } from "@/lib/utils";
import { metaVariants, previewVariants, baseTransition } from "./animations";
import type { LottieRenderer, ShowcaseItem, ShowcaseMedia } from "./types";

interface MediaProps {
  media: ShowcaseMedia | undefined;
  title: string;
  lottieRenderer?: LottieRenderer;
}

function Media({ media, title, lottieRenderer: Lottie }: MediaProps) {
  const [loaded, setLoaded] = useState(false);

  if (!media) {
    return (
      <div className="flex size-full items-center justify-center text-[var(--isc-faint)]">
        <ImageOff className="size-6" aria-hidden />
      </div>
    );
  }

  if (media.type === "component") {
    const Custom = media.render;
    return <Custom isActive />;
  }

  if (media.type === "lottie") {
    return Lottie ? (
      <Lottie data={media.data} {...(media.loop == null ? {} : { loop: media.loop })} />
    ) : null;
  }

  if (media.type === "video") {
    return (
      <video
        className="size-full object-cover"
        src={media.src}
        {...(media.poster ? { poster: media.poster } : {})}
        aria-label={media.alt ?? title}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      />
    );
  }

  const isLogo = media.type === "logo";

  return (
    <img
      src={media.src}
      alt={media.alt ?? title}
      loading="lazy"
      decoding="async"
      onLoad={() => setLoaded(true)}
      className={cn(
        "size-full transition-[opacity,filter,transform] duration-700 ease-out",
        isLogo ? "object-contain p-14" : "object-cover",
        loaded ? "scale-100 opacity-100 blur-0" : "scale-[1.04] opacity-0 blur-md",
      )}
    />
  );
}

interface PreviewCardProps {
  item: ShowcaseItem | undefined;
  direction: number;
  speed: number;
  reducedMotion: boolean;
  x: MotionValue<number>;
  y: MotionValue<number>;
  rotateX: MotionValue<number>;
  rotateY: MotionValue<number>;
  lottieRenderer?: LottieRenderer;
  onSelect: (item: ShowcaseItem) => void;
}

function PreviewCardBase({
  item,
  direction,
  speed,
  reducedMotion,
  x,
  y,
  rotateX,
  rotateY,
  lottieRenderer,
  onSelect,
}: PreviewCardProps) {
  if (!item) return null;
  const meta = [...(item.tags ?? [])];

  return (
    <div className="[perspective:1400px]">
      <motion.div
        {...(reducedMotion
          ? {}
          : {
              style: {
                x,
                y,
                rotateX,
                rotateY,
                transformStyle: "preserve-3d" as const,
              },
            })}
        className="relative will-change-transform"
      >
        {/* ambient glow behind the plate */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-10 -z-10 rounded-[3rem] opacity-70 blur-2xl"
          style={{
            background:
              "radial-gradient(60% 55% at 50% 45%, color-mix(in oklab, var(--isc-accent) 18%, transparent) 0%, transparent 70%)",
          }}
        />

        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.35rem] border border-[var(--isc-border-strong)] bg-[var(--isc-surface)]">
          <AnimatePresence mode="popLayout" initial={false} custom={direction}>
            <motion.div
              key={item.id}
              custom={direction}
              variants={previewVariants}
              initial={reducedMotion ? false : "enter"}
              animate="center"
              exit={reducedMotion ? { opacity: 0 } : "exit"}
              transition={reducedMotion ? { duration: 0.15 } : baseTransition(speed)}
              className="absolute inset-0"
            >
              <Media
                media={item.media}
                title={item.title}
                {...(lottieRenderer ? { lottieRenderer } : {})}
              />
            </motion.div>
          </AnimatePresence>

          {/* vignette + top sheen */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 90% at 50% 0%, transparent 45%, oklch(0 0 0 / 0.5) 100%)",
              boxShadow: "0 1px 0 0 oklch(1 0 0 / 0.12) inset",
            }}
          />
        </div>

        <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={item.id} className="min-w-0">
                {item.category && (
                  <motion.span
                    custom={0}
                    variants={metaVariants}
                    initial="hidden"
                    animate="visible"
                    className="inline-flex items-center rounded-full border border-[var(--isc-accent)]/40 px-3 py-1 text-[0.625rem] font-medium uppercase tracking-[0.16em] text-[var(--isc-accent)]"
                  >
                    {item.category}
                  </motion.span>
                )}
                <motion.h3
                  custom={1}
                  variants={metaVariants}
                  initial="hidden"
                  animate="visible"
                  className="mt-3 truncate text-2xl font-semibold tracking-tight text-[var(--isc-fg)] sm:text-[1.75rem]"
                >
                  {item.title}
                </motion.h3>
                {item.description && (
                  <motion.p
                    custom={2}
                    variants={metaVariants}
                    initial="hidden"
                    animate="visible"
                    className="mt-2 max-w-prose text-sm leading-relaxed text-[var(--isc-muted)]"
                  >
                    {item.description}
                  </motion.p>
                )}
                {meta.length > 0 && (
                  <motion.ul
                    custom={3}
                    variants={metaVariants}
                    initial="hidden"
                    animate="visible"
                    className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[var(--isc-faint)]"
                  >
                    {meta.map((tag) => (
                      <li key={tag} className="flex items-center gap-2">
                        <span
                          aria-hidden
                          className="size-1 rounded-full bg-[var(--isc-accent)]/70"
                        />
                        {tag}
                      </li>
                    ))}
                  </motion.ul>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {item.link && (
            <a
              href={item.link.href}
              target="_blank"
              rel="noreferrer noopener"
              onClick={() => onSelect(item)}
              aria-label={item.link.label ?? `Open ${item.title}`}
              className="group inline-flex size-14 shrink-0 items-center justify-center rounded-full border border-[var(--isc-border-strong)] bg-[var(--isc-surface)] text-[var(--isc-fg)] transition-[transform,background-color,border-color] duration-300 ease-out hover:-translate-y-0.5 hover:border-[var(--isc-accent)]/70 hover:bg-[var(--isc-surface-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--isc-accent)]/60 active:translate-y-0 active:scale-95"
            >
              <ArrowUpRight className="size-5 transition-transform duration-300 ease-out group-hover:rotate-45" aria-hidden />
            </a>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export const PreviewCard = memo(PreviewCardBase);