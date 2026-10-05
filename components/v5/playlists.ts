import { PLAYLISTS as LIVE_PLAYLISTS, type Playlist } from "@/lib/playlists";

// More playlist genres for v5 (owner, 2026-10-05). Kept here so the live 4.33
// list (lib/playlists.ts) is untouched; v5 shows the live ten, then these.
// Each passed BOTH gates on 2026-10-05, same as the live list:
//   1. every track full-length (scripts/sc_verify.py: no SNIP / Go+ / BLOCK)
//   2. real playback past 32 s on two random tracks in Chrome, no stalls.
// Tried and rejected: every Rock and R&B playlist found (mostly 30-second
// previews), Afro House sets (blocked tracks), "Springtime Soul & Smooth
// Jazz" (passed 1 but played 0 s — a dead stream).
// Display labels per language live in genres.ts (PLAYLIST_META).
export const EXTRA_PLAYLISTS: Playlist[] = [
  { n: "Jazz Café",         i: "🎷", u: "https://soundcloud.com/relaxcafemusic/sets/coffee-jazz" },                      // 432/432 · 38.5s, 37.2s
  { n: "Piano & Classical", i: "🎹", u: "https://soundcloud.com/relaxing-music-production/sets/classical-music-for-studying" }, // 484/484 · 38.7s, 39.5s
  { n: "Retro Hits",        i: "📼", u: "https://soundcloud.com/jonathan-guimaraes-kraus/sets/flashback-70s-80s-90s-best" },  // 86/86 · 39.3s, 38.0s
  { n: "Amapiano",          i: "🥁", u: "https://soundcloud.com/kenyudheaa/sets/amapiano-mixtape" },                     // 50/50 · 39.4s, 38.0s
  { n: "Bollywood",         i: "🎬", u: "https://soundcloud.com/inder-kirat/sets/hindi-songs-2000s" },                   // 67/67 · 38.0s, 39.3s
  { n: "Pakistani Hits",    i: "🇵🇰", u: "https://soundcloud.com/inder-kirat/sets/pakistani-songs-2025" },               // 49/49 · 39.5s, 39.5s
  { n: "Coke Studio",       i: "🎙️", u: "https://soundcloud.com/dawood-kamal-548097405/sets/coke-studio" },              // 61/61 · 39.4s, 38.0s
];

/** Everything v5 plays: the live list first (same order and index), then the extras. */
export const PLAYLISTS: Playlist[] = [...LIVE_PLAYLISTS, ...EXTRA_PLAYLISTS];
