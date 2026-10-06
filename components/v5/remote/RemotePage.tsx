"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Icon, type IconName } from "../../Icon";
import { STRINGS, type RequestKey, type TipKey } from "../strings";
import Wordmark from "../Wordmark";
import { remote, type RemoteCmd, type TabletState } from "./api";

// Amish's phone (roadmap P8): pair once with the 8-character code the tablet
// shows, then send New passenger / Nearly there / End ride and see the ride.
// English only — it's Amish's screen. Opened at /v5/remote.
// v5.23 (owner's feedback): the buttons sit at the top, where nothing on the
// page (like Vercel's preview toolbar) can cover them, and every tap reports
// back: Sending → Waiting for the tablet → Done on the tablet ✓, or why not.
// v5.26 (owner): just two big buttons (v5.29: New passenger on top). End trip runs the drop-off chain on
// the tablet (nearly there now, thank-you screen 2 minutes later, with a
// countdown and Cancel here); New passenger resets it for the next ride.
const PHONE_KEY = "luxpro.v5.phone";
const EVERY_MS = 2500;
const STALE_S = 20;        // no news from the tablet for this long: show it as offline
const NO_PICKUP_MS = 15_000; // a command the tablet hasn't run by then gets a warning
const EXPIRE_MS = 120_000;
// The button Amish pressed stays highlighted, then fades (Amish, v5.37):
// gold ring when sent, plus a check once the tablet has done it.
const LIT_MS = 15_000;    // the server drops commands after 2 minutes (luxpro_tablet_sync2)

