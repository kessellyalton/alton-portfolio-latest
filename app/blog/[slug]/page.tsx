import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getBlogPostBySlug, imageUrl } from "../../../lib/api";
import StreamField from "../../../components/streamfield";

export const revalidate = 60;

type Props = {
  params: Promise<{ slug: string }>;
};

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return { title: "Post not found" };
  return {
    title: post.title,
    description: post.intro,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const cover = imageUrl(post.cover_image);
  const body = post.body ?? [];

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
      <nav className="mb-8 flex items-center gap-2 text-xs text-ink-500">
        <Link href="/" className="transition-colors hover:text-gold-300">
          Home
        </Link>
        <span>/</span>
        <Link href="/blog" className="transition-colors hover:text-gold-300">
          Blog
        </Link>
        <span>/</span>
        <span className="truncate text-ink-400">{post.title}</span>
      </nav>

      <header className="mb-10">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-gold-400/40 bg-gold-400/10 px-3 py-1 text-xs font-medium text-gold-300">
            {post.category}
          </span>
        </div>

        <h1 className="mb-4 text-4xl font-bold leading-tight tracking-tight text-ink-100 sm:text-5xl">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-3 text-sm text-ink-500">
          <span>{formatDate(post.date)}</span>
          <span>·</span>
          <span>{post.reading_time} min read</span>
          {post.author && (
            <>
              <span>·</span>
              <span>By {post.author}</span>
            </>
          )}
        </div>
      </header>

      {cover && (
        <div className="relative mb-12 aspect-[16/9] overflow-hidden rounded-2xl border border-navy-800">
          <Image
            src={cover}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
            priority
          />
        </div>
      )}

      {post.intro && (
        <p className="mb-8 text-lg leading-relaxed text-ink-200">
          {post.intro}
        </p>
      )}

      {body.length > 0 && (
        <section className="mb-12">
          <StreamField blocks={body} />
        </section>
      )}

      <footer className="mt-16 border-t border-navy-800 pt-8">
        <div className="rounded-2xl border border-gold-400/20 bg-gradient-to-br from-navy-900/80 to-navy-950 p-8 text-center backdrop-blur sm:p-10">
          <h2 className="mb-3 text-xl font-bold text-ink-100">
            Have thoughts or questions?
          </h2>
          <p className="mx-auto mb-6 max-w-lg text-sm text-ink-300">
            I'm always happy to discuss AI, education policy, or building
            things that matter.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-gold-400 to-gold-500 px-5 py-2.5 text-sm font-semibold text-navy-950 shadow-lg transition-all hover:from-gold-300 hover:to-gold-400"
            >
              Get in touch
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-lg border border-navy-700 bg-navy-900/60 px-5 py-2.5 text-sm font-semibold text-ink-100 transition-all hover:border-gold-400 hover:text-gold-300"
            >
              ← All posts
            </Link>
          </div>
        </div>
      </footer>
    </article>
  );
}
