"use client";

import Link from "next/link";
import { useState } from "react";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "Lectures", href: "/lectures" },
  { label: "Blog", href: "/blog" },
  { label: "CV", href: "/cv" },
  { label: "Contact", href: "/contact" },
];

export default function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-navy-800/60 bg-navy-950/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 font-bold text-navy-950 shadow-lg transition-transform group-hover:scale-105">
            AK
          </div>
          <span className="hidden text-lg font-semibold text-ink-100 sm:inline">
            Alton Kesselly
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-ink-300 transition-colors hover:bg-navy-800/60 hover:text-gold-300"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* CTA + Dashboard + Mobile Toggle */}
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            aria-label="Dashboard"
            title="Dashboard (private)"
            className="hidden h-9 w-9 items-center justify-center rounded-lg border border-navy-700 text-ink-400 transition-colors hover:border-gold-400/60 hover:bg-navy-800 hover:text-gold-300 sm:flex"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </Link>

          <Link
            href="/contact"
            className="hidden rounded-lg bg-gradient-to-r from-gold-400 to-gold-500 px-4 py-2 text-sm font-semibold text-navy-950 shadow-md transition-all hover:from-gold-300 hover:to-gold-400 hover:shadow-gold-400/30 sm:inline-block"
          >
            Hire Me
          </Link>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-navy-700 text-ink-200 transition-colors hover:bg-navy-800 lg:hidden"
          >
            {mobileOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-navy-800/60 bg-navy-950/95 backdrop-blur-lg lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-3 py-2.5 text-base font-medium text-ink-200 transition-colors hover:bg-navy-800/60 hover:text-gold-300"
              >
                {item.label}
              </Link>
            ))}

            <Link
              href="/dashboard"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 rounded-md px-3 py-2.5 text-base font-medium text-ink-200 transition-colors hover:bg-navy-800/60 hover:text-gold-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Dashboard
            </Link>

            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="mt-2 rounded-lg bg-gradient-to-r from-gold-400 to-gold-500 px-4 py-2.5 text-center text-sm font-semibold text-navy-950"
            >
              Hire Me
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
