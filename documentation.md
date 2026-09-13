# Project Setup Documentation
## A Reusable Guide for Building Django + Wagtail + Next.js Projects

This document records every step taken to build the **Alton Kesselly Portfolio** project, with explanations of *why* each step is done. Use it as a template for future projects of a similar nature.

---

## Table of Contents

1. [Phase 0 — Prerequisites Check](#phase-0--prerequisites-check)
2. [Phase 1 — Project Directory + Git Init](#phase-1--project-directory--git-init)
3. [Phase 2 — Backend: Django + Wagtail](#phase-2--backend-django--wagtail)
4. [Phase 3 — Frontend: Next.js + Tailwind](#phase-3--frontend-nextjs--tailwind)
5. [Phase 4 — AI Chatbot](#phase-4--ai-chatbot)
6. [Phase 5 — Private Dashboard](#phase-5--private-dashboard)
7. [Phase 6 — Deployment](#phase-6--deployment)

---

## Phase 0 — Prerequisites Check

### Purpose
Verify that all required tools are installed and meet minimum version requirements before starting. This prevents cryptic errors later.

### Tools to Check

| Tool | Minimum Version | Purpose |
|---|---|---|
| Python | 3.10 – 3.13 | Backend runtime |
| Node.js | 18 or 20+ | Frontend runtime |
| npm | 9+ | Package manager for Node |
| Git | 2.30+ | Version control |
| PostgreSQL | 13+ | Production database (SQLite for dev) |

### Special Note: Python Version Choice

**Do not use the newest Python release immediately.** The Django + Wagtail ecosystem typically lags 6–12 months behind the latest Python release.

**Recommended strategy:**
1. Check supported Python versions on Django and Wagtail websites.
2. Install the highest **supported** version (e.g., 3.12) even if a newer one (e.g., 3.14) exists.
3. Install it **alongside** the system Python — never replace the system Python.
4. Use the new version **only inside a virtual environment**.

### Installing Python 3.12 on Ubuntu (example)

    sudo add-apt-repository ppa:deadsnakes/ppa -y
    sudo apt update
    sudo apt install python3.12 python3.12-venv python3.12-dev -y
    python3.12 --version
    python3.12 -m venv --help | head -3

### Phase 0 Exit Criteria
- `python3.12 --version` prints `Python 3.12.x`
- `python3.12 -m venv --help` prints usage without errors

---

## Phase 1 — Project Directory + Git Init

### Step 1.1 — Inspect the Target Directory

    pwd
    ls -la
    git status

If a prior failed attempt left files, remove them before starting clean.

### Step 1.2 — Wipe the Directory Clean (if needed)

    rm -rf <old-files>

### Step 1.3 — Initialize Git

    git init -b main
    git status

**Why `-b main`:** Sets default branch to `main` instead of `master`, matching GitHub conventions.

### Step 1.4 — Create `.gitignore`

    touch .gitignore
    code .gitignore

**Critical:** Without `.gitignore`, the first commit will sweep in:
- `env/` — virtual environment (hundreds of MB)
- `.env` — secrets (security risk)
- `db.sqlite3` — local database
- `__pycache__/` — compiled Python
- `node_modules/` — Node dependencies

Use a comprehensive `.gitignore` covering Python, Node, IDE, and OS files.

### Step 1.5 — Create `README.md`

A good README contains:
- Project title and description
- Purpose
- Tech stack
- Project structure
- Local dev setup
- Author info
- License

### Step 1.6 — First Commit

    git add .
    git status
    git commit -m "chore: initial project setup with gitignore, README, and docs"

**Commit message convention (Conventional Commits):**

| Prefix | Use |
|---|---|
| `chore:` | Setup, tooling, maintenance |
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation only |
| `refactor:` | Code cleanup without behavior change |

### One-Time Setup: Git Identity

The first commit fails if Git doesn't know who you are:

    git config --global user.email "you@example.com"
    git config --global user.name "Your Name"

Verify:

    git config --global --list | grep user

### Step 1.7 — Create GitHub Repo and Push

**Part A — Create repo on GitHub:**
1. Go to https://github.com/new
2. Fill in: name, description, visibility
3. **Leave ALL checkboxes unchecked:**
   - ☐ Add README file
   - ☐ Add .gitignore
   - ☐ Choose a license
   - ☐ Start with a template

**Why:** You already have files locally. GitHub creating its own would cause a "non-fast-forward" conflict when pushing.

**Part B — Connect local to remote:**

    git remote add origin https://github.com/USERNAME/REPO.git
    git remote -v

**Part C — Authenticate with GitHub CLI:**

    sudo apt install gh -y
    gh auth login

If browser login returns HTTP 500:

    gh auth login --with-token

Create a Personal Access Token at https://github.com/settings/tokens (scopes: `repo`, `workflow`, `read:org`).

**Part D — Configure Git to use `gh` for auth:**

    gh auth setup-git
    git config --global --get-regexp credential

**Part E — Push:**

    git push -u origin main
    git branch -vv

### Phase 1 Exit Criteria
- Git repo with `main` branch
- `.gitignore`, `README.md`, `documentation.md` committed
- Remote `origin` on GitHub
- `gh` CLI authenticated
- Local `main` tracks `origin/main`

---

## Phase 2 — Backend: Django + Wagtail

### Overview
Headless CMS backend. Django + Wagtail. Serves JSON via `/api/v2/`. SQLite in dev, PostgreSQL-ready for prod.

### Step 2.1 — Create the Virtual Environment

    python3.12 -m venv env
    source env/bin/activate
    which python        # → .../env/bin/python
    python --version    # → 3.12.x

### Step 2.2 — Install Core Packages

    pip install --upgrade pip
    pip install "Django>=5.2,<6.1" "wagtail>=7.0,<8.0"
    pip install "Pillow>=10.0,<12.0"

Quotes around version specs are required — `<` and `>` are shell redirection operators otherwise.

### Step 2.3 — Scaffold the Wagtail Project

    mkdir backend
    cd backend
    wagtail start backend .

**The two arguments:** `backend` (module name), `.` (current directory — avoids nested `backend/backend/backend/`).

### Step 2.4 — Install Extra Packages

    pip install "python-dotenv>=1.0,<2.0"
    pip install "django-cors-headers>=4.3,<5.0"
    pip install "wagtail-headless-preview>=0.9,<1.0"

### Step 2.5 — Create `.env` and `.env.example`

`.env` — real secrets (never committed):

    DJANGO_SECRET_KEY=<generated-key>
    DJANGO_DEBUG=True
    DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1
    DB_NAME=
    DB_USER=
    DB_PASSWORD=
    DB_HOST=localhost
    DB_PORT=5432
    FRONTEND_URL=http://localhost:3000
    OPENAI_API_KEY=

`.env.example` — same content, secret values blank. Committed to Git as template.

Generate a Django secret key:

    python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"

Verify `.gitignore` protects `.env`:

    git check-ignore -v .env          # should print matching rule
    git check-ignore -v .env.example  # should print NOTHING

### Step 2.6 — Rewrite `backend/settings/base.py`

Key additions over Wagtail's default:
- `load_dotenv()` to read `.env`
- `SECRET_KEY = os.getenv(...)` — no secret in source
- `ai_chat` app in `INSTALLED_APPS`
- `wagtail.api.v2`, `rest_framework`, `wagtail_headless_preview`
- `corsheaders` + middleware
- SQLite/Postgres toggle based on `DB_NAME`
- `TIME_ZONE = "Africa/Monrovia"`
- `WAGTAILAPI_LIMIT_MAX = 50`

### Step 2.7 — Create the `ai_chat` App (Chicken-and-Egg)

Django parses `INSTALLED_APPS` before any command runs. If `ai_chat` is listed but doesn't exist, every command fails. Order:

1. Comment out `"ai_chat"` in `INSTALLED_APPS`
2. `python manage.py check` — should pass
3. `python manage.py startapp ai_chat`
4. Uncomment `"ai_chat"`
5. `python manage.py check` — should pass

### Step 2.8 — Migrations and Superuser

    python manage.py migrate
    python manage.py createsuperuser
    python manage.py runserver

Verify login at http://127.0.0.1:8000/admin/

### Step 2.9 — Content Models (`home/models.py`)

Defines the entire content schema:

| Class | Purpose |
|---|---|
| `TechStackBlock` | Reusable block: technology name + icon |
| `MetricBlock` | Reusable block: stat value + label |
| `LessonBlock` | Reusable block: lesson title, duration, video URL |
| `HomePage` | Hero, stats, rotating roles, trusted-by logos |
| `ProjectPage` | Portfolio project with intro, category, tech stack, case study |
| `BlogPage` | Article with date, intro, cover, rich body |
| `LecturePage` | Course with level, duration, lessons, video URL |
| `Service` (snippet) | "What I Do" cards with sub-items |

**Key:** Every field in `api_fields` becomes available in the JSON API.

After changing models:

    python manage.py makemigrations home
    python manage.py migrate

### Step 2.10 — ChatLog Model (`ai_chat/models.py`)

Fields: `session_id`, `user_message`, `ai_response`, `page_context`, `flagged`, `created_at`.

Registered in Django admin at `/django-admin/ai_chat/chatlog/`.

### Step 2.11 — API Router (`home/api.py`) and URLs

`home/api.py` registers three endpoints:

    api_router.register_endpoint("pages", PagesAPIViewSet)
    api_router.register_endpoint("images", ImagesAPIViewSet)
    api_router.register_endpoint("documents", DocumentsAPIViewSet)

`backend/urls.py` route order (CRITICAL — catch-all must be LAST):

| Route | Purpose |
|---|---|
| `/django-admin/` | Django admin |
| `/admin/` | Wagtail admin |
| `/documents/` | Document serving |
| `/api/v2/` | REST API |
| `/` (last) | Wagtail page serving |

**Note:** `/api/v2/` alone returns 404 — only specific endpoints exist.

### Step 2.12 — Custom Dashboard Panel

Files:
- `home/wagtail_hooks.py` — registers the panel
- `home/templates/home/dashboard/stats_panel.html` — panel HTML

**CRITICAL GOTCHA:** Wagtail's page "add" URL needs THREE arguments:

    reverse("wagtailadmin_pages:add", args=["home", "projectpage", parent_id])

Missing `parent_id` → `NoReverseMatch`. Get it from:

    from home.models import HomePage
    homepage = HomePage.objects.first()
    parent_id = homepage.id

Verify the hook loads:

    python manage.py shell
    >>> from wagtail import hooks
    >>> hooks.get_hooks("construct_homepage_panels")

Should return a list containing `add_portfolio_panels`.

### Step 2.13 — Seed Command

Folder structure:

    home/management/
    ├── __init__.py
    └── commands/
        ├── __init__.py
        └── seed_portfolio.py

Both `__init__.py` files are required (even empty).

    python manage.py seed_portfolio

Ensures HomePage exists, sets site root, creates 6 default Services.

### Common Pitfalls (Phase 2)

1. **VS Code silent save failure** — paste and press `Ctrl+S`. Verify with `wc -l`. Workaround: use terminal heredocs.

2. **Django chicken-and-egg with `INSTALLED_APPS`** — comment out → `startapp` → uncomment.

3. **`reverse()` missing URL arguments** — the pattern defines the argument count. Pass exactly that many.

4. **Middleware order** — `corsheaders.middleware.CorsMiddleware` before `CommonMiddleware`.

5. **`wagtail start` without trailing dot** — creates nested `backend/backend/`.

6. **Route order in `urls.py`** — catch-all `re_path(r"^", ...)` must be last.

### Phase 2 Exit Criteria
- Django 6.0 + Wagtail 7.4 in isolated venv
- PostgreSQL-ready settings (SQLite in dev)
- Models migrated: HomePage, ProjectPage, BlogPage, LecturePage, Service, ChatLog
- REST API at `/api/v2/pages/`
- Custom dashboard panel
- Seed command
- `.env` protected

---

## Phase 3 — Frontend: Next.js + Tailwind

### Overview
Next.js 16.3.5 with App Router, TypeScript, Tailwind v4, Turbopack. Fetches from Wagtail at `http://127.0.0.1:8000`.

### Step 3.1 — Create the Next.js App

From project root:

    npx create-next-app@latest frontend

Answers to prompts:

| Prompt | Answer |
|---|---|
| Recommended defaults? | No, customize settings |
| TypeScript? | Yes |
| Which linter? | ESLint |
| React Compiler? | No |
| Tailwind CSS? | Yes |
| Use `src/`? | No |
| App Router? | Yes |
| Custom import alias? | No |
| AGENTS.md? | Yes |

Verify no nested `.git`:

    ls -la frontend/.git 2>/dev/null && echo "Nested .git found!" || echo "No nested .git"

If found: `rm -rf frontend/.git`

### Step 3.2 — Tailwind v4 Configuration

Next.js 16 uses Tailwind v4 with **CSS-first config**. No `tailwind.config.ts`. Custom colors go in `app/globals.css` inside `@theme { ... }`.

### Step 3.3 — Design System (`app/globals.css`)

Color families:

| Family | Purpose | Utility |
|---|---|---|
| `navy-950` … `navy-500` | Backgrounds | `bg-navy-900` |
| `gold-600` … `gold-200` | Primary accent | `text-gold-400` |
| `electric-700` … `electric-300` | Secondary accent | `text-electric-400` |
| `emerald-700` … `emerald-400` | Success | `text-emerald-500` |
| `ink-50` … `ink-700` | Text/borders | `text-ink-300` |

Custom animations: `animate-fade-up`, `animate-shimmer`, `animate-float`, `animate-marquee`.

Base styles: dark body, custom scrollbar, `::selection` in gold, focus outlines.

### Step 3.4 — Update `app/layout.tsx`

Defines:
- Font loading (Geist Sans, Geist Mono)
- Comprehensive `metadata` with templates, description, keywords, OG, Twitter card
- Site shell: `<SiteHeader />`, `<main>{children}</main>`, `<SiteFooter />`

**Title template pattern:**

    title: {
      default: "Alton Kesselly — AI Researcher & Full-Stack Developer",
      template: "%s | Alton Kesselly",
    }

A child page returning `export const metadata = { title: "About" }` renders as **"About | Alton Kesselly"**.

**Hydration suppression:** Add `suppressHydrationWarning` to `<html>` and `<body>` — some browser extensions (ColorZilla, Dark Reader) inject attributes.

### Step 3.5 — Create `components/site-header.tsx`

- `"use client"` (uses `useState`)
- Sticky, translucent, backdrop-blur
- Gold gradient AK logo
- Nav links: Home, About, Services, Projects, Lectures, Blog, Contact
- Gold "Hire Me" CTA
- Mobile hamburger toggle

### Step 3.6 — Centralize Socials (`lib/socials.tsx`)

**IMPORTANT:** The file is `.tsx`, not `.ts` — because it contains JSX (`<svg>` elements). A `.ts` file cannot contain JSX.

Exports `SOCIALS` array with 7 entries:
X, LinkedIn, Instagram, TikTok, GitHub, YouTube, Facebook.

Each entry: `{ label, href, color, hoverBg, icon }`.

### Step 3.7 — Create `components/site-footer.tsx`

- Three columns: Brand, Explore, Connect
- 7 social icons with hover glow + tooltip
- Uses dynamic CSS variable `--brand-color` for icon color on hover

### Step 3.8 — Hero Section (`components/hero-section.tsx`)

Elements:
- Green pulsing availability badge
- Gradient name "Alton Kesselly"
- Typing animation cycling 5 roles
- Bio paragraph
- 3 CTAs: Chat with my AI, Download CV, Watch Intro
- 4 stat cards with accent colors (gold/electric/emerald)
- Circular photo frame with gold ring
- 6 floating tech badges (Python, PyTorch, ROS2, Next.js, TensorFlow, React)

**Photo file:** `public/alton.png` (must be in `public/`, referenced as `/alton.png`).

### Step 3.9 — Tech Marquee (`components/tech-marquee.tsx`)

Full-width scrolling strip with 30 items. Two identical rows with `animate-marquee` for seamless infinite scroll.

**CSS required** in `globals.css`:

Inside `@theme`:
    --animate-marquee: marquee 40s linear infinite;

Outside:
    @keyframes marquee {
      from { transform: translateX(0); }
      to   { transform: translateX(-100%); }
    }

### Step 3.10 — About Page (`app/about/page.tsx`)

Sections:
1. Header with "About Me" badge
2. Education — 5 cards
3. Experience — vertical timeline with 6 roles
4. Skills — 5 category cards
5. Languages — progress bars
6. Certifications — 7 badges
7. CTA

### Step 3.11 — Services Page (`app/services/page.tsx`)

Six service cards. Each has:
- Icon + service number + title
- Colored tagline
- "What I offer" checklist
- "Common use cases" panel

### Step 3.12 — Contact Page (`app/contact/page.tsx`)

`"use client"` component.

Layout:
- Left: contact info cards + socials panel + availability box
- Right: form (Name, Email, Subject, Message)

**Form behavior (temporary):** Submits via `mailto:` — opens user's email client with pre-filled content. To be replaced with a proper backend endpoint.

### Step 3.13 — Projects Page (`app/projects/page.tsx`)

Async Server Component. Fetches via `getProjects()`.

Three states: error banner (backend down), empty state (dashed card), populated grid.

Each card:
- Cover image or 🎨 placeholder
- Color-coded category badge
- Title, intro
- Tech stack pills
- Live demo / Code / Details links

### Step 3.14 — Blog and Lectures Pages

`app/blog/page.tsx` and `app/lectures/page.tsx`.

Same pattern as Projects. Blog cards show date, reading time, author. Lecture cards show level badge (color-coded), duration, lesson count, play overlay on hover.

### Step 3.15 — The API Client (`lib/api.ts`)

Central module for backend communication.

Base URL: `process.env.NEXT_PUBLIC_API_URL` (default `http://127.0.0.1:8000`).

Exports:
- `getProjects()`
- `getFeaturedProjects()`
- `getBlogPosts()`
- `getLectures()`
- `imageUrl(image)` — resolves relative Wagtail image URLs

Caching: `next: { revalidate: 60 }` — 60-second cache.

### Environment Configuration

`frontend/.env.local`:

    NEXT_PUBLIC_API_URL=http://127.0.0.1:8000

**Important:** `.env*` files are gitignored — safe from accidental commit.

**Note:** `NEXT_PUBLIC_*` variables are exposed to the browser. Never put secrets there.

### Common Pitfalls (Phase 3)

1. **Forgetting to restart dev server after `.env` change** — env vars read only at startup.

2. **Backend not running** — API pages show red error banner. Run both terminals in parallel.

3. **Wagtail image URLs are relative** — use `imageUrl()` helper.

4. **Caching hides changes** — wait 60 seconds or hard refresh.

5. **`"use client"` only where needed** — pages that fetch from API should NOT use it. Only for pages with hooks/handlers.

6. **`.ts` vs `.tsx`** — files with JSX must be `.tsx`.

### Development Workflow

**Terminal 1 — Backend:**

    cd ~/Documents/alton-portfolio/backend
    source ../env/bin/activate
    python manage.py runserver

**Terminal 2 — Frontend:**

    cd ~/Documents/alton-portfolio/frontend
    npm run dev

Both must run simultaneously.

### Frontend File Structure

    frontend/
    ├── app/
    │   ├── about/page.tsx
    │   ├── blog/page.tsx
    │   ├── contact/page.tsx
    │   ├── lectures/page.tsx
    │   ├── projects/page.tsx
    │   ├── services/page.tsx
    │   ├── favicon.ico
    │   ├── globals.css
    │   ├── layout.tsx
    │   └── page.tsx
    ├── components/
    │   ├── hero-section.tsx
    │   ├── site-header.tsx
    │   ├── site-footer.tsx
    │   └── tech-marquee.tsx
    ├── lib/
    │   ├── api.ts
    │   └── socials.tsx
    ├── public/
    │   └── alton.png
    ├── .env.local           # gitignored
    ├── .gitignore
    ├── AGENTS.md
    ├── package.json
    ├── postcss.config.mjs
    └── tsconfig.json

### Phase 3 Exit Criteria
- All 7 public pages load without errors
- Header and footer work on every page
- Contact form opens email client with pre-filled content
- Projects/Blog/Lectures fetch live data from Wagtail
- Empty states render gracefully
- Error states render when backend unreachable
- Mobile responsive
- `.env.local` gitignored
- Documentation complete

---

## Phase 4 — AI Chatbot

*(To be documented as we build it)*

---

## Phase 5 — Private Dashboard

*(To be documented as we build it)*

---

## Phase 6 — Deployment

*(To be documented as we build it)*

---

## General Principles Followed

1. **One phase at a time.** Complete and verify each phase before moving on.
2. **Explain every command.** Never run something without knowing why.
3. **Clean commits.** Each commit represents one logical unit of change.
4. **Verify before committing.** Run `git status` to see what's being staged.
5. **Never commit secrets.** `.env` files always in `.gitignore`.
6. **Version pinning.** Use ranges (e.g., `Django>=5.2,<6.1`) for security updates.
7. **Virtual environments.** Always isolate dependencies from system Python.

---

## Revision History

| Date | Change |
|---|---|
| 2026-09-13 | Initial creation — Phase 0, 1, 2, 3 documented |

## Phase 4 — AI Chatbot

### Overview

A floating chat widget embedded on every page. Streams AI responses in real-time from Groq (free tier, OpenAI-compatible) and logs every conversation to the Django backend for review in the admin.

### Architecture

    ┌─────────────┐    POST /api/chat      ┌──────────────┐
    │  Chat       │ ─────────────────────► │  Next.js API │
    │  Widget     │                        │  Route       │
    │  (client)   │ ◄──── streamed ─────── │              │
    └─────────────┘       text             └──────┬───────┘
                                                  │
                                                  │ HTTPS
                                                  ▼
                                          ┌──────────────┐
                                          │  Groq API    │
                                          │  (LLM)       │
                                          └──────────────┘

    On finish, widget POSTs to backend:

    ┌─────────────┐    POST /api/chat-log  ┌──────────────┐
    │  Chat       │ ─────────────────────► │  Django      │
    │  Widget     │                        │  ChatLog     │
    └─────────────┘                        └──────────────┘

### Step 4.1 — Install Packages

    npm install ai @ai-sdk/openai @ai-sdk/react

Current versions (Sept 2026):
- `ai@7.x` — core SDK
- `@ai-sdk/openai@4.x` — provider
- `@ai-sdk/react@4.x` — `useChat` hook

### Step 4.2 — Environment Variables

Add to `frontend/.env.local`:

    NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
    GROQ_API_KEY=gsk_...

**Security:**
- `.env.local` is gitignored — never committed
- `GROQ_API_KEY` has **no** `NEXT_PUBLIC_` prefix → server-side only
- Rotate the key immediately if it's ever exposed publicly

**Free providers (no credit card):**
| Provider | Free Tier | Card |
|---|---|---|
| Groq | 1,000 req/day | No |
| Google AI Studio | 1,500 req/day | No |
| Ollama (local) | Unlimited | No |

### Step 4.3 — Chat API Route (`app/api/chat/route.ts`)

Key elements:

    import { createOpenAI } from "@ai-sdk/openai";
    import { convertToModelMessages, streamText } from "ai";

    export const maxDuration = 30;

    const groq = createOpenAI({
      baseURL: "https://api.groq.com/openai/v1",
      apiKey: process.env.GROQ_API_KEY ?? "",
    });

    // In POST handler:
    const modelMessages = await convertToModelMessages(messages);
    const result = streamText({
      model: groq.chat("openai/gpt-oss-120b"),
      system: SYSTEM_PROMPT,
      messages: modelMessages,
    });
    return result.toUIMessageStreamResponse();

**Critical learnings:**

| Issue | Solution |
|---|---|
| Edge runtime deprecated in Next 16 | Remove `export const runtime = "edge"` |
| `convertToModelMessages` returns a Promise | Must `await` it |
| AI SDK calls `/responses` instead of `/chat/completions` | Use `groq.chat(...)` instead of `groq(...)` |
| Models deprecated silently | Verify with curl + list models endpoint |

**Check current Groq models before using:**

    KEY=$(grep GROQ_API_KEY .env.local | cut -d'=' -f2)
    curl -s "https://api.groq.com/openai/v1/models" \
      -H "Authorization: Bearer $KEY" | python3 -m json.tool

**System prompt** — grounds the AI in Alton's background, skills, services, availability. Lives directly in the route file for simplicity; can be moved to a separate file later.

### Step 4.4 — Chat Widget (`components/chat-widget.tsx`)

`"use client"` component with:

- Floating gold button (bottom-right)
- Slide-up panel (380×560px)
- Header with "AK" avatar + pulsing "Online" indicator
- Messages area with user/assistant bubbles
- Suggestion chips on empty state
- Auto-scroll to bottom on new message
- Animated "typing" dots while streaming

**Global event listener** to open the widget from anywhere:

    useEffect(() => {
      const handler = () => setOpen(true);
      window.addEventListener("open-chat", handler);
      return () => window.removeEventListener("open-chat", handler);
    }, []);

**SDK v5+ message format:** `m.parts` (array of parts) instead of `m.content` (string).

### Step 4.5 — `OpenChatButton` Component

`components/open-chat-button.tsx` — reusable button that dispatches the event:

    "use client";

    export default function OpenChatButton({ children, className }) {
      return (
        <button
          type="button"
          onClick={() => window.dispatchEvent(new CustomEvent("open-chat"))}
          className={className}
        >
          {children}
        </button>
      );
    }

**Why:** Server Components (like `services/page.tsx`) can't have `onClick` handlers. This small client component bridges that gap.

**Used in:**
- `hero-section.tsx` — "Chat with my AI" CTA
- `services/page.tsx` — "Ask my AI assistant" CTA
- The floating button is separate (in `chat-widget.tsx` itself)

### Step 4.6 — Chat Logging to Backend

**Backend files:**

`ai_chat/views.py`:
    @csrf_exempt
    @require_POST
    def log_chat(request):
        # Parses JSON, validates, creates ChatLog record

`ai_chat/urls.py`:
    urlpatterns = [path("chat-log/", views.log_chat, name="chat-log")]

`backend/urls.py`:
    path("api/", include("ai_chat.urls")),   # BEFORE the catch-all

**Critical:** The `api/` include must come before `re_path(r"^", include(wagtail_urls))`, or Wagtail's page server swallows the request.

**Frontend files:**

`lib/chat-session.ts` — anonymous session ID stored in `sessionStorage`:

    export function getSessionId(): string {
      // Creates and stores ID like "sess-1757...-abc123" on first call
    }

`lib/log-chat.ts` — fire-and-forget POST that never breaks UX:

    export async function logChat(payload) {
      try {
        await fetch(`${apiUrl}/api/chat-log/`, { method: "POST", ... });
      } catch (err) {
        console.warn("[log-chat] failed:", err);
      }
    }

**Widget integration:** Uses `onFinish` callback:

    useChat({
      onFinish: ({ message }) => {
        const aiText = extractTextFromParts(message.parts);
        const userText = lastUserMessageRef.current;
        if (!userText || !aiText) return;
        logChat({ user_message: userText, ai_response: aiText, ... });
      },
    });

The user message is captured in `lastUserMessageRef` because `onFinish` only receives the AI message, not the user's.

### Common Pitfalls (Phase 4)

1. **Exposing API keys in chat** — Never paste a live key anywhere public. Rotate immediately if leaked.

2. **`NEXT_PUBLIC_` prefix leaks secrets** — Anything with this prefix ships to the browser. Keep `GROQ_API_KEY` server-side.

3. **Groq model deprecation** — Models get decommissioned. Always `curl` the models endpoint to verify.

4. **`/responses` vs `/chat/completions`** — AI SDK v5+ defaults to OpenAI's newer `/responses` endpoint. Groq doesn't fully support this; use `groq.chat(...)`.

5. **`convertToModelMessages` is async** — Must `await`. Without it, `streamText` gets a Promise and errors with `messages.some is not a function`.

6. **Route order in `backend/urls.py`** — Custom API routes before the Wagtail catch-all.

7. **`"use client"` needed for `onClick`** — Server Components can't handle interactivity. Wrap in a small client component.

8. **Message format in SDK v5+** — `m.parts`, not `m.content`.

### Testing the Full Loop

1. **Direct API test:** `curl` the chat route with `useChat`-shaped payload
2. **Widget test:** Click a suggestion, watch the response stream
3. **Log verification:** Check `django-admin/ai_chat/chatlog/` for the new entry
4. **Dashboard count:** Wagtail admin "Portfolio Overview" shows "AI Chats: N"

### Phase 4 Exit Criteria

- ✅ Floating chat widget on every page
- ✅ Streaming responses in real-time
- ✅ 4 entry points: hero button, services CTA, floating button, global event
- ✅ Every conversation logged to Django
- ✅ Logs viewable in Django admin
- ✅ Chat count shown on Wagtail dashboard
- ✅ Free tier (Groq) — no credit card required