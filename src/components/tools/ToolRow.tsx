import { motion } from "motion/react";

const EASE = [0.22, 0.61, 0.36, 1] as const;

type ToolRowProps = {
  name: string;
  category: string;
  active: boolean;
  onActivate: () => void;
};

export function ToolRow({ name, category, active, onActivate }: ToolRowProps) {
  return (
    <div
      onMouseEnter={onActivate}
      onMouseMove={onActivate}
      className="tool-row flex select-none items-center gap-[clamp(0.75rem,2vw,2rem)] pr-6"
    >
      <motion.h3
        animate={{ color: active ? "var(--tool-ink)" : "var(--tool-ink-dim)" }}
        transition={{ duration: 0.42, ease: EASE }}
        className="tool-title whitespace-nowrap leading-none tracking-[-0.02em]"
      >
        {name}
      </motion.h3>

      <motion.span
        animate={{
          color: active ? "var(--tool-meta)" : "var(--tool-meta-dim)",
          backgroundColor: active ? "var(--tool-pill)" : "var(--tool-pill-off)",
        }}
        transition={{ duration: 0.42, ease: EASE }}
        className="whitespace-nowrap rounded-full px-[0.9em] py-[0.45em] text-[clamp(0.625rem,0.86vw,0.8125rem)] leading-none"
      >
        {category}
      </motion.span>
    </div>
  );
}
