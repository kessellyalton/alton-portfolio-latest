"""
Views for the AI chat app.

Provides:
- POST /api/chat-log/            — record a new chat (from the widget)
- GET  /api/chat-logs/           — list chats (for the dashboard)
- GET  /api/chat-logs/<id>/      — single chat detail
- POST /api/chat-logs/<id>/flag/ — toggle the flagged status
- POST /api/chat/                — RAG chat (Upstash Vector + Groq)
"""
import json
import os
from pathlib import Path

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST
from dotenv import load_dotenv

from .models import ChatLog

# Load .env.local from project root (three levels up from this file)
BASE_DIR = Path(__file__).resolve().parent.parent.parent
load_dotenv(BASE_DIR / ".env.local")


# ─── Widget: log a chat ────────────────────────────

@csrf_exempt
@require_POST
def log_chat(request):
    """
    POST /api/chat-log/
    Body: { "session_id", "user_message", "ai_response", "page_context" }
    """
    try:
        data = json.loads(request.body.decode("utf-8"))
    except (ValueError, UnicodeDecodeError):
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    session_id = (data.get("session_id") or "").strip()
    user_message = (data.get("user_message") or "").strip()
    ai_response = (data.get("ai_response") or "").strip()
    page_context = (data.get("page_context") or "").strip()[:200]

    if not session_id or not user_message or not ai_response:
        return JsonResponse(
            {"error": "session_id, user_message, and ai_response are required"},
            status=400,
        )

    log = ChatLog.objects.create(
        session_id=session_id,
        user_message=user_message,
        ai_response=ai_response,
        page_context=page_context,
    )

    return JsonResponse(
        {"id": log.id, "created_at": log.created_at.isoformat()},
        status=201,
    )


# ─── Dashboard: list and manage chats ──────────────

def _serialize(log: ChatLog) -> dict:
    return {
        "id": log.id,
        "session_id": log.session_id,
        "user_message": log.user_message,
        "ai_response": log.ai_response,
        "page_context": log.page_context,
        "flagged": log.flagged,
        "created_at": log.created_at.isoformat(),
    }


@require_GET
def list_chats(request):
    """
    GET /api/chat-logs/
    Query params:
      - limit (default 50, max 200)
      - offset (default 0)
      - flagged ("true" to filter flagged only)
    """
    try:
        limit = min(int(request.GET.get("limit", 50)), 200)
        offset = max(int(request.GET.get("offset", 0)), 0)
    except ValueError:
        return JsonResponse({"error": "Invalid limit or offset"}, status=400)

    qs = ChatLog.objects.all()

    if request.GET.get("flagged") == "true":
        qs = qs.filter(flagged=True)

    total = qs.count()
    items = [_serialize(log) for log in qs[offset : offset + limit]]

    return JsonResponse({"total": total, "items": items})


@require_GET
def chat_detail(request, chat_id: int):
    """GET /api/chat-logs/<id>/"""
    try:
        log = ChatLog.objects.get(pk=chat_id)
    except ChatLog.DoesNotExist:
        return JsonResponse({"error": "Not found"}, status=404)
    return JsonResponse(_serialize(log))


@csrf_exempt
@require_POST
def toggle_flag(request, chat_id: int):
    """POST /api/chat-logs/<id>/flag/ — flips the flagged boolean."""
    try:
        log = ChatLog.objects.get(pk=chat_id)
    except ChatLog.DoesNotExist:
        return JsonResponse({"error": "Not found"}, status=404)

    log.flagged = not log.flagged
    log.save(update_fields=["flagged"])
    return JsonResponse({"id": log.id, "flagged": log.flagged})


# ─── Chatbot: RAG Query & LLM Completion ───────────

