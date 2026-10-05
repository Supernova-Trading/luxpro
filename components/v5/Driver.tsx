"use client";

import { useEffect, useRef, useState } from "react";
import { Icon, type IconName } from "../Icon";

// Amish's Driver panel (roadmap P8): behind a 4-digit PIN, opened by holding
// the LuxPro wordmark. Owner-only controls live here, out of passengers'
// reach: new passenger, nearly there, end ride, full screen, kiosk lock.
// Amish's phone remote will call the same actions later.
// The panel is for Amish, so it's English only.
// The PIN is set on the tablet the first time; only a hash is stored, on the
// tablet. Forgotten PIN: clear the site's data in Chrome and set a new one.
const PIN_KEY = "luxpro.v5.driverPin";
const MAX_TRIES = 5;
const LOCKOUT_MS = 30_000;

async function hashPin(pin: string): Promise<string> {
  const text = `luxpro-driver:${pin}`;
  if (typeof crypto !== "undefined" && crypto.subtle) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  let h = 5381; // no secure context (plain http): weaker, still not the PIN itself
  for (let i = 0; i < text.length; i++) h = ((h << 5) + h + text.charCodeAt(i)) | 0;
  return `djb2:${h >>> 0}`;
}

function readPin(): string | null {
  try { return localStorage.getItem(PIN_KEY); } catch { return null; }
}

export type RideStage = "welcome" | "ride" | "farewell";

export default function Driver({ stage, isFS, kiosk, onClose, onNewPassenger, onNearly, onEndRide, onFullscreen, onKiosk }: {
  stage: RideStage;
  isFS: boolean;
  kiosk: boolean;
  onClose: () => void;
  onNewPassenger: () => void;
  onNearly: () => void;
  onEndRide: () => void;
  onFullscreen: () => void;
  onKiosk: (on: boolean) => void;
}) {
  const [mode, setMode] = useState<"enter" | "set" | "confirm" | "panel">(() => (readPin() ? "enter" : "set"));
  const [pin, setPin] = useState("");
  const [first, setFirst] = useState("");
  const [msg, setMsg] = useState("");
  const [armed, setArmed] = useState(false); // "New passenger" needs a second tap
  const tries = useRef(0);
  const lockedUntil = useRef(0);

  useEffect(() => {
    if (!armed) return;
    const t = setTimeout(() => setArmed(false), 3000);
    return () => clearTimeout(t);
  }, [armed]);

  async function submit(code: string) {
    if (mode === "enter") {
      if (Date.now() < lockedUntil.current) { setMsg("Too many tries. Wait 30 seconds."); setPin(""); return; }
      if ((await hashPin(code)) === readPin()) { tries.current = 0; setMode("panel"); setMsg(""); }
      else {
        tries.current += 1;
        if (tries.current >= MAX_TRIES) { lockedUntil.current = Date.now() + LOCKOUT_MS; tries.current = 0; }
        setMsg("Wrong PIN");
      }
    } else if (mode === "set") {
      setFirst(code); setMode("confirm"); setMsg("");
    } else if (mode === "confirm") {
      if (code === first) {
        try { localStorage.setItem(PIN_KEY, await hashPin(code)); } catch { /* storage blocked */ }
        setMode("panel"); setMsg("");
      } else { setMode("set"); setMsg("The PINs didn't match. Try again."); }
      setFirst("");
    }
    setPin("");
  }

  function press(d: string) {
    if (pin.length >= 4) return;
    const next = pin + d;
    setPin(next);
    if (next.length === 4) void submit(next);
  }

  const title = mode === "enter" ? "Driver PIN" : mode === "set" ? "Set a 4-digit driver PIN" : mode === "confirm" ? "Enter the PIN again" : "Driver";

  const action = (icon: IconName, label: string, sub: string, onClick: () => void, extra?: { gold?: boolean; on?: boolean }) => (
    <button className="v5-drv-btn" data-gold={extra?.gold} aria-pressed={extra?.on} onClick={onClick}>
      <Icon name={icon} size={22} />
      <span style={{ display: "grid", gap: 2, textAlign: "start" }}>
        <span className="v5-label" style={{ color: "inherit" }}>{label}</span>
        <span className="v5-sub">{sub}</span>
      </span>
    </button>
  );

  return (
    <div className="v5-drv" role="dialog" aria-label={title} dir="ltr" data-lang="en">
      <div className="v5-drv-card">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <span className="v5-heading" style={{ fontFamily: "var(--font-display), Newsreader, serif" }}>{title}</span>
          <button className="v5-pill" onClick={onClose}>Close</button>
        </div>

        {mode !== "panel" ? (
          <>
            <div className="v5-drv-dots" aria-label={`${pin.length} of 4 digits`}>
              {[0, 1, 2, 3].map((i) => <i key={i} data-on={i < pin.length} />)}
            </div>
            <span className="v5-sub" role="status" style={{ minHeight: 20, color: msg ? "var(--i-red)" : undefined }}>
              {msg || (mode === "set" ? "Only Amish should know it." : "")}
            </span>
            <div className="v5-drv-pad">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((d) => (
                <button key={d} onClick={() => press(d)}>{d}</button>
              ))}
              <button aria-label="Delete" onClick={() => setPin((p) => p.slice(0, -1))}><Icon name="arrow-left" size={22} /></button>
              <button onClick={() => press("0")}>0</button>
              <span aria-hidden />
            </div>
          </>
        ) : (
          <div className="v5-drv-actions">
            <span className="v5-caption">Ride: {stage === "welcome" ? "waiting for passenger" : stage === "ride" ? "in progress" : "ended"}</span>
            {action("history", armed ? "Tap again to clear the tablet" : "New passenger",
              "Clears requests, tip, games and music; shows the welcome screen",
              () => { if (armed) { setArmed(false); onNewPassenger(); onClose(); } else setArmed(true); }, { gold: armed })}
            {action("map-pin", "Nearly there", "Tells the passenger ~5 minutes to go", () => { onNearly(); onClose(); })}
            {action("hand", "End ride", "Shows the thank-you and tip screen", () => { onEndRide(); onClose(); })}
            {action(isFS ? "close" : "present", isFS ? "Exit full screen" : "Full screen", "", onFullscreen)}
            {action("tweaks", kiosk ? "Kiosk lock: on" : "Kiosk lock: off",
              "Keeps the app full screen, blocks Back and long-press menus", () => onKiosk(!kiosk), { on: kiosk })}
            {action("settings", "Change PIN", "", () => { setMode("set"); setMsg(""); })}
          </div>
        )}
      </div>
    </div>
  );
}
