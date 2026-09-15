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

## Phase 5 — Private Dashboard

### Overview

A login-protected admin interface at `/dashboard` where Alton can:
- See content counts and recent activity
- Browse, filter, and flag AI chat conversations
- Quick-link to the Wagtail and Django admins

### Architecture

    ┌──────────────┐    password     ┌──────────────────┐
    │  Login page  │ ───────────────►│  /api/auth/login │
    │  /dashboard/ │                 │  compares to     │
    │  login       │ ◄─── cookie ─── │  DASHBOARD_PASS  │
    └──────────────┘                 └──────────────────┘

    ┌──────────────┐    cookie       ┌──────────────────┐
    │  Browser     │ ───────────────►│  proxy.ts        │
    │  /dashboard  │                 │  validates token │
    │              │ ◄─── allow ──── │  on every request│
    └──────────────┘                 └──────────────────┘

### Step 5.1 — Backend API Endpoints

Extended `ai_chat/views.py` and `ai_chat/urls.py` with four endpoints:

| Method | URL | Purpose |
|---|---|---|
| POST | `/api/chat-log/` | Widget logs a chat |
| GET | `/api/chat-logs/` | List chats (dashboard) |
| GET | `/api/chat-logs/<id>/` | Single chat |
| POST | `/api/chat-logs/<id>/flag/` | Toggle flagged |

**Query params on list endpoint:**
- `limit` (default 50, max 200)
- `offset` (default 0)
- `flagged=true` (filter flagged only)

**Views use `@csrf_exempt`** because they're called by the Next.js frontend, not a Django-rendered form. For a solo portfolio this is acceptable; a production multi-user app would need proper CSRF tokens or API keys.

### Step 5.2 — Password Auth

**Two secrets in `.env.local`:**

    DASHBOARD_PASSWORD=choose-a-strong-password
    DASHBOARD_TOKEN=any-long-random-string-you-invent

**Why two values:**
- `DASHBOARD_PASSWORD` — what you type on the login page. **Never stored in the cookie.**
- `DASHBOARD_TOKEN` — a random server-side string that goes into the cookie. A leaked cookie exposes the token, not the password.

**Files:**
- `lib/auth.ts` — helpers (`checkPassword`, `getToken`, `isValidToken`)
- `app/api/auth/login/route.ts` — POST, validates password, sets HTTP-only cookie
- `app/api/auth/logout/route.ts` — POST, clears cookie
- `proxy.ts` — Next.js 16's renamed middleware. Guards `/dashboard/*` routes.

**Critical learnings:**

| Issue | Solution |
|---|---|
| Next.js 16 renamed `middleware.ts` → `proxy.ts` | Use `proxy.ts`, not `middleware.ts` |
| Middleware runs on Edge runtime (no `crypto`) | Avoid crypto entirely — use simple string comparison |
| Cookie must be `httpOnly` | Prevents JS access — XSS-safe |
| `sameSite: "lax"` | Prevents CSRF from external sites |
| `secure: true` in production only | Local dev uses HTTP, not HTTPS |

### Step 5.3 — Dashboard Layout

`app/dashboard/layout.tsx`:

- **Sidebar** (desktop only): nav links + external Wagtail/Django links + logout button
- **Main content**: `{children}`

`components/logout-button.tsx` — client component that POSTs to `/api/auth/logout` and redirects to login.

### Step 5.4 — Overview Page

`app/dashboard/page.tsx` — client component with:

- **5 stat cards**: Projects, Blog Posts, Lectures, AI Chats, Flagged Chats
- **Recent AI Chats** — last 5 conversations with page badges, timestamps, flag indicators
- **Loading** and **error** states

Fetches in parallel with `Promise.all()` for speed.

### Step 5.5 — Chats List Page

`app/dashboard/chats/page.tsx`:

**Two-column layout:**
- **Left**: Scrollable list of chats (up to 100), each with page badge, timestamp, flag toggle, and 2-line message preview
- **Right**: Selected chat detail — full user message + AI response

**Features:**
- **URL-driven state**: `?filter=flagged` and `?id=7` work as deep links
- **Inline flag toggle**: Click ⚐ to flag, 🚩 to unflag
- **"Show flagged only"** checkbox filter

### Step 5.6 — Header Dashboard Icon

`components/site-header.tsx` — added a **lock icon** between nav and "Hire Me":

- Desktop: subtle lock icon with tooltip "Dashboard (private)"
- Mobile: full "Dashboard" link in the hamburger menu

**Why a lock icon** instead of a nav link: the dashboard is private. A subtle icon signals "this exists for the owner" without cluttering the public nav.

### Common Pitfalls (Phase 5)

1. **`middleware.ts` deprecated in Next.js 16** — rename to `proxy.ts`
2. **Edge runtime has no Node `crypto`** — don't hash passwords in middleware
3. **Env vars not reloading** — restart `npm run dev` after editing `.env.local`
4. **Forgetting the catch-all route order** — `ai_chat.urls` must come before Wagtail's `re_path(r"^", ...)`
5. **404 from missing `page.tsx`** — `layout.tsx` alone doesn't create a route; you need `page.tsx`

