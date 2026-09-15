/**
 * API client for the Wagtail backend.
 *
 * All frontend fetches go through these functions so we have a single
 * place to change URLs, add auth headers, or swap backends.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

// ─── Types ──────────────────────────────────────────

export type WagtailImage = {
  id: number;
  meta: {
    download_url: string;
  };
  title: string;
};

export type WagtailDocument = {
  id: number;
  meta: {
    download_url: string;
    type: string;
  };
  title: string;
};

export type WagtailPage = {
  id: number;
  meta: {
    type: string;
    detail_url: string;
    html_url: string;
    slug: string;
    first_published_at: string;
  };
  title: string;
};

export type StreamFieldBlock = {
  type: string;
  value: unknown;
  id: string;
};

export type ResourceBlock = {
  type: "document" | "link";
  id: string;
  value:
    | {
        title: string;
        description?: string;
        document: WagtailDocument | null;
      }
    | {
        title: string;
        description?: string;
        url: string;
      };
};

export type ProjectPage = WagtailPage & {
  intro: string;
  category: string;
  featured: boolean;
  live_demo_url: string;
  case_study_url: string;
  github_url: string;
  thumbnail: WagtailImage | null;
  tech_stack: Array<{
    type: string;
    value: { name: string; icon?: string };
    id: string;
  }>;
  body: StreamFieldBlock[];
};

export type BlogPage = WagtailPage & {
  date: string;
  intro: string;
  author: string;
  reading_time: number;
  category: string;
  cover_image: WagtailImage | null;
  body: StreamFieldBlock[];
};

export type LecturePage = WagtailPage & {
  intro: string;
  level: string;
  duration: string;
  lesson_count: number;
  featured: boolean;
  cover_image: WagtailImage | null;
  video_url: string;
  syllabus_url: string;
  resources: ResourceBlock[];
  body: StreamFieldBlock[];
};

export type PagesResponse<T> = {
  meta: { total_count: number };
  items: T[];
};

// ─── Fetch helpers ─────────────────────────────────

async function fetchJSON<T>(path: string): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, { next: { revalidate: 60 } });

  if (!res.ok) {
    throw new Error(
      `API request failed: ${res.status} ${res.statusText} — ${url}`
    );
  }

  return res.json();
}

// ─── List endpoints ────────────────────────────────

export async function getProjects(): Promise<ProjectPage[]> {
  const data = await fetchJSON<PagesResponse<ProjectPage>>(
    "/api/v2/pages/?type=home.ProjectPage&fields=intro,category,featured,live_demo_url,case_study_url,github_url,thumbnail,tech_stack"
  );
  return data.items;
}

export async function getFeaturedProjects(): Promise<ProjectPage[]> {
  const projects = await getProjects();
  return projects.filter((p) => p.featured);
}

export async function getBlogPosts(): Promise<BlogPage[]> {
  const data = await fetchJSON<PagesResponse<BlogPage>>(
    "/api/v2/pages/?type=home.BlogPage&fields=date,intro,author,reading_time,category,cover_image"
  );
  return data.items;
}

export async function getLectures(): Promise<LecturePage[]> {
  const data = await fetchJSON<PagesResponse<LecturePage>>(
    "/api/v2/pages/?type=home.LecturePage&fields=intro,level,duration,lesson_count,featured,cover_image,video_url,syllabus_url"
  );
  return data.items;
}

// ─── Detail endpoints (by slug) ────────────────────

export async function getProjectBySlug(
  slug: string
): Promise<ProjectPage | null> {
  try {
    const data = await fetchJSON<PagesResponse<ProjectPage>>(
      `/api/v2/pages/?type=home.ProjectPage&slug=${encodeURIComponent(
        slug
      )}&fields=intro,category,featured,live_demo_url,case_study_url,github_url,thumbnail,tech_stack,body`
    );
    return data.items?.[0] ?? null;
  } catch {
    return null;
  }
}

export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPage | null> {
  try {
    const data = await fetchJSON<PagesResponse<BlogPage>>(
      `/api/v2/pages/?type=home.BlogPage&slug=${encodeURIComponent(
        slug
      )}&fields=date,intro,author,reading_time,category,cover_image,body`
    );
    return data.items?.[0] ?? null;
  } catch {
    return null;
  }
}

export async function getLectureBySlug(
  slug: string
): Promise<LecturePage | null> {
  try {
    const data = await fetchJSON<PagesResponse<LecturePage>>(
      `/api/v2/pages/?type=home.LecturePage&slug=${encodeURIComponent(
        slug
      )}&fields=intro,level,duration,lesson_count,featured,cover_image,video_url,syllabus_url,resources,body`
    );
    const lecture = data.items?.[0];
    if (!lecture) return null;
    return await resolveLectureResources(lecture);
  } catch {
    return null;
  }
}

// ─── Document resolution ───────────────────────────
//
// Wagtail's DocumentChooserBlock serializes to just the document's numeric
// ID, not a full object. To render downloads, we need to fetch each document
// separately via /api/v2/documents/<id>/ and swap it in.

async function fetchDocument(id: number): Promise<WagtailDocument | null> {
  try {
    return await fetchJSON<WagtailDocument>(`/api/v2/documents/${id}/`);
  } catch {
    return null;
  }
}

async function resolveLectureResources(
  lecture: LecturePage
): Promise<LecturePage> {
  if (!lecture.resources || lecture.resources.length === 0) {
    return lecture;
  }

  const resolved = await Promise.all(
    lecture.resources.map(async (resource): Promise<ResourceBlock> => {
      if (resource.type !== "document") return resource;

      const value = resource.value as {
        title: string;
        description?: string;
        document: unknown;
      };
      const docField = value.document;

      if (
        docField &&
        typeof docField === "object" &&
        "meta" in docField &&
        (docField as WagtailDocument).meta?.download_url
      ) {
        return resource;
      }

      if (typeof docField === "number") {
        const doc = await fetchDocument(docField);
        return {
          ...resource,
          value: { ...value, document: doc },
        } as ResourceBlock;
      }

      return resource;
    })
  );

  return { ...lecture, resources: resolved };
}

// ─── Utilities ─────────────────────────────────────

/**
 * Resolve a Wagtail media URL to an absolute URL using our API base.
 *
 * Wagtail sometimes returns URLs using the Site's hostname — which can lack
 * the correct port (e.g., "http://localhost/documents/..." without ":8000").
 * This function rewrites the origin to point at our actual API base.
 */
