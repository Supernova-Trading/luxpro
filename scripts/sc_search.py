"""Search SoundCloud widget API for curated playlists. Diagnostic helper for playlist replacement."""
import io
import json
import sys

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
import urllib.parse
import urllib.request

CID = "nIjtjiYnjkOhMyh5xrbqEW12DxeJVnic"

def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=20) as r:
        return json.loads(r.read().decode("utf-8"))

def search_playlists(q, limit=8):
    url = (
        "https://api-widget.soundcloud.com/search/playlists?q="
        + urllib.parse.quote(q)
        + f"&client_id={CID}&limit={limit}&app_version=1700000000"
    )
    d = fetch(url)
    out = []
    for p in d.get("collection", []):
        u = p.get("user", {})
        out.append({
            "tracks": p.get("track_count"),
            "likes": p.get("likes_count") or 0,
            "verified": u.get("verified"),
            "owner": u.get("username"),
            "owner_followers": u.get("followers_count"),
            "url": p.get("permalink_url"),
            "title": p.get("title"),
        })
    return out

def search_users(q, limit=8):
    url = (
        "https://api-widget.soundcloud.com/search/users?q="
        + urllib.parse.quote(q)
        + f"&client_id={CID}&limit={limit}&app_version=1700000000"
    )
    d = fetch(url)
    return [
        {
            "verified": u.get("verified"),
            "followers": u.get("followers_count"),
            "tracks": u.get("track_count"),
            "name": u.get("username"),
            "url": u.get("permalink_url"),
            "id": u.get("id"),
        }
        for u in d.get("collection", [])
    ]

def user_playlists(user_id, limit=15):
    url = f"https://api-widget.soundcloud.com/users/{user_id}/playlists?client_id={CID}&limit={limit}&app_version=1700000000"
    d = fetch(url)
    return [
        {"tracks": p.get("track_count"), "likes": p.get("likes_count") or 0, "title": p.get("title"), "url": p.get("permalink_url")}
        for p in d.get("collection", [])
    ]

if __name__ == "__main__":
    mode = sys.argv[1]
    q = " ".join(sys.argv[2:])
    if mode == "pl":
        for r in search_playlists(q):
            print(f"{r['tracks']:>4}t {r['likes']:>7}likes v={r['verified']} owner={r['owner']!r}({r['owner_followers']}) {r['title']!r} {r['url']}")
    elif mode == "user":
        for r in search_users(q):
            print(f"v={r['verified']} {r['followers']:>9}fol {r['tracks']:>5}t id={r['id']} {r['name']!r} {r['url']}")
    elif mode == "userpl":
        for r in user_playlists(int(q)):
            print(f"{r['tracks']:>4}t {r['likes']:>7}likes {r['title']!r} {r['url']}")
