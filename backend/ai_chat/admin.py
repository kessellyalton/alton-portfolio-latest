"""Django admin registration for AI chat logs."""
from django.contrib import admin
from .models import ChatLog


@admin.register(ChatLog)
class ChatLogAdmin(admin.ModelAdmin):
    list_display = (
        "session_id",
        "short_message",
        "page_context",
        "flagged",
        "created_at",
    )
    list_filter = ("flagged", "page_context")
    search_fields = ("user_message", "ai_response", "session_id")
    readonly_fields = ("created_at",)
    date_hierarchy = "created_at"

    def short_message(self, obj):
        return obj.user_message[:60] + ("..." if len(obj.user_message) > 60 else "")

    short_message.short_description = "Message"