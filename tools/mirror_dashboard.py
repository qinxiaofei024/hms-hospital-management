# -*- coding: utf-8 -*-
# A robust dashboard mirroring tool using Playwright.
# Usage:
#   python mirror_dashboard.py --url "<dashboard_url>" --out "C:/path/to/output_dir" --timeout 45 --headful
# If --url is omitted, it defaults to the iframe URL from 实时监控大屏1.html.

import os
import re
import sys
import json
import time
import hashlib
import argparse
from urllib.parse import urlparse, unquote, urlsplit

try:
    from playwright.sync_api import sync_playwright
except Exception as e:
    print("[ERROR] Playwright is not installed. Please run: pip install playwright && python -m playwright install chromium")
    raise


def now_ts():
    return time.strftime("%Y%m%d_%H%M%S")


def safe_filename(name: str) -> str:
    # Remove illegal characters for Windows
    name = unquote(name)
    name = re.sub(r"[\\/:*?\"<>|]", "_", name)
    name = name.strip()
    if not name:
        name = "file"
    return name[:200]


def ext_from_content_type(ct: str) -> str:
    if not ct:
        return ""
    ct = ct.split(";")[0].strip().lower()
    mapping = {
        "text/html": ".html",
        "text/css": ".css",
        "application/javascript": ".js",
        "text/javascript": ".js",
        "application/json": ".json",
        "image/png": ".png",
        "image/jpeg": ".jpg",
        "image/jpg": ".jpg",
        "image/gif": ".gif",
        "image/svg+xml": ".svg",
        "font/woff2": ".woff2",
        "font/woff": ".woff",
        "font/ttf": ".ttf",
        "application/octet-stream": "",
    }
    return mapping.get(ct, "")


def path_from_url(url: str) -> str:
    u = urlsplit(url)
    path = u.path or "/index"
    if path.endswith("/"):
        path += "index"
    # Include a short hash of the query to avoid collisions
    qhash = ""
    if u.query:
        h = hashlib.sha1(u.query.encode("utf-8")).hexdigest()[:8]
        qhash = f"__{h}"
    base = safe_filename(path.lstrip("/"))
    if qhash:
        base = f"{base}{qhash}"
    return base


def ensure_dir(p: str):
    os.makedirs(os.path.dirname(p), exist_ok=True)


def write_bytes(path: str, data: bytes):
    ensure_dir(path)
    with open(path, "wb") as f:
        f.write(data)


def write_text(path: str, text: str):
    ensure_dir(path)
    with open(path, "w", encoding="utf-8") as f:
        f.write(text)


def mirror(url: str, out_dir: str, timeout: int = 45, headful: bool = False):
    os.makedirs(out_dir, exist_ok=True)
    manifest = {
        "start_url": url,
        "saved_at": now_ts(),
        "resources": [],
        "errors": [],
    }

    print(f"[INFO] Starting browser. Saving to: {out_dir}")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=(not headful))
        context = browser.new_context(ignore_https_errors=True)
        page = context.new_page()

        # Record responses
        def on_response(response):
            try:
                req = response.request
                rurl = response.url
                status = response.status
                rtype = req.resource_type
                headers = {k.lower(): v for k, v in response.headers.items()}
                ct = headers.get("content-type", "")

                # Get body safely
                body = None
                try:
                    body = response.body()
                except Exception as be:
                    manifest["errors"].append({
                        "url": rurl,
                        "when": "read_body",
                        "error": str(be),
                    })
                    return

                # Decide extension + save path
                base = path_from_url(rurl)
                ext = os.path.splitext(base)[1]
                if not ext:
                    ext = ext_from_content_type(ct) or ""
                save_rel = base + ext
                save_path = os.path.join(out_dir, save_rel)

                write_bytes(save_path, body)
                manifest["resources"].append({
                    "url": rurl,
                    "status": status,
                    "type": rtype,
                    "content_type": ct,
                    "path": save_rel,
                    "size": len(body) if body is not None else 0,
                })
                if len(manifest["resources"]) % 25 == 0:
                    print(f"[INFO] Saved {len(manifest['resources'])} resources...")
            except Exception as e:
                manifest["errors"].append({
                    "url": getattr(response, 'url', ''),
                    "when": "on_response",
                    "error": str(e),
                })

        page.on("response", on_response)

        print(f"[INFO] Navigating to: {url}")
        page.goto(url, wait_until="domcontentloaded", timeout=timeout * 1000)

        # Try to wait for idle and then extra time for dynamic/XHR
        try:
            page.wait_for_load_state("networkidle", timeout=timeout * 1000)
        except Exception:
            pass

        # Additional settling time to capture late XHRs
        time.sleep(5)

        # Save main page HTML separately for convenience
        html = page.content()
        write_text(os.path.join(out_dir, "index.html"), html)

        # Save manifest
        write_text(os.path.join(out_dir, "manifest.json"), json.dumps(manifest, ensure_ascii=False, indent=2))

        print(f"[DONE] Total resources saved: {len(manifest['resources'])}")
        browser.close()


def main():
    default_url = (
        "https://app.fanruan.com:8444/decision/app/package/?preview=false"
        "&appId=f59959b2-bdb1-54ec-3e2d-b7fa508267af"
        "&ssoToken=KDmf4GKGXrBANRTYiDDiRiQPP3Wszf%2Fvol%2FLHvB56PNgcU9xORfkTXPPlnsT5Zwm2MaT2JaRjcsoC2FV8oNH0dxReQezWHOy6Dxp75nDsESS6lXGzmEOdWSjAV6MOHCPFUZOQgeKnO5PfctCjFOq7VVaOlY96dOajprZgxH7VDmvrZiZ4wrU%2BCkFLXBkDlr1Wz6t8p8roc5HFUJpsmh7HdexcCCcddG5onFFW1Er%2FpP927g3Gv8kY61fvOdCExqaf6jnlCOCTofa46jF9CfgsU5aAgQNGqu%2F1gbvjLfJa2Jt305Wc%2BYXNeRA1K%2FdTArAbbFnFmTH4Q5aM%2FX2xUvj4A%3D%3D"
        "&force_web=true"
    )

    parser = argparse.ArgumentParser(description="Mirror a dashboard by saving all loaded resources via Playwright.")
    parser.add_argument("--url", type=str, default=default_url, help="Dashboard URL to mirror. Defaults to the iframe URL from 实时监控大屏1.html.")
    parser.add_argument("--out", type=str, default=None, help="Output directory. Defaults to hms/mirrors/fanruan_<timestamp> under project root.")
    parser.add_argument("--timeout", type=int, default=45, help="Navigation/network idle timeout in seconds.")
    parser.add_argument("--headful", action="store_true", help="Run browser in headful mode to visually debug.")

    args = parser.parse_args()

    root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
    default_out = os.path.join(root, "hms", "mirrors", f"fanruan_{now_ts()}")
    out_dir = args.out or default_out

    mirror(args.url, out_dir, timeout=args.timeout, headful=args.headful)


if __name__ == "__main__":
    main()