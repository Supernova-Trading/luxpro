"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import SectionHeader from "./SectionHeader";
import { Icon, type IconName } from "./Icon";
import type { Translation } from "@/lib/translations";

interface Props {
  t: Translation;
  onSpeak: (text: string) => void;
}

const AUTO_RESET_MS = 2500;

export default function ComfortItems({ t, onSpeak }: Props) {
  const items: { icon: IconName; color: string; labelKey: "charger" | "specialSnacks" | "wipes" | "mints"; msg: string }[] = [
    { icon: "plug",    color: "var(--accent-positive)", labelKey: "charger",       msg: "Amish, can I use the phone charger please" },
    { icon: "cookie",  color: "var(--icon-orange)", labelKey: "specialSnacks", msg: "Amish, can I have some special snacks please" },
    { icon: "droplet", color: "var(--icon-sky)", labelKey: "wipes",         msg: "Amish, can I have some wet wipes please" },
    { icon: "candy",   color: "var(--icon-pink)", labelKey: "mints",         msg: "Amish, can I have some sweets and mints please" },
  ];

  const [active, setActive] = useState<Record<number, boolean>>({});
  const [fastRoute, setFastRoute] = useState(false);
  const fastRouteTimer = useRef<ReturnType<typeof setTimeout>>();
  // Change Dest / Motorway are one-shot requests, not persistent toggles —
  // there's nothing to turn back off — so they get a confirmation flash on
  // tap instead of a lasting selected state.
  const [justTapped, setJustTapped] = useState<"dest" | "motorway" | null>(null);

  function toggle(idx: number, msg: string) {
    const next = !active[idx];
    setActive((prev) => ({ ...prev, [idx]: next }));
    onSpeak(next ? msg : "That request has been removed.");
  }

  function toggleFastRoute() {
    clearTimeout(fastRouteTimer.current);
    const next = !fastRoute;
    setFastRoute(next);
    onSpeak(next ? "Amish, please take the fastest route" : "Fast route off");
    if (next) {
      // Auto-reverts to neutral if the passenger never taps it off — same
      // window as Change Dest / Motorway's confirmation flash, so the
      // whole row behaves consistently.
      fastRouteTimer.current = setTimeout(() => setFastRoute(false), AUTO_RESET_MS);
    }
  }

  function tapOneShot(id: "dest" | "motorway", msg: string) {
    setJustTapped(id);
    onSpeak(msg);
    setTimeout(() => setJustTapped((cur) => (cur === id ? null : cur)), AUTO_RESET_MS);
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
                background: isActive ? "var(--active-bg)" : "var(--lp-surface)",
                border: isActive
                  ? "1px solid var(--active-border)"
                  : "1px solid var(--lp-border)",
                boxShadow: isActive ? "inset 0 0 0 1.5px var(--active-ring)" : "var(--tile-shadow)",
              }}
            >
              <Icon name={icon} size={26} style={{ color: isActive ? "var(--active-text)" : color }} />
              <div
                className="text-[12px] tracking-[2px] uppercase font-bold text-center"
                style={{ color: isActive ? "var(--active-text)" : "var(--text-primary)" }}
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
            background: fastRoute ? "var(--active-bg-strong)" : "var(--lp-surface)",
            border: fastRoute ? "1px solid var(--active-border)" : "1px solid var(--lp-border)",
            boxShadow: fastRoute ? "inset 0 0 0 1.5px var(--active-ring)" : "var(--tile-shadow)",
          }}
        >
          <Icon name="zap" size={24} style={{ color: fastRoute ? "var(--active-text)" : "var(--icon-yellow)" }} />
          <div
            className="text-[12px] tracking-[1.5px] font-bold uppercase"
            style={{ color: fastRoute ? "var(--active-text)" : "var(--text-primary)" }}
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
            background: justTapped === "dest" ? "var(--active-bg-strong)" : "var(--lp-surface)",
            border: justTapped === "dest" ? "1px solid var(--active-border)" : "1px solid var(--lp-border)",
            boxShadow: justTapped === "dest" ? "inset 0 0 0 1.5px var(--active-ring)" : "var(--tile-shadow)",
          }}
        >
          <Icon name="map-pin" size={24} style={{ color: justTapped === "dest" ? "var(--active-text)" : "var(--icon-red)" }} />
          <div className="text-[12px] tracking-[1.5px] font-bold uppercase" style={{ color: justTapped === "dest" ? "var(--active-text)" : "var(--text-primary)" }}>
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
            background: justTapped === "motorway" ? "var(--active-bg-strong)" : "var(--lp-surface)",
            border: justTapped === "motorway" ? "1px solid var(--active-border)" : "1px solid var(--lp-border)",
            boxShadow: justTapped === "motorway" ? "inset 0 0 0 1.5px var(--active-ring)" : "var(--tile-shadow)",
          }}
        >
          <Icon name="road" size={24} style={{ color: justTapped === "motorway" ? "var(--active-text)" : "var(--icon-gray)" }} />
          <div className="text-[12px] tracking-[1.5px] font-bold uppercase" style={{ color: justTapped === "motorway" ? "var(--active-text)" : "var(--text-primary)" }}>
            {t.motorway}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
