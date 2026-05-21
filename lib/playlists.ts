export interface Playlist {
  n: string; // name
  i: string; // icon
  u: string; // SoundCloud URL
}

export const PLAYLISTS: Playlist[] = [
  { n: "Top Hits",   i: "🎵", u: "https://soundcloud.com/discover/sets/charts-top:all-music" },
  { n: "Spanish",    i: "🇪🇸", u: "https://soundcloud.com/discover/sets/charts-top:all-music:es" },
  { n: "French",     i: "🇫🇷", u: "https://soundcloud.com/discover/sets/charts-top:all-music:fr" },
  { n: "Arabic",     i: "🇸🇦", u: "https://soundcloud.com/discover/sets/charts-top:all-music:sa" },
  { n: "Russian",    i: "🇷🇺", u: "https://soundcloud.com/discover/sets/charts-top:all-music:ru" },
  { n: "Electronic", i: "🎛️", u: "https://soundcloud.com/discover/sets/charts-top:electronic" },
  { n: "Hip-Hop",    i: "🎤", u: "https://soundcloud.com/discover/sets/charts-top:hiphoprap" },
  { n: "Pop",        i: "🎶", u: "https://soundcloud.com/discover/sets/charts-top:pop" },
  { n: "Chill",      i: "🧘", u: "https://soundcloud.com/discover/sets/charts-top:ambient" },
  { n: "Dance",      i: "💃", u: "https://soundcloud.com/discover/sets/charts-top:dance" },
];
