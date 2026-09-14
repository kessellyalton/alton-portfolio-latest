/**
 * Dynamic knowledge base for the AI chatbot.
 *
 * Fetches live content from the Wagtail backend (projects, blog posts,
 * lectures) and formats it as markdown to inject into the system prompt.
 *
 * Cached in-memory for 5 minutes to avoid hammering the API on every chat.
 *
 * Approach: "Context Stuffing" — all content goes into the prompt. This works
 * beautifully for portfolios (up to ~50k tokens) and avoids the complexity of
 * embeddings + vector search. If content grows past that, migrate to true RAG.
 */

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

type CacheEntry = { content: string; timestamp: number };
let cache: CacheEntry | null = null;

// ─── Types (only the fields we need) ─────────────

type ProjectPage = {
  id: number;
  title: string;
  intro: string;
  category: string;
  tech_stack: Array<{ value: { name: string } }>;
  live_demo_url: string;
  github_url: string;
};

type BlogPage = {
  id: number;
  title: string;
  intro: string;
  date: string;
  category: string;
  reading_time: number;
};

type LecturePage = {
  id: number;
  title: string;
  intro: string;
  level: string;
  duration: string;
  lesson_count: number;
};

type PagesResponse<T> = { items: T[] };

// ─── Fetch helpers ───────────────────────────────

async function fetchJSON<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Knowledge base fetch failed: ${res.status} ${path}`);
  }
  return res.json();
}

async function fetchProjects(): Promise<ProjectPage[]> {
  const data = await fetchJSON<PagesResponse<ProjectPage>>(
    "/api/v2/pages/?type=home.ProjectPage&fields=intro,category,tech_stack,live_demo_url,github_url"
  );
  return data.items ?? [];
}

async function fetchBlogPosts(): Promise<BlogPage[]> {
  const data = await fetchJSON<PagesResponse<BlogPage>>(
    "/api/v2/pages/?type=home.BlogPage&fields=intro,date,category,reading_time"
  );
  return data.items ?? [];
}

async function fetchLectures(): Promise<LecturePage[]> {
  const data = await fetchJSON<PagesResponse<LecturePage>>(
    "/api/v2/pages/?type=home.LecturePage&fields=intro,level,duration,lesson_count"
  );
  return data.items ?? [];
}

// ─── Formatting ──────────────────────────────────

const CATEGORY_LABELS: Record<string, string> = {
  ai_ml: "AI & Machine Learning",
  dashboard: "Data & Dashboards",
  software: "Software Engineering",
  education: "Education & Policy",
  research: "Research & Analysis",
  teaching: "Teaching & Tutorials",
};

function formatProjects(projects: ProjectPage[]): string {
  if (projects.length === 0) {
    return "### Projects\nNo projects published yet.";
  }
  const lines = ["### Published Projects"];
  for (const p of projects) {
    const tech =
      p.tech_stack
        ?.map((t) => t.value?.name)
        .filter(Boolean)
        .join(", ") || "";
    const category = CATEGORY_LABELS[p.category] || p.category;
    lines.push(`- **${p.title}** — ${category}`);
    if (p.intro) lines.push(`  Summary: ${p.intro}`);
    if (tech) lines.push(`  Tech stack: ${tech}`);
    if (p.live_demo_url) lines.push(`  Live demo: ${p.live_demo_url}`);
    if (p.github_url) lines.push(`  Source code: ${p.github_url}`);
  }
  return lines.join("\n");
}

function formatBlogPosts(posts: BlogPage[]): string {
  if (posts.length === 0) {
    return "### Blog Posts\nNo blog posts published yet.";
  }
  const lines = ["### Published Blog Posts"];
  for (const post of posts) {
    const date = post.date ? ` (${post.date})` : "";
    lines.push(`- **${post.title}**${date}`);
    if (post.intro) lines.push(`  Summary: ${post.intro}`);
    if (post.reading_time) {
      lines.push(`  Reading time: ${post.reading_time} min`);
    }
  }
  return lines.join("\n");
}

function formatLectures(lectures: LecturePage[]): string {
  if (lectures.length === 0) {
    return "### Lectures & Courses\nNo lectures published yet.";
  }
  const lines = ["### Published Lectures & Courses"];
  for (const l of lectures) {
    const meta = [
      l.level ? `Level: ${l.level}` : null,
      l.duration ? `Duration: ${l.duration}` : null,
      l.lesson_count ? `${l.lesson_count} lessons` : null,
    ]
      .filter(Boolean)
      .join(" · ");
    lines.push(`- **${l.title}**${meta ? ` — ${meta}` : ""}`);
    if (l.intro) lines.push(`  Summary: ${l.intro}`);
  }
  return lines.join("\n");
}

// ─── Public API ──────────────────────────────────

export async function buildKnowledgeBase(): Promise<string> {
  const now = Date.now();
  if (cache && now - cache.timestamp < CACHE_TTL_MS) {
    return cache.content;
  }

  try {
    const [projects, posts, lectures] = await Promise.all([
      fetchProjects().catch(() => []),
      fetchBlogPosts().catch(() => []),
      fetchLectures().catch(() => []),
    ]);

    const sections = [
      "## Portfolio Content (Live from CMS)",
      "The following information is pulled live from Alton's portfolio content management system. Use it when the visitor asks about specific projects, blog posts, or lectures. If a section is empty, that category has no published items yet.",
      formatProjects(projects),
      formatBlogPosts(posts),
      formatLectures(lectures),
    ];

    const content = sections.join("\n\n");
    cache = { content, timestamp: now };
    return content;
  } catch (err) {
    console.error("[knowledge-base] Failed to build:", err);
    return "";
  }
}

export function clearKnowledgeBaseCache() {
  cache = null;
}
