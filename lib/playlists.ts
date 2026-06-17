export interface Playlist {
  n: string; // display name
  i: string; // icon
  u: string; // SoundCloud profile OR playlist/set URL (the widget accepts both)
}

// DUAL-VERIFIED 2026-06-17 (scripts/sc_verify.py + a 35s real-playback harness):
//   1. API gate  — every track enumerated; reject if ANY track is policy "SNIP" /
//      monetization "SUB_HIGH_TIER" / snipped:true (the Go+ preview check).
//   2. Playback gate — load the embed, attach the Widget API, PLAY several tracks, poll
//      getPosition for 35s; require continuous advance past 32s with no early FINISH and
//      no 0-stall.
// The API gate alone is NOT enough: commercial-artist accounts (J Balvin, Maluma, Stromae,
// Amr Diab) served ~30s Go+ SNIP previews — the "8-second cutoff" — and some accounts that
// passed the flags (88rising, an earlier Latin pick) were geo-stalled dead streams (0s of
// audio despite policy:MONETIZE). Both gates must pass. Re-run scripts/sc_verify.py to recheck.
//
// Display names are genre/language only — no card names an artist it doesn't play.
//
// NOTE (UX pass): on Android Chrome auto_play=true is often blocked by mobile autoplay
// policy in cross-origin iframes — player loads paused; passenger taps play. Not a data bug.
export const PLAYLISTS: Playlist[] = [
  { n: "Top Hits",    i: "🎵", u: "https://soundcloud.com/spinninrecords" },                         // label · API 3498/3498 · playback ✅
  { n: "Spanish",     i: "🇪🇸", u: "https://soundcloud.com/reggaeton" },                             // REGGAETON Movement · API 44/44 · playback ✅
  { n: "French",      i: "🇫🇷", u: "https://soundcloud.com/salman-mellati/sets/franch-music" },      // FR chanson/variété · API 312/313 (1 region-BLOCK, 0 SNIP) · playback ✅
  { n: "Arabic",      i: "🇸🇦", u: "https://soundcloud.com/hanangobran/sets/arabic-old-songs-music-only" }, // Arabic classics · API 168/168 · playback ✅
  { n: "Russian",     i: "🇷🇺", u: "https://soundcloud.com/black-star-label" },                      // label · API 509/509 · playback ✅
  { n: "Chinese",     i: "🇨🇳", u: "https://soundcloud.com/sanode/sets/chinese-pop" },               // Chinese/Mandopop · API 422/422 · playback ✅
  { n: "Electronic",  i: "🎛️", u: "https://soundcloud.com/nocopyrightsounds" },                     // free-music label · API 1923/1923 · playback ✅
  { n: "Hip-Hop",     i: "🎤", u: "https://soundcloud.com/hotnewhiphop" },                           // API 49/49 · playback ✅
  { n: "Chill",       i: "🧘", u: "https://soundcloud.com/chillhopdotcom" },                         // free-music label · API 1795/1795 · playback ✅
  { n: "Latin Pop",   i: "💃", u: "https://soundcloud.com/latinpowermusic" },                        // Latin Power Music · API 56/56 · playback ✅
];
