import type { ReactNode } from "react";
import { motion } from "motion/react";
import { useMotionIntensity } from "@/hooks/useMotionIntensity";

/**
 * Scroll reveal that scales with device capability instead of switching off.
 * Content is animated to a visible state on every breakpoint, and rendered
 * fully visible when reduced motion is requested.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "span";
}) {
  const { intensity, reduced } = useMotionIntensity();
  const Motion = motion[as];

  if (reduced) {
    return <Motion className={className}>{children}</Motion>;
  }

  return (
    <Motion
      className={className}
      initial={{ opacity: 0, y: 26 * intensity, filter: `blur(${6 * intensity}px)` }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.15, margin: "0px 0px -8% 0px" }}
      transition={{
        duration: 0.5 + 0.25 * intensity,
        delay: delay * intensity,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </Motion>
  );
}

export function SectionHeading({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description?: string;
}) {
  return (
    <Reveal className="max-w-2xl">
      <p className="label-mono">{label}</p>
      <h2 className="mt-5 text-[clamp(2.6rem,6.5vw,5.5rem)] leading-[0.95] font-extrabold tracking-[-0.035em] uppercase text-foreground">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-[clamp(1rem,1.2vw,1.075rem)] leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
    </Reveal>
  );
}

/**
 * Cinematic paragraph reveal: each word is masked inside an overflow-hidden
 * wrapper and slides/fades up into place on scroll, staggered word-by-word.
 * Elegant, not flashy — no per-character flips, no color cycling.
 * Falls back to plain text when reduced motion is requested.
 */
export function ParagraphReveal({
  text,
  className,
  delay = 0,
  as = "p",
}: {
  text: string;
  className?: string;
  delay?: number;
  as?: "p" | "span";
}) {
  const { intensity, reduced } = useMotionIntensity();
  const Wrapper = as;

  if (reduced) {
    return <Wrapper className={className}>{text}</Wrapper>;
  }

  const words = text.split(" ");

  return (
    <Wrapper className={className}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          style={{
            display: "inline-block",
            overflow: "hidden",
            verticalAlign: "top",
            paddingBottom: "0.15em",
            marginBottom: "-0.15em",
          }}
        >
          <motion.span
            style={{ display: "inline-block" }}
            initial={{ y: "100%", opacity: 0 }}
            whileInView={{ y: "0%", opacity: 1 }}
            viewport={{ once: true, amount: 0.5, margin: "0px 0px -10% 0px" }}
            transition={{
              duration: 0.6,
              delay: delay * intensity + i * 0.018 * intensity,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </Wrapper>
  );
}