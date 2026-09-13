"""
Content models for the Alton Kesselly portfolio.

Includes:
- HomePage: hero, stats, rotating roles, trusted-by logos
- ProjectPage: portfolio projects (AI, dashboards, software, education)
- BlogPage: articles and insights
- LecturePage: online courses and tutorials
- Service: snippet for "What I Do" cards
"""
from django.db import models
from wagtail.models import Page
from wagtail.fields import StreamField
from wagtail.admin.panels import FieldPanel, MultiFieldPanel
from wagtail.api import APIField
from wagtail import blocks
from wagtail.images.blocks import ImageChooserBlock
from wagtail.snippets.models import register_snippet
from modelcluster.models import ClusterableModel


# ─────────────────────────────────────────────
# REUSABLE BLOCKS
# ─────────────────────────────────────────────

class TechStackBlock(blocks.StructBlock):
    """A single technology tag with optional icon slug."""
    name = blocks.CharBlock(max_length=50)
    icon = blocks.CharBlock(max_length=50, required=False, help_text="e.g. 'python', 'react'")

    class Meta:
        icon = "tag"
        label = "Technology"


class MetricBlock(blocks.StructBlock):
    """A single impact metric (e.g., $300M+ donor support)."""
    value = blocks.CharBlock(max_length=20)
    label = blocks.CharBlock(max_length=100)

    class Meta:
        icon = "plus"
        label = "Metric"


class LessonBlock(blocks.StructBlock):
    """One lesson inside a lecture/course."""
    title = blocks.CharBlock(max_length=200)
    duration = blocks.CharBlock(max_length=20, help_text="e.g. '12 min'")
    video_url = blocks.URLBlock(required=False)

    class Meta:
        icon = "media"
        label = "Lesson"


# ─────────────────────────────────────────────
# HOMEPAGE
# ─────────────────────────────────────────────

class HomePage(Page):
    """The landing page. Only one instance should exist."""

    hero_title = models.CharField(max_length=200, default="Hi, I'm Alton Kesselly.")
    hero_subtitle = models.CharField(
        max_length=300,
        default=(
            "I build AI systems, interactive dashboards, and digital tools "
            "for education and development."
        ),
    )
    hero_cta_text = models.CharField(max_length=50, default="Chat with my AI")
    hero_cta_link = models.CharField(max_length=200, default="/chat")

    rotating_roles = StreamField(
        [("role", blocks.CharBlock(max_length=100))],
        blank=True,
        use_json_field=True,
        help_text="Roles that cycle in the hero typing animation.",
    )

    stats = StreamField(
        [("stat", MetricBlock())],
        blank=True,
        use_json_field=True,
        help_text="Stat cards shown under the hero.",
    )

    trusted_by = StreamField(
        [
            ("logo", blocks.StructBlock([
                ("name", blocks.CharBlock(max_length=100)),
                ("image", ImageChooserBlock(required=False)),
            ])),
        ],
        blank=True,
        use_json_field=True,
        help_text="Organizations or institutions you've worked with.",
    )

    content_panels = Page.content_panels + [
        MultiFieldPanel([
            FieldPanel("hero_title"),
            FieldPanel("hero_subtitle"),
            FieldPanel("hero_cta_text"),
            FieldPanel("hero_cta_link"),
        ], heading="Hero Section"),
        FieldPanel("rotating_roles"),
        FieldPanel("stats"),
        FieldPanel("trusted_by"),
    ]

    api_fields = [
        APIField("hero_title"),
        APIField("hero_subtitle"),
        APIField("hero_cta_text"),
        APIField("hero_cta_link"),
        APIField("rotating_roles"),
        APIField("stats"),
        APIField("trusted_by"),
    ]

    max_count = 1
    subpage_types = ["home.ProjectPage", "home.BlogPage", "home.LecturePage"]

    class Meta:
        verbose_name = "Homepage"


# ─────────────────────────────────────────────
# PROJECT PAGE
# ─────────────────────────────────────────────

class ProjectPage(Page):
    """A portfolio project with links, tech stack, and case study."""

    CATEGORY_CHOICES = [
        ("ai_ml", "AI & Machine Learning"),
        ("dashboard", "Data & Dashboards"),
        ("software", "Software Engineering"),
        ("education", "Education & Policy"),
        ("research", "Research & Analysis"),
        ("teaching", "Teaching & Tutorials"),
    ]

    intro = models.TextField(max_length=500, help_text="Short summary for cards.")
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default="software")
    featured = models.BooleanField(default=False, help_text="Show on homepage grid.")

    live_demo_url = models.URLField(blank=True)
    case_study_url = models.URLField(blank=True)
    github_url = models.URLField(blank=True)

    thumbnail = models.ForeignKey(
        "wagtailimages.Image",
        null=True, blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
    )

    tech_stack = StreamField(
        [("tech", TechStackBlock())],
        blank=True,
        use_json_field=True,
    )

    body = StreamField(
        [
            ("heading", blocks.CharBlock(form_classname="title")),
            ("paragraph", blocks.RichTextBlock()),
            ("image", ImageChooserBlock()),
            ("code", blocks.StructBlock([
                ("language", blocks.CharBlock(max_length=20)),
                ("code", blocks.TextBlock()),
            ], icon="code")),
        ],
        blank=True,
        use_json_field=True,
        help_text="Full case study content.",
    )

    content_panels = Page.content_panels + [
        FieldPanel("intro"),
        FieldPanel("category"),
        FieldPanel("featured"),
        FieldPanel("thumbnail"),
        FieldPanel("tech_stack"),
        MultiFieldPanel([
            FieldPanel("live_demo_url"),
            FieldPanel("case_study_url"),
            FieldPanel("github_url"),
        ], heading="Links"),
        FieldPanel("body"),
    ]

    api_fields = [
        APIField("intro"),
        APIField("category"),
        APIField("featured"),
        APIField("live_demo_url"),
        APIField("case_study_url"),
        APIField("github_url"),
        APIField("thumbnail"),
        APIField("tech_stack"),
        APIField("body"),
    ]

    parent_page_types = ["home.HomePage"]
    subpage_types = []

    class Meta:
        verbose_name = "Project"


