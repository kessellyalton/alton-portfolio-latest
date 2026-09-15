import os
from pathlib import Path
from dotenv import load_dotenv
from django.core.management.base import BaseCommand
from upstash_vector import Index
from home.models import ProjectPage, BlogPage, LecturePage

# Point to project root (/home/alton/Documents/alton-portfolio)
BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent.parent
load_dotenv(BASE_DIR / ".env.local")

class Command(BaseCommand):
    help = "Index Wagtail pages into Upstash Vector for RAG"

    def handle(self, *args, **options):
        self.stdout.write("Initializing Upstash Vector client...")

        url = os.getenv("UPSTASH_VECTOR_REST_URL")
        token = os.getenv("UPSTASH_VECTOR_REST_TOKEN")

        if not url or not token:
            self.stderr.write(
                self.style.ERROR(
                    f"Missing UPSTASH_VECTOR_REST_URL or UPSTASH_VECTOR_REST_TOKEN in {BASE_DIR / '.env.local'}."
                )
            )
            return

        try:
            index = Index(url=url, token=token)
        except Exception as e:
            self.stderr.write(self.style.ERROR(f"Failed to connect to Upstash: {e}"))
            return

        total_indexed = 0

        # 1. Index Projects
        projects = ProjectPage.objects.live().public()
        self.stdout.write(f"Indexing {projects.count()} projects...")
        for project in projects:
            text = f"{project.title}. {project.intro or ''}"
            index.upsert(
                vectors=[
                    (
                        f"project-{project.id}",
                        text,
                        {
                            "title": project.title,
                            "slug": project.slug,
                            "type": "project",
                            "url": f"/projects/{project.slug}",
                        },
                    )
                ]
            )
            total_indexed += 1

        # 2. Index Blog Posts
        blogs = BlogPage.objects.live().public()
        self.stdout.write(f"Indexing {blogs.count()} blog posts...")
        for blog in blogs:
            text = f"{blog.title}. {blog.intro or ''}"
            index.upsert(
                vectors=[
                    (
                        f"blog-{blog.id}",
                        text,
                        {
                            "title": blog.title,
                            "slug": blog.slug,
                            "type": "blog",
                            "url": f"/blog/{blog.slug}",
                        },
                    )
                ]
            )
            total_indexed += 1

        # 3. Index Lectures
        lectures = LecturePage.objects.live().public()
        self.stdout.write(f"Indexing {lectures.count()} lectures...")
        for lecture in lectures:
            text = f"{lecture.title}. {lecture.intro or ''}"
            index.upsert(
                vectors=[
                    (
                        f"lecture-{lecture.id}",
                        text,
                        {
                            "title": lecture.title,
                            "slug": lecture.slug,
                            "type": "lecture",
                            "url": f"/lectures/{lecture.slug}",
                        },
                    )
                ]
            )
            total_indexed += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Successfully indexed {total_indexed} pages into Upstash Vector!"
            )
        )
