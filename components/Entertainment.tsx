"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeader from "./SectionHeader";
import type { Translation } from "@/lib/translations";
import type { RadioStation } from "@/lib/radios";
import type { Playlist } from "@/lib/playlists";
import { PLAYLISTS } from "@/lib/playlists";
import type { useRadio as UseRadioType } from "@/hooks/useRadio";

const panelVariants = {
  hidden: { opacity: 0, height: 0, overflow: "hidden" },
  visible: { opacity: 1, height: "auto", overflow: "visible" },
};

// Shared glass panel style for expanded panels
const glassPanelStyle: React.CSSProperties = {
  background: "var(--card-bg)",
  backdropFilter: "blur(32px)",
  WebkitBackdropFilter: "blur(32px)",
  border: "1px solid var(--card-border)",
  boxShadow: "var(--lp-shadow-glass)",
};

// Panel header style (theme-aware strip inside glass panel)
const panelHeaderStyle: React.CSSProperties = {
  background: "var(--lp-surface)",
  borderBottom: "1px solid var(--lp-border)",
};

// Shared glass card base
const glassCard: React.CSSProperties = {
  backdropFilter: "blur(24px)",
  WebkitBackdropFilter: "blur(24px)",
  transition: "border-color 200ms ease, box-shadow 200ms ease, background 200ms ease",
};

interface Props {
  t: Translation;
  radios: RadioStation[];
  radio: ReturnType<typeof UseRadioType>;
  onSpeak: (text: string) => void;
  onShowBT: () => void;
}

type Panel = "bt" | "radio" | "playlist" | null;

