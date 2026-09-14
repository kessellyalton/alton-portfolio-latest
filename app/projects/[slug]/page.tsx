import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getProjectBySlug, imageUrl } from "@/lib/api";
import StreamField from "@/components/streamfield";

export const revalidate = 60;

type Props = {
  params: Promise<{ slug: string }>;
};

const CATEGORY_LABELS: Record<string, string> = {
  ai_ml: "AI & Machine Learning",
  dashboard: "Data & Dashboards",
  software: "Software Engineering",
  education: "Education & Policy",
  research: "Research & Analysis",
  teaching: "Teaching & Tutorials",
};

const CATEGORY_COLORS: Record<string, string> = {
  ai_ml: "border-gold-400/40 bg-gold-400/10 text-gold-300",
  dashboard: "border-electric-400/40 bg-electric-400/10 text-electric-300",
  software: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
  education: "border-gold-400/40 bg-gold-400/10 text-gold-300",
  research: "border-electric-400/40 bg-electric-400/10 text-electric-300",
  teaching: "border-gold-400/40 bg-gold-400/10 text-gold-300",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project not found" };
  return {
    title: project.title,
    description: project.intro,
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const thumb = imageUrl(project.thumbnail);
  const categoryLabel = CATEGORY_LABELS[project.category] || project.category;
  const categoryColor =
    CATEGORY_COLORS[project.category] || CATEGORY_COLORS.software;
  const body = project.body ?? [];

  return (
    <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
      <nav className="mb-8 flex items-center gap-2 text-xs text-ink-500">
        <Link href="/" className="transition-colors hover:text-gold-300">
          Home
        </Link>
        <span>/</span>
        <Link href="/projects" className="transition-colors hover:text-gold-300">
          Projects
        </Link>
        <span>/</span>
        <span className="text-ink-400">{project.title}</span>
      </nav>

      <header className="mb-10">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span
            className={`rounded-full border px-3 py-1 text-xs font-medium ${categoryColor}`}
          >
            {categoryLabel}
          </span>
          {project.featured && (
            <span className="rounded-full border border-gold-400/40 bg-gold-400/10 px-3 py-1 text-xs font-medium text-gold-300">
              ★ Featured
            </span>
          )}
        </div>

        <h1 className="mb-4 text-4xl font-bold tracking-tight text-ink-100 sm:text-5xl">
          {project.title}
        </h1>

        {project.intro && (
          <p className="text-lg leading-relaxed text-ink-300">
            {project.intro}
          </p>
        )}
      </header>

      {(project.live_demo_url ||
        project.case_study_url ||
        project.github_url) && (
        <div className="mb-10 flex flex-wrap gap-3">
          {project.live_demo_url && (
            <a
              href={project.live_demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-gold-400 to-gold-500 px-5 py-2.5 text-sm font-semibold text-navy-950 shadow-lg transition-all hover:from-gold-300 hover:to-gold-400 hover:shadow-xl hover:shadow-gold-400/30"
            >
              Live Demo ↗
            </a>
          )}
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-navy-700 bg-navy-900/60 px-5 py-2.5 text-sm font-semibold text-ink-100 transition-all hover:border-gold-400 hover:text-gold-300"
            >
              Source Code ↗
            </a>
          )}
          {project.case_study_url && (
            <a
              href={project.case_study_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-navy-700 bg-navy-900/60 px-5 py-2.5 text-sm font-semibold text-ink-100 transition-all hover:border-electric-400 hover:text-electric-300"
            >
              Case Study ↗
            </a>
          )}
        </div>
      )}

      {thumb && (
        <div className="relative mb-12 aspect-[16/9] overflow-hidden rounded-2xl border border-navy-800">
          <Image
            src={thumb}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, 800px"
            className="object-cover"
            priority
          />
        </div>
      )}

      {project.tech_stack && project.tech_stack.length > 0 && (
        <section className="mb-12 rounded-2xl border border-navy-800 bg-navy-900/40 p-6 backdrop-blur">
          <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-gold-300">
            Tech Stack
          </div>
          <div className="flex flex-wrap gap-2">
            {project.tech_stack.map((tech) => (
              <span
                key={tech.id}
                className="rounded-md border border-navy-700 bg-navy-800/60 px-3 py-1.5 text-sm font-medium text-ink-300"
              >
                {tech.value.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {body.length > 0 && (
        <section className="mb-12">
          <StreamField blocks={body} />
        </section>
      )}

      <footer className="mt-16 rounded-2xl border border-gold-400/20 bg-gradient-to-br from-navy-900/80 to-navy-950 p-8 text-center backdrop-blur sm:p-10">
        <h2 className="mb-3 text-xl font-bold text-ink-100">
          Interested in a similar project?
        </h2>
        <p className="mx-auto mb-6 max-w-lg text-sm text-ink-300">
          I build AI systems, dashboards, and digital tools for individuals and
          institutions.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-gold-400 to-gold-500 px-5 py-2.5 text-sm font-semibold text-navy-950 shadow-lg transition-all hover:from-gold-300 hover:to-gold-400"
          >
            Get in touch
          </Link>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded-lg border border-navy-700 bg-navy-900/60 px-5 py-2.5 text-sm font-semibold text-ink-100 transition-all hover:border-gold-400 hover:text-gold-300"
          >
            ← Back to projects
          </Link>
        </div>
      </footer>
    </article>
  );
}
