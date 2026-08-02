"use client";

import { AnimatePresence, motion } from "motion/react";
import React, { useState } from "react";
import { portfolio } from "@/data/portfolio";
import { SectionHeading } from "./Reveal";
import { cn } from "@/lib/utils";
import { Shield, Code2, TerminalSquare, Layers, ShieldAlert, Globe, Cpu } from "lucide-react";

const icons = {
  shield: Shield,
  code: Code2,
  terminal: TerminalSquare,
  layers: Layers,
} as const;

const HoverExpand_001 = ({
  items,
  className,
}: {
  items: {
    category: string;
    skillsList: string[];
    src: string;
    code: string;
    Icon: any;
  }[];
  className?: string;
}) => {
  const [activeImage, setActiveImage] = useState<number | null>(0);

  return (
    <motion.div
      initial={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{
        duration: 0.3,
        delay: 0.2,
      }}
className={cn("relative w-full max-w-6xl px-2 py-2", className)}
    >
      <div className="flex w-full items-center justify-center gap-3 overflow-x-auto pb-6 pt-4">
        {items.map((item, index) => {
          const isActive = activeImage === index;
          const IconComponent = item.Icon;

          return (
            <motion.div
              key={index}
              className="relative cursor-pointer overflow-hidden rounded-3xl border border-border/60 bg-card/40 shadow-2xl shrink-0 backdrop-blur-md"
              initial={{ width: "5rem", height: "30rem" }}
              animate={{
                width: isActive ? "38rem" : "5rem",
                height: "35rem",
              }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => setActiveImage(index)}
              onHoverStart={() => setActiveImage(index)}
            >
              {/* Background Image / Gradient Fallback */}
              <div className="absolute inset-0 z-0">
                <img
                  src={item.src}
                className="size-full object-cover opacity-85 mix-blend-overlay transition-opacity duration-500"
                  alt={item.category}
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
             <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-background/40" />
              </div>

              {/* Collapsed View Content (Vertical Text) */}
              <div
                className={cn(
                  "absolute inset-0 z-10 flex flex-col items-center justify-between p-5 transition-opacity duration-300",
                  isActive ? "opacity-0 pointer-events-none" : "opacity-100"
                )}
              >
                <span className="text-xs font-mono text-muted-foreground">{item.code}</span>
                <div className="flex flex-col items-center gap-3 [writing-mode:vertical-lr] rotate-180 py-4">
                  <span className="text-sm font-semibold tracking-wider text-foreground whitespace-nowrap">
                    {item.category}
                  </span>
                </div>
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-secondary/80 text-primary border border-border/50 shadow-sm">
                  <IconComponent size={18} />
                </div>
              </div>

              {/* Expanded View Content */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.25, delay: 0.1 }}
                    className="absolute inset-0 z-10 flex flex-col justify-between p-7"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-primary px-3 py-1 rounded-full bg-primary/15 border border-primary/30">
                        {item.code}
                      </span>
                      <div className="grid h-11 w-11 place-items-center rounded-xl border border-border/80 bg-secondary/90 text-primary shadow-md">
                        <IconComponent size={20} />
                      </div>
                    </div>

                    <div className="space-y-4 my-auto">
                      <h3 className="text-2xl font-bold tracking-tight text-foreground drop-shadow-sm">
                        {item.category}
                      </h3>
                      <ul className="space-y-2.5 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                        {item.skillsList.map((skill, sIdx) => (
                          <li
                            key={sIdx}
                            className="flex items-center gap-3 text-sm font-medium text-muted-foreground/90"
                          >
                            <span className="h-2 w-2 rounded-full bg-primary shrink-0 shadow-[0_0_8px_var(--primary)]" />
                            <span className="leading-relaxed">{skill}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

// 1. Services Section Added
const services = [
  {
    title: "Security & Penetration Testing",
    description: "Identifying vulnerabilities, securing web applications, and performing rigorous security audits to protect digital assets.",
    icon: ShieldAlert,
    tag: "Core Expertise",
  },
  {
    title: "Full-Stack Development",
    description: "Building fast, responsive, and modern web applications using cutting-edge frameworks, React, Next.js, and Tailwind CSS.",
    icon: Globe,
    tag: "Engineering",
  },
  {
    title: "System Architecture & Tooling",
    description: "Designing robust backend structures, command-line utilities, and efficient workflow tooling for seamless performance.",
    icon: Cpu,
    tag: "Infrastructure",
  },
];

export function Services() {
  return (
    <section id="services" className="section-shell">
      <div className="mx-auto w-full max-w-7xl px-4">
        <SectionHeading
          label="03 — Services"
          title="What I bring to the table"
          description="Specialized technical solutions focused on security-first development and high-performance applications."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border/60 bg-card/40 p-8 transition-all duration-500 hover:border-primary/50 hover:shadow-xl backdrop-blur-md"
              >
                <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/10 blur-2xl transition-all duration-500 group-hover:bg-primary/20" />

                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full border border-border/60 bg-secondary/60 px-3 py-1 font-mono text-xs text-primary">
                      {service.tag}
                    </span>
                    <div className="grid h-12 w-12 place-items-center rounded-2xl border border-border bg-secondary/80 text-primary transition-transform duration-500 hover:scale-110">
                      <Icon size={22} />
                    </div>
                  </div>

                  <h3 className="mt-8 text-xl font-bold tracking-tight text-foreground">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {service.description}
                  </p>
                </div>

                <div className="mt-8 flex items-center gap-2 text-xs font-mono text-primary">
                  <span>Explore capability</span>
                  <span>→</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// 2. Stats Section Added
const stats = [
  { label: "Completed Projects", value: "20+" },
  { label: "Security CTFs Played", value: "50+" },
  { label: "Code Commits", value: "1,200+" },
  { label: "Client Satisfaction", value: "100%" },
];

export function Stats() {
  return (
    <section className="border-y border-border/40 bg-secondary/20 py-16 backdrop-blur-sm">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 md:grid-cols-4 lg:gap-12">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="flex flex-col items-center text-center"
          >
            <span className="font-mono text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              {stat.value}
            </span>
            <span className="mt-2 text-xs font-medium uppercase tracking-wider text-muted-foreground sm:text-sm">
              {stat.label}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function Skills() {
  const fallbackImages = [
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop",
  ];

  const skillItems = portfolio.skills.map((group, index) => {
    const IconComponent = icons[group.icon as keyof typeof icons] || Layers;
    return {
      category: group.category,
      skillsList: group.items,
      src: fallbackImages[index % fallbackImages.length],
      code: `# 0${index + 1}`,
      Icon: IconComponent,
    };
  });

  return (
    <>
      <section id="skills" className="section-shell">
        <div className="mx-auto w-full max-w-7xl px-4">
          <SectionHeading
            label="02 — Capabilities"
            title="What I work with"
            description="Grouped by how I actually use them day to day — security practice, languages, tooling, and the development side."
          />

          <div className="mt-1 flex w-full items-center justify-center">
            <HoverExpand_001 items={skillItems} />
          </div>
        </div>
      </section>
    </>
  );
}

export { HoverExpand_001 };