export interface Playlist {
  n: string; // display name
  i: string; // icon
  u: string; // verified SoundCloud profile URL (oEmbed-confirmed working)
}

// All URLs verified via SoundCloud oEmbed API — profile feeds, not internal chart paths.
// Profile URLs are more stable than chart/discover paths which require authentication.
export const PLAYLISTS: Playlist[] = [
  { n: "Top Hits",    i: "🎵", u: "https://soundcloud.com/spinnin-records" },
  { n: "Spanish",     i: "🇪🇸", u: "https://soundcloud.com/j-balvin" },
  { n: "French",      i: "🇫🇷", u: "https://soundcloud.com/stromae" },
  { n: "Arabic",      i: "🇸🇦", u: "https://soundcloud.com/amr-diab" },
  { n: "Russian",     i: "🇷🇺", u: "https://soundcloud.com/timati" },
  { n: "Chinese",     i: "🇨🇳", u: "https://soundcloud.com/cpop" },
  { n: "Electronic",  i: "🎛️", u: "https://soundcloud.com/nocopyrightsounds" },
  { n: "Hip-Hop",     i: "🎤", u: "https://soundcloud.com/hotnewhiphop" },
  { n: "Chill",       i: "🧘", u: "https://soundcloud.com/chillhopdotcom" },
  { n: "Latin Pop",   i: "💃", u: "https://soundcloud.com/maluma" },
];
