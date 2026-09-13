"""
Custom Wagtail admin hooks.

Adds a 'Portfolio Overview' panel to the top of the Wagtail admin dashboard.
"""
from django.urls import reverse
from wagtail import hooks
from wagtail.admin.ui.components import Component


class PortfolioStatsPanel(Component):
    """Dashboard panel that summarizes portfolio content."""

    order = 100
    template_name = "home/dashboard/stats_panel.html"

    def get_context_data(self, parent_context):
        from home.models import HomePage, ProjectPage, BlogPage, LecturePage, Service
        from ai_chat.models import ChatLog

        # HomePage is the parent for all content pages (required for add URLs)
        homepage = HomePage.objects.first()
        parent_id = homepage.id if homepage else None

        # Build add URLs only if a HomePage exists
        project_url = (
            reverse("wagtailadmin_pages:add", args=["home", "projectpage", parent_id])
            if parent_id else ""
        )
        blog_url = (
            reverse("wagtailadmin_pages:add", args=["home", "blogpage", parent_id])
            if parent_id else ""
        )
        lecture_url = (
            reverse("wagtailadmin_pages:add", args=["home", "lecturepage", parent_id])
            if parent_id else ""
        )

        return {
            "project_count": ProjectPage.objects.live().count(),
            "blog_count": BlogPage.objects.live().count(),
            "lecture_count": LecturePage.objects.live().count(),
            "service_count": Service.objects.count(),
            "chat_count": ChatLog.objects.count(),
            "flagged_chats": ChatLog.objects.filter(flagged=True).count(),
            "project_url": project_url,
            "blog_url": blog_url,
            "lecture_url": lecture_url,
        }


@hooks.register("construct_homepage_panels")
def add_portfolio_panels(request, panels):
    """Insert our custom panel at the top of the admin dashboard."""
    panels.insert(0, PortfolioStatsPanel())