"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Icon, type IconName } from "../Icon";
import { COMFORT, ROUTES, TRACK, LabHeader, Told, useDaypart, useFlash, useToggles } from "./shared";

const tap = { scale: 0.95, transition: { duration: 0.1 } };

const GAMES: { key: string; icon: IconName; color: string; label: string }[] = [
  { key: "trivia", icon: "lightbulb",   color: "var(--icon-yellow)", label: "Trivia" },
  { key: "ttt",    icon: "tic-tac-toe", color: "var(--icon-violet)", label: "Tic-tac-toe" },
  { key: "rps",    icon: "hand",        color: "var(--icon-orange)", label: "Rock paper scissors" },
  { key: "memory", icon: "grid",        color: "var(--icon-cyan)",   label: "Memory match" },
];

function Circle({ icon, color, label, on, onClick }: { icon: IconName; color: string; label: string; on?: boolean; onClick?: () => void }) {
  return (
    <motion.button whileTap={tap} className="lab-circle" aria-pressed={!!on} onClick={onClick} style={{ width: 120 }}>
      <span style={{ width: 64, height: 64 }}><Icon name={icon} size={26} style={{ color }} /></span>
      <span className="bx-label text-center" style={{ fontSize: 13, lineHeight: 1.25, color: on ? "var(--bx-gold)" : undefined }}>
        {on ? "Told Amish" : label}
      </span>
    </motion.button>
  );
}

// Direction D — the owner's pick (2026-10-04): C's album-art hero and round
// request buttons, route as a second row of the same circles, Warmer/Cooler
// without a number (no link to the car's climate), games one tap away on the
// home screen (most used by passengers), and a highlighted tip band.
export default function MockD() {
  const part = useDaypart();
  const comfort = useToggles();
  const route = useFlash();
  const [climate, setClimate] = useState<"cold" | "warm" | null>(null);
  const [source, setSource] = useState("Playlists");
  const [playing, setPlaying] = useState(true);

  const climateHalf = (id: "cold" | "warm", icon: IconName, color: string, label: string) => {
    const on = climate === id;
    return (
      <motion.button
        whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
        className="flex items-center justify-center gap-3"
        style={{
          height: 60,
          // sRGB mix: in OKLCH, sky blue over the warm-dark surface drifts to olive
          background: `color-mix(in srgb, ${color} ${on ? 40 : 22}%, var(--bx-raised))`,
          boxShadow: on ? "inset 0 0 0 1.5px var(--bx-gold)" : undefined,
          transition: "background 150ms ease",
        }}
        onClick={() => setClimate(on ? null : id)}
        aria-pressed={on}
      >
        <Icon name={icon} size={22} style={{ color }} />
        <span className="bx-label" style={{ fontSize: 17 }}>{label}</span>
        {on && <Told />}
      </motion.button>
    );
  };

  return (
    <div className="bx relative flex flex-col overflow-hidden" style={{ height: "100dvh" }} data-lang="en">
      {/* Hero: the music is the picture */}
      <section className="relative flex-shrink-0" style={{ height: 316 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={TRACK.art} alt="" className="absolute inset-0 w-full h-full" style={{ objectFit: "cover" }} />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, color-mix(in oklch, var(--bx-canvas) 88%, transparent) 0%, color-mix(in oklch, var(--bx-canvas) 30%, transparent) 26%, transparent 38%, color-mix(in oklch, var(--bx-canvas) 75%, transparent) 62%, var(--bx-canvas) 100%)" }}
        />
        <LabHeader overlay />
        <div className="absolute inset-x-0 bottom-0 px-5 pb-2">
          <div className="flex gap-5">
            {["Radio", "Playlists", "Bluetooth"].map((s) => (
              <button key={s} className="lab-tab" aria-pressed={source === s} onClick={() => setSource(s)}>{s}</button>
            ))}
          </div>
          <div className="flex items-end justify-between gap-4 mt-1">
            <div className="min-w-0">
              <div className="bx-caption">Now playing · {TRACK.source}</div>
              <div className="lab-num truncate" style={{ fontSize: 34, lineHeight: 1.15 }}>{TRACK.title}</div>
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
            style={{ width: 40, height: 40, borderRadius: 9999, border: "1px solid var(--bx-gold)", color: "var(--bx-gold)", fontFamily: "var(--bx-serif)", fontSize: 20 }}
          >
            A
          </span>
          <div className="lab-row-label" style={{ fontSize: 19 }}>Good {part}. Amish is driving you today.</div>
        </div>

        {/* Tip — highlighted, not hidden at the bottom */}
        <motion.button
          whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
          className="flex items-center gap-3 w-full text-start"
          style={{ height: 64, padding: "0 12px 0 10px", borderRadius: 9999, border: "1px solid var(--bx-gold)", background: "var(--bx-gold-tint)" }}
        >
          <span className="flex items-center justify-center flex-shrink-0" style={{ width: 44, height: 44, borderRadius: 9999, background: "var(--bx-gold)", color: "var(--bx-on-gold)" }}>
            <Icon name="cash" size={20} />
          </span>
          <span className="flex-1 min-w-0">
            <span className="lab-row-label block" style={{ fontSize: 19 }}>Enjoying the ride? Thank Amish</span>
            <span className="bx-sub" style={{ color: "var(--bx-gold)" }}>Cash · Uber · Revolut</span>
          </span>
          <Icon name="chevron-right" size={20} style={{ color: "var(--bx-gold)" }} />
        </motion.button>

        {/* Ask Amish — two rows of the same round buttons */}
        <div>
          <div className="bx-caption mb-2">Ask Amish</div>
          <div className="flex justify-between">
            {COMFORT.map((it) => (
              <Circle key={it.key} icon={it.icon} color={it.color} label={it.label} on={!!comfort.on[it.key]} onClick={() => comfort.toggle(it.key)} />
            ))}
          </div>
          <div className="flex justify-around mt-2">
            {ROUTES.map((it) => (
              <Circle key={it.key} icon={it.icon} color={it.color} label={it.label} on={route.id === it.key} onClick={() => route.flash(it.key)} />
            ))}
          </div>
        </div>

        {/* Climate — the original Warmer / Cooler, no number */}
        <div className="grid grid-cols-2 overflow-hidden" style={{ borderRadius: 9999, border: "1px solid var(--bx-hairline)" }}>
          {climateHalf("cold", "snowflake", "var(--icon-sky)", "Cooler")}
          {climateHalf("warm", "flame", "var(--icon-orange)", "Warmer")}
        </div>

        {/* Games — most used, one tap straight in */}
        <div>
          <div className="bx-caption mb-2" style={{ color: "var(--bx-gold)" }}>Play</div>
          <div className="flex justify-between">
            {GAMES.map((g) => (
              <Circle key={g.key} icon={g.icon} color={g.color} label={g.label} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
