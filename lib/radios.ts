import type { Lang } from "./translations";

export interface RadioStation {
  n: string;  // name
  i: string;  // icon/emoji
  f?: 1;      // favourite (shown first, highlighted)
  h?: 1;      // HLS stream (requires hls.js)
  u: string;  // stream URL
}

// ─── Stations verified via radio-browser.info (lastcheckok=1, is_https=true) ──
// UK stations also verified via Global Radio / BBC / Radiofrance CDN infrastructure.
// Last verified: May 2026.
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
    { n: "Europa FM",      i: "🎤",      u: "https://playerservices.streamtheworld.com/api/livestream-redirect/EUROPAFM_SC" },
    { n: "80 Éxitos",      i: "💯",      u: "https://80sexitos.stream.laut.fm/80sexitos" },
    { n: "Café del Mar",   i: "☀️",      u: "https://streams.radio.co/se1a320b47/listen" },
    { n: "M80 Radio",      i: "🎸",      u: "https://playerservices.streamtheworld.com/api/livestream-redirect/M80_SC" },
    { n: "Radio Marca",    i: "🏟️",      u: "https://sonic.mediatelekom.net/9316/stream" },
    { n: "Deep House",     i: "🎧",      u: "https://stream.radiojar.com/asngk2sg798uv" },
    { n: "Ibiza Radio",    i: "🏖️",      u: "https://streams.radio.co/se1a320b47/listen" },
  ],

  // ── French — France ─────────────────────────────────────────────────────────
  fr: [
    { n: "NRJ France",     i: "⚡", f: 1, u: "https://scdn.nrjaudio.fm/adwz2/fr/30001/mp3_128.mp3" },
    { n: "France Inter",   i: "🎙️", f: 1, u: "https://icecast.radiofrance.fr/franceinter-midfi.mp3" },
    { n: "OUI FM",         i: "🎸",      u: "https://ouifm.ice.infomaniak.ch/ouifm-high.mp3" },
    { n: "Fun Radio",      i: "🎉",      u: "https://streaming.radio.funradio.fr/fun-1-48-192" },
    { n: "RTL",            i: "📻",      u: "https://streaming.radio.rtl.fr/rtl-1-48-192" },
    { n: "France Info",    i: "📰",      u: "https://icecast.radiofrance.fr/franceinfo-midfi.mp3" },
    { n: "RMC",            i: "⚽",      u: "https://audio.bfmtv.com/rmcradio_128.mp3" },
    { n: "Nostalgie",      i: "🕰️",      u: "https://scdn.nrjaudio.fm/adwz2/fr/30601/mp3_128.mp3" },
    { n: "Sud Radio",      i: "🌞",      u: "https://ice.creacast.com/sudradio" },
    { n: "EuroDance 90",   i: "💃",      u: "https://stream-eurodance90.fr/radio/8000/128.mp3" },
  ],

  // ── Arabic ──────────────────────────────────────────────────────────────────
  ar: [
    { n: "Aswat FM",       i: "🎵", f: 1, u: "https://broadcast.ice.infomaniak.ch/aswat-high.mp3" },
    { n: "Amr Diab Radio", i: "🎤", f: 1, u: "https://stream-40.zeno.fm/xa4yhh4k838uv" },
    { n: "Ambiance FM",    i: "🎶",      u: "https://stream.zeno.fm/0rehsamc9xxtv" },
    { n: "Voice Lebanon",  i: "🇱🇧",      u: "https://l3.itworkscdn.net/itwaudio/9054/stream" },
    { n: "Sana'a Radio",   i: "📻",      u: "https://dc5.serverse.com/proxy/pbmhbvxs/stream" },
    { n: "Anghamy",        i: "🎼",      u: "https://radio.avazfarsi.com:8010/radio.mp3" },
    { n: "Mishary Afasi",  i: "🕌",      u: "https://qurango.net/radio/mishary_alafasi" },
    { n: "Quran Radio",    i: "☪️",      u: "https://qurango.net/radio/mix" },
    { n: "Tarateel",       i: "🌙",      u: "https://qurango.net/radio/tarateel" },
    { n: "Maher Zain",     i: "⭐",      u: "https://backup.qurango.net/radio/maher" },
  ],

  // ── Russian ─────────────────────────────────────────────────────────────────
  ru: [
    { n: "Радио Maximum",  i: "🎸", f: 1, u: "https://maximum.hostingradio.ru/maximum128.mp3" },
    { n: "Europa Plus",    i: "🎵", f: 1, u: "https://europaplus.hostingradio.ru/europaplus128.mp3" },
    { n: "Mixadance FM",   i: "💃",      u: "https://stream.mixadance.fm/mixadance" },
    { n: "Радио НАШЕ",     i: "🤘",      u: "https://nashe.hostingradio.ru/nashe128.mp3" },
    { n: "Rock FM",        i: "🎸",      u: "https://rock.hostingradio.ru/rock128.mp3" },
    { n: "DFM",            i: "🎧",      u: "https://dfm.hostingradio.ru/dfm128.mp3" },
    { n: "Авторадио",      i: "🚗",      u: "https://avtoradio.hostingradio.ru/avtoradio128.mp3" },
    { n: "Звезда",         i: "⭐",      u: "https://icecast-zvezda.mediacdn.ru/radio/zvezda/zvezda_128" },
    { n: "Вести FM",       i: "📰",      u: "https://icecast-vgtrk.cdnvideo.ru/vestifm" },
    { n: "Спокойное",      i: "😌",      u: "https://listen9.myradio24.com/6262" },
  ],

  // ── Chinese — Taiwan + China ────────────────────────────────────────────────
  zh: [
    { n: "臺灣教育廣播FM", i: "🇹🇼", f: 1, u: "https://cast.ner.gov.tw/1" },
    { n: "CNR-1 中国之声", i: "🇨🇳", f: 1, u: "https://lhttp.qtfm.cn/live/15318317/64k.mp3" },
    { n: "台北古典廣播",   i: "🎼",      u: "https://stream.zeno.fm/w66d3dp6ynhvv" },
    { n: "雨声轻音乐",     i: "🌧️",      u: "https://stream.zeno.fm/689zc32y4x8uv" },
    { n: "Taiwan Lounge",  i: "🏝️",      u: "https://azuracast.conceptradio.fr/radio/8030/stream.mp3" },
    { n: "亚洲粤语 FM",    i: "🎵",      u: "https://lhttp.qtfm.cn/live/15318569/64k.mp3" },
    { n: "500国际经典",    i: "🎶",      u: "https://lhttp.qtfm.cn/live/5022308/64k.mp3" },
    { n: "两广之声",       i: "📻",      u: "https://lhttp.qtfm.cn/live/20500149/64k.mp3" },
    { n: "臺灣廣播 AM",    i: "📡",      u: "https://cast.ner.gov.tw/2" },
    { n: "德云社相声",     i: "😄",      u: "https://stream.zeno.fm/yqawwmweq8mtv" },
  ],
};
