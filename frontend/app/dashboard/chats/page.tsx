"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type ChatLog = {
  id: number;
  session_id: string;
  user_message: string;
  ai_response: string;
  page_context: string;
  flagged: boolean;
  created_at: string;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function ChatsPage() {
  const searchParams = useSearchParams();
  const filter = searchParams.get("filter");
  const initialId = searchParams.get("id");

  const [chats, setChats] = useState<ChatLog[]>([]);
  const [total, setTotal] = useState(0);
  const [selectedId, setSelectedId] = useState<number | null>(
    initialId ? Number(initialId) : null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFlaggedOnly, setShowFlaggedOnly] = useState(filter === "flagged");

  const loadChats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = showFlaggedOnly
        ? `${API_URL}/api/chat-logs/?flagged=true&limit=100`
        : `${API_URL}/api/chat-logs/?limit=100`;
      const res = await fetch(url);
      const data = await res.json();
      setChats(data.items ?? []);
      setTotal(data.total ?? 0);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [showFlaggedOnly]);

  useEffect(() => {
    loadChats();
  }, [loadChats]);

  const toggleFlag = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch(`${API_URL}/api/chat-logs/${id}/flag/`, {
        method: "POST",
      });
      const data = await res.json();
      setChats((prev) =>
        prev.map((c) => (c.id === id ? { ...c, flagged: data.flagged } : c))
      );
    } catch (err) {
      console.error(err);
    }
  };

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

  const selectedChat = chats.find((c) => c.id === selectedId) ?? null;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-ink-100">AI Chats</h1>
          <p className="text-ink-400">
            {total} conversation{total === 1 ? "" : "s"}
            {showFlaggedOnly ? " (flagged)" : ""}.
          </p>
        </div>

        <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-navy-700 bg-navy-900/60 px-3 py-2 text-sm text-ink-300">
          <input
            type="checkbox"
            checked={showFlaggedOnly}
            onChange={(e) => setShowFlaggedOnly(e.target.checked)}
            className="accent-gold-400"
          />
          Show flagged only
        </label>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-5 text-sm text-red-300">
          {error}
        </div>
      )}

      {loading && chats.length === 0 && (
        <div className="rounded-xl border border-navy-800 bg-navy-900/40 p-5 text-sm text-ink-400">
          Loading chats...
        </div>
      )}

      {!loading && chats.length === 0 && (
        <div className="rounded-xl border border-dashed border-navy-700 bg-navy-900/40 p-12 text-center text-sm text-ink-400">
          {showFlaggedOnly
            ? "No flagged chats yet."
            : "No chats yet. Start a conversation on the public site."}
        </div>
      )}

      {chats.length > 0 && (
        <div className="grid gap-4 lg:grid-cols-5">
          {/* ═══ List ═══ */}
          <div className="lg:col-span-2">
            <div className="max-h-[70vh] space-y-2 overflow-y-auto pr-1">
              {chats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => setSelectedId(chat.id)}
                  className={`group block w-full rounded-xl border p-4 text-left backdrop-blur transition-all ${
                    selectedId === chat.id
                      ? "border-gold-400/60 bg-navy-900/80"
                      : "border-navy-800 bg-navy-900/40 hover:border-gold-400/40 hover:bg-navy-900/70"
                  }`}
                >
                  <div className="mb-2 flex items-center gap-2">
                    <span className="rounded-md border border-navy-700 bg-navy-800/60 px-2 py-0.5 text-[10px] font-medium text-ink-400">
                      {chat.page_context || "/"}
                    </span>
                    <span className="text-[10px] text-ink-500">
                      {formatDate(chat.created_at)}
                    </span>
                    <span
                      onClick={(e) => toggleFlag(chat.id, e)}
                      className="ml-auto cursor-pointer text-sm transition-transform hover:scale-110"
                      title={chat.flagged ? "Unflag" : "Flag"}
                    >
                      {chat.flagged ? "🚩" : "⚐"}
                    </span>
                  </div>
                  <div className="line-clamp-2 text-sm font-medium text-ink-200 group-hover:text-gold-300">
                    {chat.user_message}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* ═══ Detail ═══ */}
          <div className="lg:col-span-3">
            {selectedChat ? (
              <div className="sticky top-24 rounded-2xl border border-navy-800 bg-navy-900/40 p-6 backdrop-blur">
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <span className="rounded-md border border-navy-700 bg-navy-800/60 px-2 py-0.5 text-xs font-medium text-ink-400">
                    {selectedChat.page_context || "/"}
                  </span>
                  <span className="text-xs text-ink-500">
                    {formatDate(selectedChat.created_at)}
                  </span>
                  <span className="text-xs text-ink-500">
                    · {selectedChat.session_id}
                  </span>
                  <button
                    onClick={(e) => toggleFlag(selectedChat.id, e)}
                    className={`ml-auto rounded-md border px-3 py-1 text-xs font-medium transition-colors ${
                      selectedChat.flagged
                        ? "border-red-500/40 bg-red-500/10 text-red-300 hover:bg-red-500/20"
                        : "border-navy-700 bg-navy-800/60 text-ink-400 hover:border-gold-400/40 hover:text-gold-300"
                    }`}
                  >
                    {selectedChat.flagged ? "🚩 Flagged" : "⚐ Flag this chat"}
                  </button>
                </div>

                <div className="mb-6">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-gold-300">
                    Visitor asked
                  </div>
                  <div className="rounded-lg border border-navy-800 bg-navy-950/60 p-4 text-sm leading-relaxed text-ink-100">
                    {selectedChat.user_message}
                  </div>
                </div>

                <div>
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-electric-300">
                    AI responded
                  </div>
                  <div className="whitespace-pre-wrap rounded-lg border border-navy-800 bg-navy-950/60 p-4 text-sm leading-relaxed text-ink-200">
                    {selectedChat.ai_response}
                  </div>
                </div>
              </div>
            ) : (
              <div className="sticky top-24 rounded-2xl border border-dashed border-navy-700 bg-navy-900/40 p-12 text-center text-sm text-ink-400">
                Select a chat from the list to see the full conversation.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
