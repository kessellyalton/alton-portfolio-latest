"""
Dump all Wagtail content (projects, blogs, lectures) to a portable JSON file.

The output is designed to be committed to the git repo and loaded on
another environment (e.g. production) via the `load_content` command.

Usage:
    python manage.py dump_content
    python manage.py dump_content --output=home/fixtures/content.json
"""
import json
from pathlib import Path

from django.core.management.base import BaseCommand

from home.models import ProjectPage, BlogPage, LecturePage


DEFAULT_OUTPUT = "home/fixtures/content.json"


def _streamfield_tech_stack(sf):
    """Flatten a tech_stack StreamField into a list of {name, icon} dicts."""
    if not sf:
        return []
    out = []
    for block in sf:
        try:
            value = block.value
            out.append({
                "name": value.get("name", ""),
                "icon": value.get("icon", ""),
            })
        except Exception:
            continue
    return out


def _project_to_dict(page):
    return {
        "slug": page.slug,
        "title": page.title,
        "intro": page.intro or "",
        "category": page.category or "software",
        "featured": bool(page.featured),
        "live_demo_url": page.live_demo_url or "",
        "case_study_url": page.case_study_url or "",
        "github_url": page.github_url or "",
        "tech_stack": _streamfield_tech_stack(page.tech_stack),
    }


def _blog_to_dict(page):
    return {
        "slug": page.slug,
        "title": page.title,
        "date": page.date.isoformat() if page.date else None,
        "intro": page.intro or "",
        "author": page.author or "Alton Kesselly",
        "reading_time": page.reading_time or 5,
        "category": page.category or "AI & Education",
    }


def _lecture_to_dict(page):
    return {
        "slug": page.slug,
        "title": page.title,
        "intro": page.intro or "",
        "level": page.level or "beginner",
        "duration": page.duration or "",
        "lesson_count": page.lesson_count or 0,
        "featured": bool(page.featured),
        "video_url": page.video_url or "",
        "syllabus_url": page.syllabus_url or "",
    }


class Command(BaseCommand):
    help = "Dump all Wagtail content to a portable JSON file."

    def add_arguments(self, parser):
        parser.add_argument(
            "--output",
            default=DEFAULT_OUTPUT,
            help=f"Output path (default: {DEFAULT_OUTPUT})",
        )

    def handle(self, *args, **options):
        output_path = Path(options["output"])
        output_path.parent.mkdir(parents=True, exist_ok=True)

        projects = [_project_to_dict(p) for p in ProjectPage.objects.live().public()]
        blogs = [_blog_to_dict(b) for b in BlogPage.objects.live().public()]
        lectures = [_lecture_to_dict(l) for l in LecturePage.objects.live().public()]

        payload = {
            "version": 1,
            "projects": projects,
            "blogs": blogs,
            "lectures": lectures,
        }

        output_path.write_text(json.dumps(payload, indent=2, ensure_ascii=False))

        self.stdout.write(self.style.SUCCESS(
            f"Wrote {output_path} "
            f"({len(projects)} projects, {len(blogs)} blogs, {len(lectures)} lectures)"
        ))
