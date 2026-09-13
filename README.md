# Alton Kesselly — Personal Portfolio

An interactive personal portfolio website with an integrated AI chatbot, private dashboard, and full content management system.

## Purpose

This site serves as the online home for my professional work:

- **Freelance & consulting** in AI/ML, data analysis, and software engineering
- **Institutional work** in education policy, strategic planning, and donor relations
- **Online lectures & tutorials** in AI, Machine Learning, Deep Learning, Mathematics, and Physics
- **Teaching services** for Mathematics, Physics, productivity tools (spreadsheets, presentations), Linux, and LaTeX

## Tech Stack

### Backend
- **Django** — Python web framework
- **Wagtail** — Headless CMS for content management
- **Wagtail API v2** — REST API for content delivery
- **PostgreSQL** — Production database (SQLite for local dev)
- **Django REST Framework** — API foundation

### Frontend
- **Next.js** (App Router) — React framework
- **Tailwind CSS** — Utility-first styling
- **Framer Motion** — Animations
- **TypeScript** — Type safety

### AI
- **Vercel AI SDK** — Streaming chat interface
- **OpenAI GPT** — Language model
- **RAG (Retrieval-Augmented Generation)** — Knowledge base retrieval
- **Vector database** — For embedding storage and search

### Deployment
- **Railway** — Backend hosting
- **Vercel** — Frontend hosting

## Project Structure

    alton-portfolio/
    ├── backend/              # Django + Wagtail CMS
    │   ├── backend/          # Django settings, URLs, WSGI
    │   ├── home/             # Content models (projects, blog, lectures)
    │   ├── ai_chat/          # AI chat logging and dashboard
    │   ├── search/           # Wagtail search
    │   ├── manage.py
    │   └── requirements.txt
    ├── frontend/             # Next.js application (coming soon)
    ├── .gitignore
    └── README.md

## Local Development

Detailed setup instructions for each part are in the respective folders:

- **Backend:** see `backend/README.md`
- **Frontend:** see `frontend/README.md` (once created)

### Quick Start (Backend)

    cd backend
    python3.12 -m venv ../env
    source ../env/bin/activate
    pip install -r requirements.txt
    python manage.py migrate
    python manage.py createsuperuser
    python manage.py runserver

## Author

**Alton Kesselly**
- Former Deputy Minister for Planning, Research & Development (2018–2024), Ministry of Education, Liberia
- Educator, Data Analyst, AI Researcher
- Website: www.kessellyalton.com
- Email: kessellyalton@outlook.com

## License

MIT