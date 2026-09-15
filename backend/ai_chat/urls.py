from django.urls import path
from . import views
from . import sync_views

urlpatterns = [
    # Chat RAG Query Endpoint
    path("chat/", views.ask_chat, name="chat"),

    # Chat context retrieval (retrieval only — for hybrid RAG streaming)
    path("chat/context/", views.chat_context, name="chat-context"),

    # Called by the widget
    path("chat-log/", views.log_chat, name="chat-log"),

    # Called by the dashboard
    path("chat-logs/", views.list_chats, name="chat-logs"),
    path("chat-logs/<int:chat_id>/", views.chat_detail, name="chat-detail"),
    path("chat-logs/<int:chat_id>/flag/", views.toggle_flag, name="chat-flag"),

    # Content sync from JSON fixture (token-protected)
    path("sync-content/", sync_views.sync_content, name="sync-content"),
]
