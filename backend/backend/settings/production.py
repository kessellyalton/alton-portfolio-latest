import os
import dj_database_url

from .base import *  # noqa


DEBUG = False

# ─── Security ─────────────────────────────────────
SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY", SECRET_KEY)

ALLOWED_HOSTS = [
    h.strip()
    for h in os.environ.get("DJANGO_ALLOWED_HOSTS", "").split(",")
    if h.strip()
]

SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

SECURE_SSL_REDIRECT = os.environ.get("SECURE_SSL_REDIRECT", "True") == "True"
SESSION_COOKIE_SECURE = os.environ.get("SESSION_COOKIE_SECURE", "True") == "True"
CSRF_COOKIE_SECURE = os.environ.get("CSRF_COOKIE_SECURE", "True") == "True"

SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

CSRF_TRUSTED_ORIGINS = [
    o.strip()
    for o in os.environ.get("CSRF_TRUSTED_ORIGINS", "").split(",")
    if o.strip()
]

# ─── Database ─────────────────────────────────────
if os.environ.get("DATABASE_URL"):
    DATABASES = {
        "default": dj_database_url.config(
            default=os.environ["DATABASE_URL"],
            conn_max_age=600,
            conn_health_checks=True,
        )
    }

# ─── Static files (WhiteNoise) ────────────────────
MIDDLEWARE.insert(1, "whitenoise.middleware.WhiteNoiseMiddleware")

STORAGES = {
    "default": {
        "BACKEND": "django.core.files.storage.FileSystemStorage",
    },
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
    },
}

# ─── CORS ─────────────────────────────────────────
# Read from CORS_ALLOWED_ORIGINS if set; otherwise fall back to FRONTEND_URL.
_cors_env = os.environ.get("CORS_ALLOWED_ORIGINS", "").strip()
if _cors_env:
    CORS_ALLOWED_ORIGINS = [
        o.strip() for o in _cors_env.split(",") if o.strip()
    ]
else:
    # Fall back to FRONTEND_URL (which base.py already parsed)
    _frontend = os.environ.get("FRONTEND_URL", "").strip()
    CORS_ALLOWED_ORIGINS = [_frontend] if _frontend else []