### Phase 5 Exit Criteria

- ✅ `/dashboard` requires login
- ✅ Password auth works (wrong password rejected)
- ✅ Overview shows real stats
- ✅ Chats list with detail view
- ✅ Flag toggle works from both list and detail
- ✅ Filter by flagged
- ✅ Deep links (`?id=X`, `?filter=flagged`)
- ✅ Header lock icon links to dashboard
- ✅ Logout works

## Phase 6 — RAG-Enhanced Chatbot

### Overview

Extended the chatbot with Retrieval-Augmented Generation using the simplest viable approach: **context stuffing**. All portfolio content (projects, blog posts, lectures) is fetched from Wagtail and injected into the AI's system prompt. The AI can now reference real, live content instead of guessing.

### Why Context Stuffing (vs. Embeddings + Vector DB)

Three RAG approaches were considered:

| Approach | Complexity | Fit |
|---|---|---|
| **Context Stuffing** ✅ | Low | Perfect for portfolios |
| True RAG with embeddings | High | Overkill under 50k tokens |
| LLM-based retrieval | Medium | 2x latency for marginal gain |

**Chosen: Context Stuffing.** Reasons:

- **Content is small.** Even 50 projects + 100 blogs + 50 lectures fits well under Groq's 128k token window.
- **Free-tier pricing is request-based, not token-based.** Tokens are free with Groq.
- **No second API needed.** No embeddings, no vector DB, no extra services.
- **Quality is actually higher.** No retrieval step to fail — the AI sees everything.
- **Migration path exists.** If content ever grows to thousands of items, swap in true RAG behind the same `buildKnowledgeBase()` interface.

### Step 6.1 — Knowledge Base Module (`lib/knowledge-base.ts`)

Fetches all content in parallel, formats as markdown, caches for 5 minutes.

    export async function buildKnowledgeBase(): Promise<string> {
      // Check cache first
      if (cache && Date.now() - cache.timestamp < CACHE_TTL_MS) {
        return cache.content;
      }
      // Fetch projects, blogs, lectures in parallel
      const [projects, posts, lectures] = await Promise.all([...]);
      // Format as markdown sections
      // Cache and return
    }

**Formatting rules:**
- Projects: title, category, intro, tech stack, links
- Blog posts: title, date, intro, reading time
- Lectures: title, level, duration, lesson count, intro

**Caching:** 5-minute TTL. Prevents hammering the Wagtail API on every chat message.

**Error handling:** Each fetch is wrapped in `.catch(() => [])` so a failing section doesn't break the whole KB.

### Step 6.2 — Wire Into Chat Route

`app/api/chat/route.ts` updates:

    const knowledgeBase = await buildKnowledgeBase();
    const fullSystemPrompt = knowledgeBase
      ? `${SYSTEM_PROMPT}\n\n---\n\n${knowledgeBase}`
      : SYSTEM_PROMPT;

    const result = streamText({
      model: groq.chat("openai/gpt-oss-120b"),
      system: fullSystemPrompt,   // ← was SYSTEM_PROMPT
      messages: modelMessages,
    });

**System prompt guidance added:**
> "When a 'Portfolio Content' section appears below, use it to answer questions about Alton's SPECIFIC projects, blog posts, and lectures. Reference actual titles and details. Never fabricate project names — if the section is empty, say so honestly."

**Debug log:** `console.log("[/api/chat] knowledge base length:", knowledgeBase.length, "chars")` — tells you if content is being fetched.

### Step 6.3 — Markdown Rendering in Chat Widget

The AI returns markdown (bold, lists, links). The chat widget renders it with `react-markdown` + `remark-gfm`.

**Packages:**

    npm install react-markdown remark-gfm

**Custom rendering** (so styles match the site):

| Element | Styling |
|---|---|
| `**bold**` | Gold-colored bold |
| `*italic*` | Italic, light ink |
| `- item` | Indented bullet list |
| `1. item` | Numbered list |
| `[text](url)` | Electric-blue link, opens in new tab |
| `` `code` `` | Gold monospace with dark background |
| Headings | Bold, sized by level |

**Why user messages stay plain text:** Users rarely type markdown, and rendering their input would be surprising. Only AI replies get markdown treatment.

### Common Pitfalls (Phase 6)

1. **KB length is 0** — check the terminal log. If `knowledge base length: 0 chars`, the Wagtail API is unreachable. Verify `NEXT_PUBLIC_API_URL` and that Django is running.

2. **KB length is small (e.g., 654 chars)** — that's fine if you have no content. It's just the boilerplate "no items yet" sections. Create projects/posts/lectures in Wagtail and the length grows.

3. **Cache staleness** — after creating new content in Wagtail, wait up to 5 minutes (or restart `npm run dev`) before the AI sees it.

4. **Markdown not rendering** — verify `npm list react-markdown remark-gfm` shows both installed.

5. **`**` visible in replies** — the message block wasn't wrapped in `<ReactMarkdown>`. Check the widget's `messages.map()` block.

