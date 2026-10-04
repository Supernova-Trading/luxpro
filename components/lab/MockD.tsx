"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Icon, type IconName } from "../Icon";
import { COMFORT, ROUTES, TRACK, LabHeader, Told, say, useToggles } from "./shared";

const tap = { scale: 0.95, transition: { duration: 0.1 } };

const GAMES: { key: string; icon: IconName; color: string; label: string }[] = [
  { key: "quiz",    icon: "lightbulb",   color: "var(--icon-yellow)",     label: "Quiz" },
  { key: "riddles", icon: "help-circle", color: "var(--icon-cyan)",       label: "Riddles" },
  { key: "snake",   icon: "snake",       color: "var(--accent-positive)", label: "Snake" },
  { key: "blocks",  icon: "blocks",      color: "var(--icon-violet)",     label: "Blocks" },
  { key: "mines",   icon: "mine",        color: "var(--icon-red)",        label: "Mines" },
];

// Owner (2026-10-04): show all three tip options up front, say what each one
// does, and speak the choice so Amish knows a tip is coming.
const TIPS: { key: "cash" | "uber" | "revolut"; icon: IconName; color: string; label: string; sub: string; msg: string }[] = [
  { key: "cash",    icon: "cash", color: "var(--accent-positive)", label: "Cash",    sub: "At drop-off",     msg: "Amish, I'd like to give you a cash tip at the end of the trip." },
  { key: "uber",    icon: "car",  color: "var(--bx-ink)",          label: "Uber",    sub: "In the Uber app", msg: "Amish, I'll leave you a tip through Uber." },
  { key: "revolut", icon: "bank", color: "var(--icon-sky)",        label: "Revolut", sub: "Scan QR code",    msg: "Amish, I'm sending you a tip with Revolut." },
];

function Circle({ icon, color, label, on, onClick }: { icon: IconName; color: string; label: string; on?: boolean; onClick?: () => void }) {
  return (
    <motion.button whileTap={tap} className="lab-circle" style={{ minWidth: 0, width: "100%" }} aria-pressed={!!on} onClick={onClick}>
      <span style={{ width: 68, height: 68 }}><Icon name={icon} size={28} style={{ color }} /></span>
      <span className="bx-label text-center" style={{ fontSize: 15, lineHeight: 1.25, maxWidth: "100%", padding: "0 2px", color: on ? "var(--bx-gold)" : undefined }}>
        {on ? "Told Amish" : label}
      </span>
    </motion.button>
  );
}

