"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Icon, type IconName } from "../../Icon";
import { STRINGS, type RequestKey, type TipKey } from "../strings";
import { remote, type RemoteCmd, type TabletState } from "./api";

// Amish's phone (roadmap P8): pair once with the 8-character code the tablet
// shows, then send New passenger / Nearly there / End ride and see the ride.
// English only — it's Amish's screen. Opened at /v5/remote.
// v5.23 (owner's feedback): the buttons sit at the top, where nothing on the
// page (like Vercel's preview toolbar) can cover them, and every tap reports
// back: Sending → Waiting for the tablet → Done on the tablet ✓, or why not.
const PHONE_KEY = "luxpro.v5.phone";
const EVERY_MS = 2500;
const STALE_S = 20;        // no news from the tablet for this long: show it as offline
const NO_PICKUP_MS = 15_000; // a command the tablet hasn't run by then gets a warning

type Pairing = { car: string; token: string };
type Note = { text: string; tone: "wait" | "ok" | "err" };
const en = STRINGS.en;
const LANG_NAME: Record<string, string> = { en: "English", es: "Spanish", ur: "Urdu" };
const REQUEST_ICON: Partial<Record<RequestKey, IconName>> = {
  charger: "plug", snacks: "cookie", wipes: "droplet", mints: "candy",
  fastest: "zap", motorway: "road", changeDest: "map-pin", bluetooth: "bluetooth",
};
const TIERS = ["bronze", "silver", "gold", "platinum", "diamond"] as const;

function requestName(k: string): string {
  if (k === "bluetooth") return "Connect phone to Bluetooth";
  return (en.requests as Record<string, string>)[k] ?? k;
}

function readPairing(): Pairing | null {
  try {
    const v = JSON.parse(localStorage.getItem(PHONE_KEY) || "null");
    return v && typeof v.car === "string" && typeof v.token === "string" ? v : null;
  } catch { return null; }
}

