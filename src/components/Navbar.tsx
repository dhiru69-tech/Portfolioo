import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Menu, X } from "lucide-react";
import { portfolio } from "@/data/portfolio";
import { BrandLogo } from "@/components/BrandLogo";


export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#home");
  const reduce = useReducedMotion();
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = portfolio.nav.map((n) => n.href.slice(1));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(`#${visible.target.id}`);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5] },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ?  "border-b border-border bg-[color-mix(in_oklab,var(--abyss)_92%,transparent)] shadow-[0_10px_40px_-24px_rgba(0,0,0,0.9)] backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <nav
        aria-label="Primary"
        className="mx-auto grid w-full max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-4"
      >
        <a
          href="#home"
          aria-label={`${portfolio.name} — home`}
          className="min-w-0 truncate text-foreground"
        >
          <BrandLogo />
        </a>


        <ul className="hidden items-center gap-1 lg:flex">
          {portfolio.nav.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                aria-current={active === item.href ? "page" : undefined}
                className={`relative rounded-md px-3 py-2 text-sm transition-colors ${
                  active === item.href
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
                {active === item.href && (
                  <motion.span
                    layoutId="nav-active"
                    transition={{ duration: reduce ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-x-2 -bottom-0.5 h-px bg-primary"
                  />
                )}
              </a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-border text-foreground transition-colors hover:bg-secondary lg:hidden"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      <div
        id="mobile-nav"
        ref={panelRef}
        hidden={!open}
        className="border-t border-border bg-[color-mix(in_oklab,var(--abyss)_94%,transparent)] backdrop-blur-xl lg:hidden"
      >
        <ul className="mx-auto flex max-w-7xl flex-col px-5 py-3">
          {portfolio.nav.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-3 text-base text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
