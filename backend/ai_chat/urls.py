from django.urls import path
from . import views

urlpatterns = [
    path("chat-log/", views.log_chat, name="chat-log"),
]
