import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { getBlogPosts, imageUrl, type BlogPage } from "@/lib/api";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Insights and articles on AI, machine learning, data analysis, education policy, and software engineering.",
};

export const revalidate = 60;

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

export default async function BlogPage() {
  let posts: BlogPage[] = [];
  let error: string | null = null;

  try {
    posts = await getBlogPosts();
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load blog posts";
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mb-16 max-w-3xl">
        <div className="mb-4 inline-block rounded-full border border-gold-400/40 bg-gold-400/10 px-4 py-1.5 text-sm font-medium text-gold-300">
          Blog
        </div>
        <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">
          Insights &{" "}
          <span className="bg-gradient-to-r from-gold-400 via-gold-300 to-electric-400 bg-clip-text text-transparent">
            writing
          </span>
        </h1>
        <p className="text-lg leading-relaxed text-ink-300">
          Thoughts on AI, education policy, data science, and building
          software that matters.
        </p>
      </div>

      {error && (
        <div className="mb-8 rounded-xl border border-red-500/30 bg-red-500/10 p-5 text-sm text-red-300">
          <div className="mb-1 font-semibold">Could not load blog posts</div>
          <div className="text-xs opacity-80">{error}</div>
          <div className="mt-2 text-xs opacity-70">
            Make sure the backend is running at http://127.0.0.1:8000
          </div>
        </div>
      )}

      {!error && posts.length === 0 && (
        <div className="rounded-2xl border border-dashed border-navy-700 bg-navy-900/40 p-12 text-center backdrop-blur">
          <div className="mb-4 text-5xl">✍️</div>
          <h2 className="mb-2 text-xl font-semibold text-ink-100">
            No posts yet
          </h2>
          <p className="mx-auto max-w-md text-sm text-ink-400">
            Blog posts will appear here as they are created in the Wagtail
            admin.
          </p>
        </div>
      )}

      {posts.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => {
            const cover = imageUrl(post.cover_image);

            return (
              <article
                key={post.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-navy-800 bg-navy-900/40 backdrop-blur transition-all hover:-translate-y-1 hover:border-gold-400/40 hover:bg-navy-900/70"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-navy-950">
                  {cover ? (
                    <Image
                      src={cover}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-6xl opacity-30">
                      📝
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="rounded-full border border-gold-400/40 bg-gold-400/10 px-3 py-1 text-xs font-medium text-gold-300 backdrop-blur">
                      {post.category}
                    </span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-3 flex items-center gap-3 text-xs text-ink-500">
                    <span>{formatDate(post.date)}</span>
                    <span>•</span>
                    <span>{post.reading_time} min read</span>
                  </div>

                  <h3 className="mb-2 text-lg font-semibold text-ink-100 transition-colors group-hover:text-gold-300">
                    {post.title}
                  </h3>

                  <p className="mb-4 flex-1 text-sm leading-relaxed text-ink-400">
                    {post.intro}
                  </p>

                  <div className="flex items-center border-t border-navy-800 pt-4 text-sm">
                    <span className="text-xs text-ink-500">
                      By {post.author}
                    </span>
                    <Link
                      href={`/blog/${post.meta.slug}`}
                      className="ml-auto font-medium text-electric-300 transition-colors hover:text-electric-200"
                    >
                      Read →
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