### Testing the RAG

1. Create a project in Wagtail admin with a distinctive title
2. Restart `npm run dev` (clears KB cache)
3. Ask the chat: "What projects has Alton published?"
4. Verify the AI references the exact title

Expected terminal output:

    [/api/chat] knowledge base length: 900 chars

The number grows as you add content.

### Phase 6 Exit Criteria

- ✅ Chatbot references live Wagtail content
- ✅ Markdown renders properly in AI replies
- ✅ Knowledge base cached for 5 minutes
- ✅ System prompt instructs the AI to use the KB
- ✅ No fabricated project names
- ✅ Graceful fallback when KB is empty

## Phase 7 — Detail Pages + Document Library

### Overview

Added detail pages for every content type, plus a document/file download system for lectures.

### Step 7.1 — Project Detail Page

Route: `app/projects/[slug]/page.tsx`

- **Server Component** — fetches via `getProjectBySlug(slug)`
- **404** if slug not found (`notFound()`)
- **Dynamic metadata** — title and description from the project
- **Layout**: breadcrumb, category badge, featured badge, title, intro, live demo / source code / case study buttons, cover image, tech stack pills, StreamField body, CTA footer

### Step 7.2 — Blog Post Detail Page

Route: `app/blog/[slug]/page.tsx`

- Same pattern as projects
- **Narrower layout** (max-w-3xl) for reading comfort
- Metadata row: date, reading time, author
- Cover image + StreamField body

### Step 7.3 — Lecture Detail Page

Route: `app/lectures/[slug]/page.tsx`

- Level badge (color-coded: emerald/electric/gold)
- Featured badge if applicable
- Duration + lesson count metadata
- Watch Video / Download Syllabus buttons
- StreamField body
- **Resource list** (see 7.4)

### Step 7.4 — Document & Resource Library

**Purpose:** Allow uploading PDFs, Word docs, spreadsheets, presentations, and linking external resources (Google Docs/Sheets/Slides) that visitors can view or download.

**Backend changes** (`home/models.py`):

| Addition | Type |
|---|---|
| `ResourceDocumentBlock` | StructBlock: title, description, DocumentChooserBlock |
| `ResourceLinkBlock` | StructBlock: title, description, URL |
| `LecturePage.resources` | StreamField with both block types |
| `DocumentChooserBlock` import | From `wagtail.documents.blocks` |

**Migration:** `0004_lecturepage_resources.py`

**Frontend changes:**

- `components/resource-list.tsx` — renders resource rows with file-type detection
- `lib/api.ts` — added `WagtailDocument` and `ResourceBlock` types
- `app/lectures/[slug]/page.tsx` — renders `<ResourceList>` when resources exist

**File type detection** — from the file extension:

| Extension | Badge | Color |
|---|---|---|
| `pdf` | PDF | Red |
| `doc`, `docx`, `pages`, `odt` | DOC | Electric blue |
| `xls`, `xlsx`, `csv`, `numbers`, `ods` | XLS | Emerald |
| `ppt`, `pptx`, `key`, `odp` | PPT | Gold |
| Anything else | FILE | Muted |

### Step 7.5 — Document Resolution & URL Rewriting

**Two tricky problems surfaced, both now solved:**

#### Problem 1: `DocumentChooserBlock` Returns Just an ID

Wagtail's API serializes `DocumentChooserBlock` as a numeric ID, not a full object. So `resource.value.document` was `7`, not `{ id: 7, meta: {...}, title: "..." }`.

**Solution:** `resolveLectureResources()` in `lib/api.ts` fetches each document via `/api/v2/documents/<id>/` and swaps it in. Runs in parallel with `Promise.all`.

#### Problem 2: Wagtail Returns URLs Without the Port

The API returned URLs like `http://localhost/documents/1/file.pdf` (no `:8000`). Browsers tried port 80 → connection refused.

**Root cause:** Wagtail's Site object has `hostname = "localhost"` (no port). Generated URLs use it verbatim.

**Solution:** A `resolveMediaUrl()` helper in `lib/api.ts` that:

1. Parses the URL if it starts with `http`
2. Replaces the origin with `API_BASE`
3. Preserves pathname + query string

Applied to both `imageUrl()` (in `lib/api.ts`) and `docUrl()` (in `resource-list.tsx`).

**Alternative (backend) fix:** Update the Site hostname to `localhost:8000` in Wagtail admin → Settings → Sites. We chose the frontend fix because it's deployment-agnostic.

### Common Pitfalls (Phase 7)

1. **`getFileKind` crashes on null document** — use `document?.meta?.download_url` with a default fallback.

2. **Download URL missing port** — always rewrite Wagtail URLs to use `API_BASE`, never trust Wagtail's absolute URLs.

3. **`document` is a number, not an object** — always resolve via `/api/v2/documents/<id>/`.

4. **VS Code silent save failure** — use heredocs for multi-line files.

5. **`notFound()` requires the `next/navigation` import** — not a thrown exception class.

### Testing the Full Flow

