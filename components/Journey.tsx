"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SectionHeader from "./SectionHeader";
import type { Translation } from "@/lib/translations";

interface Props {
  t: Translation;
  onSpeak: (text: string) => void;
}

type TempChoice = "warm" | "cold" | null;

function playChime(type: "warm" | "cold") {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const notes = type === "warm" ? [261.6, 329.6, 392.0] : [523.2, 659.3, 783.9];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = type === "warm" ? "sine" : "triangle";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.18);
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.18);
      gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + i * 0.18 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.18 + 0.5);
      osc.start(ctx.currentTime + i * 0.18);
      osc.stop(ctx.currentTime + i * 0.18 + 0.55);
    });
  } catch { /* silently ignore if audio context unavailable */ }
}

const glassCard: React.CSSProperties = {
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  transition: "box-shadow 200ms ease, border-color 200ms ease, background 200ms ease",
};

export default function Journey({ t, onSpeak }: Props) {
  const [fastRoute, setFastRoute] = useState(false);
  const [quietRide, setQuietRide] = useState(false);
  const [temp, setTemp] = useState<TempChoice>(null);

  function toggleFastRoute() {
    const next = !fastRoute;
    setFastRoute(next);
    onSpeak(next ? "Amish, please take the fastest route" : "Fast route off");
  }

  function toggleQuietRide() {
    const next = !quietRide;
    setQuietRide(next);
    onSpeak(next ? "Amish, the passenger would prefer a quiet ride please" : "Quiet ride off");
  }

  function selectTemp(t2: "warm" | "cold") {
    if (temp === t2) {
      setTemp(null);
      onSpeak("Temperature request cancelled.");
    } else {
      setTemp(t2);
      playChime(t2);
      setTimeout(() => {
        onSpeak(
          t2 === "warm"
            ? "Amish, can you put the warm temperature, please?"
            : "Amish, can you put the cold temperature, please?"
        );
      }, 700);
    }
  }

  return (
    <div>
      <SectionHeader label={t.journey} />

      {/* WARM + COLD — dominant merged card */}
      <div
        className="flex rounded-[18px] overflow-hidden mb-2.5"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.10)",
        }}
      >
        {/* Warm */}
        <motion.div
          whileTap={{ scale: 0.97, transition: { duration: 0.08 } }}
          whileHover={{ y: -2, transition: { type: "tween", duration: 0.2, ease: [0.16, 1, 0.3, 1] } }}
          onClick={() => selectTemp("warm")}
          className="flex-1 flex flex-col items-center gap-2 text-center cursor-pointer py-6 px-2"
          style={{
            ...glassCard,
            border: "none",
            background: temp === "warm" ? "rgba(200,168,75,0.10)" : "transparent",
            boxShadow: temp === "warm" ? "inset 0 0 0 1.5px rgba(200,168,75,0.70)" : "none",
          }}
        >
          <div className="text-[30px] leading-none">🔥</div>
          <div
            className="text-[12px] tracking-[1.5px] font-bold uppercase"
            style={{ color: temp === "warm" ? "var(--lp-gold)" : "rgba(255,255,255,0.80)" }}
          >
            {t.warm}
          </div>
        </motion.div>

        {/* Divider */}
        <div style={{ width: "1px", background: "rgba(255,255,255,0.08)", alignSelf: "stretch" }} />

        {/* Cold */}
        <motion.div
          whileTap={{ scale: 0.97, transition: { duration: 0.08 } }}
          whileHover={{ y: -2, transition: { type: "tween", duration: 0.2, ease: [0.16, 1, 0.3, 1] } }}
          onClick={() => selectTemp("cold")}
          className="flex-1 flex flex-col items-center gap-2 text-center cursor-pointer py-6 px-2"
          style={{
            ...glassCard,
            border: "none",
            background: temp === "cold" ? "rgba(200,168,75,0.10)" : "transparent",
            boxShadow: temp === "cold" ? "inset 0 0 0 1.5px rgba(200,168,75,0.70)" : "none",
          }}
        >
          <div className="text-[30px] leading-none">🧊</div>
          <div
            className="text-[12px] tracking-[1.5px] font-bold uppercase"
            style={{ color: temp === "cold" ? "var(--lp-gold)" : "rgba(255,255,255,0.80)" }}
          >
            {t.cold}
          </div>
        </motion.div>
      </div>

      {/* Fast Route | Change Dest | Quiet Ride — 3-col strip */}
      <div className="grid grid-cols-3 gap-2.5">
        {/* Fast Route */}
        <motion.div
          whileTap={{ scale: 0.95, transition: { duration: 0.08 } }}
          whileHover={{ y: -2, transition: { type: "tween", duration: 0.2, ease: [0.16, 1, 0.3, 1] } }}
          onClick={toggleFastRoute}
          className="flex flex-col items-center gap-2 text-center rounded-[18px] cursor-pointer py-5 px-2"
          style={{
            ...glassCard,
            background: fastRoute ? "rgba(200,168,75,0.12)" : "rgba(255,255,255,0.05)",
            border: fastRoute ? "1px solid rgba(200,168,75,0.55)" : "1px solid rgba(255,255,255,0.10)",
            boxShadow: fastRoute ? "inset 0 0 0 1.5px rgba(200,168,75,0.70)" : "none",
          }}
        >
          <div className="text-[30px] leading-none">⚡</div>
          <div
            className="text-[12px] tracking-[1.5px] font-bold uppercase"
            style={{ color: fastRoute ? "var(--lp-gold)" : "rgba(255,255,255,0.80)" }}
          >
            {t.fastRoute}
          </div>
        </motion.div>

        {/* Change Destination */}
        <motion.div
          whileTap={{ scale: 0.95, transition: { duration: 0.08 } }}
          whileHover={{ y: -2, transition: { type: "tween", duration: 0.2, ease: [0.16, 1, 0.3, 1] } }}
          onClick={() => onSpeak("Amish, the passenger would like to change the destination.")}
          className="flex flex-col items-center gap-2 text-center rounded-[18px] cursor-pointer py-5 px-2"
          style={{
            ...glassCard,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.10)",
            boxShadow: "none",
          }}
        >
          <div className="text-[30px] leading-none">📍</div>
          <div className="text-[12px] tracking-[1.5px] font-bold uppercase" style={{ color: "rgba(255,255,255,0.80)" }}>
            {t.changeDest}
          </div>
        </motion.div>

        {/* Quiet Ride */}
        <motion.div
          whileTap={{ scale: 0.95, transition: { duration: 0.08 } }}
          whileHover={{ y: -2, transition: { type: "tween", duration: 0.2, ease: [0.16, 1, 0.3, 1] } }}
          onClick={toggleQuietRide}
          className="flex flex-col items-center gap-2 text-center rounded-[18px] cursor-pointer py-5 px-2"
          style={{
            ...glassCard,
            background: quietRide ? "rgba(200,168,75,0.12)" : "rgba(255,255,255,0.05)",
            border: quietRide ? "1px solid rgba(200,168,75,0.55)" : "1px solid rgba(255,255,255,0.10)",
            boxShadow: quietRide ? "inset 0 0 0 1.5px rgba(200,168,75,0.70)" : "none",
          }}
        >
          <div className="text-[30px] leading-none">🔇</div>
          <div
            className="text-[12px] tracking-[1.5px] font-bold uppercase"
            style={{ color: quietRide ? "var(--lp-gold)" : "rgba(255,255,255,0.80)" }}
          >
            {t.quietRide}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