# ─────────────────────────────────────────────
# BLOG PAGE
# ─────────────────────────────────────────────

class BlogPage(Page):
    """A blog post or insight article."""

    date = models.DateField("Post date")
    intro = models.TextField(max_length=300)
    author = models.CharField(max_length=100, default="Alton Kesselly")
    reading_time = models.PositiveIntegerField(default=5, help_text="Minutes")
    category = models.CharField(max_length=50, default="AI & Education")

    cover_image = models.ForeignKey(
        "wagtailimages.Image",
        null=True, blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
    )

    body = StreamField(
        [
            ("heading", blocks.CharBlock(form_classname="title")),
            ("paragraph", blocks.RichTextBlock()),
            ("image", ImageChooserBlock()),
            ("code", blocks.StructBlock([
                ("language", blocks.CharBlock(max_length=20)),
                ("code", blocks.TextBlock()),
            ], icon="code")),
            ("quote", blocks.BlockQuoteBlock()),
        ],
        use_json_field=True,
    )

    content_panels = Page.content_panels + [
        FieldPanel("date"),
        FieldPanel("intro"),
        FieldPanel("author"),
        FieldPanel("reading_time"),
        FieldPanel("category"),
        FieldPanel("cover_image"),
        FieldPanel("body"),
    ]

    api_fields = [
        APIField("date"),
        APIField("intro"),
        APIField("author"),
        APIField("reading_time"),
        APIField("category"),
        APIField("cover_image"),
        APIField("body"),
    ]

    parent_page_types = ["home.HomePage"]
    subpage_types = []

    class Meta:
        verbose_name = "Blog Post"


# ─────────────────────────────────────────────
# LECTURE PAGE
# ─────────────────────────────────────────────

class LecturePage(Page):
    """An online course or tutorial."""

    LEVEL_CHOICES = [
        ("beginner", "Beginner"),
        ("intermediate", "Intermediate"),
        ("advanced", "Advanced"),
    ]

    intro = models.TextField(max_length=500)
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES, default="beginner")
    duration = models.CharField(max_length=50, help_text="e.g. '4h 30m'")
    lesson_count = models.PositiveIntegerField(default=0)
    featured = models.BooleanField(default=False)

    cover_image = models.ForeignKey(
        "wagtailimages.Image",
        null=True, blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
    )

    video_url = models.URLField(blank=True, help_text="YouTube / Vimeo embed URL")
    syllabus_url = models.URLField(blank=True)

    lessons = StreamField(
        [("lesson", LessonBlock())],
        blank=True,
        use_json_field=True,
    )

    body = StreamField(
        [
            ("heading", blocks.CharBlock(form_classname="title")),
            ("paragraph", blocks.RichTextBlock()),
            ("image", ImageChooserBlock()),
        ],
        blank=True,
        use_json_field=True,
    )

    content_panels = Page.content_panels + [
        FieldPanel("intro"),
        FieldPanel("level"),
        FieldPanel("duration"),
        FieldPanel("lesson_count"),
        FieldPanel("featured"),
        FieldPanel("cover_image"),
        FieldPanel("video_url"),
        FieldPanel("syllabus_url"),
        FieldPanel("lessons"),
        FieldPanel("body"),
    ]

    api_fields = [
        APIField("intro"),
        APIField("level"),
        APIField("duration"),
        APIField("lesson_count"),
        APIField("featured"),
        APIField("cover_image"),
        APIField("video_url"),
        APIField("syllabus_url"),
        APIField("lessons"),
        APIField("body"),
    ]

    parent_page_types = ["home.HomePage"]
    subpage_types = []

    class Meta:
        verbose_name = "Lecture"


# ─────────────────────────────────────────────
# SERVICE SNIPPET
# ─────────────────────────────────────────────

@register_snippet
class Service(ClusterableModel):
    """A service offering (e.g., 'AI & ML Solutions')."""

    title = models.CharField(max_length=100)
    description = models.TextField(max_length=300)
    icon = models.CharField(max_length=50, help_text="Emoji or icon name")
    order = models.PositiveIntegerField(default=0, help_text="Display order")

    items = StreamField(
        [("item", blocks.CharBlock(max_length=100))],
        blank=True,
        use_json_field=True,
        help_text="List of sub-services.",
    )

    panels = [
        FieldPanel("title"),
        FieldPanel("description"),
        FieldPanel("icon"),
        FieldPanel("order"),
        FieldPanel("items"),
    ]

    api_fields = [
        APIField("title"),
        APIField("description"),
        APIField("icon"),
        APIField("order"),
        APIField("items"),
    ]

    def __str__(self):
        return self.title

    class Meta:
        ordering = ["order"]
        verbose_name = "Service"
        verbose_name_plural = "Services"