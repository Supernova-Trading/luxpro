"""Emit spread-out track permalink URLs (+ API-gate flags) for an account/set,
so the browser playback-gate can test several distinct tracks per source, not
just the current one. Prints JSON: [{permalink_url, policy, snipped, title}].

Usage: python scripts/sc_tracks.py <url> [count]   (default count=3: first/mid/last)
"""
import io
import json
import sys
import urllib.parse
import urllib.request

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

CID = "nIjtjiYnjkOhMyh5xrbqEW12DxeJVnic"
BASE = "https://api-widget.soundcloud.com"


def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read().decode("utf-8"))


def all_ids(obj):
    if obj.get("kind") == "playlist":
        return [t["id"] for t in obj.get("tracks", []) if t.get("id")]
    ids, href = [], f"{BASE}/users/{obj['id']}/tracks?client_id={CID}&limit=200&linked_partitioning=1&app_version=1700000000"
    while href:
        d = fetch(href)
        ids += [t["id"] for t in d.get("collection", []) if t.get("id")]
        href = d.get("next_href")
        if href and "client_id" not in href:
            href += f"&client_id={CID}"
    return ids


def fetch_tracks(ids):
    out = []
    for i in range(0, len(ids), 50):
        idstr = ",".join(str(x) for x in ids[i : i + 50])
        d = fetch(f"{BASE}/tracks?ids={idstr}&client_id={CID}&app_version=1700000000")
        out += d if isinstance(d, list) else d.get("collection", [])
    return out


def main():
    url = sys.argv[1]
    count = int(sys.argv[2]) if len(sys.argv) > 2 else 3
    obj = fetch(f"{BASE}/resolve?url={urllib.parse.quote(url, safe='')}&client_id={CID}")
    ids = all_ids(obj)
    n = len(ids)
    if n == 0:
        print("[]")
        return
    # spread: first, then evenly across, including last
    if count >= n:
        picks = ids
    else:
        picks = [ids[round(i * (n - 1) / (count - 1))] for i in range(count)]
    tracks = fetch_tracks(picks)
    out = []
    for t in tracks:
        trs = ((t.get("media") or {}).get("transcodings")) or []
        out.append({
            "permalink_url": t.get("permalink_url"),
            "policy": t.get("policy"),
            "snipped": any(tr.get("snipped") for tr in trs),
            "title": t.get("title"),
        })
    print(json.dumps(out, ensure_ascii=False))


if __name__ == "__main__":
    main()
