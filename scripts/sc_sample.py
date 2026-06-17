"""Print a sample of track titles/artists/genre for a SoundCloud URL — used to
confirm a candidate source is genre/language-appropriate (the verifier only
checks streamability, not content)."""
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


def main():
    url = sys.argv[1]
    n = int(sys.argv[2]) if len(sys.argv) > 2 else 14
    obj = fetch(f"{BASE}/resolve?url={urllib.parse.quote(url, safe='')}&client_id={CID}")
    kind = obj.get("kind")
    if kind == "playlist":
        ids = [t["id"] for t in obj.get("tracks", []) if t.get("id")][:n]
    else:
        d = fetch(f"{BASE}/users/{obj['id']}/tracks?client_id={CID}&limit={n}&app_version=1700000000")
        ids = [t["id"] for t in d.get("collection", []) if t.get("id")][:n]
    idstr = ",".join(str(x) for x in ids)
    tracks = fetch(f"{BASE}/tracks?ids={idstr}&client_id={CID}&app_version=1700000000")
    tracks = tracks if isinstance(tracks, list) else tracks.get("collection", [])
    print(f"# {kind}: {obj.get('title') or obj.get('username')!r}")
    for t in tracks:
        u = (t.get("user") or {}).get("username")
        print(f"   - {t.get('title')!r}  —  {u!r}  [{t.get('genre')}]")


if __name__ == "__main__":
    main()
