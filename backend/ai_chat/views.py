"""
Views for the AI chat app.

Provides:
- POST /api/chat-log/          — record a new chat (from the widget)
- GET  /api/chat-logs/         — list chats (for the dashboard)
- GET  /api/chat-logs/<id>/    — single chat detail
- POST /api/chat-logs/<id>/flag/ — toggle the flagged status
"""
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST

from .models import ChatLog


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