export default function RemotePage() {
  const [pairing, setPairing] = useState<Pairing | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [state, setState] = useState<TabletState | null>(null);
  const [age, setAge] = useState<number | null>(null);
  const [note, setNote] = useState<Note | null>(null);
  const [armed, setArmed] = useState(false);
  const [sending, setSending] = useState(false);
  const armTimer = useRef<ReturnType<typeof setTimeout>>();
  const pending = useRef<{ id: number; label: string; at: number; warned: boolean } | null>(null);

  useEffect(() => { setPairing(readPairing()); setLoaded(true); }, []);

  // The app's global style locks page scrolling (right for the tablet). The
  // phone must scroll, or buttons below the fold can't be reached (v5.23 bug).
  useEffect(() => {
    const els = [document.documentElement, document.body];
    const before = els.map((e) => [e.style.overflow, e.style.height]);
    els.forEach((e) => { e.style.overflow = "auto"; e.style.height = "auto"; });
    return () => els.forEach((e, i) => { e.style.overflow = before[i][0]; e.style.height = before[i][1]; });
  }, []);

  // Follow the tablet; confirm commands once the tablet reports running them.
  useEffect(() => {
    if (!pairing) return;
    let stop = false;
    let t: ReturnType<typeof setTimeout>;
    const tick = async () => {
      try {
        const r = await remote.phoneState(pairing.car, pairing.token);
        if (r === null) {
          setMsg("This phone was disconnected from the tablet. Pair it again.");
          setPairing(null);
          try { localStorage.removeItem(PHONE_KEY); } catch { /* fine */ }
          return;
        }
        const st = r.state && "stage" in r.state ? (r.state as TabletState) : null;
        if (st) setState(st);
        setAge(r.state_at ? Math.max(0, Math.round((Date.parse(r.now) - Date.parse(r.state_at)) / 1000)) : null);
        const p = pending.current;
        if (p && st && (st.lastCmd ?? 0) >= p.id) {
          setNote({ text: `${p.label}: done on the tablet ✓`, tone: "ok" });
          pending.current = null;
        } else if (p && !p.warned && Date.now() - p.at > NO_PICKUP_MS) {
          p.warned = true;
          setNote({ text: `${p.label}: the tablet hasn't picked it up yet. Is its screen on, with LuxPro open and online?`, tone: "err" });
        }
      } catch { setAge(null); }
      if (!stop) t = setTimeout(tick, EVERY_MS);
    };
    void tick();
    return () => { stop = true; clearTimeout(t); };
  }, [pairing]);

  async function pair() {
    const c = code.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
    if (c.length !== 8) { setMsg("The code has 8 letters and numbers."); return; }
    setBusy(true); setMsg("");
    try {
      const r = await remote.phonePair(c);
      if (!r) { setMsg("That code didn't work. Check it, or make a new one on the tablet."); return; }
      try { localStorage.setItem(PHONE_KEY, JSON.stringify(r)); } catch { /* storage blocked */ }
      setPairing(r); setCode("");
    } catch { setMsg("No connection. Check the phone's internet and try again."); }
    finally { setBusy(false); }
  }

  const send = useCallback(async (cmd: RemoteCmd, label: string) => {
    if (!pairing || sending) return;
    setSending(true);
    setNote({ text: `${label}: sending…`, tone: "wait" });
    try {
      const id = await remote.phoneSend(pairing.car, pairing.token, cmd);
      if (id === null) { setNote({ text: "Not sent: this phone isn't paired any more. Pair it again from the tablet.", tone: "err" }); return; }
      pending.current = { id, label, at: Date.now(), warned: false };
      setNote({ text: `${label}: sent · waiting for the tablet…`, tone: "wait" });
    } catch {
      setNote({ text: `${label}: not sent. No internet on this phone?`, tone: "err" });
    } finally { setSending(false); }
  }, [pairing, sending]);

  function newPassenger() {
    if (!armed) {
      setArmed(true);
      clearTimeout(armTimer.current);
      armTimer.current = setTimeout(() => setArmed(false), 4000);
      return;
    }
    clearTimeout(armTimer.current);
    setArmed(false);
    void send("new_passenger", "New passenger");
  }

  function forget() {
    try { localStorage.removeItem(PHONE_KEY); } catch { /* fine */ }
    setPairing(null); setState(null); setNote(null);
  }

  if (!loaded) return <div className="v5 v5-remote" />;

  if (!pairing) {
    return (
      <div className="v5 v5-remote" data-lang="en">
        <span className="v5-wordmark">LuxPro · Driver remote</span>
        <span className="v5-heading">Pair this phone</span>
        <ol className="v5-remote-steps">
          <li>On the tablet, hold the <b>LuxPro</b> name and enter your PIN.</li>
          <li>Tap <b>Connect phone</b>. The tablet shows an 8-character code.</li>
          <li>Type it here.</li>
        </ol>
        <input id="pair-code" className="v5-remote-code" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="ABCD-2345" maxLength={9} autoCapitalize="characters" autoComplete="off" spellCheck={false} inputMode="text" />
        <button className="v5-next" disabled={busy} onClick={pair}>{busy ? "Pairing…" : "Pair"}</button>
        {msg && <span className="v5-sub" role="status" style={{ color: "var(--i-red)" }}>{msg}</span>}
      </div>
    );
  }

  const live = age !== null && age <= STALE_S;
  const st = state;
  const stageText = !st ? "Waiting for the tablet…" : st.stage === "welcome" ? "Waiting for passenger" : st.stage === "ride" ? "Ride in progress" : "Ride ended · thank-you screen";
  const asked = st ? [...st.requests.map((k) => ({ key: k, icon: REQUEST_ICON[k as RequestKey] ?? ("comment" as IconName), text: requestName(k) })),
    ...(st.climate ? [{ key: "climate", icon: (st.climate === "cool" ? "snowflake" : "flame") as IconName, text: st.climate === "cool" ? "Make it cooler" : "Make it warmer" }] : [])] : [];
  const tierName = st && st.prize.tier >= 0 ? en.tiers[TIERS[st.prize.tier]] : "";

  return (
    <div className="v5 v5-remote" data-lang="en">
      <header className="v5-rm-head">
        <span className="v5-wordmark">LuxPro · Driver</span>
        <span className="v5-remote-live" data-live={live}>
          <i />{live ? "Tablet connected" : age === null ? "Connecting…" : `Tablet offline (${age}s)`}
        </span>
      </header>

      <section className="v5-rm-stage" data-stage={st?.stage ?? "none"}>
        <span className="v5-rm-stage-title">{stageText}</span>
        {st && st.stage !== "welcome" && <span className="v5-sub">Passenger language: {LANG_NAME[st.lang] ?? st.lang}</span>}
      </section>

      {/* Actions first: big, at the top, nothing can sit over them */}
      <section className="v5-rm-actions" aria-label="Send to the tablet">
        <button className="v5-rm-btn" disabled={sending} onClick={() => send("nearly", "Nearly there")}>
          <Icon name="map-pin" size={26} /><span>Nearly there</span>
        </button>
        <button className="v5-rm-btn" disabled={sending} onClick={() => send("end_ride", "End ride")}>
          <Icon name="hand" size={26} /><span>End ride</span>
        </button>
        <button className="v5-rm-btn v5-rm-wide" data-armed={armed} disabled={sending} onClick={newPassenger}>
          <Icon name="history" size={26} />
          <span>{armed ? "Tap again to clear the tablet" : "New passenger"}</span>
        </button>
      </section>
      {/* Tablet music volume, in 10% steps like the tablet's own − / + */}
      <section className="v5-rm-vol" aria-label="Tablet music volume">
        <button className="v5-rm-volbtn" disabled={sending || (st?.volume ?? 50) <= 0} aria-label="Music volume down" onClick={() => send("vol_down", "Volume down")}>
          <Icon name="minus" size={26} />
        </button>
        <span className="v5-rm-volmid">
          <span className="v5-caption">Music volume</span>
          <span className="v5-rm-volbar" aria-hidden>
            {Array.from({ length: 10 }, (_, i) => <i key={i} data-on={st?.volume !== undefined && i < Math.round(st.volume / 10)} />)}
          </span>
          <b dir="ltr">{st?.volume !== undefined ? `${st.volume}%` : "—"}</b>
        </span>
        <button className="v5-rm-volbtn" disabled={sending || (st?.volume ?? 50) >= 100} aria-label="Music volume up" onClick={() => send("vol_up", "Volume up")}>
          <Icon name="plus" size={26} />
        </button>
      </section>

      <div className="v5-rm-note" role="status" data-tone={note?.tone ?? "none"}>
        {note ? note.text : "Each button shows here when the tablet has done it."}
      </div>

      <section className="v5-remote-card">
        <span className="v5-caption">Passenger asked for</span>
        {asked.length === 0 ? (
          <span className="v5-sub">Nothing at the moment.</span>
        ) : (
          <ul className="v5-rm-asked">
            {asked.map((a) => <li key={a.key}><Icon name={a.icon} size={20} />{a.text}</li>)}
          </ul>
        )}
      </section>

      <dl className="v5-rm-facts">
        <div><dt>Tip</dt><dd>{st?.tip ? `${en.tip[st.tip as TipKey]?.label ?? st.tip} · ${en.tip[st.tip as TipKey]?.sub ?? ""}` : "None yet"}</dd></div>
        <div><dt>Quiz prize</dt><dd>{!st ? "—" : st.prize.status === "claimed" ? `${tierName} won (${st.prize.correct} correct)` : `${st.prize.correct} correct`}</dd></div>
        <div><dt>Music</dt><dd>{st?.music.title ? `${st.music.playing ? "Playing" : "Paused"} · ${st.music.title}` : "Nothing playing"}</dd></div>
      </dl>

      <button className="v5-rm-unpair" onClick={forget}>Unpair this phone</button>
    </div>
  );
}
