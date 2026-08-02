import { ArrowUp, Github, Linkedin, Mail } from "lucide-react";
import { portfolio } from "@/data/portfolio";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-5 py-10 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
        <p className="min-w-0 text-sm text-muted-foreground">
          © 2026 {portfolio.name}. Built with code and curiosity.
        </p>

        <div className="flex flex-wrap items-center gap-5">
          {[
            { icon: Github, label: "GitHub", href: portfolio.social.github },
            { icon: Linkedin, label: "LinkedIn", href: portfolio.social.linkedin },
            { icon: Mail, label: "Email", href: `mailto:${portfolio.email}` },
          ].map(({ icon: Icon, label, href }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              <Icon size={15} aria-hidden="true" />
              {label}
            </a>
          ))}
          <a
            href="#home"
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
          >
            Back to top
            <ArrowUp size={14} aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
