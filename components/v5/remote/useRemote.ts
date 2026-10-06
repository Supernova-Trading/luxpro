"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { remote, randomHex, type RemoteCmd, type TabletState } from "./api";

// Tablet side of Amish's phone remote. Nothing goes online until Amish taps
// "Connect phone" in the Driver panel; from then on the tablet checks in
// every few seconds: it reports the ride (stage, requests, tip, music) and
// picks up his commands, which run exactly like the Driver panel buttons.
const ID_KEY = "luxpro.v5.remote";
const EVERY_MS = 3000;
const BACKOFF_MS = 10_000;

type Identity = { car: string; secret: string };

function readId(): Identity | null {
  try {
    const v = JSON.parse(localStorage.getItem(ID_KEY) || "null");
    return v && typeof v.car === "string" && typeof v.secret === "string" ? v : null;
  } catch { return null; }
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
  const lastCmd = useRef(0);           // reported back so the phone can show "Done"
  const pairing = useRef<Promise<string | null> | null>(null); // one Connect at a time

  useEffect(() => { setId(readId()); }, []);

  // Check in on a timer while the tablet is in use.
  useEffect(() => {
    if (!id) return;
    let stop = false;
    let t: ReturnType<typeof setTimeout>;
    const tick = async () => {
      if (stop) return;
      let wait = EVERY_MS;
      if (document.visibilityState === "visible") {
        try {
          const st = stateRef.current;
          const endingIn = st.endAt ? Math.max(0, Math.round((st.endAt - Date.now()) / 1000)) : null;
          const r = await remote.sync(id.car, id.secret, { ...st, endingIn, lastCmd: lastCmd.current });
          if (r) {
            setOnline(true);
            setPaired(r.paired);
            for (const c of r.commands) {
              if (seen.current.has(c.id)) continue;
              seen.current.add(c.id);
              cmdRef.current(c.cmd);
              lastCmd.current = Math.max(lastCmd.current, c.id);
            }
          } else { setOnline(false); wait = BACKOFF_MS; }
        } catch { setOnline(false); wait = BACKOFF_MS; }
      }
      t = setTimeout(tick, wait);
    };
    void tick();
    return () => { stop = true; clearTimeout(t); };
  }, [id]);

  /** First time: give this tablet an id and secret; then get a pairing code. */
  const pairCode = useCallback((): Promise<string | null> => {
    // A double tap on "Connect phone" used to register the tablet twice.
    if (pairing.current) return pairing.current;
    pairing.current = makeCode().finally(() => { pairing.current = null; });
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