/** "40 s" / "3 min": how long the tablet has been silent, in words (v5.31). */
function since(s: number): string {
  return s < 90 ? `${s} s` : `${Math.round(s / 60)} min`;
}

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
  const [unpairArmed, setUnpairArmed] = useState(false); // "Unpair" needs a second tap (v5.31)
  const [reloadArmed, setReloadArmed] = useState(false); // "Refresh tablet" too: it clears the ride (v5.36)
  const [sending, setSending] = useState(false);
  const armTimer = useRef<ReturnType<typeof setTimeout>>();
  const pending = useRef<{ id: number; cmd: RemoteCmd; label: string; at: number; warned: boolean } | null>(null);
  const [lit, setLit] = useState<{ cmd: RemoteCmd; state: "sent" | "done" } | null>(null);
  useEffect(() => {
    if (!lit) return;
    const t = setTimeout(() => setLit(null), LIT_MS);
    return () => clearTimeout(t);
  }, [lit]);
  const litOf = (c: RemoteCmd) => (lit?.cmd === c ? lit.state : undefined);
  const doneMark = (c: RemoteCmd) => litOf(c) === "done" && <span className="v5-rm-tick" aria-hidden><Icon name="check" size={14} /></span>;
  const [endsAt, setEndsAt] = useState<number | null>(null); // phone clock: thank-you screen time
  const [, tick] = useState(0);
  useEffect(() => {
    if (!endsAt) return;
    const t = setInterval(() => tick((n) => n + 1), 1000);
    return () => clearInterval(t);
  }, [endsAt]);

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
      clearTimeout(t);
      if (document.visibilityState !== "visible") return; // phone screen off: no data used
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
        const ageS = r.state_at ? Math.max(0, Math.round((Date.parse(r.now) - Date.parse(r.state_at)) / 1000)) : null;
        setAge(ageS);
        if (st) setEndsAt(st.endingIn != null && st.endingIn > 0 ? Date.now() + (st.endingIn - (ageS ?? 0)) * 1000 : null);
        const p = pending.current;
        if (p && st && (st.lastCmd ?? 0) >= p.id) {
          setNote({ text: `${p.label}: done on the tablet ✓`, tone: "ok" });
          setLit({ cmd: p.cmd, state: "done" });
          pending.current = null;
        } else if (p && Date.now() - p.at > EXPIRE_MS) {
          setNote({ text: `${p.label}: not done. The tablet was offline for 2 minutes. Tap again if it's still needed.`, tone: "err" });
          setLit(null);
          pending.current = null;
        } else if (p && !p.warned && Date.now() - p.at > NO_PICKUP_MS) {
          p.warned = true;
          setNote({ text: `${p.label}: the tablet hasn't picked it up yet. Is its screen on, with LuxPro open and online?`, tone: "err" });
        }
      } catch { setAge(null); }
      if (!stop) t = setTimeout(tick, EVERY_MS);
    };
    const onShow = () => { if (document.visibilityState === "visible" && !stop) void tick(); };
    document.addEventListener("visibilitychange", onShow);
    void tick();
    return () => { stop = true; clearTimeout(t); document.removeEventListener("visibilitychange", onShow); };
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
      pending.current = { id, cmd, label, at: Date.now(), warned: false };
      setLit({ cmd, state: "sent" });
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

  function refreshTablet() {
    if (!reloadArmed) {
      setReloadArmed(true);
      setTimeout(() => setReloadArmed(false), 4000);
      return;
    }
    setReloadArmed(false);
    void send("reload", "Refresh tablet");
  }

  function forget() {
    if (!unpairArmed) {
      setUnpairArmed(true);
      setTimeout(() => setUnpairArmed(false), 4000);
      return;
    }
    setUnpairArmed(false);
    try { localStorage.removeItem(PHONE_KEY); } catch { /* fine */ }
    setPairing(null); setState(null); setNote(null);
  }

  if (!loaded) return <div className="v5 v5-remote" />;

  if (!pairing) {
    return (
      <div className="v5 v5-remote" data-lang="en">
        <span className="v5-wordmark"><Wordmark width={150} /></span>
        <span className="v5-caption">Driver remote</span>
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
      {/* One compact status line (owner, v5.27): tablet dot, ride dot, language */}
      <header className="v5-rm-head">
        <span className="v5-wordmark"><Wordmark width={104} /></span>
        <span className="v5-rm-status">
          {/* Words, not just colours (v5.31): phones never show title tooltips */}
          <span className="v5-rm-dot" data-tone={live ? "ok" : age === null ? "wait" : "bad"}>
            <i />{live ? "Tablet" : age === null ? "Connecting…" : `Offline ${since(age)}`}
          </span>
          <span className="v5-rm-dot" data-tone={!st ? "wait" : endsAt ? "gold" : st.stage === "ride" ? "ok" : "idle"}
            title={stageText}>
            <i />{!st || st.stage === "ride" || endsAt ? "Ride" : st.stage === "welcome" ? "Waiting" : "Ended"}
          </span>
          <span className="v5-rm-lang" title={st ? `Passenger language: ${LANG_NAME[st.lang] ?? st.lang}` : ""}>
            {st ? st.lang.toUpperCase() : "—"}
          </span>
        </span>
      </header>

      {/* Three buttons again (Amish, v5.37): New passenger on top, then Nearly
          there and End ride side by side — each acts the moment it's pressed,
          as in v5.25. A countdown started from the tablet's Driver panel
          still shows here with Cancel. */}
      <section className="v5-rm-actions" aria-label="Send to the tablet">
        <button className="v5-rm-btn v5-rm-wide v5-rm-big" data-armed={armed} data-lit={litOf("new_passenger")} disabled={sending} onClick={newPassenger}>
          {doneMark("new_passenger")}
          <Icon name="history" size={30} />
          <span className="v5-rm-btn-text">
            <span>{armed ? "Tap again to clear the tablet" : "New passenger"}</span>
            <small>{armed ? "Clears everything and shows Welcome" : "Restart the tablet for the next ride"}</small>
          </span>
        </button>
        {endsAt ? (
          <div className="v5-rm-ending">
            <span className="v5-rm-ending-t">
              <Icon name="hand" size={26} />
              Thank-you screen in {(() => { const left = Math.max(0, Math.round((endsAt - Date.now()) / 1000)); return `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`; })()}
            </span>
            <button className="v5-pill" data-lit={litOf("cancel_end")} disabled={sending} onClick={() => send("cancel_end", "Cancel end of trip")}>Cancel</button>
          </div>
        ) : (
          <>
            <button className="v5-rm-btn v5-rm-half" data-lit={litOf("nearly")} disabled={sending || st?.stage !== "ride"} onClick={() => send("nearly", "Nearly there")}>
              {doneMark("nearly")}
              <Icon name="map-pin" size={28} />
              <span className="v5-rm-btn-text">
                <span>Nearly there</span>
                <small>Banner + voice</small>
              </span>
            </button>
            <button className="v5-rm-btn v5-rm-half" data-lit={litOf("end_ride")} disabled={sending || st?.stage === "farewell"} onClick={() => send("end_ride", "End ride")}>
              {doneMark("end_ride")}
              <Icon name="hand" size={28} />
              <span className="v5-rm-btn-text">
                <span>End ride</span>
                <small>Thank-you screen</small>
              </span>
            </button>
          </>
        )}
      </section>

      {/* Tablet music volume, in 10% steps like the tablet's own − / + */}
      <section className="v5-rm-vol" aria-label="Tablet music volume">
        <button className="v5-rm-volbtn" data-lit={litOf("vol_down")} disabled={sending || (st?.volume ?? 50) <= 0} aria-label="Music volume down" onClick={() => send("vol_down", "Volume down")}>
          <Icon name="minus" size={26} />
        </button>
        <span className="v5-rm-volmid">
          <span className="v5-caption">Music volume</span>
          <span className="v5-rm-volbar" aria-hidden>
            {Array.from({ length: 10 }, (_, i) => <i key={i} data-on={st?.volume !== undefined && i < Math.round(st.volume / 10)} />)}
          </span>
          <b dir="ltr">{st?.volume !== undefined ? `${st.volume}%` : "—"}</b>
        </span>
        <button className="v5-rm-volbtn" data-lit={litOf("vol_up")} disabled={sending || (st?.volume ?? 50) >= 100} aria-label="Music volume up" onClick={() => send("vol_up", "Volume up")}>
          <Icon name="plus" size={26} />
        </button>
      </section>

      <div className="v5-rm-note" role="status" data-tone={note?.tone ?? "none"}>
        {note ? note.text : "Each button shows here when the tablet has done it."}
      </div>

      {/* What the passenger asked for: icons only, one row (owner, v5.28) */}
      <section className="v5-rm-row" aria-label="Passenger asked for">
        <span className="v5-caption">Asked</span>
        {asked.length === 0 ? (
          <span className="v5-sub">Nothing</span>
        ) : (
          <ul className="v5-rm-icons">
            {asked.map((a) => (
              <li key={a.key} title={a.text} aria-label={a.text}><Icon name={a.icon} size={22} /></li>
            ))}
          </ul>
        )}
      </section>

      {/* Tip · quiz prize · music in one row of three small cells */}
      <dl className="v5-rm-mini">
        <div title={st?.tip ? `Tip: ${en.tip[st.tip as TipKey]?.label} (${en.tip[st.tip as TipKey]?.sub})` : "No tip yet"}>
          <dt><Icon name="cash" size={18} /><span className="v5-sr">Tip</span></dt>
          <dd>{st?.tip ? en.tip[st.tip as TipKey]?.label ?? st.tip : "—"}</dd>
        </div>
        <div title={st ? (st.prize.status === "claimed" ? `Quiz prize won: ${tierName} (${st.prize.correct} correct)` : `Quiz: ${st.prize.correct} correct answers`) : "Quiz"}>
          <dt><Icon name="lightbulb" size={18} /><span className="v5-sr">Quiz prize</span></dt>
          <dd>{!st ? "—" : st.prize.status === "claimed" ? tierName : `${en.quizShort} ${st.prize.correct}/${[5, 10, 15, 20, 25].find((t) => t > st.prize.correct) ?? 25}`}</dd>
        </div>
        <div title={st?.music.title ? `${st.music.playing ? "Playing" : "Paused"}: ${st.music.title}` : "Nothing playing"}>
          <dt><Icon name="music-note" size={18} /><span className="v5-sr">Music</span></dt>
          <dd>{st?.music.title ? (st.music.playing ? "Playing" : "Paused") : "—"}</dd>
        </div>
      </dl>

      {/* Refresh the tablet from here when it seems stuck (owner, v5.36) */}
      <div className="v5-rm-foot">
        <button className="v5-pill v5-rm-refresh" data-armed={reloadArmed} data-lit={litOf("reload")} disabled={sending} onClick={refreshTablet}>
          {doneMark("reload")}
          <Icon name="refresh" size={18} />{reloadArmed ? "Tap again to refresh" : "Refresh tablet"}
        </button>
        <button className="v5-rm-unpair" data-armed={unpairArmed} onClick={forget}>
          {unpairArmed ? "Tap again to unpair" : "Unpair this phone"}
        </button>
      </div>
    </div>
  );
}
