import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getLectureBySlug, imageUrl } from "../../../lib/api";
import StreamField from "../../../components/streamfield";
import ResourceList from "../../../components/resource-list";

export const revalidate = 60;

type Props = {
  params: Promise<{ slug: string }>;
};

const LEVEL_LABELS: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

const LEVEL_COLORS: Record<string, string> = {
  beginner: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
  intermediate: "border-electric-400/40 bg-electric-400/10 text-electric-300",
  advanced: "border-gold-400/40 bg-gold-400/10 text-gold-300",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const lecture = await getLectureBySlug(slug);
  if (!lecture) return { title: "Lecture not found" };
  return {
    title: lecture.title,
    description: lecture.intro,
  };
}

export default async function LectureDetailPage({ params }: Props) {
  const { slug } = await params;
  const lecture = await getLectureBySlug(slug);

  if (!lecture) {
    notFound();
  }

  const cover = imageUrl(lecture.cover_image);
  const body = lecture.body ?? [];
  const resources = lecture.resources ?? [];
  const levelLabel = LEVEL_LABELS[lecture.level] || lecture.level;
  const levelColor = LEVEL_COLORS[lecture.level] || LEVEL_COLORS.beginner;

  return (
    <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
      <nav className="mb-8 flex items-center gap-2 text-xs text-ink-500">
        <Link href="/" className="transition-colors hover:text-gold-300">
          Home
        </Link>
        <span>/</span>
        <Link href="/lectures" className="transition-colors hover:text-gold-300">
          Lectures
        </Link>
        <span>/</span>
        <span className="truncate text-ink-400">{lecture.title}</span>
      </nav>

      <header className="mb-10">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span
            className={`rounded-full border px-3 py-1 text-xs font-medium ${levelColor}`}
          >
            {levelLabel}
          </span>
          {lecture.featured && (
            <span className="rounded-full border border-gold-400/40 bg-gold-400/10 px-3 py-1 text-xs font-medium text-gold-300">
              ★ Featured
            </span>
          )}
        </div>

        <h1 className="mb-4 text-4xl font-bold leading-tight tracking-tight text-ink-100 sm:text-5xl">
          {lecture.title}
        </h1>

        {lecture.intro && (
          <p className="text-lg leading-relaxed text-ink-300">
            {lecture.intro}
          </p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-ink-500">
          {lecture.duration && <span>⏱ {lecture.duration}</span>}
          {lecture.lesson_count > 0 && (
            <span>{lecture.lesson_count} lessons</span>
          )}
        </div>
      </header>

      {(lecture.video_url || lecture.syllabus_url) && (
        <div className="mb-10 flex flex-wrap gap-3">
          {lecture.video_url && (
            <a
              href={lecture.video_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-gold-400 to-gold-500 px-5 py-2.5 text-sm font-semibold text-navy-950 shadow-lg transition-all hover:from-gold-300 hover:to-gold-400 hover:shadow-xl hover:shadow-gold-400/30"
            >
              ▶ Watch Video ↗
            </a>
          )}
          {lecture.syllabus_url && (
            <a
              href={lecture.syllabus_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-navy-700 bg-navy-900/60 px-5 py-2.5 text-sm font-semibold text-ink-100 transition-all hover:border-gold-400 hover:text-gold-300"
            >
              Download Syllabus ↗
            </a>
          )}
        </div>
      )}

      {cover && (
        <div className="relative mb-12 aspect-[16/9] overflow-hidden rounded-2xl border border-navy-800">
          <Image
            src={cover}
            alt={lecture.title}
            fill
            sizes="(max-width: 768px) 100vw, 800px"
            className="object-cover"
            priority
          />
        </div>
      )}

      {body.length > 0 && (
        <section className="mb-12">
          <StreamField blocks={body} />
        </section>
      )}

      {resources.length > 0 && (
        <div className="mb-12">
          <ResourceList resources={resources} />
        </div>
      )}

      <footer className="mt-16 rounded-2xl border border-gold-400/20 bg-gradient-to-br from-navy-900/80 to-navy-950 p-8 text-center backdrop-blur sm:p-10">
        <h2 className="mb-3 text-xl font-bold text-ink-100">
          Ready to start learning?
        </h2>
        <p className="mx-auto mb-6 max-w-lg text-sm text-ink-300">
          Get in touch to enroll or ask about custom tutoring sessions.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-gold-400 to-gold-500 px-5 py-2.5 text-sm font-semibold text-navy-950 shadow-lg transition-all hover:from-gold-300 hover:to-gold-400"
          >
            Get in touch
          </Link>
          <Link
            href="/lectures"
            className="inline-flex items-center gap-2 rounded-lg border border-navy-700 bg-navy-900/60 px-5 py-2.5 text-sm font-semibold text-ink-100 transition-all hover:border-gold-400 hover:text-gold-300"
          >
            ← All lectures
          </Link>
        </div>
      </footer>
    </article>
  );
}