1. Create a Project, Blog Post, or Lecture in Wagtail admin
2. On the list page, click "Details →" / "Read →" / "Start learning →"
3. Verify the detail page loads
4. **For lectures**: upload a document via **Documents** in Wagtail admin, add it as a **Resource** on the lecture, then verify View + Download buttons work
5. Test external links (Google Docs, etc.) via the **External Link** resource type

### Phase 7 Exit Criteria

- ✅ All three detail pages work (`/projects/[slug]`, `/blog/[slug]`, `/lectures/[slug]`)
- ✅ 404 handling for nonexistent slugs
- ✅ Document uploads render with correct file-type badges
- ✅ View button opens document in new tab
- ✅ Download button forces download
- ✅ External link resources work
- ✅ Wagtail-generated URLs are correctly rewritten to use the API base

## Phase 7.5 — Polish Tasks

Four refinements completed after the detail pages.

### 7.5.1 — CV Page

Route: `app/cv/page.tsx`

- Uses Node's `fs.existsSync` to detect if `public/alton-cv.pdf` exists
- If present: shows download button, "open in new tab" button, and an embedded PDF preview
- If missing: shows a friendly placeholder with instructions
- `export const dynamic = "force-dynamic"` — file check runs at request time
- Linked from header nav, homepage hero

### 7.5.2 — Watch Intro Video Modal

Files:
- `components/intro-video-modal.tsx` — reusable modal
- `components/hero-section.tsx` — state + trigger + render

**Modal features:**
- Click outside → close
- Press `Escape` → close
- Click × → close
- Body scroll lock while open
- YouTube/Vimeo embed via `NEXT_PUBLIC_INTRO_VIDEO_URL`

**Config in `.env.local`:**

## Phase 8 — Deployment

### 🚨 REMINDER: Paused — Waiting for Domain

**Status:** Paused until a custom domain is acquired.
**Resume point:** Whenever you have a domain (e.g., `kessellyalton.com`).

**When you come back:**
1. `cd ~/Documents/alton-portfolio && git pull`
2. Start both servers to confirm everything still works:
   - Backend: `cd backend && source ../env/bin/activate && python manage.py runserver`
   - Frontend: `cd frontend && npm run dev`
3. Open `http://localhost:3000` — verify homepage, AI chat, dashboard all work
4. Say **"Ready to deploy"** and pick up at Step 8.1 below

---

### Overview

Deploy the portfolio to production with:
- **Backend** (Django + Wagtail) → Railway or Render
- **Frontend** (Next.js) → Vercel
- **Database** → PostgreSQL (managed by host)
- **Domain** → custom domain (or free subdomain initially)
- **HTTPS** → automatic on both platforms

**Estimated time:** 2–3 hours of guided work.

---

### Pre-Flight Checklist (Do Before Deploying)

- [ ] **Domain acquired** — e.g., `kessellyalton.com` (or use free `*.vercel.app` first)
- [ ] **GitHub repo is up to date** — `git push` everything
- [ ] **Local works end-to-end** — verify homepage, chat, dashboard, projects, blog, lectures all load
- [ ] **Media strategy decided:**
  - **Option A** — keep files in `backend/media/` (simple; grows git repo over time)
  - **Option B** — switch to Cloudflare R2 / AWS S3 (recommended for many large files)
- [ ] **Free tier vs paid decided:**
  - **Free tier is fine** — Railway ($5 credit/mo), Render (free tier), Vercel (hobby tier)
  - **Paid starts at ~$5/mo** per service if you exceed free limits

---

### Step 8.1 — Deploy the Backend (Railway or Render)

**Why Railway/Render:** Both support Django out of the box, provide managed PostgreSQL, and offer free tiers.

#### 8.1.1 — Push Everything to GitHub First

The deploy platforms pull from GitHub. Make sure everything is committed and pushed:

```bash
cd ~/Documents/alton-portfolio
git status
git push

## Phase 8 — Deployment

### 🎉 LIVE IN PRODUCTION

| Service | URL |
|---|---|
| Frontend | https://alton-portfolio-latest.vercel.app |
| Backend API | https://alton-portfolio-api.onrender.com |
| Database | Neon PostgreSQL (permanent free tier) |
| AI Provider | Groq (free tier) |

### Stack

- **Frontend:** Vercel (Hobby tier, free)
- **Backend:** Render (Free tier, spins down after 15 min inactivity)
- **Database:** Neon (0.5 GB free, never expires)
- **AI:** Groq (free tier, no credit card)

### Production Environment Variables

**Render (backend):**
- `DJANGO_SECRET_KEY`, `DJANGO_DEBUG=False`, `DJANGO_SETTINGS_MODULE=backend.settings.production`
- `DJANGO_ALLOWED_HOSTS=alton-portfolio-api.onrender.com,.onrender.com`
- `DATABASE_URL` (from Neon)
- `FRONTEND_URL=https://alton-portfolio-latest.vercel.app`
- `CORS_ALLOWED_ORIGINS=https://alton-portfolio-latest.vercel.app`
- `CSRF_TRUSTED_ORIGINS=https://alton-portfolio-latest.vercel.app`
- `SECURE_SSL_REDIRECT=False`, `SESSION_COOKIE_SECURE=False`, `CSRF_COOKIE_SECURE=False`
- `DJANGO_SUPERUSER_USERNAME/EMAIL/PASSWORD` (one-time bootstrap)

