export interface Playlist {
  n: string; // display name
  i: string; // icon
  u: string; // SoundCloud profile URL — resolved via api-widget.soundcloud.com with track_count > 0
}

// All URLs verified 2026-06-13 via the widget resolve API (the exact call the embed player
// makes): each account resolves with track_count > 0. oEmbed HTTP 200 is NOT sufficient —
// it confirms a page exists, not that it has playable audio (squatter accounts pass oEmbed).
//
// NOTE (for upcoming UX pass): on Android Chrome the widget's auto_play=true is often
// blocked by mobile autoplay policy in cross-origin iframes — the player loads paused and
// the passenger must tap play inside the widget. Not a data bug; needs a UX affordance.
export const PLAYLISTS: Playlist[] = [
  { n: "Top Hits",    i: "🎵", u: "https://soundcloud.com/spinninrecords" },      // verified, 3,535 tracks
  { n: "Spanish",     i: "🇪🇸", u: "https://soundcloud.com/j-balvin-official" },  // verified, 259 tracks
  { n: "French",      i: "🇫🇷", u: "https://soundcloud.com/stromae" },            // verified, 78 tracks
  { n: "Arabic",      i: "🇸🇦", u: "https://soundcloud.com/amrdiab" },            // verified, 518 tracks
  { n: "Russian",     i: "🇷🇺", u: "https://soundcloud.com/black-star-label" },   // verified, 509 tracks (Timati's label)
  { n: "Chinese",     i: "🇨🇳", u: "https://soundcloud.com/88rising" },           // verified, 96 tracks (pan-Asian incl. Chinese acts)
  { n: "Electronic",  i: "🎛️", u: "https://soundcloud.com/nocopyrightsounds" },  // verified, 1,923 tracks
  { n: "Hip-Hop",     i: "🎤", u: "https://soundcloud.com/hotnewhiphop" },        // 49 tracks
  { n: "Chill",       i: "🧘", u: "https://soundcloud.com/chillhopdotcom" },      // verified, 1,793 tracks
  { n: "Latin Pop",   i: "💃", u: "https://soundcloud.com/malumaofficial" },      // verified, 189 tracks
];
