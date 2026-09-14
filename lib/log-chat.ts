/**
 * Fire-and-forget POST to the Django backend to record a chat interaction.
 * Errors are swallowed — logging should never break the UX.
 */
export async function logChat(payload: {
  user_message: string;
  ai_response: string;
  page_context: string;
  session_id: string;
}): Promise<void> {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  try {
    await fetch(`${apiUrl}/api/chat-log/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.warn("[log-chat] failed:", err);
  }
}