**Vercel (frontend):**
- `NEXT_PUBLIC_API_URL=https://alton-portfolio-api.onrender.com`
- `NEXT_PUBLIC_SITE_URL=https://alton-portfolio-latest.vercel.app`
- `GROQ_API_KEY`, `DASHBOARD_PASSWORD`, `DASHBOARD_TOKEN`
- `NEXT_PUBLIC_INTRO_VIDEO_URL=https://www.youtube.com/embed/JeRcfKQTxRg`

### The Big Debugging Journey: Vercel + `@/` Alias

**Symptom:** Every deployment failed with `Module not found: Can't resolve '@/lib/api'`.

**Root cause:** Vercel's monorepo support had subtle issues that made the `@` path alias unresolvable in production even though it worked locally.

**Failed attempts:**
1. Root Directory = `frontend` — Vercel ignored it
2. `process.cwd()` webpack alias — pointed to repo root
3. `__dirname` webpack alias — Vercel's `modifyConfig` overrode it
4. Moved frontend to repo root — tsconfig paths still not honored
5. Empty `next.config.ts` — same issue
6. `@` alias via `__dirname` — Vercel's platform hook reset it

**Final solution:** Move all frontend files to the repo root AND replace every `@/...` import with relative paths (`../lib/...`).

**Critical discovery:** The root `.gitignore` had `lib/` in the Python section, which silently ignored the Next.js `lib/` folder. Vercel never received the files. Fixed by commenting out `lib/` and `lib64/`.

**Lesson:** When using a `.gitignore` with broad patterns, always verify with:
```bash
git check-ignore -v path/to/important/file

## Phase 9 — Hybrid RAG (Django Retrieval + Next.js Streaming)

### Overview

Upgraded the chatbot from context-stuffing to true semantic retrieval. The new architecture:

- **Django** exposes a lightweight `/api/chat/context/` endpoint that queries Upstash Vector and returns the top-k relevant chunks. **No LLM call** — just retrieval.
- **Next.js** fetches the context from Django, injects it into the system prompt, and streams the LLM response from Groq.
- **Streaming is preserved** — user sees tokens as they arrive.
- **Chat logging stays in Next.js** — the existing `onFinish` handler continues to record every conversation.

### Why Hybrid (vs. Django-Only or Next.js-Only)

| Approach | Retrieval | Streaming | Complexity |
|---|---|---|---|
| Next.js only (context stuffing) | Fetch all content | ✅ | Low |
| Django only | Semantic (Upstash) | ❌ | Medium |
| **Hybrid** ✅ | Semantic (Upstash) | ✅ | Medium |

Chosen because it scales with content (only top-k chunks hit the LLM) while keeping the fast UX of streaming.

### Architecture

    Browser → Next.js /api/chat
                │
                ├─► GET http://127.0.0.1:8000/api/chat/context/?q=...
                │    (returns top-k chunks from Upstash — fast, no LLM)
                │
                ├─► Stream from Groq with retrieved context injected
                │
                └─► Stream to browser + log chat on finish

### Step 9.1 — Django Context Endpoint (`ai_chat/views.py`)

Added `chat_context` view — a retrieval-only endpoint:

    @require_GET
    def chat_context(request):
        """
        GET /api/chat/context/?q=<query>&k=<count>
        Returns { "context": "...", "chunks": [...] }
        """
        from upstash_vector import Index

        query = (request.GET.get("q") or "").strip()
        if not query:
            return JsonResponse({"error": "q parameter is required"}, status=400)

        top_k = min(int(request.GET.get("k", 3)), 10)

        # Query Upstash Vector
        index = Index(url=..., token=...)
        results = index.query(data=query, top_k=top_k, include_metadata=True)

        # Return context string + structured chunk list
        return JsonResponse({"context": context_str, "chunks": chunks})

**Key properties:**
- Uses `@require_GET` — the frontend calls it with a query string
- Does NOT call Groq — pure retrieval, ~300–500ms response
- Graceful fallback: if Upstash isn't configured, returns empty context with a warning instead of erroring
- Returns both a formatted `context` string (for the LLM prompt) and a structured `chunks` array (for future analytics)

### Step 9.2 — Route Registration (`ai_chat/urls.py`)

    path("chat/context/", views.chat_context, name="chat-context"),

Full URL: `http://127.0.0.1:8000/api/chat/context/`

### Django View Inventory (after Phase 9)

