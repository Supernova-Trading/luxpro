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
const LOCK_KEY = "luxpro.v5.driverLock"; // wrong-PIN count survives a reload (v5.30)
const MAX_TRIES = 5;
const LOCKOUT_MS = 30_000;
// The panel closes itself if left open, so a passenger can't reach it
// (council 2026-10-06). Longer while a phone code is on screen to be typed.
const IDLE_MS = 60_000;
const IDLE_PAIRING_MS = 180_000;

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

type Lock = { tries: number; until: number };
function readLock(): Lock {
  try {
    const v = JSON.parse(localStorage.getItem(LOCK_KEY) || "null");
    if (v && typeof v.tries === "number" && typeof v.until === "number") return v;
  } catch { /* storage blocked */ }
  return { tries: 0, until: 0 };
}
function writeLock(l: Lock) {
  try { localStorage.setItem(LOCK_KEY, JSON.stringify(l)); } catch { /* storage blocked */ }
}

export type RideStage = "welcome" | "ride" | "farewell";

export interface PhoneLink {
  paired: boolean;
  online: boolean;
  pairCode: () => Promise<string | null>;
  unpair: () => Promise<void>;
}

export default function Driver({ stage, isFS, kiosk, phone, endAt, onClose, onNewPassenger, onEndTrip, onCancelEnd, onFullscreen, onKiosk }: {
  stage: RideStage;
  phone: PhoneLink;
  isFS: boolean;
  kiosk: boolean;
  onClose: () => void;
  onNewPassenger: () => void;
  endAt: number | null;
  onEndTrip: () => void;
  onCancelEnd: () => void;
  onFullscreen: () => void;
  onKiosk: (on: boolean) => void;
}) {
  const [mode, setMode] = useState<"enter" | "verify" | "set" | "confirm" | "panel">(() => (readPin() ? "enter" : "set"));
  const [pin, setPin] = useState("");
  const [first, setFirst] = useState("");
  const [msg, setMsg] = useState("");
  const [armed, setArmed] = useState(false); // "New passenger" needs a second tap
  const [pairing, setPairing] = useState<string | null>(null); // code on screen
  const [pairMsg, setPairMsg] = useState("");
  const [touched, setTouched] = useState(() => Date.now());
  const [, tickNow] = useState(0); // re-render each second while the End-trip countdown runs
  useEffect(() => {
    if (!endAt) return;
    const t = setInterval(() => tickNow((n) => n + 1), 1000);
    return () => clearInterval(t);
  }, [endAt]);
  const left = endAt ? Math.max(0, Math.round((endAt - Date.now()) / 1000)) : 0;
  const mmss = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`;

  // Close after a quiet minute, and whenever the ride stage changes underneath
  // (e.g. Amish's phone ended the trip or started a new passenger).
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const t = setTimeout(() => closeRef.current(), pairing && !phone.paired ? IDLE_PAIRING_MS : IDLE_MS);
    return () => clearTimeout(t);
  }, [touched, pairing, phone.paired]);
  // (Not on Welcome carrying on into the ride by itself after 30 s, which
  // would snatch the panel from Amish mid-setup.)
  const lastStage = useRef(stage);
  useEffect(() => {
    const was = lastStage.current;
    lastStage.current = stage;
    if (stage !== was && !(was === "welcome" && stage === "ride")) closeRef.current();
  }, [stage]);

  useEffect(() => {
    if (!armed) return;
    const t = setTimeout(() => setArmed(false), 3000);
    return () => clearTimeout(t);
  }, [armed]);

  async function submit(code: string) {
    if (mode === "enter" || mode === "verify") {
      const lock = readLock();
      if (Date.now() < lock.until) { setMsg("Too many tries. Wait 30 seconds."); setPin(""); return; }
      if ((await hashPin(code)) === readPin()) {
        writeLock({ tries: 0, until: 0 });
        setMode(mode === "verify" ? "set" : "panel"); setMsg("");
      } else {
        const tries = lock.tries + 1;
        writeLock(tries >= MAX_TRIES ? { tries: 0, until: Date.now() + LOCKOUT_MS } : { tries, until: 0 });
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

  const title = mode === "enter" ? "Driver PIN" : mode === "verify" ? "Enter the current PIN" : mode === "set" ? "Set a 4-digit driver PIN" : mode === "confirm" ? "Enter the PIN again" : "Driver";

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
    <div className="v5-drv" role="dialog" aria-label={title} dir="ltr" data-lang="en" onPointerDown={() => setTouched(Date.now())}>
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
              {msg || (mode === "set" ? "Only Amish should know it." : mode === "verify" ? "Needed before choosing a new one." : "")}
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
              () => { if (armed) { setArmed(false); onClose(); onNewPassenger(); } else setArmed(true); }, { gold: armed })}
            {endAt
              ? action("hand", `Thank-you screen in ${mmss}`, "Tap to cancel the end of the trip", () => { onCancelEnd(); }, { gold: true })
              : action("hand", "End trip", "Nearly there now · thank-you screen 2 minutes later", () => { onClose(); onEndTrip(); })}
            {action(isFS ? "close" : "present", isFS ? "Exit full screen" : "Full screen", "", onFullscreen)}
            {action("tweaks", kiosk ? "Kiosk lock: on" : "Kiosk lock: off",
              "Keeps the app full screen, blocks Back and long-press menus", () => onKiosk(!kiosk), { on: kiosk })}
            {phone.paired ? (
              action("phone", "Amish's phone: connected", phone.online ? "Tap to disconnect it" : "Tablet offline right now · tap to disconnect",
                () => { void phone.unpair(); setPairing(null); }, { on: true })
            ) : (
              action("phone", "Connect phone", "Control rides from Amish's phone",
                async () => {
                  setPairMsg("Getting a code…");
                  try {
                    const c = await phone.pairCode();
                    setPairing(c); setPairMsg(c ? "" : "Couldn't get a code. Check the tablet's internet.");
                  } catch { setPairMsg("No internet connection."); }
                })
            )}
            {pairing && !phone.paired && (
              <div className="v5-drv-pair">
                <span className="v5-sub">On Amish's phone open</span>
                <b dir="ltr">{typeof window !== "undefined" ? `${window.location.origin}/v5/remote` : "/v5/remote"}</b>
                <span className="v5-sub">and type this code (valid 10 minutes):</span>
                <span className="v5-drv-code" dir="ltr">{pairing.slice(0, 4)}-{pairing.slice(4)}</span>
              </div>
            )}
            {pairMsg && <span className="v5-sub" role="status">{pairMsg}</span>}
            {action("settings", "Change PIN", "Asks for the current PIN first", () => { setMode("verify"); setMsg(""); })}
          </div>
        )}
      </div>
    </div>
  );
}
