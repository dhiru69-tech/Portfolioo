"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { playTick } from "@/lib/tick-sound";

const FLIP_COLORS = ["#a78bfa", "#4ade80", "#facc15"];

/**
 * Split-flap / departure-board style text reveal.
 *
 * Each character flips vertically through a few accent colours before settling
 * on its final colour, with a short mechanical tick per flip step.
 * Scroll-triggered by default, replayable on hover. Simplified on small
 * screens / reduced motion (single fade, no per-character flips, no sound).
 */
export function SplitFlapText({
  text,
  className = "",
  as: Tag = "span",
  replayOnHover = true,
  style,
}: {
  text: string;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
  replayOnHover?: boolean;
  style?: React.CSSProperties;
}) {
  const rootRef = useRef<HTMLElement | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const playedRef = useRef(false);

  const isSimple = () => {
    if (typeof window === "undefined") return true;
    return (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(max-width: 767px)").matches
    );
  };

  const run = () => {
    const root = rootRef.current;
    if (!root) return;
    const chars = Array.from(root.querySelectorAll<HTMLElement>("[data-flap]"));
    if (!chars.length) return;

    tlRef.current?.kill();

    if (isSimple()) {
      gsap.fromTo(
        root,
        { opacity: 0.35 },
        { opacity: 1, duration: 0.4, ease: "power2.out" },
      );
      return;
    }

    const tl = gsap.timeline({ defaults: { duration: 0.14, ease: "power2.inOut" } });
    tlRef.current = tl;

    chars.forEach((char, i) => {
      const start = i * 0.035;
      tl.set(char, { transformOrigin: "50% 0%" }, start);
      FLIP_COLORS.forEach((color, step) => {
        const at = start + step * 0.14;
        tl.set(char, { rotateX: -90, opacity: 0.2 }, at);
        tl.to(
          char,
          {
            rotateX: 0,
            opacity: 1,
            color,
            onStart: () => playTick(0.045),
          },
          at,
        );
      });
      const settleAt = start + FLIP_COLORS.length * 0.14;
      tl.set(char, { rotateX: -90, opacity: 0.2 }, settleAt);
      tl.to(
        char,
        {
          rotateX: 0,
          opacity: 1,
          color: "inherit",
          clearProps: "color",
          onStart: () => playTick(0.05),
        },
        settleAt,
      );
    });
  };

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !playedRef.current) {
            playedRef.current = true;
            run();
          }
        });
      },
      { threshold: 0.35 },
    );
    observer.observe(root);

    return () => {
      observer.disconnect();
      tlRef.current?.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  const Component = Tag as any;

  return (
    <Component
      ref={rootRef as any}
      className={className}
      style={{ perspective: "600px", ...style }}
      onMouseEnter={replayOnHover ? run : undefined}
      aria-label={text}
    >
      {text.split("").map((char, i) => (
        <span
          key={`${char}-${i}`}
          data-flap
          aria-hidden="true"
          style={{ display: "inline-block", willChange: "transform" }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </Component>
  );
}