| Function | Route | Purpose |
|---|---|---|
| `log_chat` | POST `/api/chat-log/` | Record a chat from the widget |
| `list_chats` | GET `/api/chat-logs/` | Dashboard chat listing |
| `chat_detail` | GET `/api/chat-logs/<id>/` | Single chat detail |
| `toggle_flag` | POST `/api/chat-logs/<id>/flag/` | Flip flagged boolean |
| `ask_chat` | POST `/api/chat/` | Full RAG pipeline (retrieval + LLM) — kept for direct API use and future Slack/WhatsApp integration |
| **`chat_context`** | **GET `/api/chat/context/`** | **Retrieval only — for hybrid frontend** |

### Why We Keep Both `ask_chat` and `chat_context`

- **`ask_chat`** — useful for non-browser clients (a future Slack bot, WhatsApp integration, internal dashboards) where streaming doesn't matter.
- **`chat_context`** — used by the Next.js widget to preserve streaming.

Both share the same Upstash backend. They're two interfaces to the same retrieval layer.

---
### Step 9.3 — Testing the Context Endpoint

**Success case:**

    curl -s "http://127.0.0.1:8000/api/chat/context/?q=What+projects+has+Alton+published&k=3" | python3 -m json.tool

**Response:**

    {
        "context": "Title: Introduction to Transformers & LLMs\nType: lecture\nURL: /lectures/introduction-to-transformers-llms\n\nTitle: Education KPI Dashboard\nType: project\nURL: /projects/education-kpi-dashboard\n\nTitle: How LLMs Can Transform Education Policy\nType: blog\nURL: /blog/how-llms-can-transform-education-policy",
        "chunks": [
            { "title": "Introduction to Transformers & LLMs", "type": "lecture", "url": "...", "score": 0.577 },
            { "title": "Education KPI Dashboard", "type": "project", "url": "...", "score": 0.569 },
            { "title": "How LLMs Can Transform Education Policy", "type": "blog", "url": "...", "score": 0.560 }
        ]
    }

**Key observations:**

- Upstash Vector is populated with all three content types (project, blog, lecture)
- Semantic search works: the query about "projects" also surfaced the related lecture and blog
- Scores range from 0.55 to 0.58 — typical for semantic similarity
- The `context` string is formatted as markdown for direct injection into the LLM prompt

**Error case (missing query):**

    curl -s "http://127.0.0.1:8000/api/chat/context/" | python3 -m json.tool

**Response:**

    { "error": "q parameter is required" }

**Server log confirms both:**

    "GET /api/chat/context/?q=... HTTP/1.1" 200
    "GET /api/chat/context/ HTTP/1.1" 400

---
### Step 9.4 — Frontend Helper (`lib/api.ts`)

Added `getRAGContext(query, topK)` to `lib/api.ts`. This is the only place the frontend talks to the Django RAG endpoint — keeping the RAG layer centralized.

**TypeScript types:**

    export type RAGChunk = {
      title: string;
      type: string;
      url: string;
      score: number | null;
    };

    export type RAGContext = {
      context: string;
      chunks: RAGChunk[];
    };

**The helper:**

    export async function getRAGContext(
      query: string,
      topK: number = 3
    ): Promise<RAGContext> {
      // Returns { context, chunks }
      // Falls back to empty context on any error
    }

**Key design decisions:**

| Decision | Why |
|---|---|
| `cache: "no-store"` | Each query is unique — no caching benefit |
| `AbortSignal.timeout(5000)` | If Django is slow, don't block the LLM stream. 5s is generous |
| Returns empty context on error | Chat still works — just without RAG enrichment. Never fails loudly to the user |
| `console.warn` instead of `console.error` | The RAG layer failing isn't fatal — it's a degraded mode |
| `topK` defaults to 3 | Balanced: enough context without bloating the prompt |

**Why this belongs in `lib/api.ts`:**

Every backend call goes through this file. Adding `getRAGContext` here means:
- One place to change the URL or add auth headers later
- Consistent error handling across all API calls
- Easy to test / mock in isolation

---

### Step 9.5 — Next.js Chat Route Rewrite (Hybrid RAG Integration)

**File:** `app/api/chat/route.ts`

The route no longer uses context stuffing (`buildKnowledgeBase`). It now:

1. Extracts the latest user message from the incoming `messages` array
2. Calls `getRAGContext(userQuery, 3)` to retrieve top-3 semantically similar chunks
3. Injects those chunks into the system prompt under a `RETRIEVED PORTFOLIO CONTEXT` header
4. Streams the Groq response back to the browser as before

**Key code changes:**

| Before | After |
|---|---|
| `import { buildKnowledgeBase } from "../../../lib/knowledge-base"` | `import { getRAGContext } from "../../../lib/api"` |
| `await buildKnowledgeBase()` | `await getRAGContext(userQuery, 3)` |
| System prompt header: `"Portfolio Content"` | `"RETRIEVED PORTFOLIO CONTEXT"` |
| Full KB injected into every prompt | Only top-3 chunks per query |

**New helper — `getTextFromMessage`:**

    function getTextFromMessage(msg: any): string {
      if (typeof msg?.content === "string") return msg.content;
      if (Array.isArray(msg?.parts)) {
        return msg.parts
          .filter((p: any) => p?.type === "text")
          .map((p: any) => p?.text ?? "")
          .join("");
      }
      return "";
    }

