// Amish's phone remote (roadmap P8) — the small online link between his phone
// and the tablet. Supabase project "luxpro-remote" (London, free plan),
// created 2026-10-05. The key below is the *publishable* key: it is meant to
// be in the browser. The database tables are closed; this key can only call
// the luxpro_* functions, and each of those checks a secret (the tablet's
// own, or the phone's token from pairing). No npm package: plain fetch.
const URL = "https://crfgevfebyabskxpyobi.supabase.co";
const KEY = "sb_publishable__VjklvtFLFpujMpOyIHdHQ_ucilxNrv";

async function rpc<T>(fn: string, args: Record<string, unknown>): Promise<T> {
  const r = await fetch(`${URL}/rest/v1/rpc/${fn}`, {
    method: "POST",
    headers: { apikey: KEY, "Content-Type": "application/json" },
    body: JSON.stringify(args),
    cache: "no-store",
  });
  if (!r.ok) throw new Error(`${fn}: HTTP ${r.status}`);
  return r.json() as Promise<T>;
}

export type RemoteCmd = "new_passenger" | "nearly" | "end_ride" | "vol_up" | "vol_down";

/** What the tablet tells the phone, every few seconds. */
export interface TabletState {
  stage: "welcome" | "ride" | "farewell";
  lang: string;
  requests: string[];
  climate: "cool" | "warm" | null;
  tip: string | null;
  prize: { correct: number; status: string; tier: number };
  music: { source: string; title: string; playing: boolean };
  lastCmd?: number; // id of the last phone command the tablet ran (v5.23)
  volume?: number;  // music volume 0-100 (v5.25)
}

export const remote = {
  register: (car: string, secret: string) => rpc<boolean>("luxpro_tablet_register", { p_car: car, p_secret: secret }),
  pairCode: (car: string, secret: string) => rpc<string | null>("luxpro_pair_code", { p_car: car, p_secret: secret }),
  unpair: (car: string, secret: string) => rpc<boolean>("luxpro_tablet_unpair", { p_car: car, p_secret: secret }),
  sync: (car: string, secret: string, state: TabletState) =>
    rpc<{ commands: { id: number; cmd: RemoteCmd }[]; paired: boolean } | null>("luxpro_tablet_sync", { p_car: car, p_secret: secret, p_state: state }),
  phonePair: (code: string) => rpc<{ car: string; token: string } | null>("luxpro_phone_pair", { p_code: code }),
  phoneCommand: (car: string, token: string, cmd: RemoteCmd) => rpc<boolean>("luxpro_phone_command", { p_car: car, p_token: token, p_cmd: cmd }),
  /** Like phoneCommand, but returns the command's id (null = not paired) so the phone can wait for the tablet. */
  phoneSend: (car: string, token: string, cmd: RemoteCmd) => rpc<number | null>("luxpro_phone_send", { p_car: car, p_token: token, p_cmd: cmd }),
  phoneState: (car: string, token: string) =>
    rpc<{ state: TabletState | Record<string, never>; state_at: string | null; now: string } | null>("luxpro_phone_state", { p_car: car, p_token: token }),
};

export function randomHex(bytes: number): string {
  const a = new Uint8Array(bytes);
  crypto.getRandomValues(a);
  return Array.from(a).map((b) => b.toString(16).padStart(2, "0")).join("");
}
