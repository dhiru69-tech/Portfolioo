import { UserRound } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";
import { portfolio } from "@/data/portfolio";
import { Reveal, SectionHeading } from "./Reveal";
import { ScrollRevealText } from "./ScrollRevealText";
import { AmbientVideo } from "./AmbientVideo";
import { useMotionIntensity } from "@/hooks/useMotionIntensity";

export function About() {
  const [imageFailed, setImageFailed] = useState(false);
  const { reduced, intensity } = useMotionIntensity();

  return (
    <section id="about" className="section-shell ambient-top">
      <div className="mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-16">
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute -inset-3 rounded-3xl bg-[radial-gradient(70%_70%_at_30%_20%,color-mix(in_oklab,var(--primary)_16%,transparent),transparent_70%)] blur-xl"
            />

            <AmbientVideo
              src="/videos/about.mp4"
              poster="/videos/about-poster.jpg"
              label="How I work"
              aspect="aspect-4/3 sm:aspect-square"
              className="relative shadow-[var(--shadow-ambient)]"
            />

            <div className="mt-5 flex items-center gap-4">
              <div className="glass-panel h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                {imageFailed ? (
                  <div className="grid h-full w-full place-items-center text-muted-foreground">
                    <UserRound size={22} strokeWidth={1.2} aria-hidden="true" />
                  </div>
                ) : (
                  <img
                    src={portfolio.about.image}
                    alt={`${portfolio.name}, ${portfolio.role}`}
                    loading="lazy"
                    decoding="async"
                    onError={() => setImageFailed(true)}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{portfolio.name}</p>
                <p className="truncate text-sm text-muted-foreground">{portfolio.role}</p>
              </div>
            </div>
          </div>
        </Reveal>

        <div>
          <SectionHeading label="01 — Profile" title={portfolio.about.heading} />

          <div className="mt-8 space-y-5">
            {portfolio.about.paragraphs.map((p, i) => (
              <ScrollRevealText
                key={i}
                text={p}
                className="text-[clamp(1rem,1.2vw,1.075rem)] leading-[1.85] text-muted-foreground"
              />
            ))}
          </div>

          <Reveal delay={0.24}>
            <div className="glass-panel mt-10 rounded-2xl p-6 transition-colors duration-500 hover:border-primary/40 sm:p-7">
              <p className="label-mono">Currently exploring</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {portfolio.about.exploring.map((item, i) => (
                  <motion.li
                    key={item}
                    initial={reduced ? false : { opacity: 0, y: 10 * intensity, scale: 0.96 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{
                      duration: 0.4,
                      delay: reduced ? 0 : 0.06 * i,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="rounded-full border border-border bg-secondary/60 px-3 py-1.5 font-[family-name:var(--font-mono)] text-xs text-foreground/85 transition-colors duration-300 hover:border-primary/50 hover:text-foreground"
                  >
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}