Handles both AI SDK v5+ `parts` format and legacy `content` string format.

**Debug logs added:**

    [/api/chat] user query: <first 120 chars>
    [/api/chat] RAG chunks retrieved: <n> context length: <chars> chars

These let us verify in the terminal that retrieval is happening.

**Build verification:**

    npm run build

    ✓ Compiled successfully in 4.5s
    ✓ Generating static pages (18/18)

**Warning encountered (harmless):**

    ⚠ Warning: Next.js ignored package-lock.json in /home/alton because it is
      outside the current Git repository

Fix: either delete the stray `/home/alton/package-lock.json`, or add
`outputFileTracingRoot: __dirname` to `next.config.ts`. Not blocking.

---
### Step 9.6 — Live End-to-End Test (Hybrid RAG Verified)

**Test conditions:**
- Backend running on http://127.0.0.1:8000
- Frontend running on http://localhost:3000
- User asked in the chat widget: **"What projects has Alton published?"**

**Frontend terminal output:**

    [/api/chat] incoming request
    [/api/chat] received messages count: 1
    [/api/chat] user query: What projects have Alton published?
    [/api/chat] RAG chunks retrieved: 3 context length: 300 chars
    [/api/chat] converted messages count: 1
    [/api/chat] streamText created, returning response
     POST /api/chat 200 in 3.2s

**Backend terminal output:**

    "GET /api/chat/context/?q=What%20projects%20have%20Alton%20published%3F&k=3 HTTP/1.1" 200 746
    "OPTIONS /api/chat-log/ HTTP/1.1" 200 0
    "POST /api/chat-log/ HTTP/1.1" 201 60

**Chat response:**

> Alton's published project portfolio includes:
>
> **Education KPI Dashboard** – an interactive data-visualization tool for tracking key performance indicators across Liberia's education system. You can view it here: /projects/education-kpi-dashboard
>
> If you'd like to discuss similar projects or explore new collaborations, feel free to reach out via the contact page.

**Analysis:**

| Stage | Result |
|---|---|
| Frontend extracts latest user message | ✅ |
| Frontend calls Django `/api/chat/context/` | ✅ (200, 746 bytes) |
| Upstash returns 3 semantic chunks | ✅ |
| Context injected into system prompt | ✅ (300 chars) |
| Groq streams response | ✅ |
| Response references real content | ✅ (exact project title and URL) |
| Chat logged to Django | ✅ (201 Created) |

**Key improvement over context stuffing:**

The AI referenced a **specific project by exact URL** — proving semantic retrieval found the right chunk. Under the old context-stuffing approach, the AI would have seen all content but with lower signal-to-noise. Under hybrid RAG, only the top-3 relevant chunks reach the LLM.

### Phase 9 Exit Criteria

- ✅ Django `/api/chat/context/` endpoint retrieves top-k chunks from Upstash
- ✅ Next.js `getRAGContext()` helper wraps the Django call with graceful fallback
- ✅ Chat route injects retrieved context into the system prompt
- ✅ Streaming preserved — user sees tokens as they arrive
- ✅ Semantic retrieval verified — AI references real content by exact title and URL
- ✅ Chat logging still works — every conversation recorded in Django
- ✅ Backend `ask_chat` (full RAG + LLM) retained for future Slack/WhatsApp integration

---
### Step 9.7 — Production Deploy Fix (Missing Packages)

**Symptom on production:** `https://alton-portfolio-api.onrender.com/api/chat/context/?q=test&k=1` returned **Internal Server Error**.

**Root cause:** `upstash-vector` and `groq` were installed locally but **missing from `requirements.txt`**. Render's build only installs what's listed. When the endpoint tried `from upstash_vector import Index`, it threw `ImportError` → 500.

**Fix — add packages to `requirements.txt`:**

    # ─── RAG / AI ─────────────────────────────────
    upstash-vector>=0.8,<1.0
    groq>=1.0,<2.0

**Version constraint note:** Initially we wrote `groq>=0.13,<1.0` but the locally-installed version was 1.7.0 — outside the range. Updated the constraint to `groq>=1.0,<2.0` so it matches what was tested locally.

### Step 9.8 — Render Environment Variables (No Quotes!)

**Symptom:** After adding the packages and redeploying, the endpoint still needed the RAG secrets.

**Missing on Render:**
- `GROQ_API_KEY`
- `UPSTASH_VECTOR_REST_URL`
- `UPSTASH_VECTOR_REST_TOKEN`

**Critical gotcha — quotes:**

In `.env.local`, values are often wrapped in quotes:

    UPSTASH_VECTOR_REST_URL="https://alive-rhino-58300-us1-vector.upstash.io"

`python-dotenv` **strips the quotes** when loading locally. But Render's UI treats the entire field **literally** — if you paste with quotes, the value becomes:

    "https://alive-rhino-58300-us1-vector.upstash.io"

…including the literal quote characters. When `upstash_vector.Index(url=...)` receives this, DNS resolution fails.

