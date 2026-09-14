"use client";

import { useEffect } from "react";

export default function IntroVideoModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  // Lock scroll + handle Escape key when modal is open
  useEffect(() => {
    if (!isOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const videoUrl =
    process.env.NEXT_PUBLIC_INTRO_VIDEO_URL ||
    "https://www.youtube.com/embed/dQw4w9WgXcQ";

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-navy-950/90 p-4 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Introduction video"
    >
      <div
        className="relative w-full max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close video"
          className="absolute -top-12 right-0 flex h-10 w-10 items-center justify-center rounded-lg border border-navy-700 bg-navy-900/80 text-ink-200 backdrop-blur transition-colors hover:border-gold-400 hover:text-gold-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Video frame */}
        <div className="overflow-hidden rounded-2xl border border-navy-700 bg-navy-950 shadow-2xl">
          <div className="flex items-center justify-between border-b border-navy-800 bg-navy-900/80 px-4 py-3 backdrop-blur">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <div className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
                <div className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
              </div>
              <span className="ml-2 text-xs font-medium text-ink-400">
                Alton Kesselly — Intro
              </span>
            </div>
            <span className="text-xs text-ink-500">Press ESC to close</span>
          </div>

          <div className="relative aspect-video w-full bg-black">
            <iframe
              src={videoUrl}
              title="Introduction video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
