"""Audit all radio streams in lib/radios.ts: reachability, HTTPS, CORS, codec."""
import concurrent.futures as cf
import io
import json
import re
import ssl
import sys
import urllib.request

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

ORIGIN = "https://luxpro-nu.vercel.app"
UA = "Mozilla/5.0 (Linux; Android 13; SM-T510) AppleWebKit/537.36 Chrome/120 Safari/537.36"

ctx = ssl.create_default_context()

def probe(name, url):
    req = urllib.request.Request(url, headers={
        "User-Agent": UA,
        "Origin": ORIGIN,
        "Icy-MetaData": "0",
        "Accept": "*/*",
    })
    try:
        with urllib.request.urlopen(req, timeout=10, context=ctx) as r:
            final = r.geturl()
            h = {k.lower(): v for k, v in r.headers.items()}
            ct = h.get("content-type", "?")
            acao = h.get("access-control-allow-origin")
            # read a tiny chunk to confirm bytes actually flow
            chunk = r.read(2048)
            return {
                "name": name, "url": url, "status": r.status,
                "final_https": final.startswith("https://"),
                "content_type": ct, "acao": acao,
                "bytes": len(chunk),
                "err": None,
            }
    except Exception as e:
        return {"name": name, "url": url, "status": None, "final_https": None,
                "content_type": None, "acao": None, "bytes": 0,
                "err": f"{type(e).__name__}: {e}"[:140]}

def main():
    src = open("../lib/radios.ts", encoding="utf-8").read()
    langs = re.findall(r"^\s*(\w+):\s*\[", src, re.M)
    blocks = re.split(r"^\s*\w+:\s*\[", src, flags=re.M)[1:]
    jobs = []
    for lang, block in zip(langs, blocks):
        for m in re.finditer(r'n:\s*"([^"]+)".*?u:\s*"([^"]+)"', block):
            jobs.append((lang, m.group(1), m.group(2)))
    print(f"{len(jobs)} stations parsed", file=sys.stderr)

    results = {}
    with cf.ThreadPoolExecutor(max_workers=12) as ex:
        futs = {ex.submit(probe, n, u): (lang, n) for lang, n, u in jobs}
        for f in cf.as_completed(futs):
            lang, n = futs[f]
            results[(lang, n)] = f.result()

    for lang, n, u in jobs:
        r = results[(lang, n)]
        if r["err"]:
            verdict = "DEAD"
            detail = r["err"]
        elif r["bytes"] == 0:
            verdict = "NO-DATA"
            detail = f"ct={r['content_type']}"
        elif not r["acao"]:
            verdict = "NO-CORS"
            detail = f"ct={r['content_type']} (plays only without crossOrigin)"
        else:
            verdict = "OK"
            detail = f"ct={r['content_type']} acao={r['acao']}"
        https_flag = "" if r["final_https"] in (True, None) else " REDIRECTS-TO-HTTP!"
        print(f"{lang} | {n} | {verdict}{https_flag} | {detail}")

if __name__ == "__main__":
    main()
