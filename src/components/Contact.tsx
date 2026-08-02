import { useState, type FormEvent } from "react";
import { CheckCircle2, Github, Linkedin, Mail, Send } from "lucide-react";
import { portfolio } from "@/data/portfolio";
import { Reveal, SectionHeading } from "./Reveal";
import { AmbientVideo } from "./AmbientVideo";

type Errors = Partial<Record<"name" | "email" | "message", string>>;

/**
 * Real contact delivery via FormSubmit (https://formsubmit.co).
 *
 * No API key, no backend and no account: messages are emailed straight to
 * `portfolio.email`. The very first submission triggers a one-time
 * confirmation email to that address — click the link in it to activate the
 * endpoint. Spam protection: FormSubmit's built-in captcha/filtering plus the
 * `_honey` honeypot field below (hidden from humans, filled by bots).
 */
const FORMSUBMIT_ENDPOINT = `https://formsubmit.co/ajax/${encodeURIComponent(portfolio.email)}`;

async function submitMessage(payload: {
  name: string;
  email: string;
  message: string;
  _honey: string;
}) {
  const response = await fetch(FORMSUBMIT_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      name: payload.name.trim(),
      email: payload.email.trim(),
      message: payload.message.trim(),
      _subject: `Portfolio message from ${payload.name.trim()}`,
      _template: "table",
      _captcha: "true",
      _honey: payload._honey,
    }),
  });
  if (!response.ok) throw new Error(`FormSubmit responded ${response.status}`);
  return { ok: true as const };
}

export function Contact() {
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [honey, setHoney] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const validate = () => {
    const next: Errors = {};
    if (values.name.trim().length < 2) next.name = "Please enter your name.";
    if (values.name.trim().length > 100) next.name = "Name must be under 100 characters.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim()))
      next.email = "Please enter a valid email address.";
    if (values.message.trim().length < 10)
      next.message = "Message should be at least 10 characters.";
    if (values.message.trim().length > 2000)
      next.message = "Message must be under 2000 characters.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;
    if (honey) return; // bot caught by the honeypot — silently ignore
    setStatus("sending");
    try {
      const result = await submitMessage({ ...values, _honey: honey });
      if (!result.ok) throw new Error("failed");
      setStatus("sent");
      setValues({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };


  const field =
    "w-full rounded-xl border border-border bg-secondary/40 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 transition-all duration-300 focus:border-primary/60 focus:bg-secondary/60 focus:shadow-[0_0_0_4px_color-mix(in_oklab,var(--primary)_12%,transparent)] focus:outline-none aria-[invalid=true]:border-destructive/70";

  return (
    <section id="contact" className="section-shell ambient-top overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] bg-[radial-gradient(60%_80%_at_50%_100%,color-mix(in_oklab,var(--primary)_14%,transparent),transparent_70%)]"
      />

      <div className="relative mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
        <div>
          <SectionHeading
            label="06 — Contact"
            title={portfolio.contact.heading}
            description={portfolio.contact.description}
          />

          <Reveal delay={0.12}>
            <form onSubmit={onSubmit} noValidate className="glass-panel mt-10 rounded-2xl p-6 sm:p-8">
              <div className="space-y-5">
                <div>
                  <label htmlFor="name" className="label-mono">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    autoComplete="name"
                    className={`mt-2 ${field}`}
                    value={values.name}
                    onChange={(e) => setValues({ ...values, name: e.target.value })}
                    placeholder="Your name"
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "name-error" : undefined}
                  />
                  {errors.name && (
                    <p id="name-error" className="mt-2 text-xs text-destructive">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="label-mono">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className={`mt-2 ${field}`}
                    value={values.email}
                    onChange={(e) => setValues({ ...values, email: e.target.value })}
                    placeholder="you@example.com"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                  {errors.email && (
                    <p id="email-error" className="mt-2 text-xs text-destructive">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className="label-mono">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    className={`mt-2 resize-y ${field}`}
                    value={values.message}
                    onChange={(e) => setValues({ ...values, message: e.target.value })}
                    placeholder="What would you like to talk about?"
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? "message-error" : undefined}
                  />
                  {errors.message && (
                    <p id="message-error" className="mt-2 text-xs text-destructive">
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* Honeypot — hidden from users, bots fill it in. */}
                <div className="absolute left-[-9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
                  <label htmlFor="company">Company</label>
                  <input
                    id="company"
                    name="_honey"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honey}
                    onChange={(e) => setHoney(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="group mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-ambient)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "sending" ? "Sending…" : "Send Message"}
                <Send
                  size={15}
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                />
              </button>

              <p aria-live="polite" className="mt-4 min-h-5 text-sm">
                {status === "sent" && (
                  <span className="inline-flex items-start gap-2 text-cyan">
                    <CheckCircle2 size={15} aria-hidden="true" className="mt-0.5 shrink-0" />
                    Thanks — your message is on its way. I'll reply to the email you gave.
                  </span>
                )}
                {status === "error" && (
                  <span className="text-destructive">
                    Something went wrong sending that. Please email me directly at{" "}
                    {portfolio.email}.
                  </span>
                )}
              </p>

            </form>
          </Reveal>
        </div>

        <div className="flex flex-col gap-6 lg:pt-24">
          <Reveal delay={0.1}>
            <ul className="space-y-3">
              {[
                {
                  icon: Mail,
                  label: "Email",
                  value: portfolio.email,
                  href: `mailto:${portfolio.email}`,
                },
                {
                  icon: Github,
                  label: "GitHub",
                  value: "View profile",
                  href: portfolio.social.github,
                },
                {
                  icon: Linkedin,
                  label: "LinkedIn",
                  value: "View profile",
                  href: portfolio.social.linkedin,
                },
              ].map(({ icon: Icon, label, value, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    className="glass-panel grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4 rounded-2xl px-5 py-4 transition-all duration-400 hover:-translate-y-0.5 hover:border-primary/45"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-border bg-secondary/70 text-primary">
                      <Icon size={16} aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="label-mono block">{label}</span>
                      <span className="mt-0.5 block truncate text-sm text-foreground">{value}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.18}>
            <AmbientVideo
              src="/videos/contact.mp4"
              poster="/videos/contact-poster.jpg"
              label="Let's build something"
              aspect="aspect-16/10 sm:aspect-video lg:aspect-4/3"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
