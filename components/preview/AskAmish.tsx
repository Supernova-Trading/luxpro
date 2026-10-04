"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Icon, type IconName } from "../Icon";
import type { PreviewStrings } from "@/lib/preview-strings";

interface Props {
  s: PreviewStrings;
  onSpeak: (text: string) => void;
}

// Route requests keep the owner's 2.5s auto-reset; comfort requests stay
// "Told Amish" until the passenger taps again to cancel.
const AUTO_RESET_MS = 2500;
const tap = { scale: 0.97, transition: { duration: 0.1 } };

type ItemKey = "charger" | "snacks" | "wipes" | "mints";
const ITEMS: { key: ItemKey; icon: IconName; color: string; msg: string }[] = [
  { key: "charger", icon: "plug",    color: "var(--accent-positive)", msg: "Amish, can I use the phone charger please" },
  { key: "snacks",  icon: "cookie",  color: "var(--icon-orange)",     msg: "Amish, can I have some special snacks please" },
  { key: "wipes",   icon: "droplet", color: "var(--icon-sky)",        msg: "Amish, can I have some wet wipes please" },
  { key: "mints",   icon: "candy",   color: "var(--icon-pink)",       msg: "Amish, can I have some sweets and mints please" },
];

function Told({ label }: { label: string }) {
  return (
    <span className="bx-status">
      <Icon name="check" size={14} />
      {label}
    </span>
  );
}

export default function AskAmish({ s, onSpeak }: Props) {
  const [active, setActive] = useState<Partial<Record<ItemKey, boolean>>>({});
  const [fastRoute, setFastRoute] = useState(false);
  const fastRouteTimer = useRef<ReturnType<typeof setTimeout>>();
  const [justTapped, setJustTapped] = useState<"dest" | "motorway" | null>(null);

  function toggle(key: ItemKey, msg: string) {
    const next = !active[key];
    setActive((prev) => ({ ...prev, [key]: next }));
    onSpeak(next ? msg : "That request has been removed.");
  }

  function toggleFastRoute() {
    clearTimeout(fastRouteTimer.current);
    const next = !fastRoute;
    setFastRoute(next);
    onSpeak(next ? "Amish, please take the fastest route" : "Fast route off");
    if (next) fastRouteTimer.current = setTimeout(() => setFastRoute(false), AUTO_RESET_MS);
  }

  function tapOneShot(id: "dest" | "motorway", msg: string) {
    setJustTapped(id);
    onSpeak(msg);
    setTimeout(() => setJustTapped((cur) => (cur === id ? null : cur)), AUTO_RESET_MS);
  }

  const routes: { id: "fast" | "dest" | "motorway"; icon: IconName; color: string; label: string; on: boolean; onTap: () => void }[] = [
    { id: "fast",     icon: "zap",     color: "var(--icon-yellow)", label: s.fastest,    on: fastRoute,               onTap: toggleFastRoute },
    { id: "dest",     icon: "map-pin", color: "var(--icon-red)",    label: s.changeDest, on: justTapped === "dest",     onTap: () => tapOneShot("dest", "Amish, the passenger would like to change the destination.") },
    { id: "motorway", icon: "road",    color: "var(--icon-gray)",   label: s.motorway,   on: justTapped === "motorway", onTap: () => tapOneShot("motorway", "Amish, please take the motorway.") },
  ];

  return (
    <section>
      <div className="bx-caption mb-3">{s.askAmish}</div>

      <div className="grid grid-cols-2 gap-2">
        {ITEMS.map(({ key, icon, color, msg }) => (
          <motion.button
            key={key}
            whileTap={tap}
            className="bx-tile bx-tile--row"
            style={{ minHeight: 92 }}
            aria-pressed={!!active[key]}
            onClick={() => toggle(key, msg)}
          >
            <Icon name={icon} size={28} style={{ color, flexShrink: 0 }} />
            <span className="flex flex-col gap-1 min-w-0">
              <span className="bx-label">{s[key]}</span>
              {active[key] && <Told label={s.toldAmish} />}
            </span>
          </motion.button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2 mt-2">
        {routes.map(({ id, icon, color, label, on, onTap }) => (
          <motion.button
            key={id}
            whileTap={tap}
            className="bx-tile"
            style={{ minHeight: 104 }}
            data-told={on}
            aria-pressed={id === "fast" ? on : undefined}
            onClick={onTap}
          >
            <span className="flex items-center justify-between gap-2 w-full">
              <Icon name={icon} size={24} style={{ color, flexShrink: 0 }} />
              {on && <Told label={s.toldAmish} />}
            </span>
            <span className="bx-label">{label}</span>
          </motion.button>
        ))}
      </div>
    </section>
  );
}
