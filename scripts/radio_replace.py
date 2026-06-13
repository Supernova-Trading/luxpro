"""Find tested replacements for dead stations via radio-browser.info API."""
import json
import sys
import urllib.parse
import urllib.request

from radio_audit import probe  # reuse the exact same probe (Origin, UA, byte check); also UTF-8-wraps stdout

API = "https://de1.api.radio-browser.info/json/stations/search"
UA = {"User-Agent": "LuxPro-StationAudit/1.0"}

def search(**params):
    qs = urllib.parse.urlencode({
        "hidebroken": "true",
        "is_https": "true",
        "order": "clickcount",
        "reverse": "true",
        "limit": "8",
        **params,
    })
    req = urllib.request.Request(f"{API}?{qs}", headers=UA)
    with urllib.request.urlopen(req, timeout=15) as r:
        return json.loads(r.read().decode("utf-8"))

def candidates(label, **params):
    print(f"\n### {label}")
    try:
        rows = search(**params)
    except Exception as e:
        print(f"  API error: {e}")
        return
    seen = set()
    tested = 0
    for s in rows:
        if tested >= 4:
            break
        url = s.get("url_resolved") or s.get("url")
        codec = (s.get("codec") or "").upper()
        if not url or not url.startswith("https://") or url in seen:
            continue
        if s.get("lastcheckok") != 1 or codec not in ("MP3", "AAC", "AAC+", "HLS"):
            continue
        seen.add(url)
        tested += 1
        r = probe(s["name"], url)
        if r["err"]:
            verdict = f"FAIL {r['err'][:80]}"
        elif r["bytes"] == 0:
            verdict = "FAIL no-data"
        elif r["final_https"] is False:
            verdict = "FAIL redirects-to-http"
        else:
            cors = r["acao"] or "NO-ACAO"
            verdict = f"PASS ct={r['content_type']} acao={cors}"
        print(f"  [{verdict}] {s['name'].strip()} | codec={codec} clicks={s.get('clickcount')} | {url}")

if __name__ == "__main__":
    # Exact-name retries first (station may have a newer working URL)
    candidates("Europa FM (ES)", name="Europa FM", countrycode="ES")
    candidates("M80 Radio (ES)", name="M80", countrycode="ES")
    candidates("NRJ (FR)", name="NRJ", countrycode="FR")
    candidates("Fun Radio (FR)", name="Fun Radio", countrycode="FR")
    candidates("RTL (FR)", name="RTL", countrycode="FR")
    candidates("Nostalgie (FR)", name="Nostalgie", countrycode="FR")
    candidates("Aswat (AR)", name="aswat")
    candidates("Arabic pop/persian (Anghamy repl)", tagList="arabic", language="arabic")
    candidates("Maher Zain / nasheed", name="maher zain")
    candidates("Europa Plus (RU)", name="Europa Plus")
    candidates("Nashe Radio (RU)", name="наше")
    candidates("Rock FM (RU)", name="rock fm", countrycode="RU")
    candidates("Avtoradio (RU)", name="авторадио")
    candidates("Taiwan radio (zh #1)", countrycode="TW", language="chinese")
    candidates("Taiwan/Chinese music (zh #2)", tagList="mandopop")
