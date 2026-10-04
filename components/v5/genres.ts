import type { IconName } from "../Icon";
import type { Lang } from "@/lib/translations";

// Genre grouping for the music picker (owner, v5.3: "choose the type of
// playlist according to the genre — and the same for radio"). Kept inside v5
// so the live station and playlist lists (lib/radios.ts, lib/playlists.ts)
// stay untouched; entries are matched by name.

export type GenreKey =
  | "hits" | "decades" | "dance" | "chill" | "urban" | "latin"
  | "classical" | "news" | "sport" | "spiritual" | "world" | "more";

export const GENRES: Record<GenreKey, { icon: IconName; color: string; label: Record<Lang, string> }> = {
  hits:      { icon: "sparkles",   color: "var(--i-lemon)",  label: { en: "Pop & hits",         es: "Éxitos y pop",       ur: "پاپ اور ہٹس" } },
  decades:   { icon: "history",    color: "var(--i-orange)", label: { en: "70s, 80s & 90s",     es: "Años 70, 80 y 90",   ur: "70، 80 اور 90 کی دہائی" } },
  dance:     { icon: "headphones", color: "var(--i-violet)", label: { en: "Dance & electronic", es: "Dance y electrónica", ur: "ڈانس اور الیکٹرانک" } },
  chill:     { icon: "moon",       color: "var(--i-teal)",   label: { en: "Chill",              es: "Relax",              ur: "پرسکون" } },
  urban:     { icon: "mic",        color: "var(--i-pink)",   label: { en: "Hip-hop & urban",    es: "Hip-hop y urbano",   ur: "ہپ ہاپ اور اربن" } },
  latin:     { icon: "flame",      color: "var(--i-red)",    label: { en: "Latin",              es: "Latina",             ur: "لاطینی" } },
  classical: { icon: "music-note", color: "var(--i-sky)",    label: { en: "Classical",          es: "Clásica",            ur: "کلاسیکی" } },
  news:      { icon: "comment",    color: "var(--i-blue)",   label: { en: "News & talk",        es: "Noticias y debate",  ur: "خبریں اور گفتگو" } },
  sport:     { icon: "zap",        color: "var(--i-green)",  label: { en: "Sport",              es: "Deportes",           ur: "کھیل" } },
  spiritual: { icon: "sun",        color: "var(--i-teal)",   label: { en: "Spiritual",          es: "Espiritual",         ur: "روحانی" } },
  world:     { icon: "languages",  color: "var(--i-sky)",    label: { en: "World",              es: "Del mundo",          ur: "دنیا بھر سے" } },
  more:      { icon: "radio",      color: "var(--i-violet)", label: { en: "More stations",      es: "Más emisoras",       ur: "مزید اسٹیشن" } },
};

// Playlists: five styles, then five "from around the world".
export const PLAYLIST_META: Record<string, { genre: GenreKey; icon: IconName; color: string; label: Record<Lang, string>; group: "style" | "world" }> = {
  "Top Hits":   { genre: "hits",  group: "style", icon: "sparkles",   color: "var(--i-lemon)",  label: { en: "Pop & hits",         es: "Éxitos y pop",        ur: "پاپ اور ہٹس" } },
  "Electronic": { genre: "dance", group: "style", icon: "headphones", color: "var(--i-violet)", label: { en: "Dance & electronic", es: "Dance y electrónica", ur: "ڈانس اور الیکٹرانک" } },
  "Hip-Hop":    { genre: "urban", group: "style", icon: "mic",        color: "var(--i-pink)",   label: { en: "Hip-hop",            es: "Hip-hop",             ur: "ہپ ہاپ" } },
  "Chill":      { genre: "chill", group: "style", icon: "moon",       color: "var(--i-teal)",   label: { en: "Chill",              es: "Relax",               ur: "پرسکون" } },
  "Latin Pop":  { genre: "latin", group: "style", icon: "flame",      color: "var(--i-red)",    label: { en: "Latin pop",          es: "Pop latino",          ur: "لاطینی پاپ" } },
  "Spanish":    { genre: "world", group: "world", icon: "languages",  color: "var(--i-red)",    label: { en: "Spanish",            es: "Española",            ur: "ہسپانوی" } },
  "French":     { genre: "world", group: "world", icon: "languages",  color: "var(--i-blue)",   label: { en: "French",             es: "Francesa",            ur: "فرانسیسی" } },
  "Arabic":     { genre: "world", group: "world", icon: "languages",  color: "var(--i-green)",  label: { en: "Arabic",             es: "Árabe",               ur: "عربی" } },
  "Russian":    { genre: "world", group: "world", icon: "languages",  color: "var(--i-sky)",    label: { en: "Russian",            es: "Rusa",                ur: "روسی" } },
  "Chinese":    { genre: "world", group: "world", icon: "languages",  color: "var(--i-orange)", label: { en: "Chinese",            es: "China",               ur: "چینی" } },
};

// Radio stations by name, per language list in lib/radios.ts.
const STATION_GENRE: Record<string, GenreKey> = {
  // English (UK)
  "Capital FM": "hits",
  "Heart 70s": "decades", "Heart 80s": "decades", "Heart 90s": "decades", "Gold": "decades",
  "Heart Dance": "dance",
  "Smooth Chill": "chill",
  "Classic FM": "classical",
  "BBC World": "news",
  "talkSPORT": "sport",
  // Spanish
  "LOS 40": "hits", "Cadena 100": "hits", "KISS FM": "hits",
  "80 Éxitos": "decades", "LOS40 Classic": "decades",
  "Los 40 Urban": "urban",
  "Café del Mar": "chill",
  "Deep House": "dance", "Ibiza Global": "dance",
  "Radio Marca": "sport",
  // Urdu (Pakistan)
  "Hum FM 106.2": "hits", "Samaa FM 107.4": "hits", "All4Masti": "hits", "Radio Madhoshi": "hits", "BIG 92.7 FM": "hits",
  "Radio Pakistan Lahore": "news", "Radio Pakistan News": "news",
  "Sout-ul-Quran FM 93.4": "spiritual",
};

export function stationGenre(name: string): GenreKey {
  return STATION_GENRE[name] ?? "more";
}

/** Group a station list by genre, keeping each genre's first-appearance order. */
export function groupStations<T extends { n: string }>(stations: T[]): { genre: GenreKey; items: { st: T; idx: number }[] }[] {
  const groups: { genre: GenreKey; items: { st: T; idx: number }[] }[] = [];
  stations.forEach((st, idx) => {
    const g = stationGenre(st.n);
    let group = groups.find((x) => x.genre === g);
    if (!group) { group = { genre: g, items: [] }; groups.push(group); }
    group.items.push({ st, idx });
  });
  return groups;
}
