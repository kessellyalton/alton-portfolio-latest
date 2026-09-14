import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import {
  getProjects,
  imageUrl,
  type ProjectPage,
} from "@/lib/api";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Selected work in AI, machine learning, data dashboards, software engineering, and education.",
};

export const revalidate = 60;

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

export default async function ProjectsPage() {
  let projects: ProjectPage[] = [];
  let error: string | null = null;

  try {
    projects = await getProjects();
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load projects";
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mb-16 max-w-3xl">
        <div className="mb-4 inline-block rounded-full border border-gold-400/40 bg-gold-400/10 px-4 py-1.5 text-sm font-medium text-gold-300">
          Portfolio
        </div>
        <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">
          Selected{" "}
          <span className="bg-gradient-to-r from-gold-400 via-gold-300 to-electric-400 bg-clip-text text-transparent">
            work
          </span>
        </h1>
        <p className="text-lg leading-relaxed text-ink-300">
          A curated selection of projects in AI, data, software engineering,
          and education — each solving a real problem.
        </p>
      </div>

      {error && (
        <div className="mb-8 rounded-xl border border-red-500/30 bg-red-500/10 p-5 text-sm text-red-300">
          <div className="mb-1 font-semibold">Could not load projects</div>
          <div className="text-xs opacity-80">{error}</div>
          <div className="mt-2 text-xs opacity-70">
            Make sure the backend is running at http://127.0.0.1:8000
          </div>
        </div>
      )}

      {!error && projects.length === 0 && (
        <div className="rounded-2xl border border-dashed border-navy-700 bg-navy-900/40 p-12 text-center backdrop-blur">
          <div className="mb-4 text-5xl">📁</div>
          <h2 className="mb-2 text-xl font-semibold text-ink-100">
            No projects yet
          </h2>
          <p className="mx-auto max-w-md text-sm text-ink-400">
            Projects will appear here as they are created in the Wagtail admin.
            Log in at{" "}
            <a
              href="http://127.0.0.1:8000/admin/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-300 underline hover:text-gold-200"
            >
              the admin panel
            </a>{" "}
            to add your first project.
          </p>
        </div>
      )}

      {projects.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const thumb = imageUrl(project.thumbnail);
            const categoryLabel =
              CATEGORY_LABELS[project.category] || project.category;
            const categoryColor =
              CATEGORY_COLORS[project.category] || CATEGORY_COLORS.software;

            return (
              <article
                key={project.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-navy-800 bg-navy-900/40 backdrop-blur transition-all hover:-translate-y-1 hover:border-gold-400/40 hover:bg-navy-900/70"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-navy-950">
                  {thumb ? (
                    <Image
                      src={thumb}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-6xl opacity-30">
                      🎨
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-medium backdrop-blur ${categoryColor}`}
                    >
                      {categoryLabel}
                    </span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <h3 className="mb-2 text-lg font-semibold text-ink-100 transition-colors group-hover:text-gold-300">
                    {project.title}
                  </h3>
                  <p className="mb-4 flex-1 text-sm leading-relaxed text-ink-400">
                    {project.intro}
                  </p>

                  {project.tech_stack && project.tech_stack.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-1.5">
                      {project.tech_stack.slice(0, 5).map((tech) => (
                        <span
                          key={tech.id}
                          className="rounded-md border border-navy-700 bg-navy-800/60 px-2 py-0.5 text-xs font-medium text-ink-400"
                        >
                          {tech.value.name}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-3 border-t border-navy-800 pt-4 text-sm">
                    {project.live_demo_url && (
                      <a
                        href={project.live_demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-gold-300 transition-colors hover:text-gold-200"
                      >
                        Live demo →
                      </a>
                    )}
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-ink-400 transition-colors hover:text-ink-200"
                      >
                        Code
                      </a>
                    )}
                    <Link
                      href={`/projects/${project.meta.slug}`}
                      className="ml-auto font-medium text-electric-300 transition-colors hover:text-electric-200"
                    >
                      Details →
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
