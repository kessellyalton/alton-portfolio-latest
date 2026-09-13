import type { ResourceBlock, WagtailDocument } from "@/lib/api";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

// ─── File type detection ────────────────────────

type FileKind = {
  label: string;
  icon: string;
  color: string;
};

const KIND_MAP: Record<string, FileKind> = {
  pdf: {
    label: "PDF",
    icon: "📄",
    color: "border-red-500/40 bg-red-500/10 text-red-300",
  },
  doc: {
    label: "DOC",
    icon: "📝",
    color: "border-electric-400/40 bg-electric-400/10 text-electric-300",
  },
  docx: {
    label: "DOCX",
    icon: "📝",
    color: "border-electric-400/40 bg-electric-400/10 text-electric-300",
  },
  xls: {
    label: "XLS",
    icon: "📊",
    color: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
  },
  xlsx: {
    label: "XLSX",
    icon: "📊",
    color: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
  },
  csv: {
    label: "CSV",
    icon: "📊",
    color: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
  },
  ppt: {
    label: "PPT",
    icon: "🎯",
    color: "border-gold-400/40 bg-gold-400/10 text-gold-300",
  },
  pptx: {
    label: "PPTX",
    icon: "🎯",
    color: "border-gold-400/40 bg-gold-400/10 text-gold-300",
  },
  key: {
    label: "KEY",
    icon: "🎯",
    color: "border-gold-400/40 bg-gold-400/10 text-gold-300",
  },
  odt: {
    label: "ODT",
    icon: "📝",
    color: "border-electric-400/40 bg-electric-400/10 text-electric-300",
  },
  ods: {
    label: "ODS",
    icon: "📊",
    color: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
  },
  odp: {
    label: "ODP",
    icon: "🎯",
    color: "border-gold-400/40 bg-gold-400/10 text-gold-300",
  },
  numbers: {
    label: "NUMBERS",
    icon: "📊",
    color: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
  },
  pages: {
    label: "PAGES",
    icon: "📝",
    color: "border-electric-400/40 bg-electric-400/10 text-electric-300",
  },
  zip: {
    label: "ZIP",
    icon: "🗜️",
    color: "border-ink-500/40 bg-ink-500/10 text-ink-300",
  },
  default: {
    label: "FILE",
    icon: "📎",
    color: "border-navy-700 bg-navy-800/60 text-ink-400",
  },
};

function getFileKind(document: WagtailDocument | null | undefined): FileKind {
  const path = document?.meta?.download_url;
  if (!path) return KIND_MAP.default;
  const filename = path.split("/").pop() || "";
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  return KIND_MAP[ext] || KIND_MAP.default;
}

function docUrl(
  document: WagtailDocument | null | undefined,
  download = false
): string | null {
  const path = document?.meta?.download_url;
  if (!path) return null;

  let url: string;
  if (path.startsWith("http")) {
    try {
      const parsed = new URL(path);
      url = `${API_URL}${parsed.pathname}${parsed.search}`;
    } catch {
      url = path;
    }
  } else {
    url = `${API_URL}${path}`;
  }

  return download ? `${url}?download=true` : url;
}

// ─── Component ──────────────────────────────────

export default function ResourceList({
  resources,
}: {
  resources: ResourceBlock[];
}) {
  if (!Array.isArray(resources) || resources.length === 0) {
    return null;
  }

  return (
    <section className="rounded-2xl border border-navy-800 bg-navy-900/40 p-6 backdrop-blur sm:p-8">
      <div className="mb-6">
        <h2 className="mb-1 text-xl font-bold text-ink-100">
          📚 Downloads &amp; Resources
        </h2>
        <p className="text-sm text-ink-400">
          Files, slides, spreadsheets, and links to accompany this lecture.
        </p>
      </div>

      <div className="space-y-3">
        {resources.map((resource) => (
          <ResourceRow key={resource.id} resource={resource} />
        ))}
      </div>
    </section>
  );
}

function ResourceRow({ resource }: { resource: ResourceBlock }) {
  // External link
  if (resource.type === "link") {
    const { title, description, url } = resource.value as {
      title: string;
      description?: string;
      url: string;
    };
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-start gap-4 rounded-xl border border-navy-800 bg-navy-950/60 p-4 transition-all hover:-translate-y-0.5 hover:border-electric-400/60 hover:bg-navy-900/80"
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-electric-400/40 bg-electric-400/10 text-lg">
          🔗
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <span className="font-medium text-ink-100 transition-colors group-hover:text-electric-300">
              {title}
            </span>
            <span className="rounded-md border border-electric-400/40 bg-electric-400/10 px-1.5 py-0.5 text-[10px] font-medium text-electric-300">
              LINK
            </span>
          </div>
          {description && (
            <p className="text-sm leading-relaxed text-ink-400">
              {description}
            </p>
          )}
        </div>
        <div className="self-center text-electric-300 opacity-0 transition-opacity group-hover:opacity-100">
          ↗
        </div>
      </a>
    );
  }

  // Document
  const { title, description, document } = resource.value as {
    title: string;
    description?: string;
    document: WagtailDocument | null;
  };
  const kind = getFileKind(document);
  const viewUrl = docUrl(document, false);
  const downloadUrl = docUrl(document, true);

  return (
    <div className="flex items-start gap-4 rounded-xl border border-navy-800 bg-navy-950/60 p-4 transition-all hover:border-gold-400/40 hover:bg-navy-900/80">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-navy-700 bg-navy-900/60 text-lg">
        {kind.icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2">
          <span className="font-medium text-ink-100">{title}</span>
          <span
            className={`rounded-md border px-1.5 py-0.5 text-[10px] font-medium ${kind.color}`}
          >
            {kind.label}
          </span>
        </div>
        {description && (
          <p className="text-sm leading-relaxed text-ink-400">{description}</p>
        )}
        <div className="mt-3 flex flex-wrap gap-2">
          {viewUrl && (
            <a
              href={viewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border border-navy-700 bg-navy-900/60 px-3 py-1.5 text-xs font-medium text-ink-200 transition-colors hover:border-electric-400 hover:text-electric-300"
            >
              👁 View
            </a>
          )}
          {downloadUrl && (
            <a
              href={downloadUrl}
              className="inline-flex items-center gap-1.5 rounded-md border border-navy-700 bg-navy-900/60 px-3 py-1.5 text-xs font-medium text-ink-200 transition-colors hover:border-gold-400 hover:text-gold-300"
            >
              ⬇ Download
            </a>
          )}
          {!viewUrl && (
            <span className="text-xs italic text-ink-500">
              Document unavailable
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
