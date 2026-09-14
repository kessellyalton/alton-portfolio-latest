import type { Metadata } from "next";
import Link from "next/link";
import { existsSync } from "fs";
import { join } from "path";

export const metadata: Metadata = {
  title: "CV",
  description:
    "Download or view Alton Kesselly's curriculum vitae — AI researcher, data analyst, full-stack developer.",
};

export const dynamic = "force-dynamic";

const PUBLIC_DIR = join(process.cwd(), "public");
const CV_FILENAME = "alton-cv.pdf";

export default function CVPage() {
  const cvExists = existsSync(join(PUBLIC_DIR, CV_FILENAME));

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="mb-12 max-w-2xl">
        <div className="mb-4 inline-block rounded-full border border-gold-400/40 bg-gold-400/10 px-4 py-1.5 text-sm font-medium text-gold-300">
          Curriculum Vitae
        </div>
        <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">
          My{" "}
          <span className="bg-gradient-to-r from-gold-400 via-gold-300 to-electric-400 bg-clip-text text-transparent">
            CV
          </span>
        </h1>
        <p className="text-lg leading-relaxed text-ink-300">
          View or download a complete record of my education, experience,
          publications, and skills.
        </p>
      </div>

      {cvExists ? (
        <>
          <div className="mb-8 flex flex-wrap gap-3">
            <a
              href={`/${CV_FILENAME}`}
              download
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-gold-400 to-gold-500 px-6 py-3 font-semibold text-navy-950 shadow-lg transition-all hover:from-gold-300 hover:to-gold-400 hover:shadow-xl hover:shadow-gold-400/30"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download PDF
            </a>
            <a
              href={`/${CV_FILENAME}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-navy-700 bg-navy-900/60 px-6 py-3 font-semibold text-ink-100 transition-all hover:border-gold-400 hover:text-gold-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
              Open in new tab
            </a>
          </div>

          <div className="overflow-hidden rounded-2xl border border-navy-800 bg-navy-900/40 shadow-xl">
            <div className="flex items-center justify-between border-b border-navy-800 bg-navy-900/60 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                  <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
                </div>
                <span className="ml-2 text-xs font-medium text-ink-400">
                  alton-cv.pdf
                </span>
              </div>
              <span className="text-xs text-ink-500">Preview</span>
            </div>
            <div className="aspect-[8.5/11] w-full bg-white">
              <iframe
                src={`/${CV_FILENAME}#view=FitH`}
                title="Alton Kesselly CV"
                className="h-full w-full border-0"
              />
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-ink-500">
            PDF won&apos;t render on some mobile browsers. Use the{" "}
            <a
              href={`/${CV_FILENAME}`}
              download
              className="text-gold-300 underline hover:text-gold-200"
            >
              download button
            </a>{" "}
            instead.
          </p>
        </>
      ) : (
        <div className="rounded-2xl border border-dashed border-gold-400/40 bg-navy-900/40 p-8 text-center backdrop-blur sm:p-12">
          <div className="mb-4 text-5xl">📄</div>
          <h2 className="mb-2 text-xl font-bold text-ink-100">
            CV not yet uploaded
          </h2>
          <p className="mx-auto mb-6 max-w-md text-sm text-ink-400">
            To make this page work, save your CV as a PDF file named{" "}
            <code className="rounded bg-navy-950/80 px-1.5 py-0.5 font-mono text-xs text-gold-200">
              alton-cv.pdf
            </code>{" "}
            in the{" "}
            <code className="rounded bg-navy-950/80 px-1.5 py-0.5 font-mono text-xs text-gold-200">
              frontend/public/
            </code>{" "}
            folder.
          </p>
          <p className="text-xs text-ink-500">
            The page will automatically detect it and show the download button
            + preview.
          </p>
        </div>
      )}

      <div className="mt-16 rounded-2xl border border-gold-400/20 bg-gradient-to-br from-navy-900/80 to-navy-950 p-8 text-center backdrop-blur sm:p-10">
        <h2 className="mb-3 text-xl font-bold text-ink-100">
          Want to discuss a role or project?
        </h2>
        <p className="mx-auto mb-6 max-w-lg text-sm text-ink-300">
          I&apos;m available for freelance, consulting, and institutional work.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-gold-400 to-gold-500 px-6 py-3 font-semibold text-navy-950 shadow-lg transition-all hover:from-gold-300 hover:to-gold-400"
          >
            Get in touch
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 rounded-lg border border-navy-700 bg-navy-900/60 px-6 py-3 font-semibold text-ink-100 transition-all hover:border-gold-400 hover:text-gold-300"
          >
            View about page
          </Link>
        </div>
      </div>
    </div>
  );
}
