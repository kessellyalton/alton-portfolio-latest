"""
Load Wagtail content (projects, blogs, lectures) from a portable JSON file.

Matches existing pages by slug — updates if found, creates if not.
Designed for syncing content between environments (local → production).

Usage:
    python manage.py load_content
    python manage.py load_content --input=home/fixtures/content.json
    python manage.py load_content --parent-slug=home
"""
import json
from pathlib import Path

from django.core.management.base import BaseCommand
from wagtail.models import Page

from home.models import HomePage, ProjectPage, BlogPage, LecturePage


DEFAULT_INPUT = "home/fixtures/content.json"


def _build_tech_stack(items):
    return [
        ("tech", {"name": it.get("name", ""), "icon": it.get("icon", "")})
        for it in items or []
    ]


class Command(BaseCommand):
    help = "Load Wagtail content from a JSON fixture."

    def add_arguments(self, parser):
        parser.add_argument(
            "--input",
            default=DEFAULT_INPUT,
            help=f"Input path (default: {DEFAULT_INPUT})",
        )
        parser.add_argument(
            "--parent-slug",
            default="home",
            help="Slug of the parent page (default: home)",
        )

    def handle(self, *args, **options):
        input_path = Path(options["input"])
        parent_slug = options["parent_slug"]

        if not input_path.exists():
            self.stderr.write(self.style.ERROR(f"File not found: {input_path}"))
            return

        payload = json.loads(input_path.read_text())
        version = payload.get("version", 1)
        self.stdout.write(f"Loading fixture version {version} from {input_path}")

        try:
            parent = HomePage.objects.get(slug=parent_slug)
        except HomePage.DoesNotExist:
            self.stderr.write(self.style.ERROR(
                f"No HomePage with slug '{parent_slug}' — aborting"
            ))
            return

        created = {"projects": 0, "blogs": 0, "lectures": 0}
        updated = {"projects": 0, "blogs": 0, "lectures": 0}

        # ─── Projects ────────────────────────────────
        for item in payload.get("projects", []):
            slug = item["slug"]
            page = ProjectPage.objects.filter(slug=slug).first()

            fields = dict(
                title=item["title"],
                intro=item.get("intro", ""),
                category=item.get("category", "software"),
                featured=item.get("featured", False),
                live_demo_url=item.get("live_demo_url", ""),
                case_study_url=item.get("case_study_url", ""),
                github_url=item.get("github_url", ""),
            )
            tech_stack_value = _build_tech_stack(item.get("tech_stack", []))

            if page:
                for k, v in fields.items():
                    setattr(page, k, v)
                page.tech_stack = tech_stack_value
                page.save_revision().publish()
                updated["projects"] += 1
            else:
                page = ProjectPage(slug=slug, **fields)
                page.tech_stack = tech_stack_value
                parent.add_child(instance=page)
                page.save_revision().publish()
                created["projects"] += 1

        # ─── Blogs ───────────────────────────────────
        for item in payload.get("blogs", []):
            slug = item["slug"]
            page = BlogPage.objects.filter(slug=slug).first()

            fields = dict(
                title=item["title"],
                intro=item.get("intro", ""),
                author=item.get("author", "Alton Kesselly"),
                reading_time=item.get("reading_time", 5),
                category=item.get("category", "AI & Education"),
            )
            if item.get("date"):
                fields["date"] = item["date"]

            if page:
                for k, v in fields.items():
                    setattr(page, k, v)
                page.save_revision().publish()
                updated["blogs"] += 1
            else:
                page = BlogPage(slug=slug, **fields)
                parent.add_child(instance=page)
                page.save_revision().publish()
                created["blogs"] += 1

        # ─── Lectures ────────────────────────────────
        for item in payload.get("lectures", []):
            slug = item["slug"]
            page = LecturePage.objects.filter(slug=slug).first()

            fields = dict(
                title=item["title"],
                intro=item.get("intro", ""),
                level=item.get("level", "beginner"),
                duration=item.get("duration", ""),
                lesson_count=item.get("lesson_count", 0),
                featured=item.get("featured", False),
                video_url=item.get("video_url", ""),
                syllabus_url=item.get("syllabus_url", ""),
            )

            if page:
                for k, v in fields.items():
                    setattr(page, k, v)
                page.save_revision().publish()
                updated["lectures"] += 1
            else:
                page = LecturePage(slug=slug, **fields)
                parent.add_child(instance=page)
                page.save_revision().publish()
                created["lectures"] += 1

        self.stdout.write(self.style.SUCCESS(
            f"Created: {created}\nUpdated: {updated}"
        ))
