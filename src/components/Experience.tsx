"use client";

import { useMemo } from "react";
import { portfolio } from "@/data/portfolio";
import { SectionHeading } from "./Reveal";
import { AuroraBackground } from "./AuroraBackground";
import { InteractiveShowcase } from "./InteractiveShowcase";
import type { ShowcaseItem } from "./InteractiveShowcase";

/**
 * Experience section built on the reusable InteractiveShowcase (Aurora)
 * component. Portfolio data is mapped into showcase items; theming is handed
 * the portfolio's monochrome accent so it reads as native to this design.
 */
export function Experience() {
  const items = useMemo<ShowcaseItem[]>(
    () =>
      portfolio.experience.map((item, i) => ({
        id: `${item.role}-${i}`,
        title: item.role,
        subtitle: item.organization,
        description: item.description,
        category: item.date,
        tags: item.tags,
        ...(item.image ? { media: { type: "image" as const, src: item.image, alt: "" } } : {}),
      })),
    [],
  );

  return (
    <section id="experience" className="section-shell relative overflow-hidden">
      <AuroraBackground intensity={0.32} className="z-0" />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <SectionHeading
          label="04 — Timeline"
          title="Experience & Milestones"
          description="Interactive timeline of my professional journey, internships, and key roles."
        />

        <div className="mt-12">
          <InteractiveShowcase
            items={items}
            theme="dark"
            accentColor="var(--primary)"
            previewSize="lg"
            soundEnabled
            soundVolume={0.14}
            hint="Hover, scroll or use arrow keys"
            label="Experience timeline"
            className="rounded-2xl"
          />
        </div>
      </div>
    </section>
  );
}
