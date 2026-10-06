"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { remote, randomHex, type RemoteCmd, type TabletState } from "./api";

// Tablet side of Amish's phone remote. Nothing goes online until Amish taps
// "Connect phone" in the Driver panel; from then on the tablet checks in
// every few seconds: it reports the ride (stage, requests, tip, music) and
// picks up his commands, which run exactly like the Driver panel buttons.
const ID_KEY = "luxpro.v5.remote";
const ACK_KEY = "luxpro.v5.remoteAck"; // last command id run, kept across reloads (v5.31)
const EVERY_MS = 3000;
const BACKOFF_MS = 10_000;
// No phone paired: check in rarely (v5.31, council: ~1,200 calls an hour for
// nothing). Fast again while a pairing code is on screen.
const UNPAIRED_MS = 30_000;
const PAIRING_WINDOW_MS = 10 * 60_000;

type Identity = { car: string; secret: string };

function readId(): Identity | null {
  try {
    const v = JSON.parse(localStorage.getItem(ID_KEY) || "null");
    return v && typeof v.car === "string" && typeof v.secret === "string" ? v : null;
  } catch { return null; }
}

function readAck(): number {
  try { return Number(localStorage.getItem(ACK_KEY)) || 0; } catch { return 0; }
}

export function useRemote(state: TabletState, onCommand: (cmd: RemoteCmd) => void) {
  const [id, setId] = useState<Identity | null>(null);
  const [paired, setPaired] = useState(false);
  const [online, setOnline] = useState(false);
  const stateRef = useRef(state);
  stateRef.current = state;
  const cmdRef = useRef(onCommand);
  cmdRef.current = onCommand;
  const seen = useRef(new Set<number>());
  const lastCmd = useRef(0);           // reported back so the phone can show "Done", and acked to the server
  const pairingUntil = useRef(0);      // a pairing code is on screen until then
  const kick = useRef<() => void>(() => {}); // check in now instead of waiting
  const pairing = useRef<Promise<string | null> | null>(null); // one Connect at a time

  useEffect(() => { setId(readId()); lastCmd.current = readAck(); }, []);

  // Check in on a timer while the tablet is in use.
  useEffect(() => {
    if (!id) return;
    let stop = false;
    let t: ReturnType<typeof setTimeout>;
    let busy = false;
    const tick = async () => {
      if (stop || busy) return;
      busy = true;
      let wait = EVERY_MS;
      if (document.visibilityState === "visible") {
        try {
          const st = stateRef.current;
          const endingIn = st.endAt ? Math.max(0, Math.round((st.endAt - Date.now()) / 1000)) : null;
          const r = await remote.sync2(id.car, id.secret, { ...st, endingIn, lastCmd: lastCmd.current }, lastCmd.current);
          if (r) {
            setOnline(true);
            setPaired(r.paired);
            for (const c of r.commands) {
              if (seen.current.has(c.id) || c.id <= lastCmd.current) continue;
              seen.current.add(c.id);
              // Saved before running it: "reload" restarts the page and must
              // not run a second time when the tablet comes back (v5.36)
              lastCmd.current = Math.max(lastCmd.current, c.id);
              try { localStorage.setItem(ACK_KEY, String(lastCmd.current)); } catch { /* storage blocked */ }
              cmdRef.current(c.cmd);
            }
            if (!r.paired && Date.now() > pairingUntil.current) wait = UNPAIRED_MS;
          } else { setOnline(false); wait = BACKOFF_MS; }
        } catch { setOnline(false); wait = BACKOFF_MS; }
      }
      busy = false;
      clearTimeout(t);
      if (!stop) t = setTimeout(tick, wait);
    };
    kick.current = () => { clearTimeout(t); void tick(); };
    void tick();
    return () => { stop = true; clearTimeout(t); kick.current = () => {}; };
  }, [id]);

  /** First time: give this tablet an id and secret; then get a pairing code. */
  const pairCode = useCallback((): Promise<string | null> => {
    // A double tap on "Connect phone" used to register the tablet twice.
    if (pairing.current) return pairing.current;
    pairingUntil.current = Date.now() + PAIRING_WINDOW_MS;
    pairing.current = makeCode().finally(() => { pairing.current = null; kick.current(); });
    return pairing.current;
  }, []);

  async function makeCode(): Promise<string | null> {
    let me = readId();
    if (!me) {
      me = { car: crypto.randomUUID(), secret: randomHex(32) };
      if (!(await remote.register(me.car, me.secret))) return null;
      try { localStorage.setItem(ID_KEY, JSON.stringify(me)); } catch { /* storage blocked */ }
      setId(me);
    }
    return remote.pairCode(me.car, me.secret);
  }

  const unpair = useCallback(async () => {
    const me = readId();
    if (me) await remote.unpair(me.car, me.secret).catch(() => {});
    setPaired(false);
  }, []);

  return { enabled: !!id, paired, online, pairCode, unpair };
}
