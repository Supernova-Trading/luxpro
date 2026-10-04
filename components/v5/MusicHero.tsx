"use client";

import { Icon } from "../Icon";
import { PLAYLISTS } from "@/lib/playlists";
import type { V5Strings } from "./strings";
import type { Music, Source } from "./useMusic";

// The top third: the music is the picture (owner's pick from mockups C/D).
// Playlists show the real artwork of what's playing; radio and Bluetooth have
// no artwork, so they get a typographic hero instead of a blank.
export default function MusicHero({ s, music, header, onPicker, btOn, onBtAsk, onBtHow }: {
  s: V5Strings;
  music: Music;
  header: React.ReactNode;
  onPicker: () => void;
  btOn: boolean;
  onBtAsk: () => void;
  onBtHow: () => void;
}) {
  const { source, sc, radio, plIdx } = music;
  const art = source === "playlists" && sc.track?.artwork ? sc.track.artwork : "";
  const plName = PLAYLISTS[plIdx]?.n ?? "";

  let caption: React.ReactNode = "";
  let title = "";
  let sub = "";
  let playing = false;
  if (source === "playlists") {
    playing = sc.playing;
    title = sc.track?.title || plName;
    sub = sc.track?.artist || "";
    caption = sc.failed ? s.needInternet : sc.playing ? `${s.nowPlaying} · ${plName}` : `${plName} · ${sc.ready ? s.tapPlay : s.loading}`;
  } else if (source === "radio") {
    playing = radio.playing;
    const st = radio.currentStation;
    const broken = radio.currentIdx >= 0 && radio.brokenStations.has(radio.currentIdx);
    title = st ? st.n : s.chooseStation;
    caption = !st
      ? s.radio
      : broken
      ? s.offline
      : radio.playing
      ? <><span className="v5-live" aria-hidden />{s.live}</>
      : radio.statusText.startsWith("Loading") ? s.loading : s.tapPlay;
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
        <div className="v5-tabs" role="tablist">
          {tabs.map(([id, label]) => (
            <button key={id} role="tab" className="v5-tab" aria-pressed={source === id} aria-selected={source === id} onClick={() => music.setSource(id)}>
              {label}
            </button>
          ))}
        </div>

        {source === "bluetooth" ? (
          <div style={{ display: "grid", gap: 10, marginTop: 4 }}>
            <div>
              <div className="v5-display">{s.btTitle}</div>
              <div className="v5-sub">{s.btSub}</div>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button className="v5-pill" aria-pressed={btOn} onClick={onBtAsk}>
                <Icon name={btOn ? "check" : "bluetooth"} size={16} />
                {s.btAsk}
              </button>
              <button className="v5-pill" onClick={onBtHow}>{s.btHow}</button>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, marginTop: 4 }}>
            {/* Tap the title to choose a station or playlist */}
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
