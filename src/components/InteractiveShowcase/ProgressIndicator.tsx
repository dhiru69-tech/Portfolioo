import { memo } from "react";
import { motion } from "motion/react";

interface ProgressIndicatorProps {
  current: number;
  total: number;
  reducedMotion: boolean;
}

function ProgressIndicatorBase({ current, total, reducedMotion }: ProgressIndicatorProps) {
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="flex items-center gap-3" aria-hidden>
      <div className="h-px w-16 overflow-hidden bg-[var(--isc-border-strong)] sm:w-24">
        <motion.div
          className="h-full origin-left bg-[var(--isc-accent)]"
          animate={{ scaleX: total ? (current + 1) / total : 0 }}
          transition={reducedMotion ? { duration: 0 } : { duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
          style={{ scaleX: 0 }}
        />
      </div>
      <p className="text-xs tabular-nums tracking-[0.18em] text-[var(--isc-faint)]">
        <span className="text-[var(--isc-fg)]">{pad(current + 1)}</span> / {pad(total)}
      </p>
    </div>
  );
}

export const ProgressIndicator = memo(ProgressIndicatorBase);