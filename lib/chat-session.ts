/**
 * Anonymous session ID for grouping chat messages from the same browser tab.
 * Stored in sessionStorage so a new tab = a new session.
 */
const SESSION_KEY = "alton-chat-session";

export function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = `sess-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}
