"""
Wagtail signals for RAG vector sync.

When a ProjectPage, BlogPage, or LecturePage is published, its content
is upserted into Upstash Vector for semantic retrieval. When it is
unpublished or deleted, the vector is removed.

This keeps the vector DB in sync without needing a scheduled cron job.
"""
import logging
import os
from pathlib import Path

from django.db.models.signals import post_delete
from django.dispatch import receiver
from dotenv import load_dotenv
from wagtail.signals import page_published, page_unpublished

from home.models import BlogPage, LecturePage, ProjectPage

logger = logging.getLogger(__name__)

# Load .env.local from repo root
BASE_DIR = Path(__file__).resolve().parent.parent.parent
load_dotenv(BASE_DIR / ".env.local")

INDEXABLE_TYPES = (ProjectPage, BlogPage, LecturePage)


def _get_index():
    """Lazy-init Upstash client. Returns None if not configured."""
    url = os.getenv("UPSTASH_VECTOR_REST_URL")
    token = os.getenv("UPSTASH_VECTOR_REST_TOKEN")
    if not url or not token:
        logger.warning("[rag-signal] Upstash env vars not set — skipping")
        return None
    try:
        from upstash_vector import Index
        return Index(url=url, token=token)
    except Exception as e:
        logger.warning(f"[rag-signal] Upstash init failed: {e}")
        return None


def _vector_id(page):
    if isinstance(page, ProjectPage):
        return f"project-{page.id}"
    if isinstance(page, BlogPage):
        return f"blog-{page.id}"
    if isinstance(page, LecturePage):
        return f"lecture-{page.id}"
    return None


def _page_type(page):
    if isinstance(page, ProjectPage):
        return "project"
    if isinstance(page, BlogPage):
        return "blog"
    if isinstance(page, LecturePage):
        return "lecture"
    return None


def _page_url(page):
    if isinstance(page, ProjectPage):
        return f"/projects/{page.slug}"
    if isinstance(page, BlogPage):
        return f"/blog/{page.slug}"
    if isinstance(page, LecturePage):
        return f"/lectures/{page.slug}"
    return None


def _build_text(page):
    intro = getattr(page, "intro", "") or ""
    return f"{page.title}. {intro}".strip()


@receiver(page_published)
def on_page_published(sender, instance, **kwargs):
    """Upsert the vector when a page is published."""
    if not isinstance(instance, INDEXABLE_TYPES):
        return
    index = _get_index()
    if index is None:
        return
    vector_id = _vector_id(instance)
    if not vector_id:
        return
    try:
        index.upsert(vectors=[(
            vector_id,
            _build_text(instance),
            {
                "title": instance.title,
                "slug": instance.slug,
                "type": _page_type(instance),
                "url": _page_url(instance),
            },
        )])
        logger.info(f"[rag-signal] Indexed {vector_id}")
    except Exception as e:
        logger.error(f"[rag-signal] Upsert failed for {vector_id}: {e}")


@receiver(page_unpublished)
def on_page_unpublished(sender, instance, **kwargs):
    """Remove the vector when a page is unpublished."""
    if not isinstance(instance, INDEXABLE_TYPES):
        return
    index = _get_index()
    if index is None:
        return
    vector_id = _vector_id(instance)
    if not vector_id:
        return
    try:
        index.delete(ids=[vector_id])
        logger.info(f"[rag-signal] Deleted vector {vector_id}")
    except Exception as e:
        logger.error(f"[rag-signal] Delete failed for {vector_id}: {e}")


@receiver(post_delete)
def on_page_deleted(sender, instance, **kwargs):
    """Remove the vector when a page is deleted entirely."""
    if sender not in INDEXABLE_TYPES:
        return
    index = _get_index()
    if index is None:
        return
    vector_id = _vector_id(instance)
    if not vector_id:
        return
    try:
        index.delete(ids=[vector_id])
        logger.info(f"[rag-signal] Deleted vector {vector_id} (post_delete)")
    except Exception as e:
        logger.error(f"[rag-signal] Delete failed for {vector_id}: {e}")
