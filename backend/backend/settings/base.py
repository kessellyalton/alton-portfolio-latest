"""
Base settings for the Alton Kesselly Portfolio project.
Shared across dev and production environments.
"""
import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env file from backend/ (next to manage.py)
load_dotenv()

# ─── Paths ────────────────────────────────────────
PROJECT_DIR = Path(__file__).resolve().parent.parent
BASE_DIR = PROJECT_DIR.parent


# ─── Security ─────────────────────────────────────
SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", "insecure-dev-key-change-me")
DEBUG = os.getenv("DJANGO_DEBUG", "True").lower() == "true"
ALLOWED_HOSTS = [
    h.strip() for h in os.getenv("DJANGO_ALLOWED_HOSTS", "localhost,127.0.0.1").split(",") if h.strip()
]


# ─── Applications ─────────────────────────────────
INSTALLED_APPS = [
    # Local apps
    "home",
    "search",
    "ai_chat",

    # Wagtail core
    "wagtail.contrib.forms",
    "wagtail.contrib.redirects",
    "wagtail.embeds",
    "wagtail.sites",
    "wagtail.users",
    "wagtail.snippets",
    "wagtail.documents",
    "wagtail.images",
    "wagtail.search",
    "wagtail.admin",
    "wagtail",

    # Wagtail API + headless
    "wagtail.api.v2",
    "wagtail_headless_preview",

    # Third-party
    "rest_framework",
    "corsheaders",
    "modelcluster",
    "taggit",
    "django_filters",

    # Django
    "django.contrib.postgres",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
]


# ─── Middleware ───────────────────────────────────
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",  # must be above CommonMiddleware
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "wagtail.contrib.redirects.middleware.RedirectMiddleware",
]

ROOT_URLCONF = "backend.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [PROJECT_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "backend.wsgi.application"


# ─── Database ─────────────────────────────────────
# Uses PostgreSQL if DB_NAME is set in .env; otherwise SQLite (local dev).
if os.getenv("DB_NAME"):
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": os.getenv("DB_NAME"),
            "USER": os.getenv("DB_USER", ""),
            "PASSWORD": os.getenv("DB_PASSWORD", ""),
            "HOST": os.getenv("DB_HOST", "localhost"),
            "PORT": os.getenv("DB_PORT", "5432"),
        }
    }
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }


# ─── Password validation ──────────────────────────
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]


# ─── Internationalization ─────────────────────────
LANGUAGE_CODE = "en-us"
TIME_ZONE = "Africa/Monrovia"
USE_I18N = True
USE_TZ = True


# ─── Static files ─────────────────────────────────
STATICFILES_FINDERS = [
    "django.contrib.staticfiles.finders.FileSystemFinder",
    "django.contrib.staticfiles.finders.AppDirectoriesFinder",
]
STATICFILES_DIRS = [PROJECT_DIR / "static"]
STATIC_ROOT = BASE_DIR / "staticfiles"
STATIC_URL = "/static/"

# ─── Media files ──────────────────────────────────
MEDIA_ROOT = BASE_DIR / "media"
MEDIA_URL = "/media/"

# ─── Wagtail ──────────────────────────────────────
WAGTAIL_SITE_NAME = "Alton Kesselly"
WAGTAILADMIN_BASE_URL = "http://localhost:8000"
WAGTAILAPI_LIMIT_MAX = 50

# Headless preview (tells Wagtail how to reach the Next.js preview route)
WAGTAIL_HEADLESS_PREVIEW = {
    "CLIENT_URLS": {
        "default": os.getenv("FRONTEND_URL", "http://localhost:3000") + "/api/preview",
    },
}

# ─── CORS (for Next.js frontend) ──────────────────
CORS_ALLOWED_ORIGINS = [
    os.getenv("FRONTEND_URL", "http://localhost:3000"),
]
CORS_ALLOW_CREDENTIALS = True


# ─── Misc ─────────────────────────────────────────
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# ─── Logging ─────────────────────────────────────
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
        },
    },
    "loggers": {
        "home.signals": {
            "handlers": ["console"],
            "level": "INFO",
            "propagate": False,
        },
        "ai_chat.views": {
            "handlers": ["console"],
            "level": "INFO",
            "propagate": False,
        },
    },
}