import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowDown, Github, Linkedin, Mail } from "lucide-react";
import { portfolio } from "@/data/portfolio";
import { useScrollVideo } from "@/hooks/useScrollVideo";
import { useMotionIntensity } from "@/hooks/useMotionIntensity";

export function ScrollVideoHero() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { intensity, reduced } = useMotionIntensity();
  const reduce = useReducedMotion() || reduced;
  // Scrubbing stays on across every breakpoint; only reduced motion parks it.
  const { videoRef } = useScrollVideo({ containerRef, enabled: !reduce, intensity: intensity || 1 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const contentOpacity = useTransform(scrollYProgress, [0, 0.35, 0.6], [1, 0.6, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.6], [0, -70]);
  const veil = useTransform(scrollYProgress, [0.5, 1], [0, 1]);

  const ease = [0.22, 1, 0.36, 1] as const;
  const rise = (delay: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 18, filter: "blur(6px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    transition: { duration: reduce ? 0 : 0.8, delay: reduce ? 0 : delay, ease },
  });

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative h-[320vh] w-full lg:h-[420vh]"
      aria-label="Introduction"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          poster="/videos/poster.jpg"
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          tabIndex={-1}
          aria-hidden="true"
        >
          {/* mp4 first: browsers pick the first supported source, so H.264 users
              never download the larger VP9 fallback. */}
          <source src="/videos/hero-video.mp4" type="video/mp4" />
          <source src="/videos/hero-video.webm" type="video/webm" />
        </video>


        {/* Layer 1 — light neutral wash so text stays readable */}
        <div className="absolute inset-0 bg-black/25" aria-hidden="true" />
        {/* Layer 2 — navy gradient anchored to the text side */}
        <div
          className="absolute inset-0 bg-[linear-gradient(100deg,color-mix(in_oklab,var(--abyss)_88%,transparent)_0%,color-mix(in_oklab,var(--abyss)_45%,transparent)_42%,transparent_72%)]"
          aria-hidden="true"
        />
        {/* Layer 2b — vertical scrim for narrow screens where text spans full width */}
        <div
          className="absolute inset-0 bg-[linear-gradient(to_bottom,color-mix(in_oklab,var(--abyss)_78%,transparent)_0%,color-mix(in_oklab,var(--abyss)_55%,transparent)_55%,color-mix(in_oklab,var(--abyss)_85%,transparent)_100%)] md:hidden"
          aria-hidden="true"
        />
        {/* Layer 3 — subtle blue atmosphere + bottom fade into the page */}
        <div
          className="absolute inset-0 bg-[radial-gradient(90%_70%_at_15%_60%,color-mix(in_oklab,var(--primary)_16%,transparent),transparent_65%)]"
          aria-hidden="true"
        />
        <div
          className="absolute inset-x-0 bottom-0 h-56 bg-[linear-gradient(to_top,var(--abyss),transparent)]"
          aria-hidden="true"
        />
        {/* Exit veil — the video dissolves into the dark page */}
        <motion.div
          style={{ opacity: veil }}
          className="pointer-events-none absolute inset-0 bg-abyss"
          aria-hidden="true"
        />

        <motion.div
          style={{ opacity: contentOpacity, y: contentY }}
          className="relative mx-auto flex h-full w-full max-w-7xl flex-col justify-center px-5"
        >
          <div className="max-w-xl lg:max-w-2xl">
            <motion.p {...rise(0.1)} className="label-mono">
              {portfolio.hero.eyebrow}
            </motion.p>

            <h1 className="mt-6 flex flex-wrap text-[clamp(2.4rem,6.2vw,5rem)] leading-[0.98] font-extrabold tracking-[-0.035em] text-foreground">
              {portfolio.hero.title.split(" ").map((word, i) => (
                <motion.span
                  key={`${word}-${i}`}
                  initial={{ opacity: 0, y: reduce ? 0 : 22, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{
                    duration: reduce ? 0 : 0.7,
                    delay: reduce ? 0 : 0.26 + i * 0.055,
                    ease,
                  }}
                  className="mr-[0.28em] inline-block"
                >
                  {word}
                </motion.span>
              ))}
            </h1>

            <motion.p
              {...rise(0.46)}
              className="mt-6 max-w-lg text-[clamp(0.95rem,1.3vw,1.075rem)] leading-relaxed text-muted-foreground"
            >
              {portfolio.hero.description}
            </motion.p>

            <motion.div {...rise(0.62)} className="mt-9 flex flex-wrap gap-3">
              <a
                href="#projects"
                className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-[var(--shadow-ambient)] transition-transform duration-300 hover:-translate-y-0.5"
              >
                View My Work
              </a>
              <a
                href="#contact"
                className="glass-panel inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium text-foreground transition-colors duration-300 hover:border-primary/50"
              >
                Let's Connect
              </a>
            </motion.div>

            <motion.ul {...rise(0.76)} className="mt-8 flex items-center gap-5">
              {[
                { icon: Github, label: "GitHub", href: portfolio.social.github },
                { icon: Linkedin, label: "LinkedIn", href: portfolio.social.linkedin },
                { icon: Mail, label: "Email", href: `mailto:${portfolio.email}` },
              ].map(({ icon: Icon, label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    <Icon size={16} aria-hidden="true" />
                    {label}
                  </a>
                </li>
              ))}
            </motion.ul>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reduce ? 0 : 1.1, duration: 0.8 }}
          style={{ opacity: contentOpacity }}
          className="pointer-events-none absolute inset-x-0 bottom-7 flex flex-col items-center gap-2"
        >
          <span className="label-mono">Scroll to explore</span>
          <motion.span
            animate={reduce ? {} : { y: [0, 7, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className="text-primary"
          >
            <ArrowDown size={16} aria-hidden="true" />
          </motion.span>
        </motion.div>
      </div>
    </section>
  );
}
