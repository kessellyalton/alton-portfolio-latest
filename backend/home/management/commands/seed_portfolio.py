"""
Seed the portfolio with initial content.

Usage:
    python manage.py seed_portfolio
"""
from django.core.management.base import BaseCommand
from wagtail.models import Page, Site

from home.models import HomePage, Service


SERVICES = [
    {
        "title": "AI & ML Solutions",
        "description": "Transformers, LLMs, deep learning, and robotics for real-world problems.",
        "icon": "AI",
        "order": 1,
        "items": ["Transformers", "LLMs & RAG", "Deep Learning", "Robotics", "Computer Vision"],
    },
    {
        "title": "Data & Dashboards",
        "description": "KPI dashboards, M&E systems, and data analysis for decision-making.",
        "icon": "DATA",
        "order": 2,
        "items": ["KPI Dashboards", "M&E Systems", "Tableau", "Power BI", "Streamlit", "Plotly Dash"],
    },
    {
        "title": "Software Engineering",
        "description": "Full-stack web applications and APIs built with modern tools.",
        "icon": "SWE",
        "order": 3,
        "items": ["React / Next.js", "Django REST", "Tailwind CSS", "Bootstrap", "Wagtail CMS"],
    },
    {
        "title": "Teaching & Tutoring",
        "description": "Mathematics, Physics, AI, and productivity tools for all levels.",
        "icon": "TEACH",
        "order": 4,
        "items": ["Mathematics", "Physics", "AI / ML", "Spreadsheets", "Linux & LaTeX", "Office Suites"],
    },
    {
        "title": "Research & Analysis",
        "description": "Data-driven research, statistics, and predictive modeling.",
        "icon": "RESEARCH",
        "order": 5,
        "items": ["Data Analysis", "Statistics", "Visualization", "Predictive Modeling", "Reporting"],
    },
    {
        "title": "Consulting & Policy",
        "description": "Education policy, strategic planning, and donor relations.",
        "icon": "POLICY",
        "order": 6,
        "items": ["Education Policy", "Strategic Planning", "Donor Relations"],
    },
]


class Command(BaseCommand):
    help = "Seed the portfolio with a homepage and initial services."

    def handle(self, *args, **options):
        self.stdout.write(self.style.MIGRATE_HEADING("Seeding portfolio..."))

        # Ensure HomePage exists
        homepage = HomePage.objects.first()

        if not homepage:
            root = Page.get_first_root_node()
            homepage = HomePage(
                title="Home",
                slug="home",
                hero_title="Hi, I'm Alton Kesselly.",
                hero_subtitle=(
                    "I build AI systems, interactive dashboards, and digital tools "
                    "for education and development."
                ),
            )
            root.add_child(instance=homepage)
            homepage.save_revision().publish()
            self.stdout.write(self.style.SUCCESS("  OK: Created HomePage"))
        else:
            self.stdout.write(f"  -- HomePage already exists (id={homepage.id})")

        # Set the site root
        site = Site.objects.first()
        if site:
            site.root_page = homepage
            site.site_name = "Alton Kesselly"
            site.save()
            self.stdout.write(self.style.SUCCESS("  OK: Set site root to HomePage"))
        else:
            self.stdout.write(self.style.WARNING("  !! No Site found - skipping"))

        # Seed Services
        created_count = 0
        for svc in SERVICES:
            obj, created = Service.objects.get_or_create(
                title=svc["title"],
                defaults={
                    "description": svc["description"],
                    "icon": svc["icon"],
                    "order": svc["order"],
                    "items": [("item", item) for item in svc["items"]],
                },
            )
            if created:
                created_count += 1
                self.stdout.write(self.style.SUCCESS(f"  OK: Created service: {svc['title']}"))
            else:
                self.stdout.write(f"  -- Service exists: {svc['title']}")

        self.stdout.write("")
        self.stdout.write(self.style.SUCCESS(
            f"Done. {created_count} new services created."
        ))
