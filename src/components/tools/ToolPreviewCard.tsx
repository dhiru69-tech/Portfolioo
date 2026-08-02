import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useEffect, useState } from "react";
import { Radar } from "lucide-react";
import { toolLogoUrl, type Tool } from "@/data/tools";

const EASE = [0.22, 0.61, 0.36, 1] as const;
const MAX_SHIFT = 15;

export function ToolPreviewCard({ tool }: { tool: Tool }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [tool.slug]);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 90, damping: 22, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 90, damping: 22, mass: 0.6 });
  const x = useTransform(sx, [-1, 1], [-MAX_SHIFT, MAX_SHIFT]);
  const y = useTransform(sy, [-1, 1], [-MAX_SHIFT, MAX_SHIFT]);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const onMove = (event: PointerEvent) => {
      px.set((event.clientX / window.innerWidth) * 2 - 1);
      py.set((event.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [px, py]);

  return (
    <motion.aside
      style={{ x, y }}
      className="pointer-events-none w-[clamp(13rem,24vw,22rem)] will-change-transform"
      aria-live="polite"
    >
      <div className="overflow-hidden rounded-[clamp(0.875rem,1.4vw,1.375rem)] bg-[#0f0f0f] shadow-[0_28px_70px_-24px_rgba(0,0,0,0.75),0_6px_20px_-8px_rgba(0,0,0,0.5)] ring-1 ring-white/10">
        <div className="relative aspect-square w-full">
          <AnimatePresence mode="sync" initial={false}>
            <motion.div
              key={tool.slug}
              initial={{ opacity: 0, y: 14, scale: 1.03 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.985 }}
              transition={{ duration: 0.46, ease: EASE }}
              className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.08),transparent_65%)]"
            >
              {failed ? (
                <Radar className="h-[38%] w-[38%] text-white/90" strokeWidth={1.2} />
              ) : (
                <img
                  src={toolLogoUrl(tool.slug)}
                  alt={`${tool.name} logo`}
                  width={160}
                  height={160}
                  loading="lazy"
                  decoding="async"
                  onError={() => setFailed(true)}
                  className="h-[42%] w-[42%] object-contain opacity-95"
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="px-[clamp(0.875rem,1.4vw,1.5rem)] pb-[clamp(0.875rem,1.3vw,1.375rem)] pt-[clamp(0.75rem,1.1vw,1.125rem)]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={tool.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.38, ease: EASE }}
            >
              <p className="text-[0.5625rem] uppercase tracking-[0.22em] text-white/40">
                {tool.category}
              </p>
              <p className="mt-[0.5em] text-[clamp(0.875rem,1.1vw,1.0625rem)] leading-none text-white/90">
                {tool.name}
              </p>
              <p className="mt-[0.7em] text-[clamp(0.625rem,0.8vw,0.8125rem)] leading-[1.5] text-white/60">
                {tool.blurb}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
}
