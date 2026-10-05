"use client";

import { Icon } from "../Icon";
import { PLAYLISTS } from "./playlists";
import type { Lang } from "@/lib/translations";
import type { V5Strings } from "./strings";
import type { Music, Source } from "./useMusic";
import { GENRES, PLAYLIST_META, stationGenre } from "./genres";

// The top third: the music is the picture (owner's pick from mockups C/D).
// Playlists show the real artwork of what's playing; radio and Bluetooth have
// no artwork, so they get a typographic hero instead of a blank.
export default function MusicHero({ s, lang, music, header, onPicker, btOn, onBtAsk, onBtHow }: {
  s: V5Strings;
  lang: Lang;
  music: Music;
  header: React.ReactNode;
  onPicker: () => void;
  btOn: boolean;
  onBtAsk: () => void;
  onBtHow: () => void;
}) {
  const { source, sc, radio, plIdx, stalled, online } = music;
  const art = source === "playlists" && sc.track?.artwork ? sc.track.artwork : "";
  const plName = PLAYLISTS[plIdx]?.n ?? "";
  const plGenre = PLAYLIST_META[plName]?.label[lang] ?? plName;

  let caption: React.ReactNode = "";
  let title = "";
  let sub = "";
  let playing = false;
  if (source === "playlists") {
    playing = sc.playing;
    title = sc.track?.title || plGenre;
    sub = sc.track?.artist || "";
    caption = sc.failed || (!online && !sc.playing) ? s.needInternet : sc.playing ? `${s.nowPlaying} · ${plGenre}` : `${plGenre} · ${sc.ready ? s.tapPlay : s.loading}`;
  } else if (source === "radio") {
    playing = radio.playing;
    const st = radio.currentStation;
    const broken = radio.currentIdx >= 0 && (radio.brokenStations.has(radio.currentIdx) || stalled || !online);
    const genre = st ? GENRES[stationGenre(st.n)].label[lang] : "";
    title = st ? st.n : s.chooseStation;
    caption = !st
      ? s.radio
      : broken
      ? s.offline
      : radio.playing
      ? <><span className="v5-live" aria-hidden />{s.live} · {genre}</>
      : radio.statusText.startsWith("Loading") ? s.loading : `${genre} · ${s.tapPlay}`;
  }

  const tabs: [Source, string][] = [["radio", s.radio], ["playlists", s.playlists], ["bluetooth", s.bluetooth]];

  return (
    <section className="v5-hero">
      {art && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="v5-hero-art" src={art} alt="" decoding="async" />
          <div className="v5-hero-scrim" />
        </>
      )}
      {header}

      <div className="v5-hero-glyph" aria-hidden>
        {!art && (
          <>
            <Icon
              name={source === "radio" ? "radio" : source === "bluetooth" ? "bluetooth" : "headphones"}
              size={40}
              style={{ color: source === "radio" ? "var(--i-violet)" : source === "bluetooth" ? "var(--i-blue)" : "var(--i-pink)" }}
            />
            <span className="v5-hero-rule" />
          </>
        )}
      </div>

      <div className="v5-hero-foot">
        <div className="v5-tabs-row">
          <div className="v5-tabs" role="tablist">
            {tabs.map(([id, label]) => (
              <button key={id} role="tab" className="v5-tab" aria-pressed={source === id} aria-selected={source === id} onClick={() => music.setSource(id)}>
                {label}
              </button>
            ))}
          </div>
          {/* Visible way into genres — not only a tap on the title */}
          {source !== "bluetooth" && (
            <button className="v5-genre-btn" onClick={onPicker}>
              <Icon name="sliders" size={16} />
              {source === "radio" ? s.stationsBtn : s.genresBtn}
            </button>
          )}
        </div>

        {source === "bluetooth" ? (
          // Three tiles: the phone → car, ask Amish, how to connect
          <div className="v5-bt-tiles">
            <div className="v5-bt-tile">
              <Icon name="bluetooth" size={22} style={{ color: "var(--i-blue)" }} />
              <span className="v5-label">{s.btTitle}</span>
              <span className="v5-sub">{s.btSub}</span>
            </div>
            <button className="v5-bt-tile" aria-pressed={btOn} onClick={onBtAsk}>
              <Icon name="comment" size={22} style={{ color: "var(--i-teal)" }} />
              <span className="v5-label">{s.btAsk}</span>
              {btOn && <span className="v5-badge" aria-hidden style={{ top: 8, insetInlineEnd: 8 }}><Icon name="check" size={13} strokeWidth={2.4} /></span>}
            </button>
            <button className="v5-bt-tile" onClick={onBtHow}>
              <Icon name="help-circle" size={22} style={{ color: "var(--i-lemon)" }} />
              <span className="v5-label">{s.btHow}</span>
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, marginTop: 4 }}>
            {/* Tap the title to choose too */}
            <button className="v5-now" onClick={onPicker}>
              <span className="v5-caption">{caption}</span>
              <span className="v5-now-title v5-display">
                <span>{title}</span>
                <Icon name="chevron-down" size={22} style={{ flexShrink: 0, color: "var(--muted)" }} />
              </span>
              {sub && <span className="v5-sub" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{sub}</span>}
            </button>
            {/* Media transport stays left-to-right in RTL */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }} dir="ltr">
              <button className="v5-iconbtn" data-size="md" aria-label="Previous" onClick={() => music.step(-1)}><Icon name="skip-back" size={18} /></button>
              <button className="v5-iconbtn v5-play" aria-label={playing ? "Pause" : "Play"} onClick={() => music.togglePlay(onPicker)}>
                <Icon name={playing ? "pause" : "play"} size={24} />
              </button>
              <button className="v5-iconbtn" data-size="md" aria-label="Next" onClick={() => music.step(1)}><Icon name="skip-forward" size={18} /></button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
