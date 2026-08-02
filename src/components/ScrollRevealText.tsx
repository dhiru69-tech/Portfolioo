"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";

/**
 * Editorial scroll-linked text reveal.
 *
 * The paragraph is split into words; each word's opacity and blur are driven
 * directly by the element's scroll progress, so the copy resolves at natural
 * reading speed as the reader scrolls — muted + soft at first, crisp once read.
 * No typing, no per-character effects, no bounce.
 */
type ScrollRevealTextProps = {
  text: string;
  className?: string;
  as?: "p" | "span";
  /** How much of the reveal window each word occupies (0–1). */
  wordSpan?: number;
};

function Word({
  children,
  progress,
  start,
  end,
}: {
  children: string;
  progress: MotionValue<number>;
  start: number;
  end: number;
}) {
  const opacity = useTransform(progress, [start, end], [0.16, 1]);
  const filter = useTransform(progress, [start, end], ["blur(6px)", "blur(0px)"]);

  return (
    <motion.span style={{ opacity, filter, display: "inline-block", willChange: "opacity, filter" }}>
      {children}
    </motion.span>
  );
}

export function ScrollRevealText({
  text,
  className,
  as = "p",
  wordSpan = 0.22,
}: ScrollRevealTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "start 0.35"],
  });

  const Wrapper = as;

  if (reduced) {
    return <Wrapper className={className}>{text}</Wrapper>;
  }

  const words = text.split(" ");
  const step = words.length > 1 ? (1 - wordSpan) / (words.length - 1) : 0;

  return (
    <Wrapper ref={ref as never} className={className}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`}>
          <Word progress={scrollYProgress} start={i * step} end={i * step + wordSpan}>
            {word}
          </Word>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </Wrapper>
  );
}

export default ScrollRevealText;