@csrf_exempt
@require_POST
def ask_chat(request):
    """
    POST /api/chat/
    Body: { "message": "What projects has Alton built?" }

    Pipeline:
      1. Query Upstash Vector for top-3 semantically similar portfolio items
      2. Build a system prompt with the retrieved context
      3. Call Groq's openai/gpt-oss-20b model
      4. Return { "response": "..." }
    """
    from upstash_vector import Index
    from groq import Groq

    try:
        data = json.loads(request.body.decode("utf-8"))
    except (ValueError, UnicodeDecodeError):
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    user_message = (data.get("message") or "").strip()
    if not user_message:
        return JsonResponse({"error": "message is required"}, status=400)

    context_str = ""
    url = os.getenv("UPSTASH_VECTOR_REST_URL")
    token = os.getenv("UPSTASH_VECTOR_REST_TOKEN")

    if url and token:
        try:
            index = Index(url=url, token=token)
            results = index.query(
                data=user_message,
                top_k=3,
                include_metadata=True,
            )
            context_blocks = []
            for res in results:
                meta = res.metadata or {}
                title = meta.get("title", "")
                page_type = meta.get("type", "")
                url_path = meta.get("url", "")
                context_blocks.append(
                    f"Title: {title}\nType: {page_type}\nURL: {url_path}"
                )
            context_str = "\n\n".join(context_blocks)
        except Exception as e:
            print(f"Upstash query failed: {e}")

    system_prompt = (
        "You are an AI assistant on Alton's portfolio website.\n"
        "Use the relevant portfolio content below to answer the user's "
        "question accurately. If the information is not present, answer "
        "politely using general knowledge.\n\n"
        f"--- CONTEXT FROM PORTFOLIO ---\n{context_str}\n"
        "------------------------------"
    )

    groq_api_key = os.getenv("GROQ_API_KEY")
    if not groq_api_key:
        return JsonResponse(
            {"error": "GROQ_API_KEY is not configured"}, status=500
        )

    try:
        client = Groq(api_key=groq_api_key)
        completion = client.chat.completions.create(
            model="openai/gpt-oss-20b",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message},
            ],
            temperature=0.5,
        )
        response_text = completion.choices[0].message.content
        return JsonResponse({"response": response_text})
    except Exception as e:
        return JsonResponse(
            {"error": f"Groq API error: {str(e)}"}, status=500
        )


# ─── Chatbot: Retrieval-only endpoint (for hybrid RAG) ─────

@require_GET
def chat_context(request):
    """
    GET /api/chat/context/?q=<query>&k=<count>

    Retrieval-only endpoint. Queries Upstash Vector and returns the
    top-k relevant portfolio chunks as JSON. Does NOT call an LLM.

    Response: {
      "context": "Title: ...\\nType: ...\\nURL: ...",
      "chunks": [ { "title": ..., "type": ..., "url": ..., "score": ... } ]
    }

    The Next.js frontend fetches this, injects the context into its
    system prompt, and streams the LLM response itself.
    """
    from upstash_vector import Index

    query = (request.GET.get("q") or "").strip()
    if not query:
        return JsonResponse({"error": "q parameter is required"}, status=400)

    try:
        top_k = min(int(request.GET.get("k", 3)), 10)
    except ValueError:
        return JsonResponse({"error": "k must be an integer"}, status=400)

    url = os.getenv("UPSTASH_VECTOR_REST_URL")
    token = os.getenv("UPSTASH_VECTOR_REST_TOKEN")

    if not url or not token:
        # Graceful fallback: no vector store configured
        return JsonResponse(
            {"context": "", "chunks": [], "warning": "Upstash not configured"}
        )

    try:
        index = Index(url=url, token=token)
        results = index.query(
            data=query,
            top_k=top_k,
            include_metadata=True,
        )

        chunks = []
        context_blocks = []
        for res in results:
            meta = res.metadata or {}
            chunk = {
                "title": meta.get("title", ""),
                "type": meta.get("type", ""),
                "url": meta.get("url", ""),
                "score": getattr(res, "score", None),
            }
            chunks.append(chunk)
            context_blocks.append(
                f"Title: {chunk['title']}\n"
                f"Type: {chunk['type']}\n"
                f"URL: {chunk['url']}"
            )

        context_str = "\n\n".join(context_blocks)
        return JsonResponse({"context": context_str, "chunks": chunks})

    except Exception as e:
        print(f"[chat_context] Upstash query failed: {e}")
        return JsonResponse(
            {"context": "", "chunks": [], "error": str(e)},
            status=500,
        )
