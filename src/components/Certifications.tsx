"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { portfolio } from "@/data/portfolio";
import { SectionHeading } from "./Reveal";

import FlowingMenu from "./FlowingMenu";

const IMAGES = [
  "/projects/reconmind.jpg",
  "/projects/osint.jpg",
  "/projects/gamify.jpg",
  "/projects/weather.jpg",
];

type Cert = {
  name: string;
  organization: string;
  date: string;
  credential?: string;
  image: string;
};

function CertModal({ cert, onClose }: { cert: Cert; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[120] grid place-items-center bg-black/80 p-5 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-white/15 bg-[#0a0a0a] text-white shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-black/50 text-white transition-colors hover:bg-white hover:text-black"
        >
          <X size={16} />
        </button>

        <img
          src={cert.image}
          alt={cert.name}
          className="aspect-[16/9] w-full object-cover"
          loading="lazy"
        />

        <div className="p-7">
          <h3 className="text-2xl font-bold tracking-tight">{cert.name}</h3>
          <p className="mt-2 font-mono text-xs uppercase tracking-[0.22em] text-white/60">
            {cert.organization} · {cert.date}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-white/60">
            Verified credential from {cert.organization}. Kept here as a record of hands-on
            practice — the full certificate is available on request.
          </p>
          {cert.credential && (
            <a
              href={cert.credential}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-block rounded-full border border-white/25 px-5 py-2 font-mono text-xs uppercase tracking-[0.2em] transition-colors hover:bg-white hover:text-black"
            >
              View credential
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export function Certifications() {
  const certs: Cert[] = portfolio.certifications.map((cert, i) => ({
    ...cert,
    image: IMAGES[i % IMAGES.length],
  }));
  const [active, setActive] = useState<number | null>(null);

  const height = Math.max(320, certs.length * 96);

  return (
    <section id="certifications" className="section-shell">
      <div className="mx-auto w-full max-w-7xl">
        <div className="flex items-start justify-between gap-6">
          <SectionHeading
            label="05 — Credentials"
            title="Certifications & achievements"
            description="Hover a row to preview it, click to open the full certificate details."
          />
        </div>


        <div
          className="mt-12 overflow-hidden rounded-2xl bg-[#0a0a0a]"
          style={{ height: `${height}px` }}
        >
          <FlowingMenu
            items={certs.map((cert) => ({
              link: cert.credential || "#",
              text: cert.name,
              image: cert.image,
            }))}
            bgColor="#0a0a0a"
            textColor="#fff"
            marqueeBgColor="#fff"
            marqueeTextColor="#0a0a0a"
            borderColor="rgba(255,255,255,0.2)"
            useSplitFlap
            onItemClick={(index) => setActive(index)}
          />
        </div>
      </div>

      {active !== null && <CertModal cert={certs[active]} onClose={() => setActive(null)} />}
    </section>
  );
}
