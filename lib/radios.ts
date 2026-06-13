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

  // ── French — France ─────────────────────────────────────────────────────────
  fr: [
    { n: "Skyrock Hits",   i: "⚡", f: 1, u: "https://icecast.skyrock.net/s/hit_skyrock_aac_64k?tvr_name=radiofr&tvr_section1=64aac" },
    { n: "France Inter",   i: "🎙️", f: 1, u: "https://icecast.radiofrance.fr/franceinter-midfi.mp3" },
    { n: "OUI FM",         i: "🎸",      u: "https://ouifm.ice.infomaniak.ch/ouifm-high.mp3" },
    { n: "Fun Radio",      i: "🎉",      u: "https://icecast.funradio.fr/fun-1-44-128" },
    { n: "RTL",            i: "📻",      u: "https://icecast.rtl.fr/rtl-1-44-128" },
    { n: "France Info",    i: "📰",      u: "https://icecast.radiofrance.fr/franceinfo-midfi.mp3" },
    { n: "RMC",            i: "⚽",      u: "https://audio.bfmtv.com/rmcradio_128.mp3" },
    { n: "Chante France 80s", i: "🕰️",   u: "https://chantefrance80s.ice.infomaniak.ch/chantefrance80s-128.mp3" },
    { n: "Sud Radio",      i: "🌞",      u: "https://ice.creacast.com/sudradio" },
    { n: "EuroDance 90",   i: "💃",      u: "https://stream-eurodance90.fr/radio/8000/128.mp3" },
  ],

  // ── Arabic ──────────────────────────────────────────────────────────────────
  ar: [
    { n: "Radio Orient",   i: "🎵", f: 1, u: "https://stream.rcs.revma.com/7hnrkawf4p8uv.mp3" },
    { n: "Amr Diab Radio", i: "🎤", f: 1, u: "https://stream-40.zeno.fm/xa4yhh4k838uv" },
    { n: "Ambiance FM",    i: "🎶",      u: "https://stream.zeno.fm/0rehsamc9xxtv" },
    { n: "Voice Lebanon",  i: "🇱🇧",      u: "https://l3.itworkscdn.net/itwaudio/9054/stream" },
    { n: "Sana'a Radio",   i: "📻",      u: "https://dc5.serverse.com/proxy/pbmhbvxs/stream" },
    { n: "Radio Hits 88.2", i: "🎼",     u: "https://radiohits882.radioca.st/;" },
    { n: "Mishary Afasi",  i: "🕌",      u: "https://qurango.net/radio/mishary_alafasi" },
    { n: "Quran Radio",    i: "☪️",      u: "https://qurango.net/radio/mix" },
    { n: "Tarateel",       i: "🌙",      u: "https://qurango.net/radio/tarateel" },
    { n: "Maher Zain",     i: "⭐",      u: "https://qurango.net/radio/maher" },
  ],

  // ── Russian ─────────────────────────────────────────────────────────────────
  ru: [
    { n: "Радио Maximum",  i: "🎸", f: 1, u: "https://maximum.hostingradio.ru/maximum128.mp3" },
    { n: "Europa Plus",    i: "🎵", f: 1, u: "https://ep128.hostingradio.ru:8030/ep128" },
    { n: "Mixadance FM",   i: "💃",      u: "https://stream.mixadance.fm/mixadance" },
    { n: "Радио НАШЕ",     i: "🤘",      u: "https://nashe1.hostingradio.ru:80/nashe-128.mp3" },
    { n: "Rock FM",        i: "🎸",      u: "https://nashe1.hostingradio.ru:80/rock-128.mp3" },
    { n: "DFM",            i: "🎧",      u: "https://dfm.hostingradio.ru/dfm128.mp3" },
    { n: "Авторадио 90-х", i: "🚗",      u: "https://pub0202.101.ru:8443/stream/pro/aac/64/74" },
    { n: "Звезда",         i: "⭐",      u: "https://icecast-zvezda.mediacdn.ru/radio/zvezda/zvezda_128" },
    { n: "Вести FM",       i: "📰",      u: "https://icecast-vgtrk.cdnvideo.ru/vestifm" },
    { n: "Спокойное",      i: "😌",      u: "https://listen9.myradio24.com/6262" },
  ],

  // ── Chinese — Taiwan + China ────────────────────────────────────────────────
  zh: [
    { n: "臺北電台",       i: "🇹🇼", f: 1, h: 1, u: "https://stream.ginnet.cloud/live0130lo-yfyo/_definst_/fm/playlist.m3u8" },
    { n: "CNR-1 中国之声", i: "🇨🇳", f: 1, u: "https://lhttp.qtfm.cn/live/15318317/64k.mp3" },
    { n: "台北古典廣播",   i: "🎼",      u: "https://stream.zeno.fm/w66d3dp6ynhvv" },
    { n: "雨声轻音乐",     i: "🌧️",      u: "https://stream.zeno.fm/689zc32y4x8uv" },
    { n: "Taiwan Lounge",  i: "🏝️",      u: "https://azuracast.conceptradio.fr/radio/8030/stream.mp3" },
    { n: "亚洲粤语 FM",    i: "🎵",      u: "https://lhttp.qtfm.cn/live/15318569/64k.mp3" },
    { n: "500国际经典",    i: "🎶",      u: "https://lhttp.qtfm.cn/live/5022308/64k.mp3" },
    { n: "两广之声",       i: "📻",      u: "https://lhttp.qtfm.cn/live/20500149/64k.mp3" },
    { n: "九八新聞台",     i: "📡",      u: "https://n17a-eu.rcs.revma.com/pntx1639ntzuv" },
    { n: "德云社相声",     i: "😄",      u: "https://stream.zeno.fm/yqawwmweq8mtv" },
  ],
};
