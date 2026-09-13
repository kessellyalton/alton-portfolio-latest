"""
Views for the AI chat app.

Provides a simple POST endpoint the frontend calls after each AI response
so conversations can be reviewed in the Django admin.
"""
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

from .models import ChatLog


@csrf_exempt
@require_POST
def log_chat(request):
    """
    POST /api/chat-log/
    Body: { "session_id": "...", "user_message": "...", "ai_response": "...", "page_context": "..." }
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

    return JsonResponse({"id": log.id, "created_at": log.created_at.isoformat()}, status=201)
