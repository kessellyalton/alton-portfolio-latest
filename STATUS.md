# Project Status

**Last updated:** 2026-09-14
**Current phase:** Phase 8 complete — LIVE IN PRODUCTION
**Next session:** Optional enhancements (see below)

---

## 🌐 Live Production URLs

| Service | URL |
|---|---|
| **Frontend** | https://alton-portfolio-latest.vercel.app |
| **Backend API** | https://alton-portfolio-api.onrender.com |
| **Wagtail Admin** | https://alton-portfolio-api.onrender.com/admin/ |
| **Django Admin** | https://alton-portfolio-api.onrender.com/django-admin/ |

### Credentials Location

- **Wagtail admin:** username `alton`, password = `DJANGO_SUPERUSER_PASSWORD` from Render env vars
- **Dashboard:** password = `DASHBOARD_PASSWORD` from Vercel env vars
- **Django admin:** same superuser as Wagtail

### Local Development

Run both servers in parallel:

**Terminal 1 — Backend:**
```bash
cd ~/Documents/alton-portfolio/backend
source ../env/bin/activate
python manage.py runserver