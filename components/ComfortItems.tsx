"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SectionHeader from "./SectionHeader";
import { Icon, type IconName } from "./Icon";
import type { Translation } from "@/lib/translations";

interface Props {
  t: Translation;
  onSpeak: (text: string) => void;
}

export default function ComfortItems({ t, onSpeak }: Props) {
  const items: { icon: IconName; color: string; labelKey: "charger" | "specialSnacks" | "wipes" | "mints"; msg: string }[] = [
    { icon: "plug",    color: "#4ADE80", labelKey: "charger",       msg: "Amish, can I use the phone charger please" },
    { icon: "cookie",  color: "#FB923C", labelKey: "specialSnacks", msg: "Amish, can I have some special snacks please" },
    { icon: "droplet", color: "#38BDF8", labelKey: "wipes",         msg: "Amish, can I have some wet wipes please" },
    { icon: "candy",   color: "#F472B6", labelKey: "mints",         msg: "Amish, can I have some sweets and mints please" },
  ];

  const [active, setActive] = useState<Record<number, boolean>>({});
  const [fastRoute, setFastRoute] = useState(false);
  // Change Dest / Motorway are one-shot requests, not persistent toggles —
  // there's nothing to turn back off — so they get a brief gold confirmation
  // flash on tap instead of a lasting selected state.
  const [justTapped, setJustTapped] = useState<"dest" | "motorway" | null>(null);

  function toggle(idx: number, msg: string) {
    const next = !active[idx];
    setActive((prev) => ({ ...prev, [idx]: next }));
    onSpeak(next ? msg : "That request has been removed.");
  }

  function toggleFastRoute() {
    const next = !fastRoute;
    setFastRoute(next);
    onSpeak(next ? "Amish, please take the fastest route" : "Fast route off");
  }

  function tapOneShot(id: "dest" | "motorway", msg: string) {
    setJustTapped(id);
    onSpeak(msg);
    setTimeout(() => setJustTapped((cur) => (cur === id ? null : cur)), 1400);
  }

  // No backdrop-filter — 4 of these render simultaneously, and blur on
  // repeated small tiles is decorative cost without real elevation payoff
  // (see impeccable/DESIGN.md:287, redesign-skill/SKILL.md:93).
  const glassCard: React.CSSProperties = {
    transition: "box-shadow 200ms ease, border-color 200ms ease, background 200ms ease",
  };

  return (
    <div>
      <SectionHeader label={t.comfortItems} />

      {/* 4-col equal grid */}
      <div className="grid grid-cols-4 gap-2">
        {items.map(({ icon, color, labelKey, msg }, idx) => {
          const isActive = !!active[idx];
          return (
            <motion.div
              key={idx}
              whileTap={{ scale: 0.95, transition: { duration: 0.08 } }}
              whileHover={{ y: -2, transition: { type: "tween", duration: 0.2, ease: [0.16, 1, 0.3, 1] } }}
              onClick={() => toggle(idx, msg)}
              className="relative flex flex-col items-center gap-2 py-3 px-2 rounded-[18px] cursor-pointer"
              style={{
                ...glassCard,
                background: isActive ? "rgba(200,168,75,0.10)" : "var(--lp-surface)",
                border: isActive
                  ? "1px solid rgba(200,168,75,0.55)"
                  : "1px solid var(--lp-border)",
                boxShadow: isActive ? "inset 0 0 0 1.5px rgba(200,168,75,0.70)" : "none",
              }}
            >
              <Icon name={icon} size={26} style={{ color: isActive ? "var(--lp-gold)" : color }} />
              <div
                className="text-[12px] tracking-[2px] uppercase font-bold text-center"
                style={{ color: isActive ? "var(--lp-gold)" : "var(--text-primary)" }}
              >
                {t[labelKey]}
              </div>
              <div
                className="absolute top-3 right-3 w-2 h-2 rounded-full"
                style={{
                  background: "var(--lp-gold)",
                  opacity: isActive ? 1 : 0,
                  transition: "opacity 200ms ease",
                }}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Fast Route | Change Dest | Motorway — route requests, same bordered
          card treatment as the row above for visual consistency. */}
      <div className="grid grid-cols-3 gap-2 mt-2">
        <motion.div
          whileTap={{ scale: 0.95, transition: { duration: 0.08 } }}
          whileHover={{ y: -2, transition: { type: "tween", duration: 0.2, ease: [0.16, 1, 0.3, 1] } }}
          onClick={toggleFastRoute}
          className="flex flex-col items-center gap-2 text-center rounded-[18px] cursor-pointer py-3 px-2"
          style={{
            ...glassCard,
            background: fastRoute ? "rgba(200,168,75,0.12)" : "var(--lp-surface)",
            border: fastRoute ? "1px solid rgba(200,168,75,0.55)" : "1px solid var(--lp-border)",
            boxShadow: fastRoute ? "inset 0 0 0 1.5px rgba(200,168,75,0.70)" : "none",
          }}
        >
          <Icon name="zap" size={24} style={{ color: fastRoute ? "var(--lp-gold)" : "#FACC15" }} />
          <div
            className="text-[12px] tracking-[1.5px] font-bold uppercase"
            style={{ color: fastRoute ? "var(--lp-gold)" : "var(--text-primary)" }}
          >
            {t.fastRoute}
          </div>
        </motion.div>

        <motion.div
          whileTap={{ scale: 0.95, transition: { duration: 0.08 } }}
          whileHover={{ y: -2, transition: { type: "tween", duration: 0.2, ease: [0.16, 1, 0.3, 1] } }}
          onClick={() => tapOneShot("dest", "Amish, the passenger would like to change the destination.")}
          className="flex flex-col items-center gap-2 text-center rounded-[18px] cursor-pointer py-3 px-2"
          style={{
            ...glassCard,
            background: justTapped === "dest" ? "rgba(200,168,75,0.12)" : "var(--lp-surface)",
            border: justTapped === "dest" ? "1px solid rgba(200,168,75,0.55)" : "1px solid var(--lp-border)",
            boxShadow: justTapped === "dest" ? "inset 0 0 0 1.5px rgba(200,168,75,0.70)" : "none",
          }}
        >
          <Icon name="map-pin" size={24} style={{ color: justTapped === "dest" ? "var(--lp-gold)" : "#F87171" }} />
          <div className="text-[12px] tracking-[1.5px] font-bold uppercase" style={{ color: justTapped === "dest" ? "var(--lp-gold)" : "var(--text-primary)" }}>
            {t.changeDest}
          </div>
        </motion.div>

        <motion.div
          whileTap={{ scale: 0.95, transition: { duration: 0.08 } }}
          whileHover={{ y: -2, transition: { type: "tween", duration: 0.2, ease: [0.16, 1, 0.3, 1] } }}
          onClick={() => tapOneShot("motorway", "Amish, please take the motorway.")}
          className="flex flex-col items-center gap-2 text-center rounded-[18px] cursor-pointer py-3 px-2"
          style={{
            ...glassCard,
            background: justTapped === "motorway" ? "rgba(200,168,75,0.12)" : "var(--lp-surface)",
            border: justTapped === "motorway" ? "1px solid rgba(200,168,75,0.55)" : "1px solid var(--lp-border)",
            boxShadow: justTapped === "motorway" ? "inset 0 0 0 1.5px rgba(200,168,75,0.70)" : "none",
          }}
        >
          <Icon name="road" size={24} style={{ color: justTapped === "motorway" ? "var(--lp-gold)" : "#94A3B8" }} />
          <div className="text-[12px] tracking-[1.5px] font-bold uppercase" style={{ color: justTapped === "motorway" ? "var(--lp-gold)" : "var(--text-primary)" }}>
            {t.motorway}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
