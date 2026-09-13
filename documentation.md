# Project Setup Documentation
## A Reusable Guide for Building Django + Wagtail + Next.js Projects

This document records every step taken to build the **Alton Kesselly Portfolio** project, with explanations of *why* each step is done. Use it as a template for future projects of a similar nature.

---

## Table of Contents

1. [Phase 0 — Prerequisites Check](#phase-0--prerequisites-check)
2. [Phase 1 — Project Directory + Git Init](#phase-1--project-directory--git-init)
3. [Phase 2 — Backend: Django + Wagtail](#phase-2--backend-django--wagtail)
4. [Phase 3 — Frontend: Next.js](#phase-3--frontend-nextjs)
5. [Phase 4 — AI Chatbot Integration](#phase-4--ai-chatbot-integration)
6. [Phase 5 — Deployment](#phase-5--deployment)

---

## Phase 0 — Prerequisites Check

### Purpose
Verify that all required tools are installed and meet the minimum version requirements before starting. This prevents cryptic errors later.

### Tools to Check

| Tool | Minimum Version | Purpose |
|---|---|---|
| Python | 3.10 – 3.13 | Backend runtime |
| Node.js | 18 or 20 | Frontend runtime |
| npm | 9+ | Package manager for Node |
| Git | 2.30+ | Version control |
| PostgreSQL | 13+ | Production database |

### Commands

    python --version
    node --version
    npm --version
    git --version
    psql --version

### Special Note: Python Version Choice

**Do not use the newest Python release immediately.** The Django + Wagtail ecosystem typically lags 6–12 months behind the latest Python release. Using a too-new Python version causes dependency resolution errors.

**Recommended strategy:**
1. Check the supported Python versions on the Django and Wagtail websites.
2. Install the highest **supported** version (e.g., 3.12) even if a newer one (e.g., 3.14) exists.
3. Install it **alongside** the system Python so you don't break OS tools.
4. Use the new version **only inside a virtual environment** for this project.

### Installing Python 3.12 on Ubuntu 26.04 (Example)

    sudo add-apt-repository ppa:deadsnakes/ppa -y
    sudo apt update
    sudo apt install python3.12 python3.12-venv python3.12-dev -y
    python3.12 --version
    python3.12 -m venv --help | head -3

### Why This Works
- `deadsnakes` PPA provides modern Python versions for Ubuntu.
- `python3.12-venv` provides the `venv` module (required to create virtual environments).
- `python3.12-dev` provides C headers needed to compile Python packages with native extensions (e.g., `psycopg2`, `Pillow`).
- Installing side-by-side keeps the system Python untouched, avoiding OS breakage.

### Phase 0 Exit Criteria
- `python3.12 --version` prints `Python 3.12.x`
- `python3.12 -m venv --help` prints usage info without errors

---

## Phase 1 — Project Directory + Git Init

### Step 1.1 — Inspect the Target Directory

Before creating anything, check whether the target directory already has files.

    pwd
    ls -la
    git status

**What each command does:**
- `pwd` — confirms the current working directory
- `ls -la` — lists all files, including hidden ones (like `.git/`)
- `git status` — indicates whether this folder is already a git repository

**Why this matters:** If a prior failed attempt left files behind, they must be removed before a clean start. Mixing old and new files causes confusion.

### Step 1.2 — Wipe the Directory Clean (if needed)

    rm -rf .dockerignore Dockerfile backend db.sqlite3 home manage.py requirements.txt search

Then verify:

    ls -la

**Why this is safe:** `rm -rf` here only removes files inside the current folder. It does not affect the parent directory or system files.

**Safer alternative:** Move to a backup folder instead of deleting:

    mkdir ../project-old
    mv * ../project-old/

### Step 1.3 — Initialize Git

    git init -b main
    git status

**Why `-b main`:** Sets the default branch to `main` instead of the older `master`, matching GitHub and industry conventions.

**Common question:** Should `.gitignore` come before or after `git init`?

**Answer:** It doesn't matter, as long as `.gitignore` exists **before your first `git add`**. Git only consults `.gitignore` when staging files.

### Step 1.4 — Create `.gitignore`

    touch .gitignore
    code .gitignore

Paste the comprehensive `.gitignore` covering Python, Node, Django, IDE, and OS files (see project's `.gitignore` for the full template).

**Why this is critical:** Without `.gitignore`, your first commit will sweep in:
- `env/` (hundreds of MB, machine-specific)
- `.env` (API keys — a security disaster if pushed)
- `db.sqlite3` (local database, not source code)
- `__pycache__/` (compiled Python bytecode, regenerable)

Once these are committed, removing them from Git history is painful.

### Step 1.5 — Create `README.md`

    touch README.md
    code README.md

A good README contains:
- **Project title and description**
- **Purpose** — why the project exists
- **Tech stack** — what it's built with
- **Project structure** — folder layout
- **Local development setup** — how to run it
- **Author info**
- **License**

**Why this matters:** The README is the front page of the repo on GitHub. It's the first thing collaborators, employers, or clients see.

### Step 1.6 — First Commit (pending)

    git add .
    git commit -m "chore: initial project setup with gitignore and README"

**Command breakdown:**
- `git add .` — stages all untracked files (that aren't in `.gitignore`)
- `git commit -m "..."` — saves a snapshot with a descriptive message

**Commit message convention:** Use prefixes like `chore:`, `feat:`, `fix:`, `docs:`, `refactor:` for clarity.

### Step 1.7 — Push to GitHub (pending)

1. Create a repo at https://github.com/new
2. **Do not** initialize with README, .gitignore, or license (you already have them)
3. Copy the remote URL

Then:

    git remote add origin https://github.com/USERNAME/REPO.git
    git push -u origin main

**Why `-u`:** Sets the local `main` branch to track the remote `main` branch, so future `git push` commands don't need to specify the remote.

---

## Phase 2 — Backend: Django + Wagtail

*(To be documented as we build it)*

---

## Phase 3 — Frontend: Next.js

*(To be documented as we build it)*

---

## Phase 4 — AI Chatbot Integration

*(To be documented as we build it)*

---

## Phase 5 — Deployment

*(To be documented as we build it)*

---

## General Principles Followed

1. **One phase at a time.** Complete and verify each phase before moving on.
2. **Explain every command.** Never run something without knowing why.
3. **Clean commits.** Each commit represents one logical unit of change.
4. **Verify before committing.** Run `git status` to see what's being staged.
5. **Never commit secrets.** `.env` files are always in `.gitignore`.
6. **Version pinning.** Use ranges (e.g., `Django>=5.2,<6.1`) to get security updates without breaking changes.
7. **Virtual environments.** Always isolate project dependencies from the system Python.

---

## Revision History

| Date | Change |
|---|---|
| 2026-09-13 | Initial creation — Phase 0 and Phase 1 documented |

### Step 1.6 — First Commit

    git add .
    git status
    git commit -m "chore: initial project setup with gitignore, README, and docs"

**Command breakdown:**
- `git add .` — stages all untracked files (respecting `.gitignore`)
- `git status` — verifies exactly what is staged before committing
- `git commit -m "..."` — creates a permanent snapshot with a descriptive message

**Commit message convention (Conventional Commits):**
| Prefix | Use |
|---|---|
| `chore:` | Setup, tooling, maintenance |
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation only |
| `refactor:` | Code cleanup without behavior change |
| `test:` | Adding or fixing tests |
| `style:` | Formatting, no logic change |

### One-Time Setup: Git Identity

The first commit will fail if Git doesn't know who you are. Set this **once per machine**:

    git config --global user.email "you@example.com"
    git config --global user.name "Your Name"

**Why `--global`:** Applies the identity to all repositories on this machine. Without it, you'd set identity per-repo, which is tedious.

**Verify identity was set:**

    git config --global --list | grep user

### Verify the Commit

    git log --oneline
    git status

**Expected:**
- `git log --oneline` shows one line with the commit hash and message
- `git status` says `nothing to commit, working tree clean`

### Step 1.7 — Create GitHub Repo and Push

#### Part A — Create the Repo on GitHub

1. Go to https://github.com/new
2. Fill in:
   - **Repository name:** e.g., `alton-portfolio`
   - **Description:** short one-liner
   - **Visibility:** Public or Private (your choice)
3. **Leave all checkboxes UNCHECKED:**
   - ☐ Add a README file
   - ☐ Add .gitignore
   - ☐ Choose a license
   - ☐ Start with a template

**Why leave them unchecked:** You already have these files locally. If GitHub creates its own, your local and remote histories diverge, and `git push` will fail with a "non-fast-forward" error. You'd then need to `git pull --rebase` and resolve conflicts for no reason.

**Rule of thumb:** If you have commits locally, let your local repo be the source of truth. Create the remote empty.

#### Part B — Connect Local to Remote

    git remote add origin https://github.com/USERNAME/REPO.git
    git remote -v

The `-v` flag shows both fetch and push URLs, confirming the remote is set.

**What "origin" means:** `origin` is just a nickname for the remote URL. You can have multiple remotes (e.g., `origin`, `upstream`), but for a solo project, `origin` is enough.

#### Part C — Authenticate with GitHub CLI (Recommended)

Install `gh`:

    sudo apt install gh -y     # or: sudo snap install gh

Authenticate:

    gh auth login

Answer the prompts:
| Prompt | Answer |
|---|---|
| What account do you want to log into? | GitHub.com |
| Preferred protocol for Git operations? | HTTPS |
| Authenticate Git with your GitHub credentials? | Yes |
| How would you like to authenticate? | Login with a web browser |

If the browser login returns HTTP 500 (a known intermittent issue), use a Personal Access Token (PAT) instead:

    gh auth login --with-token

**How to create a PAT:**
1. Go to https://github.com/settings/tokens
2. Click **Personal access tokens (classic)** → **Generate new token (classic)**
3. Give it a name (e.g., `gh-cli-laptop`)
4. Set expiration (90 days is standard)
5. Select scopes: **`repo`**, **`workflow`**, **`read:org`**
6. Generate token and copy it immediately (you won't see it again)

Then run `gh auth login --with-token` and paste the token, followed by `Ctrl+D`.

**Verify:**

    gh auth status

#### Part D — Configure Git to Use `gh` for Auth

Even after `gh auth login`, Git may still prompt for a username/password. Fix that with:

    gh auth setup-git

Verify:

    git config --global --get-regexp credential

Expected:
    credential.https://github.com.helper !/usr/bin/gh auth git-credential
    credential.https://gist.github.com.helper !/usr/bin/gh auth git-credential

#### Part E — Push

    git push -u origin main

**`-u` flag:** Sets `origin main` as the upstream branch, so future pushes just need `git push`.

#### Part F — Verify

    git branch -vv

Expected: `main` shows `[origin/main]` as its tracking branch.

Refresh your GitHub page — your commits and files should be visible.

### Phase 1 Exit Criteria
- Git repo initialized with `main` branch
- `.gitignore`, `README.md`, and `documentation.md` committed
- Remote `origin` points to GitHub
- `gh` CLI installed and authenticated
- Local `main` tracks `origin/main`
- All commits pushed to GitHub

## Phase 2 — Backend: Django + Wagtail

### Checkpoint 2A — Environment, Packages, and Secrets

#### Step 2.1 — Create the Virtual Environment

    python3.12 -m venv env

**Why a virtual environment:** Isolates this project's Python packages from the system Python and other projects. Prevents version conflicts.

**Why at the project root** (not inside `backend/`): Both backend tooling and any future Python utilities can share it.

**Activate:**

    source env/bin/activate

Once activated, the prompt shows `(env)` and `which python` points inside `env/bin/`.

**Deactivate when done:**

    deactivate

#### Step 2.2 — Upgrade pip and Install Core Packages

    pip install --upgrade pip
    pip install "Django>=5.2,<6.1" "wagtail>=7.0,<8.0"
    pip install "Pillow>=10.0,<12.0"

**Why quotes around version specs:** Without quotes, `<` and `>` are interpreted by the shell as redirection operators.

**Why Pillow:** Wagtail's `wagtail.images` app requires it. Without it, migrations fail.

**Verify:**

    pip list | grep -iE "django|wagtail|pillow"
    django-admin --version
    wagtail --version

#### Step 2.3 — Scaffold the Wagtail Project

    mkdir backend
    cd backend
    wagtail start backend .

**The two arguments:**
- `backend` — project module name (creates `backend/settings/`, `backend/urls.py`)
- `.` — create in **current** directory (avoids nested `backend/backend/backend/`)

**What Wagtail 7.4 generates:**
- `backend/settings/base.py`, `dev.py`, `production.py` (settings already split)
- `home/` (starter app for content models)
- `search/` (starter search app)
- `manage.py`, `Dockerfile`, `.dockerignore`, `requirements.txt` (auto-generated pin)

#### Step 2.4 — Install Extra Packages

    pip install "python-dotenv>=1.0,<2.0"
    pip install "django-cors-headers>=4.3,<5.0"

**Why python-dotenv:** Reads credentials from `.env` files instead of hardcoding them in `settings.py`.

**Why django-cors-headers:** Allows the Next.js frontend (on port 3000) to call our Wagtail API (on port 8000). Without this, browsers block cross-origin requests.

**Deferred packages (installed later with their own justification):**
- `psycopg2-binary` — when we switch to PostgreSQL
- `wagtail-headless-preview` — once the frontend exists
- `openai` — Phase 4 (chatbot)

#### Step 2.5 — Create `.env` and `.env.example`

**Two files, two purposes:**

| File | Purpose | Committed? |
|---|---|---|
| `.env` | Real secrets (API keys, DB password) | ❌ Never |
| `.env.example` | Template with empty values | ✅ Yes |

**Why both:** A new developer can clone the repo, see `.env.example`, and know which variables to fill in. Real secrets stay local.

**Verify `.gitignore` is working:**

    git status

`.env` must NOT appear in the output. Only `.env.example` should show as untracked.

## Phase 2 — Backend: Django + Wagtail

### Overview

Built a headless CMS backend using Django 6.0 + Wagtail 7.4. The backend:
- Manages content (projects, blog posts, lectures, services) via Wagtail admin
- Serves JSON via Wagtail's REST API at `/api/v2/`
- Uses SQLite in dev, PostgreSQL-ready for production
- Includes a custom "Portfolio Overview" dashboard panel
- Logs AI chat interactions for later dashboard review

### Step 2.1 — Create the Virtual Environment

    python3.12 -m venv env
    source env/bin/activate

**Why a virtual environment:** Isolates project dependencies from system Python. Prevents version conflicts between projects.

**Verify activation:**

    which python        # should point inside env/bin/
    python --version    # should be 3.12.x

### Step 2.2 — Install Core Packages

    pip install --upgrade pip
    pip install "Django>=5.2,<6.1" "wagtail>=7.0,<8.0"
    pip install "Pillow>=10.0,<12.0"

**Why quotes:** Without them, `<` and `>` are shell redirection operators.

**Why Pillow:** Wagtail's `wagtail.images` app requires it. Missing Pillow = migration failures.

### Step 2.3 — Scaffold the Wagtail Project

    mkdir backend
    cd backend
    wagtail start backend .

**Why the trailing dot:** Creates the project in the current directory, avoiding nested `backend/backend/backend/`.

**What Wagtail 7.4 generates:**
- `backend/settings/base.py`, `dev.py`, `production.py` (settings already split)
- `home/`, `search/` (starter apps)
- `manage.py`, `Dockerfile`, `.dockerignore`, auto-generated `requirements.txt`

### Step 2.4 — Install Extra Packages

    pip install "python-dotenv>=1.0,<2.0"
    pip install "django-cors-headers>=4.3,<5.0"
    pip install "wagtail-headless-preview>=0.9,<1.0"

**Why python-dotenv:** Read secrets from `.env` instead of hardcoding in settings.

**Why django-cors-headers:** Allows Next.js (port 3000) to call the API (port 8000).

**Why wagtail-headless-preview:** Enables live preview from Wagtail admin to the frontend.

### Step 2.5 — Create `.env` and `.env.example`

    touch .env
    touch .env.example

**`.env`** — real secrets (never committed):

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

**`.env.example`** — same content, secret values blank. Committed to Git as a template.

**Generate a Django secret key:**

    python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"

**Verify `.gitignore` protects `.env`:**

    git check-ignore -v .env          # should print the matching rule
    git check-ignore -v .env.example  # should print NOTHING

### Step 2.6 — Rewrite `backend/settings/base.py`

Replaced Wagtail's default with our customized version. Key additions:

| Section | Purpose |
|---|---|
| `load_dotenv()` | Read `.env` into `os.environ` |
| `SECRET_KEY = os.getenv(...)` | No secret in source code |
| `ai_chat` in `INSTALLED_APPS` | AI chat logging app |
| `wagtail.api.v2`, `rest_framework` | Enables REST API |
| `corsheaders` + middleware | Cross-origin support for Next.js |
| SQLite/Postgres toggle | SQLite for dev, PostgreSQL via `.env` |
| `TIME_ZONE = "Africa/Monrovia"` | Local timezone |
| `WAGTAILAPI_LIMIT_MAX = 50` | API response size cap |

### Step 2.7 — Create the `ai_chat` App

**The chicken-and-egg problem:** Django parses `INSTALLED_APPS` before any command runs. If `ai_chat` is listed but doesn't exist, every command fails. So:

1. Comment out `"ai_chat"` in `INSTALLED_APPS`
2. Run `python manage.py check` (should pass)
3. Run `python manage.py startapp ai_chat`
4. Uncomment `"ai_chat"`
5. Run `python manage.py check` (should pass)

### Step 2.8 — Migrations and Superuser

    python manage.py migrate
    python manage.py createsuperuser
    python manage.py runserver

Verify login at http://127.0.0.1:8000/admin/

**If you forget the superuser password later:**

    python manage.py changepassword <username>

### Step 2.9 — Content Models (`home/models.py`)

Defines the entire content schema. Key classes:

| Class | Purpose |
|---|---|
| `TechStackBlock` | Reusable block: technology name + icon |
| `MetricBlock` | Reusable block: stat value + label |
| `LessonBlock` | Reusable block: lesson title, duration, video URL |
| `HomePage` | Hero, stats, rotating roles, trusted-by logos |
| `ProjectPage` | Portfolio project: intro, category, tech stack, case study |
| `BlogPage` | Article: date, intro, cover, rich body |
| `LecturePage` | Course: level, duration, lessons, video URL |
| `Service` (snippet) | "What I Do" cards with sub-items |

**Key concept:** Every field added to `api_fields` becomes available in the Wagtail API JSON response.

**Run migrations after changing models:**

    python manage.py makemigrations home
    python manage.py migrate

### Step 2.10 — ChatLog Model (`ai_chat/models.py`)

Fields: `session_id`, `user_message`, `ai_response`, `page_context`, `flagged`, `created_at`.

Registered in Django admin at `/django-admin/ai_chat/chatlog/`.

### Step 2.11 — API Router (`home/api.py`) and URLs

**`home/api.py`** registers three endpoints:

    api_router.register_endpoint("pages", PagesAPIViewSet)
    api_router.register_endpoint("images", ImagesAPIViewSet)
    api_router.register_endpoint("documents", DocumentsAPIViewSet)

**`backend/urls.py`** adds routes:

| Route | Purpose |
|---|---|
| `/django-admin/` | Django admin (ChatLog, users) |
| `/admin/` | Wagtail admin |
| `/documents/` | Document serving |
| `/api/v2/` | REST API |
| `/` (last) | Wagtail page serving |

**CRITICAL:** The catch-all `re_path(r"^", ...)` must be LAST. If it comes first, it swallows all other routes.

**Test the API:**

    curl http://127.0.0.1:8000/api/v2/pages/
    curl http://127.0.0.1:8000/api/v2/pages/?type=home.HomePage
    curl http://127.0.0.1:8000/api/v2/images/

**Note:** `/api/v2/` alone returns 404 — only specific endpoints exist. That's expected.

### Step 2.12 — Custom Dashboard Panel

**Files:**
- `home/wagtail_hooks.py` — registers the panel
- `home/templates/home/dashboard/stats_panel.html` — panel HTML

**The panel shows:**
- Stat cards: Projects, Blog Posts, Lectures, Services, AI Chats
- Conditional card: Flagged Chats (only if > 0)
- Quick-add buttons: + New Project, + New Blog Post, + New Lecture

**Verifying a hook is loaded:**

    python manage.py shell
    >>> from wagtail import hooks
    >>> hooks.get_hooks("construct_homepage_panels")

Should return a list with `add_portfolio_panels`.

**CRITICAL GOTCHA:** Wagtail's page "add" URL requires three arguments:

    reverse("wagtailadmin_pages:add", args=["home", "projectpage", parent_id])

Missing `parent_id` → `NoReverseMatch` error. To get it:

    from home.models import HomePage
    homepage = HomePage.objects.first()
    parent_id = homepage.id

### Step 2.13 — Seed Command

**Folder structure:**

    home/management/
    ├── __init__.py
    └── commands/
        ├── __init__.py
        └── seed_portfolio.py

Both `__init__.py` files are required (even empty) — Python treats folders as packages only if they contain them.

**Run:**

    python manage.py seed_portfolio

**What it does:**
- Ensures a HomePage exists, sets it as the Wagtail site root
- Creates the six default Service snippets (AI, Data, Software, Teaching, Research, Consulting)

**Verify the command is discoverable:**

    python manage.py help seed_portfolio

---

## Common Pitfalls (Phase 2)

### 1. VS Code Silent Save Failure
When you paste into a new VS Code tab, the file is **unsaved** until you press `Ctrl+S`. The tab shows a dot (●) next to the filename if unsaved. If you close without saving, the file never existed.

**Workaround:** Use a terminal heredoc to write files directly:

    cat > path/to/file.py << 'EOF'
    ...content...
    EOF

The `'EOF'` in quotes prevents shell expansion of `{{ }}` and similar syntax.

### 2. Django Chicken-and-Egg with `INSTALLED_APPS`
Never add an app to `INSTALLED_APPS` before running `startapp`. Order:
1. Comment out (if already listed)
2. `python manage.py startapp <name>`
3. Uncomment

### 3. `reverse()` and Missing URL Arguments
If a URL pattern expects N arguments, `reverse()` needs exactly N. Look at the pattern:

    admin/pages/add/<app_name>/<model_name>/<parent_page_id>/

That's **three** args, not two.

### 4. Middleware Order
`corsheaders.middleware.CorsMiddleware` must come **before** `django.middleware.common.CommonMiddleware` — otherwise preflight requests fail.

### 5. `wagtail start` Without Trailing Dot
    wagtail start backend      # creates backend/backend/
    wagtail start backend .    # creates in current dir (correct)

### 6. Duplicate Settings Folders
Wagtail's `wagtail start` creates a nested `backend/settings/` inside your outer `backend/`. This is correct for Django projects. Don't try to flatten it.

### 7. Route Order in `urls.py`
The catch-all `re_path(r"^", include(wagtail_urls))` must be **last**. Otherwise `/admin/` and `/api/v2/` routes get swallowed.

---

## Phase 2 Exit Criteria

- ✅ Django 6.0 + Wagtail 7.4 installed in isolated venv
- ✅ PostgreSQL-ready settings (SQLite in dev)
- ✅ Content models migrated: HomePage, ProjectPage, BlogPage, LecturePage, Service
- ✅ ChatLog model for AI interactions
- ✅ REST API live at `/api/v2/pages/`, `/api/v2/images/`, `/api/v2/documents/`
- ✅ Custom "Portfolio Overview" dashboard panel
- ✅ Seed command for reproducible initial content
- ✅ `.env` protected, `.env.example` committed