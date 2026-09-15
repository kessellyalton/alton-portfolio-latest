"""
One-off HTTP endpoint for syncing content from the JSON fixture
to a remote environment (e.g. production) where shell access is unavailable.

Requires the header `X-Sync-Token` matching the `SYNC_TOKEN` env var.
Only runs `python manage.py load_content`.
"""
import io
import logging
import os
import re

from django.core.management import call_command
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

logger = logging.getLogger(__name__)

# Regex to strip ANSI color/escape codes from command output
_ANSI_RE = re.compile(r"\x1b\[[0-9;]*m")


@csrf_exempt
@require_POST
def sync_content(request):
    # ─── 1. Verify token ──────────────────────────
    expected = os.getenv("SYNC_TOKEN", "").strip()
    if not expected:
        logger.warning("[sync] SYNC_TOKEN not configured on server")
        return JsonResponse(
            {"error": "SYNC_TOKEN not configured on server"}, status=500
        )

    provided = request.headers.get("X-Sync-Token", "").strip()
    if provided != expected:
        logger.warning("[sync] Unauthorized attempt (bad token)")
        return JsonResponse({"error": "Unauthorized"}, status=401)

    # ─── 2. Run the management command ────────────
    out = io.StringIO()
    err = io.StringIO()

    try:
        call_command("load_content", stdout=out, stderr=err)
    except Exception as e:
        logger.exception("[sync] load_content raised")
        return JsonResponse(
            {"error": f"Command failed: {e}", "stderr": err.getvalue()},
            status=500,
        )

    # Strip ANSI color escape codes for clean JSON output
    clean_stdout = _ANSI_RE.sub("", out.getvalue())
    clean_stderr = _ANSI_RE.sub("", err.getvalue())

    logger.info("[sync] load_content completed successfully")

    return JsonResponse({
        "ok": True,
        "stdout": clean_stdout,
        "stderr": clean_stderr,
    })
