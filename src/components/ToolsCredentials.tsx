"use client";

import type React from "react";
import { Radar } from "lucide-react";
import { LogoLoop, type LogoItem } from "@/components/LogoLoop";
import { ToolsReel } from "@/components/tools/ToolsReel";
import { SectionHeading } from "./Reveal";


const LOOP_BG = "#050505";

function Brand({ slug, label }: { slug: string; label: string }) {
  return (
    <span className="tc-badge">
      <img
        src={`https://cdn.simpleicons.org/${slug}/ffffff`}
        alt=""
        width={26}
        height={26}
        loading="lazy"
      />
      <span className="tc-badge__label">{label}</span>
    </span>
  );
}

function ToolIcon({ label }: { label: string }) {
  return (
    <span className="tc-badge">
      <Radar size={26} strokeWidth={1.5} />
      <span className="tc-badge__label">{label}</span>
    </span>
  );
}

const items: LogoItem[] = [
  { node: <Brand slug="kalilinux" label="Kali Linux" />, ariaLabel: "Kali Linux" },
  { node: <ToolIcon label="Nmap" />, ariaLabel: "Nmap" },
  { node: <Brand slug="portswigger" label="Burp Suite" />, ariaLabel: "Burp Suite" },
  { node: <Brand slug="wireshark" label="Wireshark" />, ariaLabel: "Wireshark" },
  { node: <Brand slug="metasploit" label="Metasploit" />, ariaLabel: "Metasploit" },
  { node: <Brand slug="python" label="Python" />, ariaLabel: "Python" },
  { node: <Brand slug="react" label="React" />, ariaLabel: "React" },
  { node: <Brand slug="typescript" label="TypeScript" />, ariaLabel: "TypeScript" },
  { node: <Brand slug="tailwindcss" label="Tailwind CSS" />, ariaLabel: "Tailwind CSS" },
  { node: <Brand slug="nodedotjs" label="Node.js" />, ariaLabel: "Node.js" },
  { node: <Brand slug="fastapi" label="FastAPI" />, ariaLabel: "FastAPI" },
  { node: <Brand slug="postgresql" label="PostgreSQL" />, ariaLabel: "PostgreSQL" },
  { node: <Brand slug="hackthebox" label="Hack The Box" />, ariaLabel: "Hack The Box" },
  { node: <Brand slug="tryhackme" label="TryHackMe" />, ariaLabel: "TryHackMe" },
];

/**
 * Standalone "Stack" band: a slow marquee of icon + label badges
 * showing the tools and technologies actually used day to day.
 */
export function ToolsCredentials() {
  return (
    <section
      id="stack-credentials"
      className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 pt-[clamp(6rem,11vw,9.5rem)] pb-[clamp(7rem,13vw,11rem)]"
      style={
        {
          backgroundColor: LOOP_BG,
          color: "#f5f5f3",
          "--foreground": "#f5f5f3",
          "--muted-foreground": "rgba(245,245,243,0.6)",
        } as React.CSSProperties
      }
    >
      <div className="mx-auto w-full max-w-7xl px-5">
        <SectionHeading
          label="03 — Stack"
          title="Tools I use"
          description="The software and tools I actually run day to day."
        />
      </div>

      <div className="mx-auto w-full max-w-7xl px-5">
        <ToolsReel />
      </div>

      <div className="mt-16">
        <LogoLoop
          logos={items}
          speed={70}
          direction="left"
          logoHeight={28}
          gap={64}
          fadeOut
          fadeOutColor={LOOP_BG}
          pauseOnHover
          scaleOnHover
          ariaLabel="Tools and tech stack"
        />
      </div>

    </section>
  );
}