"""
Models for the AI chat feature.

ChatLog stores every user question and AI response so the portfolio
owner can review conversations from the private dashboard.
"""
from django.db import models
from wagtail.admin.panels import FieldPanel


class ChatLog(models.Model):
    """Stores one AI chat interaction."""

    session_id = models.CharField(
        max_length=100,
        db_index=True,
        help_text="Anonymous ID to group messages from the same visitor.",
    )
    user_message = models.TextField()
    ai_response = models.TextField()
    page_context = models.CharField(
        max_length=200,
        blank=True,
        help_text="Which page the visitor was on when they chatted.",
    )
    flagged = models.BooleanField(
        default=False,
        help_text="Mark for review (e.g., bad answer, missing info).",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    panels = [
        FieldPanel("session_id"),
        FieldPanel("user_message"),
        FieldPanel("ai_response"),
        FieldPanel("page_context"),
        FieldPanel("flagged"),
    ]

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "AI Chat Log"
        verbose_name_plural = "AI Chat Logs"

    def __str__(self):
        snippet = self.user_message[:50]
        return f"{self.session_id} — {snippet}"