// Hero per source: playlists have album art; radio and Bluetooth don't, so
// they get a typographic hero instead of a blank (council round 3).
function Hero({ source, setSource, playing, onToggle }: { source: string; setSource: (s: string) => void; playing: boolean; onToggle: () => void }) {
  const art = source === "Playlists";
  const title = source === "Radio" ? "Capital FM" : source === "Bluetooth" ? "Your phone" : TRACK.title;
  const caption = source === "Radio" ? "Now playing · Radio" : source === "Bluetooth" ? "Connected by Bluetooth" : `Now playing · ${TRACK.source}`;
  const sub = source === "Radio" ? "Live" : source === "Bluetooth" ? "Play music from your phone" : TRACK.artist;
  return (
    <>
      {art ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={TRACK.art} alt="" decoding="async" className="absolute inset-0 w-full h-full" style={{ objectFit: "cover" }} />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to bottom, color-mix(in oklch, var(--bx-canvas) 88%, transparent) 0%, color-mix(in oklch, var(--bx-canvas) 30%, transparent) 26%, transparent 38%, color-mix(in oklch, var(--bx-canvas) 75%, transparent) 62%, var(--bx-canvas) 100%)" }}
          />
        </>
      ) : (
        <div className="absolute inset-x-0 flex flex-col items-center justify-center" style={{ top: 56, bottom: 150 }}>
          <Icon name={source === "Radio" ? "radio" : "bluetooth"} size={40} style={{ color: source === "Radio" ? "var(--icon-purple)" : "var(--icon-blue)" }} />
          <span style={{ width: 64, height: 1, background: "var(--bx-gold)", marginTop: 16, opacity: 0.6 }} />
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 px-5 pb-2">
        <div className="flex gap-5">
          {["Radio", "Playlists", "Bluetooth"].map((s) => (
            <button key={s} className="lab-tab" style={{ height: 48 }} aria-pressed={source === s} onClick={() => setSource(s)}>{s}</button>
          ))}
        </div>
        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0">
            <div className="bx-caption">{caption}</div>
            <div className="lab-num truncate" style={{ fontSize: 34, lineHeight: 1.15 }}>{title}</div>
            <div className="bx-sub" style={{ fontSize: 15 }}>{sub}</div>
          </div>
          {source !== "Bluetooth" && (
            <div className="flex items-center gap-2 flex-shrink-0" dir="ltr">
              <motion.button whileTap={tap} className="bx-icon-btn" style={{ width: 56, height: 56 }} aria-label="Previous"><Icon name="skip-back" size={18} /></motion.button>
              <motion.button
                whileTap={tap}
                className="bx-icon-btn"
                style={{ width: 64, height: 64, background: "var(--bx-gold)", borderColor: "var(--bx-gold)", color: "var(--bx-on-gold)" }}
                onClick={onToggle}
                aria-label={playing ? "Pause" : "Play"}
              >
                <Icon name={playing ? "pause" : "play"} size={24} />
              </motion.button>
              <motion.button whileTap={tap} className="bx-icon-btn" style={{ width: 56, height: 56 }} aria-label="Next"><Icon name="skip-forward" size={18} /></motion.button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Direction D — the owner's pick, refined after council round 3 and the
// owner's answers: tip options up front and spoken, every Ask Amish button a
// plain on/off request, gold kept to play / tip / "Told Amish", bigger
// targets, five games on the home screen.
export default function MockD() {
  const requests = useToggles();
  const [tipped, setTipped] = useState<string | null>(null);
  const [qr, setQr] = useState(false);
  const [climate, setClimate] = useState<"cold" | "warm" | null>(null);
  const [source, setSource] = useState("Playlists");
  const [playing, setPlaying] = useState(true);

  function request(key: string, msg: string) {
    const next = requests.toggle(key);
    if (next === null) return;
    say(next ? msg : "That request has been removed.");
  }

  function tip(t: (typeof TIPS)[number]) {
    setTipped(t.key);
    say(t.msg);
    if (t.key === "revolut") setQr(true);
  }

  function setTemp(id: "cold" | "warm") {
    const next = climate === id ? null : id;
    setClimate(next);
    say(next === "warm" ? "Amish, can you put the warm temperature, please?" : next === "cold" ? "Amish, can you put the cold temperature, please?" : "Temperature request cancelled.");
  }

  const climateHalf = (id: "cold" | "warm", icon: IconName, color: string, label: string) => {
    const on = climate === id;
    return (
      <motion.button
        whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
        className="flex items-center justify-center gap-3"
        style={{
          height: 60,
          // sRGB mix: in OKLCH, sky blue over the warm-dark surface drifts to olive
          background: `color-mix(in srgb, ${color} ${on ? 40 : 18}%, var(--bx-raised))`,
          boxShadow: on ? "inset 0 0 0 1.5px var(--bx-gold)" : undefined,
          transition: "background 150ms ease",
        }}
        onClick={() => setTemp(id)}
        aria-pressed={on}
      >
        <Icon name={icon} size={24} style={{ color }} />
        <span className="bx-label" style={{ fontSize: 17 }}>{label}</span>
        {on && <Told />}
      </motion.button>
    );
  };

  return (
    <div className="bx lab relative flex flex-col overflow-hidden" style={{ height: "100dvh" }} data-lang="en">
      <section className="relative flex-shrink-0" style={{ height: 300 }}>
        <Hero source={source} setSource={setSource} playing={playing} onToggle={() => setPlaying((p) => !p)} />
        <LabHeader overlay />
      </section>

      <main className="flex-1 min-h-0 flex flex-col justify-between px-5 pb-4 pt-3">
        {/* Tip — three options up front, each says what happens */}
        <section style={{ borderRadius: 24, border: "1px solid var(--bx-gold)", background: "var(--bx-gold-tint)", padding: "10px 10px 12px" }}>
          <div className="flex items-baseline justify-between px-2">
            <span className="lab-row-label" style={{ fontSize: 20 }}>Leave Amish a tip</span>
            <span className="bx-sub" style={{ color: "var(--bx-gold)" }}>Tap one · Amish will know</span>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {TIPS.map((t) => {
              const on = tipped === t.key;
              return (
                <motion.button
                  key={t.key}
                  whileTap={tap}
                  className="flex flex-col items-center justify-center"
                  style={{
                    height: 68,
                    borderRadius: 9999,
                    background: on ? "var(--bx-gold)" : "var(--bx-canvas)",
                    color: on ? "var(--bx-on-gold)" : "var(--bx-ink)",
                    border: "1px solid color-mix(in oklch, var(--bx-gold) 45%, transparent)",
                    transition: "background 150ms ease",
                  }}
                  onClick={() => tip(t)}
                  aria-pressed={on}
                >
                  <span className="flex items-center gap-2">
                    <Icon name={t.icon} size={20} style={{ color: on ? "currentColor" : t.color }} />
                    <span className="bx-label" style={{ fontSize: 17, color: "inherit" }}>{t.label}</span>
                  </span>
                  <span style={{ fontSize: 13, opacity: on ? 0.85 : 0.7 }}>{on ? "Told Amish" : t.sub}</span>
                </motion.button>
              );
            })}
          </div>
        </section>

        {/* Ask Amish — every button is a plain on/off request */}
        <div>
          <div className="bx-caption mb-2">Ask Amish</div>
          <div className="grid grid-cols-4">
            {COMFORT.map((it) => (
              <Circle key={it.key} icon={it.icon} color={it.color} label={it.label} on={!!requests.on[it.key]} onClick={() => request(it.key, it.msg)} />
            ))}
          </div>
          {/* Three under four: inset half a column so each sits between two above */}
          <div className="grid grid-cols-3 mt-2" style={{ padding: "0 12.5%" }}>
            {ROUTES.map((it) => (
              <Circle key={it.key} icon={it.icon} color={it.color} label={it.label} on={!!requests.on[it.key]} onClick={() => request(it.key, it.msg)} />
            ))}
          </div>
        </div>

        {/* Climate — the original Warmer / Cooler, no number */}
        <div className="grid grid-cols-2 overflow-hidden" style={{ borderRadius: 9999, border: "1px solid var(--bx-hairline)" }}>
          {climateHalf("cold", "snowflake", "var(--icon-sky)", "Cooler")}
          {climateHalf("warm", "flame", "var(--icon-orange)", "Warmer")}
        </div>

        {/* Games — straight from the home screen, no submenus */}
        <div>
          <div className="bx-caption mb-2">Play</div>
          <div className="grid grid-cols-5">
            {GAMES.map((g) => (
              <Circle key={g.key} icon={g.icon} color={g.color} label={g.label} />
            ))}
          </div>
        </div>
      </main>

      {/* Revolut QR — opens straight away, so passengers know what Revolut means */}
      {qr && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-6 px-8 text-center" style={{ background: "var(--bx-canvas)" }}>
          <div className="lab-row-label" style={{ fontSize: 28 }}>Tip Amish with Revolut</div>
          <div style={{ background: "oklch(0.985 0.002 90)", padding: 16, lineHeight: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/qr-tip.png" alt="Revolut QR code" width={260} height={260} />
          </div>
          <div className="bx-title" style={{ color: "var(--bx-muted)", fontWeight: 400 }}>Scan with your phone&apos;s camera or the Revolut app</div>
          <button className="bx-pill" onClick={() => setQr(false)}>Done</button>
        </div>
      )}
    </div>
  );
}