export default function Entertainment({ t, radios, radio, onSpeak, onShowBT }: Props) {
  const [open, setOpen] = useState<Panel>(null);
  const [activePL, setActivePL] = useState<number>(-1);
  const [plUrl, setPlUrl] = useState("");

  function togglePanel(panel: Panel) {
    if (open === panel) {
      setOpen(null);
      if (panel === "radio") radio.stop();
      if (panel === "playlist") {
        setActivePL(-1);
        setPlUrl("");
      }
    } else {
      if (open === "radio") radio.stop();
      if (open === "playlist") { setActivePL(-1); setPlUrl(""); }
      setOpen(panel);
      if (panel === "radio") onSpeak("Please select a radio station.");
      if (panel === "playlist") onSpeak("Please select a playlist.");
    }
  }

  function handleSelectStation(idx: number) {
    radio.play(idx, radios);
    onSpeak(`Amish, the passenger selected ${radios[idx].n}. Enjoy the radio.`);
  }

  function handleSelectPlaylist(pl: Playlist, idx: number) {
    setActivePL(idx);
    setPlUrl(
      `https://w.soundcloud.com/player/?url=${encodeURIComponent(pl.u)}&color=%23000000&auto_play=true&hide_related=false&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=false`
    );
    onSpeak(`Amish, the passenger selected ${pl.n} playlist.`);
  }

  return (
    <div>
      <SectionHeader label={t.entertainment} />

      {/* Bluetooth | Radio | Playlist — 3-col equal grid */}
      <div className="grid grid-cols-3 gap-2">
        {/* Bluetooth */}
        <motion.div
          whileTap={{ scale: 0.95, transition: { duration: 0.08 } }}
          whileHover={{ y: -2, transition: { type: "tween", duration: 0.2, ease: [0.16, 1, 0.3, 1] } }}
          onClick={onShowBT}
          className="relative cursor-pointer rounded-[18px] flex flex-col items-center gap-2 py-3 px-3"
          style={{
            ...glassCard,
            background: "var(--lp-surface)",
            border: "1px solid var(--lp-border)",
            boxShadow: "none",
          }}
        >
          <div className="text-[26px] leading-none">📱</div>
          <div
            className="text-[13px] tracking-[2px] uppercase font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            {t.bluetooth}
          </div>
        </motion.div>

        {/* Radio */}
        <motion.div
          whileTap={{ scale: 0.95, transition: { duration: 0.08 } }}
          whileHover={{ y: -2, transition: { type: "tween", duration: 0.2, ease: [0.16, 1, 0.3, 1] } }}
          onClick={() => togglePanel("radio")}
          className="relative cursor-pointer rounded-[18px] flex flex-col items-center gap-2 py-3 px-3"
          style={{
            ...glassCard,
            background: open === "radio" ? "rgba(200,168,75,0.10)" : "var(--lp-surface)",
            border: open === "radio" ? "1px solid rgba(200,168,75,0.55)" : "1px solid var(--lp-border)",
            boxShadow: open === "radio" ? "inset 0 0 0 1.5px rgba(200,168,75,0.70)" : "none",
          }}
        >
          <div className="text-[26px] leading-none">📻</div>
          <div
            className="text-[13px] tracking-[2px] uppercase font-bold"
            style={{ color: open === "radio" ? "var(--lp-gold)" : "var(--text-primary)" }}
          >
            {t.radio}
          </div>
          <div
            className="absolute top-3 right-3 w-2 h-2 rounded-full"
            style={{
              background: "var(--lp-gold)",
              boxShadow: "0 0 8px rgba(200,168,75,0.70)",
              opacity: open === "radio" ? 1 : 0,
              transition: "opacity 200ms ease",
            }}
          />
        </motion.div>

        {/* Playlist */}
        <motion.div
          whileTap={{ scale: 0.95, transition: { duration: 0.08 } }}
          whileHover={{ y: -2, transition: { type: "tween", duration: 0.2, ease: [0.16, 1, 0.3, 1] } }}
          onClick={() => togglePanel("playlist")}
          className="relative cursor-pointer rounded-[18px] flex flex-col items-center gap-2 py-3 px-3"
          style={{
            ...glassCard,
            background: open === "playlist" ? "rgba(200,168,75,0.10)" : "var(--lp-surface)",
            border: open === "playlist" ? "1px solid rgba(200,168,75,0.55)" : "1px solid var(--lp-border)",
            boxShadow: open === "playlist" ? "inset 0 0 0 1.5px rgba(200,168,75,0.70)" : "none",
          }}
        >
          <div className="text-[26px] leading-none">🎧</div>
          <div
            className="text-[13px] tracking-[2px] uppercase font-bold"
            style={{ color: open === "playlist" ? "var(--lp-gold)" : "var(--text-primary)" }}
          >
            {t.playlist}
          </div>
          <div
            className="absolute top-3 right-3 w-2 h-2 rounded-full"
            style={{
              background: "var(--lp-gold)",
              boxShadow: "0 0 8px rgba(200,168,75,0.70)",
              opacity: open === "playlist" ? 1 : 0,
              transition: "opacity 200ms ease",
            }}
          />
        </motion.div>
      </div>

      {/* Radio panel */}
      <AnimatePresence>
        {open === "radio" && (
          <motion.div
            key="radio-panel"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={panelVariants}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="mt-3 rounded-[18px] overflow-hidden"
            style={glassPanelStyle}
          >
            {/* Panel bar */}
            <div className="flex items-center gap-3 px-5 py-3.5" style={panelHeaderStyle}>
              <span className="text-[22px]">📻</span>
              <div className="flex-1 ml-2">
                <div className="text-[9px] tracking-[2.5px] text-muted uppercase font-semibold">{t.nowPlaying}</div>
                <div className="text-[14px] font-bold text-primary tracking-[1px] mt-0.5">
                  {radio.currentStation ? `${radio.currentStation.n} — Live` : t.selectStation}
                </div>
              </div>
              <button
                onClick={() => radio.stop()}
                className="rounded-lg px-3.5 py-1.5 text-primary text-[11px] font-bold tracking-[1px] transition-colors"
                style={{
                  background: "var(--lp-surface-hi)",
                  border: "1px solid var(--lp-border)",
                }}
              >
                {t.stop}
              </button>
            </div>

            {/* Station scrollable row */}
            <div className="scroll-row px-3.5 py-3.5">
              {radios.map((station, idx) => {
                const isCurrent = radio.currentIdx === idx;
                const isBroken  = radio.brokenStations.has(idx);
                return (
                  <motion.div
                    key={idx}
                    whileTap={{ scale: 0.93 }}
                    onClick={() => handleSelectStation(idx)}
                    className="relative flex flex-col items-center gap-1.5 rounded-xl px-2.5 py-3.5 cursor-pointer flex-none w-[110px]"
                    style={{
                      background: isCurrent
                        ? "rgba(200,168,75,0.15)"
                        : isBroken
                        ? "rgba(255,60,60,0.06)"
                        : station.f
                        ? "rgba(200,168,75,0.07)"
                        : "var(--lp-surface)",
                      border: isCurrent
                        ? "1px solid rgba(200,168,75,0.60)"
                        : isBroken
                        ? "1px solid rgba(255,60,60,0.35)"
                        : station.f
                        ? "1px solid rgba(200,168,75,0.30)"
                        : "1px solid var(--lp-border)",
                      boxShadow: isCurrent ? "inset 0 0 0 1.5px rgba(200,168,75,0.70)" : undefined,
                      opacity: isBroken && !isCurrent ? 0.65 : 1,
                      transition: "all 200ms ease",
                    }}
                  >
                    <span className="text-[24px]">{station.i}</span>
                    <span
                      className="text-[10px] font-bold uppercase text-center leading-tight"
                      style={{ color: isCurrent ? "var(--lp-gold)" : isBroken ? "rgba(255,100,100,0.80)" : "var(--text-primary)" }}
                    >
                      {station.n}
                    </span>
                    {isBroken && !isCurrent && (
                      <span
                        className="text-[8px] font-extrabold uppercase tracking-[1px]"
                        style={{ color: "rgba(255,80,80,0.75)" }}
                      >
                        ● Offline
                      </span>
                    )}
                    {!isBroken && station.f && (
                      <span className="text-[8px] font-extrabold" style={{ color: "var(--lp-gold)" }}>⭐ Fav</span>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Player controls */}
            {radio.currentStation && (
              <div
                className="mx-3.5 mb-3.5 rounded-2xl p-3.5"
                style={{
                  background: "var(--lp-surface)",
                  border: "1px solid var(--lp-border)",
                }}
              >
                <div className="text-center mb-3">
                  <div className="text-[10px] tracking-[2.5px] text-muted uppercase mb-1 font-semibold">{t.nowPlaying}</div>
                  <div className="text-[14px] font-bold text-primary">
                    {radio.statusText || `${radio.currentStation.n} — Live`}
                  </div>
                </div>
                <div className="flex items-center justify-center gap-3">
                  {[
                    { fn: radio.prev,       size: 40, icon: "⏮" },
                    { fn: radio.togglePlay, size: 52, icon: radio.playing ? "⏸" : "▶" },
                    { fn: radio.next,       size: 40, icon: "⏭" },
                  ].map(({ fn, size, icon }, i) => (
                    <motion.button
                      key={i}
                      whileTap={{ scale: 0.92 }}
                      onClick={fn}
                      className="rounded-full flex items-center justify-center text-primary"
                      style={{
                        width: size,
                        height: size,
                        fontSize: size > 44 ? "18px" : "14px",
                        background: "var(--lp-surface-mid)",
                        border: "1px solid var(--lp-border)",
                        boxShadow: size > 44 ? "0 0 16px rgba(200,168,75,0.18)" : undefined,
                        transition: "box-shadow 200ms ease",
                      }}
                    >
                      {icon}
                    </motion.button>
                  ))}
                </div>
                <div className="flex items-center gap-2.5 mt-3">
                  <span className="text-[10px] text-muted tracking-[1.5px] uppercase font-bold">{t.volume}</span>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={radio.volume}
                    onChange={(e) => radio.setVolume(Number(e.target.value))}
                    className="flex-1 h-1.5"
                    style={{ accentColor: "var(--lp-gold)" }}
                  />
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Playlist panel */}
      <AnimatePresence>
        {open === "playlist" && (
          <motion.div
            key="pl-panel"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={panelVariants}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="mt-3 rounded-[18px] overflow-hidden"
            style={glassPanelStyle}
          >
            <div className="flex items-center gap-3 px-5 py-3.5" style={panelHeaderStyle}>
              <span className="text-[22px]">{activePL >= 0 ? PLAYLISTS[activePL].i : "🎵"}</span>
              <div className="flex-1 ml-2">
                <div className="text-[9px] tracking-[2.5px] text-muted uppercase font-semibold">{t.nowPlaying}</div>
                <div className="text-[14px] font-bold text-primary tracking-[1px] mt-0.5">
                  {activePL >= 0 ? `${PLAYLISTS[activePL].i} ${PLAYLISTS[activePL].n}` : t.selectPlaylist}
                </div>
              </div>
              <button
                onClick={() => { setActivePL(-1); setPlUrl(""); }}
                className="rounded-lg px-3.5 py-1.5 text-primary text-[11px] font-bold tracking-[1px]"
                style={{
                  background: "var(--lp-surface-hi)",
                  border: "1px solid var(--lp-border)",
                }}
              >
                {t.stop}
              </button>
            </div>

            <div className="scroll-row px-3.5 py-3.5">
              {PLAYLISTS.map((pl, idx) => (
                <motion.div
                  key={idx}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => handleSelectPlaylist(pl, idx)}
                  className="flex flex-col items-center gap-1.5 rounded-xl px-2.5 py-3.5 cursor-pointer flex-none w-[110px]"
                  style={{
                    background: activePL === idx ? "rgba(200,168,75,0.15)" : "var(--lp-surface)",
                    border: activePL === idx
                      ? "1px solid rgba(200,168,75,0.60)"
                      : "1px solid var(--lp-border)",
                    boxShadow: activePL === idx ? "inset 0 0 0 1.5px rgba(200,168,75,0.70)" : undefined,
                    transition: "all 200ms ease",
                  }}
                >
                  <span className="text-[24px]">{pl.i}</span>
                  <span
                    className="text-[10px] font-bold uppercase text-center leading-tight"
                    style={{ color: activePL === idx ? "var(--lp-gold)" : "var(--text-primary)" }}
                  >
                    {pl.n}
                  </span>
                </motion.div>
              ))}
            </div>

            {plUrl && (
              <iframe
                src={plUrl}
                className="mx-3.5 mb-3.5 rounded-xl border-none"
                style={{ width: "calc(100% - 28px)", height: 200 }}
                scrolling="no"
                allow="autoplay"
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
