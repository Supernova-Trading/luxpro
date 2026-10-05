"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Icon, type IconName } from "../../Icon";
import { STRINGS, type RequestKey, type TipKey } from "../strings";
import { remote, type RemoteCmd, type TabletState } from "./api";

// Amish's phone (roadmap P8): pair once with the 8-character code the tablet
// shows, then see the ride and send New passenger / Nearly there / End ride.
// English only — it's Amish's screen. Opened at /v5/remote.
const PHONE_KEY = "luxpro.v5.phone";
const EVERY_MS = 3000;
const STALE_S = 20; // no news from the tablet for this long: show it as offline

type Pairing = { car: string; token: string };
const en = STRINGS.en;
const LANG_NAME: Record<string, string> = { en: "English", es: "Spanish", ur: "Urdu" };
const REQUEST_ICON: Partial<Record<RequestKey, IconName>> = {
  charger: "plug", snacks: "cookie", wipes: "droplet", mints: "candy",
  fastest: "zap", motorway: "road", changeDest: "map-pin", bluetooth: "bluetooth",
};

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
  const [sent, setSent] = useState<string>("");
  const [armed, setArmed] = useState(false);
  const armTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => { setPairing(readPairing()); setLoaded(true); }, []);

  // Follow the tablet every few seconds.
  useEffect(() => {
    if (!pairing) return;
    let stop = false;
    let t: ReturnType<typeof setTimeout>;
    const tick = async () => {
      try {
        const r = await remote.phoneState(pairing.car, pairing.token);
        if (r === null) { setMsg("This phone was disconnected from the tablet. Pair again."); setPairing(null); try { localStorage.removeItem(PHONE_KEY); } catch { /* fine */ } return; }
        if (r.state && "stage" in r.state) setState(r.state as TabletState);
        setAge(r.state_at ? Math.max(0, Math.round((Date.parse(r.now) - Date.parse(r.state_at)) / 1000)) : null);
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
    if (!pairing) return;
    try {
      const ok = await remote.phoneCommand(pairing.car, pairing.token, cmd);
      setSent(ok ? `${label}: sent. The tablet shows it within a few seconds.` : "Not sent: this phone isn't paired any more.");
    } catch { setSent("Not sent: no connection."); }
  }, [pairing]);

  function newPassenger() {
    if (!armed) {
      setArmed(true);
      clearTimeout(armTimer.current);
      armTimer.current = setTimeout(() => setArmed(false), 3000);
      return;
    }
    setArmed(false);
    void send("new_passenger", "New passenger");
  }

  function forget() {
    try { localStorage.removeItem(PHONE_KEY); } catch { /* fine */ }
    setPairing(null); setState(null);
  }

  if (!loaded) return <div className="v5 v5-remote" />;

  if (!pairing) {
    return (
      <div className="v5 v5-remote" data-lang="en">
        <span className="v5-wordmark">LuxPro · Driver remote</span>
        <span className="v5-heading">Pair this phone</span>
        <ol className="v5-remote-steps">
          <li>On the tablet, hold the <b>LuxPro</b> name, enter your PIN.</li>
          <li>Tap <b>Connect phone</b>. The tablet shows an 8-character code.</li>
          <li>Type it here.</li>
        </ol>
        <input className="v5-remote-code" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="ABCD-2345" maxLength={9} autoCapitalize="characters" autoComplete="off" spellCheck={false} inputMode="text" />
        <button className="v5-next" disabled={busy} onClick={pair}>{busy ? "Pairing…" : "Pair"}</button>
        {msg && <span className="v5-sub" role="status" style={{ color: "var(--i-red)" }}>{msg}</span>}
      </div>
    );
  }

  const live = age !== null && age <= STALE_S;
  const st = state;
  const tierName = st && st.prize.tier >= 0 ? en.tiers[(["bronze", "silver", "gold", "platinum", "diamond"] as const)[st.prize.tier]] : "";

  return (
    <div className="v5 v5-remote" data-lang="en">
      <div className="v5-remote-top">
        <span className="v5-wordmark">LuxPro · Driver remote</span>
        <span className="v5-remote-live" data-live={live}>
          <i />{live ? "Tablet connected" : age === null ? "Waiting for the tablet…" : `Tablet offline (${age}s)`}
        </span>
      </div>

      <section className="v5-remote-card">
        <span className="v5-caption">Ride</span>
        <span className="v5-title">
          {!st ? "—" : st.stage === "welcome" ? "Waiting for passenger" : st.stage === "ride" ? "In progress" : "Ended · thank-you screen"}
        </span>
        {st && st.stage !== "welcome" && <span className="v5-sub">Passenger language: {LANG_NAME[st.lang] ?? st.lang}</span>}
      </section>

      <section className="v5-remote-card">
        <span className="v5-caption">Passenger asked for</span>
        {!st || (st.requests.length === 0 && !st.climate) ? (
          <span className="v5-sub">Nothing at the moment.</span>
        ) : (
          <ul className="v5-remote-list">
            {st.requests.map((k) => (
              <li key={k}><Icon name={REQUEST_ICON[k as RequestKey] ?? "comment"} size={20} style={{ color: "var(--gold)" }} />{requestName(k)}</li>
            ))}
            {st.climate && <li><Icon name={st.climate === "cool" ? "snowflake" : "flame"} size={20} style={{ color: "var(--gold)" }} />{st.climate === "cool" ? "Make it cooler" : "Make it warmer"}</li>}
          </ul>
        )}
      </section>

      <section className="v5-remote-card v5-remote-two">
        <div>
          <span className="v5-caption">Tip</span>
          <span className="v5-label">{st?.tip ? `${en.tip[st.tip as TipKey]?.label ?? st.tip} (${en.tip[st.tip as TipKey]?.sub ?? ""})` : "None yet"}</span>
        </div>
        <div>
          <span className="v5-caption">Quiz prize</span>
          <span className="v5-label">
            {!st ? "—" : st.prize.status === "claimed" ? `Won: ${tierName} (${st.prize.correct} correct)` : `${st.prize.correct} correct`}
          </span>
        </div>
      </section>

      <section className="v5-remote-card">
        <span className="v5-caption">Music</span>
        <span className="v5-label">{st?.music.title ? `${st.music.playing ? "Playing" : "Paused"} · ${st.music.title}` : "Nothing playing"}</span>
      </section>

      <div className="v5-remote-actions">
        <button className="v5-drv-btn" onClick={() => send("nearly", "Nearly there")}>
          <Icon name="map-pin" size={24} /><span className="v5-label" style={{ color: "inherit" }}>Nearly there</span>
        </button>
        <button className="v5-drv-btn" onClick={() => send("end_ride", "End ride")}>
          <Icon name="hand" size={24} /><span className="v5-label" style={{ color: "inherit" }}>End ride (thank-you screen)</span>
        </button>
        <button className="v5-drv-btn" data-gold={armed} onClick={newPassenger}>
          <Icon name="history" size={24} />
          <span className="v5-label" style={{ color: "inherit" }}>{armed ? "Tap again to clear the tablet" : "New passenger"}</span>
        </button>
      </div>
      {sent && <span className="v5-sub" role="status">{sent}</span>}
      <button className="v5-pill" style={{ alignSelf: "center" }} onClick={forget}>Unpair this phone</button>
    </div>
  );
}
