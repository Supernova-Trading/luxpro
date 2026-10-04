"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Icon } from "../Icon";
import { COMFORT, ROUTES, TRACK, LabHeader, Told, useDaypart, useFlash, useTemp, useToggles } from "./shared";

const tap = { scale: 0.96, transition: { duration: 0.1 } };

// Direction C — "Image-led". Imagery is the depth (bugatti/DESIGN.md:219,
// :444; ferrari/DESIGN.md:480): the album art fills the top as the hero,
// Amish gets a presence, and the controls below drop boxes for circles
// and a single route switch.
export default function MockC() {
  const part = useDaypart();
  const comfort = useToggles();
  const route = useFlash();
  const temp = useTemp(21);
  const [source, setSource] = useState("Playlists");
  const [playing, setPlaying] = useState(true);

  return (
    <div className="bx relative flex flex-col overflow-hidden" style={{ height: "100dvh" }} data-lang="en">
      {/* Hero: the music is the picture */}
      <section className="relative flex-shrink-0" style={{ height: 372 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={TRACK.art} alt="" className="absolute inset-0 w-full h-full" style={{ objectFit: "cover" }} />
        {/* Legibility scrim for the header and caption, not decoration */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, color-mix(in oklch, var(--bx-canvas) 88%, transparent) 0%, color-mix(in oklch, var(--bx-canvas) 30%, transparent) 24%, transparent 36%, color-mix(in oklch, var(--bx-canvas) 75%, transparent) 62%, var(--bx-canvas) 100%)" }}
        />
        <LabHeader overlay />
        <div className="absolute inset-x-0 bottom-0 px-5 pb-3">
          <div className="flex gap-5">
            {["Radio", "Playlists", "Bluetooth"].map((s) => (
              <button key={s} className="lab-tab" aria-pressed={source === s} onClick={() => setSource(s)}>{s}</button>
            ))}
          </div>
          <div className="flex items-end justify-between gap-4 mt-2">
            <div className="min-w-0">
              <div className="bx-caption">Now playing · {TRACK.source}</div>
              <div className="lab-num truncate" style={{ fontSize: 36, lineHeight: 1.15 }}>{TRACK.title}</div>
              <div className="bx-sub" style={{ fontSize: 15 }}>{TRACK.artist}</div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0" dir="ltr">
              <motion.button whileTap={tap} className="bx-icon-btn" aria-label="Previous"><Icon name="skip-back" size={16} /></motion.button>
              <motion.button
                whileTap={tap}
                className="bx-icon-btn"
                style={{ width: 60, height: 60, background: "var(--bx-gold)", borderColor: "var(--bx-gold)", color: "var(--bx-on-gold)" }}
                onClick={() => setPlaying((p) => !p)}
                aria-label={playing ? "Pause" : "Play"}
              >
                <Icon name={playing ? "pause" : "play"} size={22} />
              </motion.button>
              <motion.button whileTap={tap} className="bx-icon-btn" aria-label="Next"><Icon name="skip-forward" size={16} /></motion.button>
            </div>
          </div>
        </div>
      </section>

      <main className="flex-1 min-h-0 flex flex-col justify-between px-5 pb-4 pt-3">
        {/* Host */}
        <div className="flex items-center gap-3">
          <span
            className="flex items-center justify-center flex-shrink-0"
            style={{ width: 44, height: 44, borderRadius: 9999, border: "1px solid var(--bx-gold)", color: "var(--bx-gold)", fontFamily: "var(--bx-serif)", fontSize: 22 }}
          >
            A
          </span>
          <div className="lab-row-label">Good {part}. Amish is driving you today.</div>
        </div>

        {/* Temperature */}
        <div className="flex items-center justify-between">
          <div>
            <div className="bx-caption">Your preference</div>
            <div style={{ minHeight: 18 }}>{temp.told && <Told text={`Told Amish · ${temp.value}°`} />}</div>
          </div>
          <div className="flex items-center gap-4">
            <motion.button whileTap={tap} className="lab-step" style={{ width: 56, height: 56 }} onClick={() => temp.step(-1)} aria-label="Cooler">
              <Icon name="snowflake" size={20} style={{ color: "var(--icon-sky)" }} />
            </motion.button>
            <span className="lab-num" data-told={temp.told} style={{ fontSize: 60, minWidth: 92, textAlign: "center" }}>{temp.value}°</span>
            <motion.button whileTap={tap} className="lab-step" style={{ width: 56, height: 56 }} onClick={() => temp.step(1)} aria-label="Warmer">
              <Icon name="flame" size={20} style={{ color: "var(--icon-orange)" }} />
            </motion.button>
          </div>
        </div>

        {/* Ask Amish — circles, not boxes */}
        <div>
          <div className="bx-caption mb-3">Ask Amish</div>
          <div className="grid grid-cols-4 gap-2">
            {COMFORT.map((it) => (
              <motion.button key={it.key} whileTap={tap} className="lab-circle" aria-pressed={!!comfort.on[it.key]} onClick={() => comfort.toggle(it.key)}>
                <span><Icon name={it.icon} size={26} style={{ color: it.color }} /></span>
                <span className="bx-label text-center" style={{ fontSize: 14, color: comfort.on[it.key] ? "var(--bx-gold)" : undefined }}>
                  {comfort.on[it.key] ? "Told Amish" : it.label}
                </span>
              </motion.button>
            ))}
          </div>
          <div className="lab-segment mt-4">
            {ROUTES.map((it) => (
              <button key={it.key} data-told={route.id === it.key} onClick={() => route.flash(it.key)}>
                {route.id === it.key ? "✓ Told Amish" : it.label.replace("Take the ", "").replace(/^./, (c) => c.toUpperCase())}
              </button>
            ))}
          </div>
        </div>

        <footer className="grid grid-cols-2 gap-6" style={{ borderTop: "1px solid var(--bx-hairline)" }}>
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
