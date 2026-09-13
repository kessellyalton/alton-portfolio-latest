from django.urls import path
from . import views

urlpatterns = [
    # Called by the widget
    path("chat-log/", views.log_chat, name="chat-log"),

    # Called by the dashboard
    path("chat-logs/", views.list_chats, name="chat-logs"),
    path("chat-logs/<int:chat_id>/", views.chat_detail, name="chat-detail"),
    path("chat-logs/<int:chat_id>/flag/", views.toggle_flag, name="chat-flag"),
]
