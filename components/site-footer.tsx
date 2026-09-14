import Link from "next/link";
import { SOCIALS } from "../lib/socials";

const QUICK_LINKS = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "Lectures", href: "/lectures" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export default function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-navy-800/60 bg-navy-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 font-bold text-navy-950">
                AK
              </div>
              <span className="text-lg font-semibold text-ink-100">
                Alton Kesselly
              </span>
            </div>
            <p className="text-sm leading-relaxed text-ink-400">
              AI researcher, data analyst, and full-stack developer building
              tools for education and development.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold-300">
              Explore
            </h3>
            <ul className="grid grid-cols-2 gap-2">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-ink-400 transition-colors hover:text-gold-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold-300">
              Connect
            </h3>
            <div className="grid grid-cols-4 gap-2.5">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  title={social.label}
                  className={`group relative flex h-11 w-11 items-center justify-center rounded-xl border border-navy-700 bg-navy-900/40 text-ink-300 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${social.hoverBg}`}
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
            <p className="mt-4 text-sm text-ink-400">Monrovia, Liberia</p>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-navy-800/60 pt-6 sm:flex-row">
          <p className="text-xs text-ink-500">
            © {new Date().getFullYear()} Alton Kesselly. All rights reserved.
          </p>
          <p className="text-xs text-ink-500">Built with Next.js + Wagtail</p>
        </div>
      </div>
    </footer>
  );
}