function resolveMediaUrl(path: string): string {
  if (!path) return "";

  if (path.startsWith("http")) {
    try {
      const parsed = new URL(path);
      return `${API_BASE}${parsed.pathname}${parsed.search}`;
    } catch {
      return path;
    }
  }

  return `${API_BASE}${path}`;
}

export function imageUrl(image: WagtailImage | null): string | null {
  if (!image) return null;
  const url = resolveMediaUrl(image.meta.download_url);
  return url || null;
}


// ─── RAG Chat Context (hybrid retrieval) ───────────

/**
 * Response shape from Django's /api/chat/context/ endpoint.
 * Retrieval-only — no LLM call.
 */
export type RAGChunk = {
  title: string;
  type: string;
  url: string;
  score: number | null;
};

export type RAGContext = {
  context: string;
  chunks: RAGChunk[];
};

/**
 * Fetch semantic retrieval context from the Django RAG endpoint.
 *
 * The Next.js chat route calls this before streaming from Groq.
 * Returns the top-k relevant portfolio chunks as a formatted
 * markdown context string plus a structured chunk list.
 *
 * On any error, returns an empty context so the chat can still
 * work (falls back to no-RAG mode).
 */
export async function getRAGContext(
  query: string,
  topK: number = 3
): Promise<RAGContext> {
  const empty: RAGContext = { context: "", chunks: [] };

  if (!query.trim()) return empty;

  try {
    const url = `${API_BASE}/api/chat/context/?q=${encodeURIComponent(
      query
    )}&k=${topK}`;

    const res = await fetch(url, {
      // No cache — the query is unique per message
      cache: "no-store",
      // Short timeout so a slow Django doesn't block the LLM stream
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      console.warn(`[getRAGContext] Django returned ${res.status}`);
      return empty;
    }

    const data = (await res.json()) as Partial<RAGContext>;
    return {
      context: data.context ?? "",
      chunks: data.chunks ?? [],
    };
  } catch (err) {
    console.warn("[getRAGContext] Failed:", err);
    return empty;
  }
}
