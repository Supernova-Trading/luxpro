import type { Lang } from "./translations";

export interface RadioStation {
  n: string;  // name
  i: string;  // icon
  f?: 1;      // favourite flag
  h?: 1;      // HLS flag (requires hls.js)
  u: string;  // stream URL
}

export const RADIOS_BY_LANG: Record<Lang, RadioStation[]> = {
  en: [
    { n: "Capital FM",   i: "🎵", f: 1, u: "https://media-ssl.musicradio.com/CapitalMP3" },
    { n: "Smooth Radio", i: "🌊", f: 1, u: "https://media-ssl.musicradio.com/SmoothUK" },
    { n: "Classic FM",   i: "🎼",      u: "https://media-ssl.musicradio.com/ClassicFMMP3" },
    { n: "BBC Radio 2",  i: "🎙️",     u: "https://stream.live.vc.bbcmedia.co.uk/bbc_radio_two" },
    { n: "Heart UK",     i: "💗",      u: "https://media-ssl.musicradio.com/HeartUK" },
    { n: "Kiss UK",      i: "💋",      u: "https://stream-mz.planetradio.co.uk/kissnational.mp3" },
    { n: "Magic Radio",  i: "✨",      u: "https://stream-mz.planetradio.co.uk/magicnational.mp3" },
    { n: "Hits Radio",   i: "🔥",      u: "https://stream-mz.planetradio.co.uk/hitsradio.mp3" },
    { n: "talkSPORT",    i: "📰",      u: "https://radio.talksport.com/stream" },
    { n: "Virgin Radio", i: "⭐",      u: "https://radio.virginradio.co.uk/stream" },
  ],
  es: [
    { n: "Los 40",      i: "🎵", f: 1, u: "https://playerservices.streamtheworld.com/api/livestream-redirect/LOS40.mp3" },
    { n: "Cadena 100",  i: "💯", f: 1, u: "https://flucast-b03-04.flumotion.com/cope/cadena100.mp3" },
    { n: "Cadena Dial", i: "📻",      u: "https://playerservices.streamtheworld.com/api/livestream-redirect/CADENADIALAAC.aac" },
    { n: "Europa FM",   i: "🎶",      u: "https://playerservices.streamtheworld.com/api/livestream-redirect/EUROPAFM_SC" },
    { n: "M80 Radio",   i: "⭐",      u: "https://playerservices.streamtheworld.com/api/livestream-redirect/M80_SC" },
    { n: "Kiss FM",     i: "💋",      u: "https://kissfm.kissfmradio.cires21.com/kissfm.mp3" },
    { n: "COPE",        i: "🎙️",     u: "https://flucast-b03-04.flumotion.com/cope/cope.mp3" },
    { n: "Rock FM",     i: "🎸",      u: "https://flucast-b03-04.flumotion.com/cope/rockfm.mp3" },
    { n: "RNE Noticias",i: "📰",  h: 1, u: "https://crtve-rne1.cires21.com/RNE_HLS/playlist.m3u8" },
    { n: "Loca FM",     i: "🔥",      u: "https://server7.emisorasenvivo.com:7508/stream" },
  ],
  fr: [
    { n: "NRJ",             i: "🎵", f: 1, u: "https://scdn.nrjaudio.fm/adwz1/fr/30001/mp3_128.mp3" },
    { n: "Fun Radio",       i: "😄", f: 1, u: "https://streaming.radio.funradio.fr/fun-1-44-128" },
    { n: "France Inter",    i: "📰",      u: "https://icecast.radiofrance.fr/franceinter-midfi.mp3" },
    { n: "Europe 1",        i: "🌍",      u: "https://stream.europe1.fr/europe1.mp3" },
    { n: "Skyrock",         i: "🎤",      u: "https://icecast.skyrock.net/s/natio_mp3_128k" },
    { n: "Chérie FM",       i: "💗",      u: "https://scdn.nrjaudio.fm/adwz1/fr/30201/mp3_128.mp3" },
    { n: "Nostalgie",       i: "⭐",      u: "https://scdn.nrjaudio.fm/adwz1/fr/30601/mp3_128.mp3" },
    { n: "RFM",             i: "🎶",      u: "https://ais-sa3.cdnstream1.com/2603_128.mp3" },
    { n: "Rire & Chansons", i: "😂",      u: "https://scdn.nrjaudio.fm/adwz1/fr/30401/mp3_128.mp3" },
    { n: "RTL",             i: "🎙️",     u: "https://streaming.radio.rtl.fr/rtl-1-44-128" },
  ],
  ar: [
    { n: "MBC FM",      i: "🎵", f: 1, h: 1, u: "https://mbcfm.akamaized.net/hls/live/2034458/mbcfm/master.m3u8" },
    { n: "Mix FM",      i: "🎶", f: 1,       u: "https://l3.itworkscdn.net/itwaudio/9202/stream/icecast.audio" },
    { n: "Al Arabiya",  i: "📰",      h: 1,  u: "https://av.alarabiya.net/Alarabiya/alarabiya.stream/playlist.m3u8" },
    { n: "Quran Radio", i: "📖",             u: "https://Qurani.medianetlive.com/8042/stream" },
    { n: "Rotana FM",   i: "⭐",             u: "https://l3.itworkscdn.net/itwaudio/9106/stream/icecast.audio" },
    { n: "Panorama FM", i: "🌅",      h: 1,  u: "https://panorama.akamaized.net/hls/live/2034466/panorama/master.m3u8" },
    { n: "Nogoum FM",   i: "💫",             u: "https://playerservices.streamtheworld.com/api/livestream-redirect/NOGOUM_FM.mp3" },
    { n: "Sawt Al Arab",i: "🎙️",            u: "https://l3.itworkscdn.net/itwaudio/9112/stream/icecast.audio" },
    { n: "Marina FM",   i: "🌊",             u: "https://l3.itworkscdn.net/itwaudio/9120/stream/icecast.audio" },
    { n: "Saudi Radio", i: "🇸🇦",           u: "https://5.39.71.159:8442/stream" },
  ],
  ru: [
    { n: "Europa Plus",   i: "🎵", f: 1, u: "https://ep128.streamr.ru/ep128" },
    { n: "Russkoe Radio", i: "🇷🇺",f: 1, u: "https://rusradio.hostingradio.ru/rusradio96.aacp" },
    { n: "Echo Moscow",   i: "📰",      u: "http://icecast.silvercast.ru/echoMoscow_128" },
    { n: "Avtoradio",     i: "🚗",      u: "https://pub0302.101.ru:8443/stream/air/aac/64/100" },
    { n: "DFM",           i: "🎛️",     u: "https://dfm.hostingradio.ru/dfm96.aacp" },
    { n: "Energy",        i: "⚡",      u: "https://pub0202.101.ru:8443/stream/air/aac/64/99" },
    { n: "Retro FM",      i: "⭐",      u: "https://retro.hostingradio.ru/retro128.mp3" },
    { n: "Love Radio",    i: "💗",      u: "https://pub0302.101.ru:8443/stream/air/aac/64/210" },
    { n: "Hit FM",        i: "🔥",      u: "https://hitfm.hostingradio.ru/hitfm96.aacp" },
    { n: "Radio Record",  i: "💿",      u: "https://radiorecord.hostingradio.ru/rr_main96.aacp" },
  ],
  zh: [
    { n: "CRI Pop",      i: "🎵", f: 1, h: 1, u: "https://china-radio.akamaized.net/hls/live/2034447/cripop/master.m3u8" },
    { n: "CNR Music",    i: "🎶", f: 1, h: 1, u: "https://ngcdn003.cnr.cn/live/zgzs/index.m3u8" },
    { n: "CNR News",     i: "📰",      h: 1,  u: "https://ngcdn001.cnr.cn/live/zgzs/index.m3u8" },
    { n: "Beijing Music",i: "🏯",      h: 1,  u: "https://ngcdn004.cnr.cn/live/yyzs/index.m3u8" },
    { n: "CRI Easy FM",  i: "😊",      h: 1,  u: "https://china-radio.akamaized.net/hls/live/2034444/crieasyfm/master.m3u8" },
    { n: "HK Radio",     i: "🇭🇰",    h: 1,  u: "https://rthkaudio2-lh.akamaihd.net/i/radio2_1@355865/master.m3u8" },
    { n: "Taiwan ICRT",  i: "🌏",             u: "https://icrt-live.icrt.com.tw/icrt" },
    { n: "CRI HitFM",    i: "🔥",      h: 1,  u: "https://china-radio.akamaized.net/hls/live/2034445/crihitfm/master.m3u8" },
    { n: "Hunan Music",  i: "🎤",      h: 1,  u: "https://ngcdn002.cnr.cn/live/jjzs/index.m3u8" },
    { n: "CRI Story",    i: "📖",      h: 1,  u: "https://china-radio.akamaized.net/hls/live/2034446/cristory/master.m3u8" },
  ],
};
