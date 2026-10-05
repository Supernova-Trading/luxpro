import type { Lang } from "@/lib/translations";
import type { RadioStation } from "@/lib/radios";

// Extra stations for v5 (owner and Amish, 2026-10-05: "more radio stations
// in all three languages"). Kept here, not in lib/radios.ts, so the live 4.33
// list is untouched; v5 plays the live list followed by these.
// Every URL passed the project's audit probe on 2026-10-05 (HTTPS final URL,
// HTTP 200, audio or HLS, bytes flowing) and has no expiring session token.
// Names match the brand that actually plays. Genres: genres.ts.
export const EXTRA_STATIONS: Record<Lang, RadioStation[]> = {
  en: [
    { n: "Radio X",              i: "🎸", u: "https://media-ssl.musicradio.com/RadioXUKMP3" },
    { n: "Radio X Classic Rock", i: "🎸", u: "https://media-ssl.musicradio.com/RadioXClassicRockMP3" },
    { n: "Capital XTRA",         i: "🎤", u: "https://media-ssl.musicradio.com/CapitalXTRANationalMP3" },
    { n: "Capital Dance",        i: "💃", u: "https://media-ssl.musicradio.com/CapitalDanceMP3" },
    { n: "KISS",                 i: "⭐", u: "https://live-kiss.sharp-stream.com/kiss100.mp3" },
    { n: "Heart 00s",            i: "💿", u: "https://media-ssl.musicradio.com/Heart00sMP3" },
    { n: "Smooth Radio",         i: "🌙", u: "https://media-ssl.musicradio.com/SmoothUKMP3" },
    { n: "Jazz London Radio",    i: "🎷", u: "https://radio.canstream.co.uk:8075/live.aac" },
    { n: "LBC",                  i: "🎙️", u: "https://media-ssl.musicradio.com/LBCUKMP3" },
    { n: "LBC News",             i: "📰", u: "https://media-ssl.musicradio.com/LBCNewsUKMP3" },
  ],
  es: [
    { n: "Cadena Dial",          i: "🎵", u: "https://playerservices.streamtheworld.com/api/livestream-redirect/CADENADIAL.mp3" },
    { n: "M80 Radio",            i: "📼", u: "https://playerservices.streamtheworld.com/api/livestream-redirect/M80RADIO.mp3" },
    { n: "LOS40 Dance",          i: "💃", u: "https://playerservices.streamtheworld.com/api/livestream-redirect/LOS40_DANCE.mp3" },
    { n: "Rock FM",              i: "🎸", h: 1, u: "https://rockfm-cope.flumotion.com/playlist.m3u8" },
    { n: "Radiolé",              i: "💃", u: "https://playerservices.streamtheworld.com/api/livestream-redirect/RADIOLE.mp3" },
    { n: "Flamenco FM",          i: "🎸", u: "https://sonic.mediatelekom.net/8534/;" },
    { n: "Radio Clásica",        i: "🎼", u: "https://dispatcher.rndfnk.com/crtve/rnerc/main/mp3/high" },
    { n: "Cadena SER",           i: "🎙️", u: "https://playerservices.streamtheworld.com/api/livestream-redirect/CADENASER.mp3" },
    { n: "Radio Nacional",       i: "📰", u: "https://dispatcher.rndfnk.com/crtve/rne1/mad/mp3/high" },
    { n: "Onda Cero",            i: "🎙️", h: 1, u: "https://atres-live.ondacero.es/live/ondacero/bitrate_1.m3u8" },
  ],
  ur: [
    { n: "City FM 89",           i: "🎵", u: "https://radio.cityfm89.com/stream" },
    { n: "FM 101 Islamabad",     i: "📻", u: "https://whmsonic.radio.gov.pk:7008/stream" },
    { n: "Bollywood Now",        i: "🎬", u: "https://drive.uber.radio/uber/bollywoodnow/icecast.audio" },
    { n: "Nostalgic Bollywood 90s", i: "💿", u: "https://www.desizoneradio.com/relay3" },
    { n: "Radio Udaan",          i: "🎬", u: "https://stream.radioudaan.com/listen/radio_udaan/radio.mp3" },
    { n: "Sunrise Radio",        i: "☀️", u: "https://direct.sharp-stream.com/sunriseradio.mp3" },
    { n: "RED FM Punjabi",       i: "🥁", u: "https://ice24.securenetsystems.net/CKYE" },
    { n: "Sher-E-Punjab",        i: "🥁", u: "https://ais-sa1.streamon.fm/7676_48k.aac" },
    { n: "Radio Central 24",     i: "🕌", u: "https://casper.radioca.st/;" },
    { n: "Radio Pakistan Islamabad", i: "📰", u: "https://whmsonic.radio.gov.pk:7003/stream" },
  ],
};

/** The live list first (unchanged order), then v5's extra stations. */
export function stationsFor(lang: Lang, live: RadioStation[]): RadioStation[] {
  return [...live, ...EXTRA_STATIONS[lang]];
}
