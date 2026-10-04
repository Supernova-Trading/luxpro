"use client";

import { useState, useRef, useEffect } from "react";
import { Icon, type IconName } from "../Icon";

// Shared content and behaviour for the three /lab direction mockups, so the
// owner compares composition only — same words, same data, same states.

export type Item = { key: string; icon: IconName; color: string; label: string; hosp: string };

export const COMFORT: Item[] = [
  { key: "charger", icon: "plug",    color: "var(--accent-positive)", label: "Phone charger",    hosp: "A phone charger" },
  { key: "snacks",  icon: "cookie",  color: "var(--icon-orange)",     label: "Snacks",           hosp: "Something to eat" },
  { key: "wipes",   icon: "droplet", color: "var(--icon-sky)",        label: "Wet wipes",        hosp: "Refreshing wipes" },
  { key: "mints",   icon: "candy",   color: "var(--icon-pink)",       label: "Sweets and mints", hosp: "Mints" },
];

export const ROUTES: Item[] = [
  { key: "fast",     icon: "zap",     color: "var(--icon-yellow)", label: "Fastest route",      hosp: "The quickest way" },
  { key: "motorway", icon: "road",    color: "var(--icon-gray)",   label: "Take the motorway",  hosp: "Via the motorway" },
  { key: "dest",     icon: "map-pin", color: "var(--icon-red)",    label: "Change destination", hosp: "Somewhere else" },
];

// A real track from the app's Electronic playlist (NCS), as the passenger would see it.
export const TRACK = {
  title: "backtoback",
  artist: "angelrot",
  source: "Electronic playlist",
  art: "https://i1.sndcdn.com/artworks-QzytRsu4EUiroPW7-amefbQ-t500x500.jpg",
};

export const TEMP_MIN = 18;
export const TEMP_MAX = 26;

export function useDaypart() {
  const [part, setPart] = useState("evening");
  useEffect(() => {
    const h = new Date().getHours();
    setPart(h < 12 ? "morning" : h < 18 ? "afternoon" : "evening");
  }, []);
  return part;
}

export function useToggles() {
  const [on, setOn] = useState<Record<string, boolean>>({});
  return { on, toggle: (k: string) => setOn((p) => ({ ...p, [k]: !p[k] })) };
}

// Route requests: one-shot confirmation that clears after 2.5s (owner's rule).
export function useFlash(ms = 2500) {
  const [id, setId] = useState<string | null>(null);
  const t = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => () => clearTimeout(t.current), []);
  return {
    id,
    flash: (k: string) => {
      clearTimeout(t.current);
      setId(k);
      t.current = setTimeout(() => setId(null), ms);
    },
  };
}

// Temperature preference: the tablet can't read the car, so this is a
// requested setpoint. "Told" lands once the passenger stops tapping.
export function useTemp(initial = 21) {
  const [value, setValue] = useState(initial);
  const [told, setTold] = useState(false);
  const t = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => () => clearTimeout(t.current), []);
  return {
    value,
    told,
    step: (d: number) => {
      setValue((v) => Math.min(TEMP_MAX, Math.max(TEMP_MIN, v + d)));
      setTold(false);
      clearTimeout(t.current);
      t.current = setTimeout(() => setTold(true), 1200);
    },
  };
}

export function LabHeader({ overlay = false }: { overlay?: boolean }) {
  return (
    <header
      className="flex items-center justify-between px-5 flex-shrink-0"
      style={{ height: 56, position: overlay ? "absolute" : "relative", top: 0, left: 0, right: 0, zIndex: 2 }}
    >
      <div className="bx-wordmark">LuxPro</div>
      <div className="flex items-center">
        <button className="bx-nav" aria-pressed>EN</button>
        <button className="bx-nav">ES</button>
        <button className="bx-nav">اردو</button>
        <button className="bx-icon-btn ms-2" aria-label="Settings">
          <Icon name="settings" size={18} />
        </button>
      </div>
    </header>
  );
}

export function Told({ text = "Told Amish" }: { text?: string }) {
  return (
    <span className="bx-status">
      <Icon name="check" size={13} />
      {text}
    </span>
  );
}
