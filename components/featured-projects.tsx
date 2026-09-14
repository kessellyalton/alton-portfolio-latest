import Image from "next/image";
import Link from "next/link";

import { getFeaturedProjects, imageUrl } from "../lib/api";

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

export default async function FeaturedProjects() {
  let projects;
  try {
    projects = await getFeaturedProjects();
  } catch {
    return null;
  }

  // If no featured projects, hide the section entirely
  if (!projects || projects.length === 0) {
    return null;
  }

  // Show at most 3 on the homepage
  const shown = projects.slice(0, 3);

  return (
    <section className="relative border-t border-navy-800/60 bg-navy-950">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        {/* Section header */}
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <div className="mb-4 inline-block rounded-full border border-gold-400/40 bg-gold-400/10 px-4 py-1.5 text-sm font-medium text-gold-300">
              Selected Work
            </div>
            <h2 className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl">
              A few things I&apos;ve{" "}
              <span className="bg-gradient-to-r from-gold-400 via-gold-300 to-electric-400 bg-clip-text text-transparent">
                built
              </span>
            </h2>
            <p className="text-base leading-relaxed text-ink-400 sm:text-lg">
              Real projects solving real problems — in AI, data, software
              engineering, and education.
            </p>
          </div>

          <Link
            href="/projects"
            className="hidden items-center gap-2 rounded-lg border border-navy-700 bg-navy-900/60 px-5 py-2.5 text-sm font-semibold text-ink-100 transition-all hover:border-gold-400 hover:text-gold-300 sm:inline-flex"
          >
            View all projects →
          </Link>
        </div>

        {/* Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {shown.map((project) => {
            const thumb = imageUrl(project.thumbnail);
            const categoryLabel =
              CATEGORY_LABELS[project.category] || project.category;
            const categoryColor =
              CATEGORY_COLORS[project.category] || CATEGORY_COLORS.software;

            return (
              <Link
                key={project.id}
                href={`/projects/${project.meta.slug}`}
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
                      {project.tech_stack.slice(0, 4).map((tech) => (
                        <span
                          key={tech.id}
                          className="rounded-md border border-navy-700 bg-navy-800/60 px-2 py-0.5 text-xs font-medium text-ink-400"
                        >
                          {tech.value.name}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center border-t border-navy-800 pt-4 text-sm">
                    <span className="font-medium text-electric-300 transition-colors group-hover:text-electric-200">
                      View details →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Mobile "View all" link */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded-lg border border-navy-700 bg-navy-900/60 px-5 py-2.5 text-sm font-semibold text-ink-100 transition-all hover:border-gold-400 hover:text-gold-300"
          >
            View all projects →
          </Link>
        </div>
      </div>
    </section>
  );
}
