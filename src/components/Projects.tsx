"use client";

import { forwardRef, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ReactLenis from "lenis/react";
import { ArrowUpRight, Github, ImageIcon } from "lucide-react";
import { portfolio, type Project } from "@/data/portfolio";
import { SectionHeading } from "./Reveal";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Single stacked project card. Absolutely positioned so every card occupies
 * the same box inside the pinned container — GSAP drives which one is on
 * top and how it scales/fades as the next card slides up over it.
 */
const ProjectCard = forwardRef<HTMLDivElement, { project: Project; index: number }>(
  ({ project, index }, ref) => {
    const [failed, setFailed] = useState(false);

    return (
      <div ref={ref} className="absolute inset-0 flex items-center justify-center p-3 lg:p-8">
        <div className="relative flex w-full max-w-4xl origin-top flex-col items-center gap-8 overflow-hidden rounded-3xl border border-border/60 bg-card/95 p-6 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)] lg:flex-row lg:p-8">
          {/* Project Image/Visual */}
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border/40 bg-secondary/50 lg:w-1/2">
            {failed ? (
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
                <ImageIcon size={30} strokeWidth={1.2} aria-hidden="true" />
                <span className="font-mono text-xs">{project.name}</span>
              </div>
            ) : (
              <img
                src={project.image}
                alt={project.name}
                loading="lazy"
                onError={() => setFailed(true)}
                className="h-full w-full object-cover"
              />
            )}
          </div>

          {/* Project Details */}
          <div className="flex w-full min-w-0 flex-col justify-between lg:w-1/2">
            <div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-primary">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="h-px w-6 bg-border" aria-hidden="true" />
                <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  {project.tagline}
                </span>
              </div>

              <h3 className="mt-3 text-2xl font-bold tracking-tight text-foreground">
                {project.name}
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                {project.description}
              </p>

              <ul className="mt-5 flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-md border border-border/60 bg-secondary/50 px-2.5 py-1 font-mono text-[0.68rem] tracking-wide text-foreground/80"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-7 flex flex-wrap gap-3 border-t border-border/40 pt-4">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-border px-4 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
                >
                  <Github size={14} />
                  GitHub
                </a>
              )}
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noreferrer"
                  className="group/cta inline-flex h-10 items-center gap-2 rounded-full bg-primary px-4 text-xs font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
                >
                  Live Demo
                  <ArrowUpRight
                    size={14}
                    className="transition-transform group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5"
                  />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  },
);
ProjectCard.displayName = "ProjectCard";

export function Projects() {
  const pinRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const projectsList = portfolio.projects;

  useEffect(() => {
    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
    const total = cards.length;
    if (!total || !pinRef.current) return;

    const ctx = gsap.context(() => {
      // First card sits in place; every other card starts stacked below,
      // ready to slide up.
      gsap.set(cards[0], { y: "0%", scale: 1, opacity: 1 });
      for (let i = 1; i < total; i++) {
        gsap.set(cards[i], { y: "100%", scale: 1, opacity: 1 });
      }

      if (total > 1) {
        const scrollTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: pinRef.current,
            start: "top top",
            end: `+=${window.innerHeight * (total - 1)}`,
            pin: true,
            scrub: 0.5,
            pinSpacing: true,
          },
        });

        for (let i = 0; i < total - 1; i++) {
          const current = cards[i];
          const next = cards[i + 1];
          const position = i;

          scrollTimeline.to(
            current,
            { scale: 0.92, opacity: 0.45, duration: 1, ease: "none" },
            position,
          );
          scrollTimeline.to(next, { y: "0%", duration: 1, ease: "none" }, position);
        }
      }

      const resizeObserver = new ResizeObserver(() => ScrollTrigger.refresh());
      if (pinRef.current) resizeObserver.observe(pinRef.current);

      return () => resizeObserver.disconnect();
    }, pinRef);

    return () => ctx.revert();
  }, [projectsList.length]);

  return (
    <ReactLenis root>
      <section id="projects" className="section-shell ambient-top">
        <div className="mx-auto w-full max-w-6xl px-4">
          <SectionHeading
            label="03 — Selected work"
            title="Projects"
            description="Tools and applications I've built, focusing on security workflows, automation, and modern web tech."
          />

          <div
            ref={pinRef}
            className="relative mt-12 h-[78vh] min-h-[520px] w-full overflow-hidden rounded-3xl"
          >
            {projectsList.map((project, i) => (
              <ProjectCard
                key={`p_${i}`}
                project={project}
                index={i}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
              />
            ))}
          </div>
        </div>
      </section>
    </ReactLenis>
  );
}