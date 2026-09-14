"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Stats = {
  projects: number;
  blogPosts: number;
  lectures: number;
  chats: number;
  flaggedChats: number;
};

type ChatLog = {
  id: number;
  user_message: string;
  page_context: string;
  flagged: boolean;
  created_at: string;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function DashboardOverviewPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentChats, setRecentChats] = useState<ChatLog[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [projectsRes, blogsRes, lecturesRes, chatsRes, flaggedRes] =
          await Promise.all([
            fetch(
              `${API_URL}/api/v2/pages/?type=home.ProjectPage&fields=title`
            ).then((r) => r.json()),
            fetch(
              `${API_URL}/api/v2/pages/?type=home.BlogPage&fields=title`
            ).then((r) => r.json()),
            fetch(
              `${API_URL}/api/v2/pages/?type=home.LecturePage&fields=title`
            ).then((r) => r.json()),
            fetch(`${API_URL}/api/chat-logs/?limit=5`).then((r) => r.json()),
            fetch(`${API_URL}/api/chat-logs/?flagged=true&limit=1`).then((r) =>
              r.json()
            ),
          ]);

        setStats({
          projects: projectsRes.meta?.total_count ?? 0,
          blogPosts: blogsRes.meta?.total_count ?? 0,
          lectures: lecturesRes.meta?.total_count ?? 0,
          chats: chatsRes.total ?? 0,
          flaggedChats: flaggedRes.total ?? 0,
        });

        setRecentChats(chatsRes.items ?? []);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return iso;
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-ink-100">Overview</h1>
        <p className="text-ink-400">
          Quick stats and recent activity across your portfolio.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-5 text-sm text-red-300">
          <div className="mb-1 font-semibold">Could not load data</div>
          <div className="text-xs opacity-80">{error}</div>
          <div className="mt-2 text-xs opacity-70">
            Make sure the backend is running at {API_URL}
          </div>
        </div>
      )}

      {loading && !stats && (
        <div className="mb-6 rounded-xl border border-navy-800 bg-navy-900/40 p-5 text-sm text-ink-400">
          Loading...
        </div>
      )}

      {stats && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            value={stats.projects}
            label="Projects"
            accent="text-gold-400"
            href="/projects"
            external
          />
          <StatCard
            value={stats.blogPosts}
            label="Blog Posts"
            accent="text-electric-400"
            href="/blog"
            external
          />
          <StatCard
            value={stats.lectures}
            label="Lectures"
            accent="text-emerald-400"
            href="/lectures"
            external
          />
          <StatCard
            value={stats.chats}
            label="AI Chats"
            accent="text-gold-400"
            href="/dashboard/chats"
          />
          <StatCard
            value={stats.flaggedChats}
            label="Flagged Chats"
            accent="text-red-400"
            href="/dashboard/chats?filter=flagged"
            warning={stats.flaggedChats > 0}
          />
        </div>
      )}

      <div className="mt-10">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-xl font-bold text-ink-100">Recent AI Chats</h2>
          <Link
            href="/dashboard/chats"
            className="text-sm font-medium text-gold-300 transition-colors hover:text-gold-200"
          >
            View all →
          </Link>
        </div>

        {recentChats.length === 0 ? (
          <div className="rounded-xl border border-dashed border-navy-700 bg-navy-900/40 p-8 text-center text-sm text-ink-400">
            No chats yet.
          </div>
        ) : (
          <div className="space-y-3">
            {recentChats.map((chat) => (
              <Link
                key={chat.id}
                href={`/dashboard/chats?id=${chat.id}`}
                className="group block rounded-xl border border-navy-800 bg-navy-900/40 p-4 backdrop-blur transition-all hover:-translate-y-0.5 hover:border-gold-400/40 hover:bg-navy-900/70"
              >
                <div className="mb-2 flex items-center gap-3">
                  <span className="rounded-md border border-navy-700 bg-navy-800/60 px-2 py-0.5 text-[10px] font-medium text-ink-400">
                    {chat.page_context || "/"}
                  </span>
                  <span className="text-[10px] text-ink-500">
                    {formatDate(chat.created_at)}
                  </span>
                  {chat.flagged && (
                    <span className="rounded-md border border-red-500/40 bg-red-500/10 px-2 py-0.5 text-[10px] font-medium text-red-300">
                      Flagged
                    </span>
                  )}
                </div>
                <div className="line-clamp-1 text-sm text-ink-200 transition-colors group-hover:text-gold-300">
                  {chat.user_message}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  value,
  label,
  accent,
  href,
  external,
  warning,
}: {
  value: number;
  label: string;
  accent: string;
  href: string;
  external?: boolean;
  warning?: boolean;
}) {
  const className = `group block rounded-xl border p-6 backdrop-blur transition-all hover:-translate-y-0.5 ${
    warning
      ? "border-red-500/40 bg-red-500/5 hover:border-red-400"
      : "border-navy-800 bg-navy-900/40 hover:border-gold-400/40 hover:bg-navy-900/70"
  }`;

  const content = (
    <>
      <div className={`text-4xl font-bold ${accent}`}>{value}</div>
      <div className="mt-2 text-sm text-ink-400">{label}</div>
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}
