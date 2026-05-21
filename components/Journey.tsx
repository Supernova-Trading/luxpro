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

// Glass card base shared across all Journey items
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

      <div className="grid grid-cols-5 gap-2.5">
        {/* Fast Route */}
        <motion.div
          whileTap={{ scale: 0.95, transition: { duration: 0.08 } }}
          onClick={toggleFastRoute}
          className="flex flex-col items-center gap-2 text-center rounded-[18px] cursor-pointer py-5 px-2"
          style={{
            ...glassCard,
            background: fastRoute ? "rgba(200,168,75,0.12)" : "rgba(255,255,255,0.05)",
            border: fastRoute ? "1px solid rgba(200,168,75,0.55)" : "1px solid rgba(255,255,255,0.10)",
            boxShadow: fastRoute ? "var(--glow-gold)" : "0 8px 24px rgba(0,0,0,0.35)",
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
          onClick={() => onSpeak("Amish, the passenger would like to change the destination.")}
          className="flex flex-col items-center gap-2 text-center rounded-[18px] cursor-pointer py-5 px-2"
          style={{
            ...glassCard,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.10)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
          }}
        >
          <div className="text-[30px] leading-none">📍</div>
          <div className="text-[12px] tracking-[1.5px] font-bold uppercase" style={{ color: "rgba(255,255,255,0.80)" }}>
            {t.changeDest}
          </div>
        </motion.div>

        {/* Warm */}
        <motion.div
          whileTap={{ scale: 0.95, transition: { duration: 0.08 } }}
          onClick={() => selectTemp("warm")}
          className="flex flex-col items-center gap-2 text-center rounded-[18px] cursor-pointer py-5 px-2"
          style={{
            ...glassCard,
            background: temp === "warm"
              ? "rgba(249,115,22,0.15)"
              : "rgba(249,115,22,0.06)",
            border: temp === "warm"
              ? "1px solid rgba(249,115,22,0.65)"
              : "1px solid rgba(249,115,22,0.25)",
            boxShadow: temp === "warm"
              ? "var(--glow-warm)"
              : "0 8px 24px rgba(0,0,0,0.35)",
          }}
        >
          <div className="text-[30px] leading-none">🔥</div>
          <div
            className="text-[12px] tracking-[1.5px] font-bold uppercase"
            style={{ color: temp === "warm" ? "#FB923C" : "rgba(251,146,60,0.75)" }}
          >
            {t.warm}
          </div>
        </motion.div>

        {/* Cold */}
        <motion.div
          whileTap={{ scale: 0.95, transition: { duration: 0.08 } }}
          onClick={() => selectTemp("cold")}
          className="flex flex-col items-center gap-2 text-center rounded-[18px] cursor-pointer py-5 px-2"
          style={{
            ...glassCard,
            background: temp === "cold"
              ? "rgba(14,165,233,0.15)"
              : "rgba(14,165,233,0.06)",
            border: temp === "cold"
              ? "1px solid rgba(14,165,233,0.65)"
              : "1px solid rgba(14,165,233,0.25)",
            boxShadow: temp === "cold"
              ? "var(--glow-cold)"
              : "0 8px 24px rgba(0,0,0,0.35)",
          }}
        >
          <div className="text-[30px] leading-none">🧊</div>
          <div
            className="text-[12px] tracking-[1.5px] font-bold uppercase"
            style={{ color: temp === "cold" ? "#38BDF8" : "rgba(56,189,248,0.75)" }}
          >
            {t.cold}
          </div>
        </motion.div>

        {/* Quiet Ride */}
        <motion.div
          whileTap={{ scale: 0.95, transition: { duration: 0.08 } }}
          onClick={toggleQuietRide}
          className="flex flex-col items-center gap-2 text-center rounded-[18px] cursor-pointer py-5 px-2"
          style={{
            ...glassCard,
            background: quietRide ? "rgba(200,168,75,0.12)" : "rgba(255,255,255,0.05)",
            border: quietRide ? "1px solid rgba(200,168,75,0.55)" : "1px solid rgba(255,255,255,0.10)",
            boxShadow: quietRide ? "var(--glow-gold)" : "0 8px 24px rgba(0,0,0,0.35)",
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
