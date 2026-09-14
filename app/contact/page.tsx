"use client";

import { useState } from "react";
import { SOCIALS } from "../../lib/socials";

const CONTACT_INFO = [
  {
    label: "Email",
    value: "kessellyalton@outlook.com",
    href: "mailto:kessellyalton@outlook.com",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
  {
    label: "Phone",
    value: "+231 888 757 477",
    href: "tel:+231888757477",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  },
  {
    label: "Location",
    value: "Monrovia, Liberia",
    href: "https://maps.google.com/?q=Monrovia,Liberia",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
];

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    const mailto = `mailto:kessellyalton@outlook.com?subject=${encodeURIComponent(
      formState.subject || `Contact from ${formState.name}`
    )}&body=${encodeURIComponent(
      `From: ${formState.name} <${formState.email}>\n\n${formState.message}`
    )}`;

    setTimeout(() => {
      window.location.href = mailto;
      setSending(false);
      setSubmitted(true);
      setFormState({ name: "", email: "", subject: "", message: "" });
    }, 400);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mb-16 max-w-3xl">
        <div className="mb-4 inline-block rounded-full border border-gold-400/40 bg-gold-400/10 px-4 py-1.5 text-sm font-medium text-gold-300">
          Contact
        </div>
        <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">
          Let&apos;s{" "}
          <span className="bg-gradient-to-r from-gold-400 via-gold-300 to-electric-400 bg-clip-text text-transparent">
            talk
          </span>
        </h1>
        <p className="text-lg leading-relaxed text-ink-300">
          Have a project in mind, a question about AI and data, or just want to
          say hello? I&apos;d love to hear from you.
        </p>
      </div>

      <div className="grid gap-12 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="mb-8 space-y-4">
            {CONTACT_INFO.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="group flex items-start gap-4 rounded-xl border border-navy-800 bg-navy-900/40 p-5 backdrop-blur transition-all hover:-translate-y-0.5 hover:border-gold-400/40 hover:bg-navy-900/70"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-navy-700 bg-navy-800/60 text-gold-300 transition-colors group-hover:border-gold-400/60 group-hover:text-gold-200">
                  {item.icon}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-medium uppercase tracking-wider text-ink-500">
                    {item.label}
                  </div>
                  <div className="mt-0.5 break-all font-medium text-ink-100 transition-colors group-hover:text-gold-300">
                    {item.value}
                  </div>
                </div>
              </a>
            ))}
          </div>

          <div className="rounded-xl border border-navy-800 bg-navy-900/40 p-6 backdrop-blur">
            <div className="mb-4 text-xs font-semibold uppercase tracking-wider text-gold-300">
              Find me online
            </div>
            <div className="grid grid-cols-4 gap-2.5">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  title={social.label}
                  className={`group relative flex h-12 w-12 items-center justify-center rounded-xl border border-navy-700 bg-navy-950/60 text-ink-300 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${social.hoverBg}`}
                  style={{ "--brand-color": social.color } as React.CSSProperties}
                >
                  <span className="transition-colors duration-300 group-hover:text-[var(--brand-color)]">
                    {social.icon}
                  </span>
                  <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-navy-800 px-2 py-1 text-xs font-medium text-ink-100 opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
                    {social.label}
                  </span>
                </a>
              ))}
            </div>
          </div>

          <div className="mt-8 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5 backdrop-blur">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Available for new projects
            </div>
            <p className="text-sm text-ink-300">
              Typical response time: within 24 hours. For urgent inquiries,
              please call or use WhatsApp.
            </p>
          </div>
        </div>

        <div className="lg:col-span-3">
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-navy-800 bg-navy-900/40 p-6 backdrop-blur sm:p-8"
          >
            <h2 className="mb-6 text-xl font-bold text-ink-100">
              Send a message
            </h2>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <label
                  htmlFor="name"
                  className="mb-2 block text-xs font-semibold uppercase tracking-wider text-ink-400"
                >
                  Your name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formState.name}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-navy-700 bg-navy-950/60 px-4 py-2.5 text-sm text-ink-100 placeholder-ink-500 outline-none transition-colors focus:border-gold-400/60 focus:bg-navy-950"
                  placeholder="Jane Doe"
                />
              </div>

              <div className="sm:col-span-1">
                <label
                  htmlFor="email"
                  className="mb-2 block text-xs font-semibold uppercase tracking-wider text-ink-400"
                >
                  Your email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formState.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-navy-700 bg-navy-950/60 px-4 py-2.5 text-sm text-ink-100 placeholder-ink-500 outline-none transition-colors focus:border-gold-400/60 focus:bg-navy-950"
                  placeholder="you@example.com"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="subject"
                  className="mb-2 block text-xs font-semibold uppercase tracking-wider text-ink-400"
                >
                  Subject
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  value={formState.subject}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-navy-700 bg-navy-950/60 px-4 py-2.5 text-sm text-ink-100 placeholder-ink-500 outline-none transition-colors focus:border-gold-400/60 focus:bg-navy-950"
                  placeholder="Project inquiry, collaboration, question..."
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="message"
                  className="mb-2 block text-xs font-semibold uppercase tracking-wider text-ink-400"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formState.message}
                  onChange={handleChange}
                  className="w-full resize-none rounded-lg border border-navy-700 bg-navy-950/60 px-4 py-2.5 text-sm text-ink-100 placeholder-ink-500 outline-none transition-colors focus:border-gold-400/60 focus:bg-navy-950"
                  placeholder="Tell me about your project or question..."
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={sending}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-gold-400 to-gold-500 px-6 py-3 font-semibold text-navy-950 shadow-lg transition-all hover:from-gold-300 hover:to-gold-400 hover:shadow-xl hover:shadow-gold-400/30 disabled:opacity-60 sm:w-auto"
            >
              {sending ? (
                "Opening your email..."
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                  Send message
                </>
              )}
            </button>

            {submitted && (
              <div className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-300">
                Your email client should have opened. If not, email me directly
                at{" "}
                <a
                  href="mailto:kessellyalton@outlook.com"
                  className="underline hover:text-emerald-200"
                >
                  kessellyalton@outlook.com
                </a>
                .
              </div>
            )}

            <p className="mt-4 text-xs text-ink-500">
              This form opens your default email client with a pre-filled
              message. We&apos;ll wire it up to a proper backend soon.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
