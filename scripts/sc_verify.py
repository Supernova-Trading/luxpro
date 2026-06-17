"""Strict streamability verifier for SoundCloud playlists/accounts.

Enumerates EVERY track in a playlist (set) or user account via the widget API
and rejects the source if ANY track is preview-only. This is the fix for what
slipped through last time: a one-shot current-track check passes while a SNIP
track one slot away breaks playback.

A track FAILS if any of:
  - policy == "SNIP"                  (snippet/preview only)
  - monetization_model == "SUB_HIGH_TIER"  (Go+ subscription required)
  - any media.transcodings[].snipped == True
  - policy == "BLOCK"                 (not playable at all)

Usage:
  python scripts/sc_verify.py <soundcloud_url> [--max N]
    <url>   playlist/set URL or user/profile URL
    --max   cap on tracks enumerated for a user account (default: all)
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


def resolve(url):
    return fetch(f"{BASE}/resolve?url={urllib.parse.quote(url, safe='')}&client_id={CID}")


def user_track_ids(user_id, cap):
    ids, href = [], (
        f"{BASE}/users/{user_id}/tracks?client_id={CID}&limit=200&linked_partitioning=1&app_version=1700000000"
    )
    while href:
        d = fetch(href)
        ids += [t["id"] for t in d.get("collection", []) if t.get("id")]
        if cap and len(ids) >= cap:
            return ids[:cap]
        href = d.get("next_href")
        if href and "client_id" not in href:
            href += f"&client_id={CID}"
    return ids


def fetch_tracks(ids):
    """Batch-hydrate full track metadata (policy/monetization/media)."""
    out = []
    for i in range(0, len(ids), 50):
        chunk = ids[i : i + 50]
        idstr = ",".join(str(x) for x in chunk)
        d = fetch(f"{BASE}/tracks?ids={idstr}&client_id={CID}&app_version=1700000000")
        out += d if isinstance(d, list) else d.get("collection", [])
    return out


def track_failure(t):
    reasons = []
    if t.get("policy") in ("SNIP", "BLOCK"):
        reasons.append(f"policy={t.get('policy')}")
    if t.get("monetization_model") == "SUB_HIGH_TIER":
        reasons.append("monetization=SUB_HIGH_TIER")
    trs = ((t.get("media") or {}).get("transcodings")) or []
    if any(tr.get("snipped") for tr in trs):
        reasons.append("snipped=true")
    return reasons


def main():
    url = sys.argv[1]
    cap = None
    if "--max" in sys.argv:
        cap = int(sys.argv[sys.argv.index("--max") + 1])

    obj = resolve(url)
    kind = obj.get("kind")
    title = obj.get("title") or (obj.get("username"))
    print(f"# {kind}: {title!r}  ({url})")

    if kind == "playlist":
        ids = [t["id"] for t in obj.get("tracks", []) if t.get("id")]
    elif kind == "user":
        ids = user_track_ids(obj["id"], cap)
    else:
        print(f"  ! unsupported kind: {kind}")
        return

    print(f"  enumerating {len(ids)} track(s)...")
    tracks = fetch_tracks(ids)

    bad = []
    for t in tracks:
        r = track_failure(t)
        if r:
            bad.append((t.get("title"), r))

    scanned = len(tracks)
    print(f"  scanned={scanned}  clean={scanned - len(bad)}  FAILING={len(bad)}")
    if bad:
        print(f"  VERDICT: ❌ REJECT — {len(bad)}/{scanned} preview/blocked")
        for ttl, r in bad[:12]:
            print(f"     - {ttl!r}: {', '.join(r)}")
        if len(bad) > 12:
            print(f"     ... and {len(bad) - 12} more")
    else:
        print(f"  VERDICT: ✅ ACCEPT — all {scanned} tracks stream full")


if __name__ == "__main__":
    main()
