"""
Production bootstrap command.

Idempotent — safe to run on every deploy.

- Fixes the Wagtail Site hostname
- Runs seed_portfolio (homepage, services)
- Creates superuser if DJANGO_SUPERUSER_* env vars are set
"""
import os

from django.contrib.auth import get_user_model
from django.core.management import call_command
from django.core.management.base import BaseCommand
from wagtail.models import Site


class Command(BaseCommand):
    help = "Idempotently bootstrap production (site host, seed, superuser)."

    def handle(self, *args, **options):
        # ─── 1. Fix the Wagtail Site hostname ─────
        primary_host = (
            os.environ.get("PRIMARY_HOST")
            or os.environ.get("DJANGO_ALLOWED_HOSTS", "").split(",")[0].strip()
            or "localhost"
        )
        if primary_host.startswith("."):
            primary_host = primary_host[1:]

        site = Site.objects.first()
        if site:
            if site.hostname != primary_host:
                site.hostname = primary_host
                site.port = 80
                site.save()
                self.stdout.write(
                    self.style.SUCCESS(f"  OK: Site hostname set to {primary_host}")
                )
            else:
                self.stdout.write(f"  -- Site hostname already {primary_host}")
        else:
            self.stdout.write(self.style.WARNING("  !! No Site found"))

        # ─── 2. Run seed ──────────────────────────
        self.stdout.write("  Running seed_portfolio...")
        call_command("seed_portfolio")

        # ─── 3. Ensure superuser ──────────────────
        User = get_user_model()
        username = os.environ.get("DJANGO_SUPERUSER_USERNAME")
        email = os.environ.get("DJANGO_SUPERUSER_EMAIL")
        password = os.environ.get("DJANGO_SUPERUSER_PASSWORD")

        if not username or not password:
            self.stdout.write(
                "  -- Skipping superuser (set DJANGO_SUPERUSER_USERNAME/PASSWORD to create)"
            )
            return

        if User.objects.filter(username=username).exists():
            self.stdout.write(f"  -- Superuser '{username}' already exists")
        else:
            User.objects.create_superuser(
                username=username, email=email or "", password=password
            )
            self.stdout.write(
                self.style.SUCCESS(f"  OK: Superuser '{username}' created")
            )

        self.stdout.write(self.style.SUCCESS("Bootstrap complete."))
