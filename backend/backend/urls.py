"""
URL configuration for the Alton Kesselly portfolio backend.

Routes:
- /django-admin/    Django admin (for ChatLog and data models)
- /admin/           Wagtail admin (CMS)
- /documents/       Wagtail document serving
- /api/v2/          Wagtail REST API (consumed by Next.js frontend)
- /                Wagtail page serving (fallback)
"""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path, re_path

from wagtail import urls as wagtail_urls
from wagtail.admin import urls as wagtailadmin_urls
from wagtail.documents import urls as wagtaildocs_urls

from home.api import api_router


urlpatterns = [
    # Django admin (for ChatLog, users, etc.)
    path("django-admin/", admin.site.urls),

    # Wagtail admin (CMS)
    path("admin/", include(wagtailadmin_urls)),

    # Wagtail documents
    path("documents/", include(wagtaildocs_urls)),

    # Wagtail REST API v2
    path("api/v2/", api_router.urls),

    # Wagtail page serving (MUST be last)
    re_path(r"^", include(wagtail_urls)),
]


# Serve media files in development only
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)