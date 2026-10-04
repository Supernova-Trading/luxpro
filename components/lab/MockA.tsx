"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Icon } from "../Icon";
import { COMFORT, ROUTES, TRACK, TEMP_MIN, TEMP_MAX, LabHeader, Told, useDaypart, useFlash, useTemp, useToggles } from "./shared";

const tap = { scale: 0.97, transition: { duration: 0.1 } };

// Direction A — "Instrument". The passenger's temperature is the one big
// thing on screen (creative-director seat: the gold numeral as signature);
// requests live in a single tray of hairline rows, not a box per item.
export default function MockA() {
  const part = useDaypart();
  const comfort = useToggles();
  const route = useFlash();
  const temp = useTemp(21);
  const [source, setSource] = useState("Playlists");
  const [playing, setPlaying] = useState(true);

  return (
    <div className="bx flex flex-col overflow-hidden" style={{ height: "100dvh" }} data-lang="en">
      <LabHeader />
      <main className="flex-1 min-h-0 flex flex-col justify-between px-5 pb-4">
        <div>
          <h1 className="bx-display">Good {part}.</h1>
          <p className="bx-title mt-1" style={{ color: "var(--bx-muted)", fontWeight: 400 }}>Amish is driving you today</p>
        </div>

        {/* Climate instrument */}
        <section>
          <div className="text-center" style={{ minHeight: 20 }}>
            {temp.told ? <Told text={`Told Amish · ${temp.value}°`} /> : <span className="bx-caption">Your preferred temperature</span>}
          </div>
          <div className="flex items-center justify-between mt-1">
            <motion.button whileTap={tap} className="lab-step" style={{ width: 84, height: 84 }} onClick={() => temp.step(-1)} aria-label="Cooler">
              <Icon name="snowflake" size={22} style={{ color: "var(--icon-sky)" }} />
              <span className="bx-sub" style={{ color: "var(--bx-body)" }}>Cooler</span>
            </motion.button>
            <div className="lab-num" data-told={temp.told} style={{ fontSize: 112 }}>
              {temp.value}°
            </div>
            <motion.button whileTap={tap} className="lab-step" style={{ width: 84, height: 84 }} onClick={() => temp.step(1)} aria-label="Warmer">
              <Icon name="flame" size={22} style={{ color: "var(--icon-orange)" }} />
              <span className="bx-sub" style={{ color: "var(--bx-body)" }}>Warmer</span>
            </motion.button>
          </div>
          {/* Scale: where the preference sits between 18° and 26° */}
          <div className="flex items-end justify-between mt-4 px-2" aria-hidden>
            {Array.from({ length: TEMP_MAX - TEMP_MIN + 1 }, (_, i) => TEMP_MIN + i).map((v) => (
              <div key={v} className="flex flex-col items-center gap-1" style={{ width: 24 }}>
                <span style={{ width: 2, height: v === temp.value ? 16 : 8, background: v === temp.value ? "var(--bx-gold)" : "var(--bx-hairline-strong)" }} />
                {(v === TEMP_MIN || v === TEMP_MAX || v === temp.value) && (
                  <span className="bx-sub" style={{ fontSize: 11, color: v === temp.value ? "var(--bx-gold)" : undefined }}>{v}°</span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Ask Amish — one tray, two columns of rows */}
        <section>
          <div className="bx-caption mb-2">Ask Amish</div>
          <div className="lab-tray grid grid-cols-2">
            <div style={{ borderInlineEnd: "1px solid var(--bx-hairline)" }}>
              {COMFORT.map((it) => (
                <motion.button key={it.key} whileTap={tap} className="lab-row" style={{ height: 62 }} onClick={() => comfort.toggle(it.key)}>
                  <Icon name={it.icon} size={20} style={{ color: it.color, flexShrink: 0 }} />
                  <span className="flex flex-col min-w-0">
                    <span className="lab-row-label" style={{ color: comfort.on[it.key] ? "var(--bx-gold)" : undefined }}>{it.label}</span>
                    {comfort.on[it.key] && <Told />}
                  </span>
                </motion.button>
              ))}
            </div>
            <div>
              {ROUTES.map((it) => (
                <motion.button key={it.key} whileTap={tap} className="lab-row" style={{ height: 248 / 3 }} onClick={() => route.flash(it.key)}>
                  <Icon name={it.icon} size={20} style={{ color: it.color, flexShrink: 0 }} />
                  <span className="flex flex-col min-w-0">
                    <span className="lab-row-label" style={{ color: route.id === it.key ? "var(--bx-gold)" : undefined }}>{it.label}</span>
                    {route.id === it.key && <Told />}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        </section>

        {/* Music — album art carries the band */}
        <section className="flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={TRACK.art} alt="" width={104} height={104} style={{ width: 104, height: 104, objectFit: "cover", flexShrink: 0 }} />
          <div className="flex-1 min-w-0">
            <div className="flex gap-4">
              {["Radio", "Playlists", "Bluetooth"].map((s) => (
                <button key={s} className="lab-tab" aria-pressed={source === s} onClick={() => setSource(s)}>{s}</button>
              ))}
            </div>
            <div className="lab-row-label truncate mt-2" style={{ fontSize: 22 }}>{TRACK.title}</div>
            <div className="bx-sub truncate">{TRACK.artist} · {TRACK.source}</div>
          </div>
          <motion.button whileTap={tap} className="bx-icon-btn" style={{ width: 56, height: 56, borderColor: "var(--bx-gold)", color: "var(--bx-gold)" }} onClick={() => setPlaying((p) => !p)} aria-label={playing ? "Pause" : "Play"}>
            <Icon name={playing ? "pause" : "play"} size={20} />
          </motion.button>
        </section>

        <footer className="grid grid-cols-2 gap-6 pt-1" style={{ borderTop: "1px solid var(--bx-hairline)" }}>
          <button className="lab-link">
            <span className="flex items-center gap-3"><Icon name="gamepad" size={20} style={{ color: "var(--icon-violet)" }} /><span className="bx-label">Pass the time</span></span>
            <Icon name="chevron-right" size={18} className="bx-chevron" />
          </button>
          <button className="lab-link">
            <span className="flex items-center gap-3"><Icon name="cash" size={20} style={{ color: "var(--accent-positive)" }} /><span className="bx-label">Thank Amish</span></span>
            <Icon name="chevron-right" size={18} className="bx-chevron" />
          </button>
        </footer>
      </main>
    </div>
  );
}
