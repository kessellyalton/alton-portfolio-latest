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