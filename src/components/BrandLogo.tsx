"use client";

import { motion, useReducedMotion } from "motion/react";
import { portfolio } from "@/data/portfolio";
import dkLogo from "@/assets/dk-logo.svg";

/**
 * Brand mark: the uploaded "DK" monogram with a premium king's crown above it.
 *
 * The crown rotates continuously and extremely slowly via Framer Motion
 * (transform-only, GPU composited) for a quiet, luxury-software feel.
 * Sizing is fixed so the navbar height never shifts.
 */
export function BrandLogo({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();

  return (
    <span className={`inline-flex h-10 items-center ${className}`}>
      <span className="relative inline-flex h-10 w-10 items-end justify-center">
        {/* Crown — slow, infinite, subtle rotation */}
        

        <img
  src={dkLogo}                  
  alt={`${portfolio.name} — home`}
  width={500}
  height={500}
  decoding="async"
  className="h-[50px] w-[50px] shrink-0 select-none rounded-full object-cover"
/>
      </span>
    </span>
  );
}

export default BrandLogo;
