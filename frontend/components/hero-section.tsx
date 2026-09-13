"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const ROLES = [
  "AI Researcher",
  "Data Analyst",
  "Full-Stack Developer",
  "Educator & Policy Leader",
  "Machine Learning Engineer",
];

const STATS = [
  { value: "$300M+", label: "Donor funding secured", accent: "gold" },
  { value: "8+", label: "Years of experience", accent: "electric" },
  { value: "5", label: "Degrees earned", accent: "emerald" },
  { value: "2", label: "Countries worked in", accent: "gold" },
];

const TECH_BADGES = [
  { label: "Python", emoji: "🐍", color: "text-gold-300", pos: "-left-6 top-12", delay: "0s" },
  { label: "PyTorch", emoji: "🔥", color: "text-electric-300", pos: "-right-4 top-20", delay: "0.8s" },
  { label: "ROS2", emoji: "🤖", color: "text-emerald-300", pos: "-left-10 top-1/2", delay: "1.6s" },
  { label: "Next.js", emoji: "▲", color: "text-ink-100", pos: "-right-8 top-1/2", delay: "2.4s" },
  { label: "TensorFlow", emoji: "🧠", color: "text-gold-300", pos: "-left-8 bottom-24", delay: "3.2s" },
  { label: "React", emoji: "⚛️", color: "text-electric-300", pos: "-right-6 bottom-20", delay: "4s" },
];

const ACCENT_MAP: Record<string, string> = {
  gold: "text-gold-400",
  electric: "text-electric-400",
  emerald: "text-emerald-400",
};

export default function HeroSection() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = ROLES[roleIndex];
    let delay = deleting ? 40 : 90;

    if (!deleting && displayed === current) {
      delay = 1800;
    } else if (deleting && displayed === "") {
      delay = 400;
    }

    const timeout = setTimeout(() => {
      if (!deleting) {
        if (displayed.length < current.length) {
          setDisplayed(current.slice(0, displayed.length + 1));
        } else {
          setDeleting(true);
        }
      } else {
        if (displayed.length > 0) {
          setDisplayed(current.slice(0, displayed.length - 1));
        } else {
          setDeleting(false);
          setRoleIndex((i) => (i + 1) % ROLES.length);
        }
      }
    }, delay);

    return () => clearTimeout(timeout);
  }, [displayed, deleting, roleIndex]);

  return (
    <section className="relative overflow-hidden">
      {/* Background gradient mesh */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-gold-400/8 blur-3xl" />
        <div className="absolute right-1/4 top-1/4 h-[500px] w-[500px] translate-x-1/2 rounded-full bg-electric-500/8 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-emerald-500/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center lg:gap-12">
          {/* ═══ Left column — text ═══ */}
          <div>
            {/* Availability badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Available for freelance &amp; consulting
            </div>

            {/* Name */}
            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
              Hi, I&apos;m{" "}
              <span className="bg-gradient-to-r from-gold-400 via-gold-300 to-electric-400 bg-clip-text text-transparent">
                Alton Kesselly
              </span>
            </h1>

            {/* Typing effect */}
            <div className="mt-6 flex h-10 items-center font-mono text-xl text-ink-200 sm:text-2xl">
              <span className="text-ink-500">&gt;&nbsp;</span>
              <span>{displayed}</span>
              <span className="ml-1 inline-block h-6 w-[2px] animate-pulse bg-gold-400" />
            </div>

            {/* Short bio */}
            <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-300 sm:text-lg">
              I build AI systems, interactive dashboards, and digital tools
              for education and development. Former Deputy Minister of
              Education in Liberia with 8+ years across policy, data, and
              software engineering.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/chat"
                className="group inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-gold-400 to-gold-500 px-6 py-3 font-semibold text-navy-950 shadow-lg transition-all hover:from-gold-300 hover:to-gold-400 hover:shadow-xl hover:shadow-gold-400/30"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                Chat with my AI
              </Link>

              <Link
                href="/cv"
                className="inline-flex items-center gap-2 rounded-lg border border-navy-700 bg-navy-900/60 px-6 py-3 font-semibold text-ink-100 backdrop-blur transition-all hover:border-gold-400 hover:bg-navy-800/60 hover:text-gold-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download CV
              </Link>

              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg border border-navy-700 bg-navy-900/60 px-6 py-3 font-semibold text-ink-100 backdrop-blur transition-all hover:border-electric-400 hover:bg-navy-800/60 hover:text-electric-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Watch Intro
              </button>
            </div>

            {/* Stats grid */}
            <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="group relative overflow-hidden rounded-lg border border-navy-800 bg-navy-900/40 p-4 backdrop-blur transition-all hover:-translate-y-0.5 hover:border-gold-400/40 hover:bg-navy-900/70"
                >
                  <div className={`text-xl font-bold sm:text-2xl ${ACCENT_MAP[stat.accent]}`}>
                    {stat.value}
                  </div>
                  <div className="mt-1 text-xs leading-snug text-ink-400">
                    {stat.label}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-gold-400/0 to-transparent transition-all group-hover:via-gold-400/60" />
                </div>
              ))}
            </div>
          </div>

          {/* ═══ Right column — photo visual ═══ */}
          <div className="relative hidden items-center justify-center lg:flex">
            <div className="relative">
              {/* Pulsing glow behind */}
              <div className="absolute -inset-6 animate-pulse rounded-full bg-gradient-to-r from-gold-400/25 via-electric-500/25 to-gold-400/25 blur-3xl" />

              {/* Outer ring */}
              <div className="absolute -inset-3 rounded-full border border-gold-400/20" />

              {/* Photo frame */}
              <div className="relative h-80 w-80 overflow-hidden rounded-full ring-2 ring-gold-400/60 xl:h-96 xl:w-96">
                <Image
                  src="/alton.png"
                  alt="Alton Kesselly"
                  fill
                  sizes="(max-width: 1280px) 320px, 384px"
                  className="object-cover"
                  priority
                />
                {/* Subtle inner gradient overlay */}
                <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-t from-navy-950/40 via-transparent to-transparent" />
              </div>

              {/* Floating tech badges */}
              {TECH_BADGES.map((badge) => (
                <div
                  key={badge.label}
                  className={`absolute ${badge.pos} animate-float rounded-lg border border-navy-700 bg-navy-900/95 px-3 py-2 text-xs font-medium shadow-xl backdrop-blur ${badge.color}`}
                  style={{ animationDelay: badge.delay }}
                >
                  <span className="mr-1.5">{badge.emoji}</span>
                  {badge.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}