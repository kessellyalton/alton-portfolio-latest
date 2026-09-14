"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";

import { getSessionId } from "@/lib/chat-session";
import { logChat } from "@/lib/log-chat";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const SUGGESTIONS = [
  "What does Alton do?",
  "Show me his AI projects",
  "Can he build me a dashboard?",
  "How do I hire him?",
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastUserMessageRef = useRef<string>("");

  const { messages, sendMessage, status, error } = useChat({
    onFinish: ({ message }) => {
      const aiText = message.parts
        .filter(
          (p): p is { type: "text"; text: string } => p.type === "text"
        )
        .map((p) => p.text)
        .join("");
      const userText = lastUserMessageRef.current;
      if (!userText || !aiText) return;

      logChat({
        user_message: userText,
        ai_response: aiText,
        page_context:
          typeof window !== "undefined" ? window.location.pathname : "/",
        session_id: getSessionId(),
      });

      lastUserMessageRef.current = "";
    },
  });

  const isStreaming = status === "streaming" || status === "submitted";
  const isEmpty = messages.length === 0;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isStreaming]);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("open-chat", handler);
    return () => window.removeEventListener("open-chat", handler);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isStreaming) return;
    lastUserMessageRef.current = text;
    sendMessage({ text });
    setInput("");
  };

  const handleSuggestion = (text: string) => {
    if (isStreaming) return;
    lastUserMessageRef.current = text;
    sendMessage({ text });
  };

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Open chat"}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-gold-400 to-gold-600 text-navy-950 shadow-2xl transition-transform hover:scale-110"
      >
        {open ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 flex h-[560px] w-[380px] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl border border-navy-700 bg-navy-950 shadow-2xl">
          <div className="flex items-center justify-between border-b border-navy-800 bg-navy-900/80 px-4 py-3 backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 text-sm font-bold text-navy-950">
                AK
              </div>
              <div>
                <div className="text-sm font-semibold text-ink-100">
                  Alton&apos;s AI Assistant
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </span>
                  Online
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="flex h-8 w-8 items-center justify-center rounded-md text-ink-400 transition-colors hover:bg-navy-800 hover:text-ink-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div
            ref={scrollRef}
            className="flex-1 space-y-4 overflow-y-auto px-4 py-4"
          >
            {isEmpty && (
              <div className="space-y-4">
                <div className="rounded-xl border border-navy-800 bg-navy-900/40 p-4 text-sm text-ink-300">
                  👋 Hi! I&apos;m Alton&apos;s AI assistant. I can tell you about
                  his work, skills, and services — or help you get in touch.
                </div>
                <div className="space-y-2">
                  <div className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                    Try asking
                  </div>
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSuggestion(s)}
                      className="block w-full rounded-lg border border-navy-800 bg-navy-900/40 px-3 py-2 text-left text-sm text-ink-300 transition-colors hover:border-gold-400/40 hover:bg-navy-800/60 hover:text-gold-300"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m) => {
              const text = m.parts
                .filter((p): p is { type: "text"; text: string } => p.type === "text")
                .map((p) => p.text)
                .join("");

              if (!text) return null;

              const isUser = m.role === "user";

              return (
                <div
                  key={m.id}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      isUser
                        ? "bg-gradient-to-br from-gold-400 to-gold-500 text-navy-950"
                        : "border border-navy-800 bg-navy-900/60 text-ink-200"
                    }`}
                  >
                    {isUser ? (
                      text
                    ) : (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: ({ children }) => (
                            <p className="mb-2 last:mb-0">{children}</p>
                          ),
                          ul: ({ children }) => (
                            <ul className="mb-2 ml-4 list-disc space-y-1 last:mb-0">
                              {children}
                            </ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="mb-2 ml-4 list-decimal space-y-1 last:mb-0">
                              {children}
                            </ol>
                          ),
                          li: ({ children }) => (
                            <li className="leading-relaxed">{children}</li>
                          ),
                          strong: ({ children }) => (
                            <strong className="font-semibold text-gold-300">
                              {children}
                            </strong>
                          ),
                          em: ({ children }) => (
                            <em className="italic text-ink-100">{children}</em>
                          ),
                          a: ({ href, children }) => (
                            <a
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-electric-300 underline hover:text-electric-200"
                            >
                              {children}
                            </a>
                          ),
                          code: ({ children }) => (
                            <code className="rounded bg-navy-950/80 px-1.5 py-0.5 font-mono text-[12px] text-gold-200">
                              {children}
                            </code>
                          ),
                          h1: ({ children }) => (
                            <h1 className="mb-2 text-base font-bold text-ink-100">
                              {children}
                            </h1>
                          ),
                          h2: ({ children }) => (
                            <h2 className="mb-2 text-base font-bold text-ink-100">
                              {children}
                            </h2>
                          ),
                          h3: ({ children }) => (
                            <h3 className="mb-1 text-sm font-bold text-ink-100">
                              {children}
                            </h3>
                          ),
                        }}
                      >
                        {text}
                      </ReactMarkdown>
                    )}
                  </div>
                </div>
              );
            })}

            {isStreaming && messages[messages.length - 1]?.role !== "assistant" && (
              <div className="flex justify-start">
                <div className="rounded-2xl border border-navy-800 bg-navy-900/60 px-3.5 py-3">
                  <div className="flex gap-1.5">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gold-400" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gold-400" style={{ animationDelay: "0.15s" }} />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gold-400" style={{ animationDelay: "0.3s" }} />
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
                <div className="mb-1 font-semibold">Error (debug):</div>
                <div className="break-words font-mono text-[11px] opacity-90">
                  {error.message || String(error)}
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="border-t border-navy-800 bg-navy-900/60 p-3"
          >
            <div className="flex items-center gap-2 rounded-lg border border-navy-700 bg-navy-950/60 px-3 py-2 transition-colors focus-within:border-gold-400/60">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                disabled={isStreaming}
                className="flex-1 bg-transparent text-sm text-ink-100 placeholder-ink-500 outline-none disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || isStreaming}
                aria-label="Send"
                className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-gold-400 to-gold-500 text-navy-950 transition-all hover:from-gold-300 hover:to-gold-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
            <div className="mt-2 text-center text-[10px] text-ink-600">
              Powered by Groq · Responses may be inaccurate
            </div>
          </form>
        </div>
      )}
    </>
  );
}