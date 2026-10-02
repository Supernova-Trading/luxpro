import type { Lang } from "./translations";

export interface RadioStation {
  n: string;  // name — MUST match the brand that actually plays on the stream
  i: string;  // icon/emoji
  f?: 1;      // favourite (shown first, highlighted)
  h?: 1;      // HLS stream (requires hls.js)
  u: string;  // stream URL
}

// ─── Station verification — last full audit: 2026-06-13 ──────────────────────
// Method (scripts/radio_audit.py): real GET per stream with
// Origin: https://luxpro-nu.vercel.app, redirects followed, 2KB of body read,
// requiring: HTTPS on the FINAL url, HTTP 200, audio content-type, and an
// Access-Control-Allow-Origin header. Borderline TLS cases re-confirmed in
// Chrome (Python rejects some chains the browser also rejects — and some it
// doesn't). Replacements sourced from radio-browser.info
// (is_https, lastcheckok=1, codec MP3/AAC/HLS) and probe-tested before
// inclusion (scripts/radio_replace.py). Rot signatures seen this cycle:
// streamtheworld/RTL/Fun mounts 404, NRJ CDN hotlink 403 (entire network),
// hostingradio.ru cert hostname mismatches, expired/broken-chain TLS (hangs
// forever in Chrome — no error event), HTTPS→HTTP redirects (mixed content).
export const RADIOS_BY_LANG: Record<Lang, RadioStation[]> = {
  // ── English — United Kingdom ────────────────────────────────────────────────
  en: [
    { n: "Heart 80s",      i: "🎵", f: 1, u: "https://media-ssl.musicradio.com/Heart80sMP3" },
    { n: "Heart 90s",      i: "💿", f: 1, u: "https://media-ssl.musicradio.com/Heart90sMP3" },
    { n: "Capital FM",     i: "⭐",      u: "https://media-ssl.musicradio.com/CapitalMP3" },
    { n: "Heart Dance",    i: "💃",      u: "https://media-ssl.musicradio.com/HeartDanceMP3" },
    { n: "Smooth Chill",   i: "🌊",      u: "https://media-ssl.musicradio.com/ChillMP3" },
    { n: "Gold",           i: "🏅",      u: "https://media-ssl.musicradio.com/GoldMP3" },
    { n: "Heart 70s",      i: "🕺",      u: "https://media-ssl.musicradio.com/Heart70sMP3" },
    { n: "Classic FM",     i: "🎼",      u: "https://media-ssl.musicradio.com/ClassicFMMP3" },
    { n: "BBC World",      i: "🌍",      u: "https://stream.live.vc.bbcmedia.co.uk/bbc_world_service" },
    { n: "talkSPORT",      i: "⚽",      u: "https://radio.talksport.com/stream" },
  ],

  // ── Spanish — Spain ─────────────────────────────────────────────────────────
  es: [
    { n: "LOS 40",         i: "🎵", f: 1, u: "https://playerservices.streamtheworld.com/api/livestream-redirect/Los40.mp3" },
    { n: "Los 40 Urban",   i: "🏙️", f: 1, u: "https://playerservices.streamtheworld.com/api/livestream-redirect/LOS40_URBAN.mp3" },
    { n: "LOS40 Classic",  i: "🎶",      u: "https://playerservices.streamtheworld.com/api/livestream-redirect/LOS40_CLASSIC.mp3" },
    { n: "KISS FM",        i: "🎤",      u: "https://bbkissfm.kissfmradio.cires21.com/bbkissfm.mp3" },
    { n: "80 Éxitos",      i: "💯",      u: "https://80sexitos.stream.laut.fm/80sexitos" },
    { n: "Café del Mar",   i: "☀️",      u: "https://streams.radio.co/se1a320b47/listen" },
    { n: "Cadena 100",     i: "🎸", h: 1, u: "https://cadena100bcn-cope.flumotion.com/playlist.m3u8" },
    { n: "Radio Marca",    i: "🏟️",      u: "https://sonic.mediatelekom.net/9316/stream" },
    { n: "Deep House",     i: "🎧",      u: "https://stream.radiojar.com/asngk2sg798uv" },
    { n: "Ibiza Global",   i: "🏖️",      u: "https://control.streaming-pro.com:8000/ibizaglobalclassics.mp3" },
  ],

  // ── Urdu — Pakistan ──────────────────────────────────────────────────────────
  // Verified 2026-08-21 with the same probe method as above (HTTPS final URL,
  // HTTP 200, audio content-type, ACAO header present, bytes confirmed flowing).
  ur: [
    { n: "Hum FM 106.2",   i: "🎵", f: 1, u: "https://server.mediacast4u.stream/8002/stream" },
    { n: "Samaa FM 107.4", i: "📻", f: 1, u: "https://samaakhi107-itelservices.radioca.st/stream" },
    { n: "Radio Pakistan Lahore", i: "🎙️",      u: "https://whmsonic.radio.gov.pk:8026/relay?type=http&nocache=9" },
    { n: "Radio Pakistan News",   i: "📰",      u: "https://whmsonic.radio.gov.pk:7004/stream?type=http&nocache=12" },
    { n: "Sout-ul-Quran FM 93.4", i: "☪️",      u: "https://whmsonic.radio.gov.pk:7002/stream?type=http&nocache=12" },
    { n: "All4Masti",      i: "🎉",      u: "https://stream.zeno.fm/bahhkuge5zhvv" },
    { n: "Radio Madhoshi", i: "🎶",      u: "https://stream.zeno.fm/7rsl8fsccf8uv" },
    { n: "BIG 92.7 FM",    i: "⭐",      u: "https://stream.zeno.fm/dbstwo3dvhhtv" },
  ],
};
