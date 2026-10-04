"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Icon, type IconName } from "../Icon";
import Sheet from "./Sheet";
import { PLAYLISTS, type Playlist } from "@/lib/playlists";
import type { RadioStation } from "@/lib/radios";
import type { Lang } from "@/lib/translations";
import type { useRadio as UseRadioType } from "@/hooks/useRadio";
import { useSoundCloud } from "@/hooks/useSoundCloud";
import type { PreviewStrings } from "@/lib/preview-strings";

interface Props {
  s: PreviewStrings;
  lang: Lang;
  radios: RadioStation[];
  radio: ReturnType<typeof UseRadioType>;
  onSpeak: (text: string) => void;
  onShowBT: () => void;
}

type Source = "radio" | "playlist";
const tap = { scale: 0.97, transition: { duration: 0.1 } };

export default function Listen({ s, lang, radios, radio, onSpeak, onShowBT }: Props) {
  const [source, setSource] = useState<Source | null>(null);
  const [activePL, setActivePL] = useState(-1);
  const [chooser, setChooser] = useState(false);
  const sc = useSoundCloud();

  // The page stops the radio on a language change; drop the playlist too so
  // nothing keeps playing from the previous language's selection.
  const firstLang = useRef(true);
  useEffect(() => {
    if (firstLang.current) { firstLang.current = false; return; }
    setActivePL(-1);
    sc.clear();
    setChooser(false);
  }, [lang, sc.clear]);

  function pickSource(next: Source) {
    if (next === source) { setChooser(true); return; }
    if (source === "radio") radio.stop();
    if (source === "playlist") { setActivePL(-1); sc.clear(); }
    setSource(next);
    setChooser(true);
    onSpeak(next === "radio" ? "Please select a radio station." : "Please select a playlist.");
  }

  function selectStation(idx: number) {
    radio.play(idx, radios);
    onSpeak(`Amish, the passenger selected ${radios[idx].n}. Enjoy the radio.`);
    setChooser(false);
  }

  function selectPlaylist(pl: Playlist, idx: number) {
    setActivePL(idx);
    sc.load(pl.u);
    onSpeak(`Amish, the passenger selected ${pl.n} playlist.`);
    setChooser(false);
  }

  const hasTrack =
    (source === "radio" && !!radio.currentStation) || (source === "playlist" && activePL >= 0);
  const isPlaying = source === "radio" ? radio.playing : source === "playlist" ? sc.playing : false;

  let title = s.nothingPlaying;
  let sub = "";
  if (source === "radio") {
    title = radio.currentStation ? radio.currentStation.n : s.chooseStation;
    sub = radio.currentStation ? radio.statusText : s.tapToChoose;
  } else if (source === "playlist") {
    title = activePL >= 0 ? sc.title || PLAYLISTS[activePL].n : s.choosePlaylist;
    sub = activePL >= 0 ? (sc.title ? PLAYLISTS[activePL].n : "") : s.tapToChoose;
  }

  const transport = {
    prev: source === "radio" ? radio.prev : sc.prev,
    toggle: source === "radio" ? radio.togglePlay : sc.toggle,
    next: source === "radio" ? radio.next : sc.next,
  };

  const sources: { id: Source | "bt"; icon: IconName; color: string; label: string }[] = [
    { id: "radio",    icon: "radio",      color: "var(--icon-purple)", label: s.radio },
    { id: "playlist", icon: "headphones", color: "var(--icon-pink)",   label: s.playlist },
    { id: "bt",       icon: "bluetooth",  color: "var(--icon-blue)",   label: s.bluetooth },
  ];

  const artIcon: { name: IconName; color: string } =
    source === "radio" ? { name: "radio", color: "var(--icon-purple)" }
    : source === "playlist" ? { name: "headphones", color: "var(--icon-pink)" }
    : { name: "music-note", color: "var(--bx-muted)" };

  return (
    <section className="bx-panel">
      {/* Source */}
      <div className="flex gap-2 flex-wrap">
        {sources.map(({ id, icon, color, label }) => {
          const on = id === source;
          return (
            <motion.button
              key={id}
              whileTap={tap}
              className="bx-pill"
              aria-pressed={id === "bt" ? undefined : on}
              onClick={() => (id === "bt" ? onShowBT() : pickSource(id))}
            >
              <Icon name={icon} size={18} style={{ color: on ? "currentColor" : color }} />
              {label}
            </motion.button>
          );
        })}
      </div>

      {/* Now playing — tap the title to change station / playlist */}
      <div className="flex items-center gap-4 mt-4">
        <button
          className="flex items-center gap-4 flex-1 min-w-0 text-start"
          onClick={() => source && setChooser(true)}
          disabled={!source}
        >
          <span
            className="flex items-center justify-center flex-shrink-0 overflow-hidden"
            style={{ width: 72, height: 72, borderRadius: 12, background: "var(--bx-canvas)" }}
          >
            {source === "playlist" && sc.artwork ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={sc.artwork} alt="" width={72} height={72} style={{ objectFit: "cover", width: 72, height: 72 }} />
            ) : (
              <Icon name={artIcon.name} size={28} style={{ color: artIcon.color }} />
            )}
          </span>
          <span className="min-w-0 flex flex-col">
            <span className="bx-caption">{s.nowPlaying}</span>
            <span className="bx-title truncate" style={{ color: hasTrack ? "var(--bx-ink)" : "var(--bx-muted)" }}>
              {title}
            </span>
            {sub && <span className="bx-sub truncate">{sub}</span>}
          </span>
        </button>

        {/* Media transport stays left-to-right in RTL locales */}
        <div className="flex items-center gap-2 flex-shrink-0" dir="ltr">
          <motion.button whileTap={tap} className="bx-icon-btn" disabled={!hasTrack} onClick={transport.prev} aria-label="Previous">
            <Icon name="skip-back" size={16} />
          </motion.button>
          <motion.button whileTap={tap} className="bx-icon-btn" data-size="lg" disabled={!hasTrack} onClick={transport.toggle} aria-label={isPlaying ? "Pause" : "Play"}>
            <Icon name={isPlaying ? "pause" : "play"} size={20} />
          </motion.button>
          <motion.button whileTap={tap} className="bx-icon-btn" disabled={!hasTrack} onClick={transport.next} aria-label="Next">
            <Icon name="skip-forward" size={16} />
          </motion.button>
        </div>
      </div>

      {/* Station / playlist chooser — a grid in a sheet, no sideways scrolling */}
      <Sheet open={chooser}>
        <div className="flex items-center justify-between gap-6 mb-6">
          <div className="bx-display">{source === "playlist" ? s.playlist : s.radio}</div>
          <motion.button whileTap={tap} className="bx-pill" onClick={() => setChooser(false)}>
            {s.close}
          </motion.button>
        </div>

        {source === "radio" && (
          <>
            <label className="flex items-center gap-4 mb-5">
              <span className="bx-caption">{s.volume}</span>
              <input
                type="range"
                min={0}
                max={100}
                value={radio.volume}
                onChange={(e) => radio.setVolume(Number(e.target.value))}
                className="flex-1"
                style={{ accentColor: "var(--bx-gold)" }}
              />
            </label>
            <div className="grid grid-cols-2 gap-2">
              {radios.map((st, idx) => {
                const offline = radio.brokenStations.has(idx) && radio.currentIdx !== idx;
                return (
                  <motion.button
                    key={st.n + idx}
                    whileTap={tap}
                    className="bx-tile bx-tile--row"
                    aria-pressed={radio.currentIdx === idx}
                    onClick={() => selectStation(idx)}
                  >
                    <span className="flex flex-col min-w-0">
                      <span className="bx-label truncate" style={{ color: offline ? "var(--bx-muted-soft)" : undefined }}>{st.n}</span>
                      {offline && <span className="bx-sub">{s.offline}</span>}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </>
        )}

        {source === "playlist" && (
          <div className="grid grid-cols-2 gap-2">
            {PLAYLISTS.map((pl, idx) => (
              <motion.button
                key={pl.n}
                whileTap={tap}
                className="bx-tile bx-tile--row"
                aria-pressed={activePL === idx}
                onClick={() => selectPlaylist(pl, idx)}
              >
                <span className="bx-label truncate">{pl.n}</span>
              </motion.button>
            ))}
          </div>
        )}
      </Sheet>

      {/* Hidden SoundCloud player — driven entirely by the transport above */}
      {sc.url && (
        <iframe
          key={sc.url}
          ref={sc.iframeRef}
          src={sc.url}
          title="Playlist player"
          allow="autoplay"
          aria-hidden
          tabIndex={-1}
          style={{ position: "absolute", width: 1, height: 1, opacity: 0, pointerEvents: "none", border: 0 }}
        />
      )}
    </section>
  );
}
