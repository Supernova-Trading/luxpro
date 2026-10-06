// Who is driving (v5.35, owner): every name, phone number and Revolut link in
// LuxPro comes from this one profile, so another driver can use the app by
// changing their details in the Driver panel (behind the PIN) — no code
// change, no new website. Saved on the tablet; Amish's details are the
// default. Words in strings.ts use {driver}, {revolut} and {trips}.

export interface DriverProfile {
  name: string;    // as passengers see it: "Amish"
  nameUr: string;  // in Urdu script, optional ("" = use name)
  phone: string;   // shown as typed, e.g. "07438 537 561"
  revolut: string; // Revolut username without @, e.g. "amishg4sqm"
  trips: number;   // 0 = don't show a trip count
}

export const DEFAULT_DRIVER: DriverProfile = {
  name: "Amish",
  nameUr: "امیش",
  phone: "07438 537 561",
  revolut: "amishg4sqm",
  trips: 15000,
};

const KEY = "luxpro.v5.driver";

export function readDriver(): DriverProfile {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || "null");
    if (v && typeof v.name === "string" && v.name.trim()) return { ...DEFAULT_DRIVER, ...v };
  } catch { /* storage blocked */ }
  return DEFAULT_DRIVER;
}

export function saveDriver(p: DriverProfile) {
  try { localStorage.setItem(KEY, JSON.stringify(p)); } catch { /* storage blocked */ }
}

/** Tidy what was typed in the Driver panel. */
export function cleanDriver(p: DriverProfile): DriverProfile {
  const trips = Math.max(0, Math.floor(Number(p.trips) || 0));
  return {
    name: p.name.trim().replace(/\s+/g, " ").slice(0, 24) || DEFAULT_DRIVER.name,
    nameUr: p.nameUr.trim().slice(0, 24),
    phone: p.phone.trim().slice(0, 20),
    revolut: p.revolut.trim().replace(/^@/, "").replace(/\s+/g, "").slice(0, 32),
    trips,
  };
}

/** The tipping page the QR opens. */
export function revolutLink(p: DriverProfile): string {
  return `https://revolut.me/${encodeURIComponent(p.revolut)}`;
}

const LOCALE: Record<string, string> = { en: "en-GB", es: "es-ES", ur: "en-GB" };

/** Put the driver's details into words (strings, nested objects, and the
 *  functions that build spoken lines). */
export function personalise<T>(v: T, p: DriverProfile, lang = "en"): T {
  const name = lang === "ur" && p.nameUr ? p.nameUr : p.name;
  const trips = p.trips.toLocaleString(LOCALE[lang] ?? "en-GB");
  const sub = (x: string) => x.split("{driver}").join(name).split("{revolut}").join(p.revolut).split("{trips}").join(trips);
  const walk = (x: unknown): unknown => {
    if (typeof x === "string") return sub(x);
    if (typeof x === "function") return (...a: unknown[]) => walk((x as (...b: unknown[]) => unknown)(...a));
    if (Array.isArray(x)) return x.map(walk);
    if (x && typeof x === "object") return Object.fromEntries(Object.entries(x).map(([k, y]) => [k, walk(y)]));
    return x;
  };
  return walk(v) as T;
}

/** Same, for tables shaped { key: { en, es, ur } } (the announcements). */
export function personaliseByLang<K extends string, L extends string>(t: Record<K, Record<L, string>>, p: DriverProfile): Record<K, Record<L, string>> {
  const out = {} as Record<K, Record<L, string>>;
  for (const k of Object.keys(t) as K[]) {
    const row = {} as Record<L, string>;
    for (const l of Object.keys(t[k]) as L[]) row[l] = personalise(t[k][l], p, l);
    out[k] = row;
  }
  return out;
}
