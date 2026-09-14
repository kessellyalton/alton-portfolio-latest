import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { getLectures, imageUrl, type LecturePage } from "../../lib/api";

export const metadata: Metadata = {
  title: "Lectures",
  description:
    "Online courses and tutorials in AI, machine learning, mathematics, and physics.",
};

export const revalidate = 60;

const LEVEL_COLORS: Record<string, string> = {
  beginner: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
  intermediate: "border-electric-400/40 bg-electric-400/10 text-electric-300",
  advanced: "border-gold-400/40 bg-gold-400/10 text-gold-300",
};

const LEVEL_LABELS: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export default async function LecturesPage() {
  let lectures: LecturePage[] = [];
  let error: string | null = null;

  try {
    lectures = await getLectures();
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load lectures";
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mb-16 max-w-3xl">
        <div className="mb-4 inline-block rounded-full border border-gold-400/40 bg-gold-400/10 px-4 py-1.5 text-sm font-medium text-gold-300">
          Lectures & Courses
        </div>
        <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">
          Learn with{" "}
          <span className="bg-gradient-to-r from-gold-400 via-gold-300 to-electric-400 bg-clip-text text-transparent">
            me
          </span>
        </h1>
        <p className="text-lg leading-relaxed text-ink-300">
          Video lectures, tutorials, and courses in AI, machine learning,
          mathematics, and physics — from fundamentals to advanced topics.
        </p>
      </div>

      {error && (
        <div className="mb-8 rounded-xl border border-red-500/30 bg-red-500/10 p-5 text-sm text-red-300">
          <div className="mb-1 font-semibold">Could not load lectures</div>
          <div className="text-xs opacity-80">{error}</div>
          <div className="mt-2 text-xs opacity-70">
            Make sure the backend is running at http://127.0.0.1:8000
          </div>
        </div>
      )}

      {!error && lectures.length === 0 && (
        <div className="rounded-2xl border border-dashed border-navy-700 bg-navy-900/40 p-12 text-center backdrop-blur">
          <div className="mb-4 text-5xl">🎥</div>
          <h2 className="mb-2 text-xl font-semibold text-ink-100">
            No lectures yet
          </h2>
          <p className="mx-auto max-w-md text-sm text-ink-400">
            Lectures will appear here as they are created in the Wagtail admin.
          </p>
        </div>
      )}

      {lectures.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {lectures.map((lecture) => {
            const cover = imageUrl(lecture.cover_image);
            const levelLabel =
              LEVEL_LABELS[lecture.level] || lecture.level;
            const levelColor =
              LEVEL_COLORS[lecture.level] || LEVEL_COLORS.beginner;

            return (
              <article
                key={lecture.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-navy-800 bg-navy-900/40 backdrop-blur transition-all hover:-translate-y-1 hover:border-gold-400/40 hover:bg-navy-900/70"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-navy-950">
                  {cover ? (
                    <Image
                      src={cover}
                      alt={lecture.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-6xl opacity-30">
                      🎬
                    </div>
                  )}

                  {/* Play overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-navy-950/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold-400 text-navy-950 shadow-2xl">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>

                  <div className="absolute top-3 left-3">
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-medium backdrop-blur ${levelColor}`}
                    >
                      {levelLabel}
                    </span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-3 flex items-center gap-3 text-xs text-ink-500">
                    <span>⏱ {lecture.duration}</span>
                    <span>•</span>
                    <span>{lecture.lesson_count} lessons</span>
                  </div>

                  <h3 className="mb-2 text-lg font-semibold text-ink-100 transition-colors group-hover:text-gold-300">
                    {lecture.title}
                  </h3>

                  <p className="mb-4 flex-1 text-sm leading-relaxed text-ink-400">
                    {lecture.intro}
                  </p>

                  <div className="flex items-center gap-3 border-t border-navy-800 pt-4 text-sm">
                    <Link
                      href={`/lectures/${lecture.meta.slug}`}
                      className="font-medium text-gold-300 transition-colors hover:text-gold-200"
                    >
                      Start learning →
                    </Link>
                    {lecture.syllabus_url && (
                      <a
                        href={lecture.syllabus_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-auto font-medium text-ink-400 transition-colors hover:text-ink-200"
                      >
                        Syllabus
                      </a>
                    )}
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
