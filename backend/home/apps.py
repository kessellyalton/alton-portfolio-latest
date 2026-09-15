from django.apps import AppConfig


class HomeConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "home"

    def ready(self):
        # Register Wagtail page-published/unpublished signals so the
        # vector DB stays in sync with published content.
        # The import must be inside ready() — Django doesn't allow
        # importing models at app-loading time.
        from home import signals  # noqa: F401