**Rule:** When entering env vars in a hosting UI (Render, Vercel, Railway, GitHub Actions), **never wrap values in quotes**. Only files parsed by `dotenv` need/allow them.

**Helper to copy clean values locally:**

    grep "^GROQ_API_KEY=" .env.local | cut -d'=' -f2- | tr -d '"'

Repeat for each var.

### Step 9.9 — Verification (Both Environments)

**Local test (localhost:3000 + 127.0.0.1:8000):**

User asked: "What lectures does he offer?"

AI response:

> "Alton currently offers the lecture **Introduction to Transformers & LLMs**. You can see the details and access the material here: /lectures/introduction-to-transformers-llms."

**Production test (alton-portfolio-latest.vercel.app + alton-portfolio-api.onrender.com):**

User asked: "What projects has Alton published?"

AI response:

> "Alton's published project portfolio currently includes **Education KPI Dashboard** – an interactive analytics tool for tracking key education metrics (see /projects/education-kpi-dashboard). No additional projects are listed in the portfolio at this time. If you'd like more details or have a specific interest, feel free to reach out via the contact page."

**Direct endpoint test (production):**

    GET https://alton-portfolio-api.onrender.com/api/chat/context/?q=test&k=1

    {
      "context": "Title: Education KPI Dashboard\nType: project\nURL: /projects/education-kpi-dashboard",
      "chunks": [
        {
          "title": "Education KPI Dashboard",
          "type": "project",
          "url": "/projects/education-kpi-dashboard",
          "score": 0.58815104
        }
      ]
    }

**Both environments confirm:**
- ✅ Django endpoint responds with valid JSON
- ✅ Upstash Vector returns semantic chunks
- ✅ Next.js injects chunks into the system prompt
- ✅ Groq streams a response referencing exact content
- ✅ Chat logged in Django admin

---
### Step 9.10 — Content-to-Vector Sync via Wagtail Signals

**Problem:** The vector DB only updated when we ran `python manage.py index_knowledge` manually. Every new project, blog post, or lecture would be invisible to the RAG chatbot until we remembered to re-index.

**Solution:** Wagtail signals that auto-index content on publish/unpublish/delete.

**New file: `backend/home/signals.py`**

Registers three receivers:

| Signal | Handler | When it fires | What it does |
|---|---|---|---|
| `page_published` | `on_page_published` | Page is published in Wagtail admin | `index.upsert(...)` — adds/updates the vector |
| `page_unpublished` | `on_page_unpublished` | Page is unpublished | `index.delete(...)` — removes the vector |
| `post_delete` | `on_page_deleted` | Page is deleted | `index.delete(...)` — removes the vector |

Only fires for `ProjectPage`, `BlogPage`, and `LecturePage` — other page types are ignored.

**Deterministic vector IDs:**

    project-{id}    e.g. "project-4"
    blog-{id}       e.g. "blog-2"
    lecture-{id}    e.g. "lecture-5"

Same ID on re-publish → upsert replaces, no duplicates.

**Non-blocking by design:** If Upstash env vars are missing or the API call fails, the signal logs a warning and returns — the Wagtail publish still succeeds. This means content editing is never blocked by RAG infrastructure issues.

### Step 9.11 — Wiring the Signals Into Django

Django doesn't auto-import `signals.py`. It must be imported in the app's `AppConfig.ready()` method.

**File: `backend/home/apps.py`**

    from django.apps import AppConfig


    class HomeConfig(AppConfig):
        default_auto_field = "django.db.models.BigAutoField"
        name = "home"

        def ready(self):
            from home import signals  # noqa: F401

**Why the import is inside `ready()`:** Django raises an `AppRegistryNotReady` error if you import models at the module level of `apps.py`. Putting the import inside `ready()` delays it until all apps are loaded.

### Step 9.12 — Logging Configuration

Django's default logging only shows `WARNING` and above. Our signal handlers use `logger.info()` — invisible by default.

**File: `backend/backend/settings/base.py`** — added:

    LOGGING = {
        "version": 1,
        "disable_existing_loggers": False,
        "handlers": {
            "console": {"class": "logging.StreamHandler"},
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

**Key settings:**

| Setting | Why |
|---|---|
| `disable_existing_loggers: False` | Keeps Django's own loggers working (HTTP requests, errors) |
| `propagate: False` | Prevents duplicate lines by stopping propagation to root logger |

### Step 9.13 — End-to-End Signal Test

**Test:** Edited a Project page in Wagtail admin and clicked Publish.

**Server log immediately after:**

    [rag-signal] Indexed project-4

**What this proves:**
- ✅ Signal fired automatically on publish
- ✅ Handler connected to Upstash successfully
- ✅ Vector upserted with ID `project-4`
- ✅ No manual command needed

**Now the RAG pipeline is fully automated:**

| Event | Response |
|---|---|
| Add a new project and publish | Signal → vector added within ~500ms |
| Edit a project and re-publish | Signal → vector updated (upsert) |
| Unpublish a project | Signal → vector removed |
| Delete a project | Signal → vector removed |

---