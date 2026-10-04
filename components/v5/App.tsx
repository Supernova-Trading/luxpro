"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Icon, type IconName } from "../Icon";
import { useLanguage } from "@/hooks/useLanguage";
import type { Lang } from "@/lib/translations";
import { STRINGS, SPEECH, type RequestKey, type TipKey, type GameKey, type V5Strings } from "./strings";
import { useSpeech } from "./useSpeech";
import { APP_VERSION, BUILD_ID } from "./version";

// LuxPro v5.1 — P0 foundation + P1 home screen + P2 requests and voice
// (roadmap: https://claude.ai/artifact/7pmPGqhwDth9LT7PtEnugD). Music arrives
// in v5.2, games after that. Built from mockup D, only on design/v2-preview.

type Source = "radio" | "playlists" | "bluetooth";

const LANGS: { id: Lang; label: string }[] = [
  { id: "en", label: "EN" },
  { id: "es", label: "ES" },
  { id: "ur", label: "اردو" },
];

const COMFORT: { key: RequestKey; icon: IconName; color: string }[] = [
  { key: "charger", icon: "plug",    color: "var(--i-green)" },
  { key: "snacks",  icon: "cookie",  color: "var(--i-orange)" },
  { key: "wipes",   icon: "droplet", color: "var(--i-sky)" },
  { key: "mints",   icon: "candy",   color: "var(--i-pink)" },
];
const ROUTES: { key: RequestKey; icon: IconName; color: string }[] = [
  { key: "fastest",    icon: "zap",     color: "var(--i-lemon)" },
  { key: "motorway",   icon: "road",    color: "var(--i-blue)" },
  { key: "changeDest", icon: "map-pin", color: "var(--i-red)" },
];
const GAMES: { key: GameKey; icon: IconName; color: string }[] = [
  { key: "quiz",    icon: "lightbulb",   color: "var(--i-lemon)" },
  { key: "riddles", icon: "help-circle", color: "var(--i-teal)" },
  { key: "snake",   icon: "snake",       color: "var(--i-green)" },
  { key: "blocks",  icon: "blocks",      color: "var(--i-violet)" },
  { key: "mines",   icon: "mine",        color: "var(--i-red)" },
];
const TIPS: { key: TipKey; icon: IconName; color: string }[] = [
  { key: "cash",    icon: "cash", color: "var(--i-green)" },
  { key: "uber",    icon: "car",  color: "var(--ink)" },
  { key: "revolut", icon: "bank", color: "var(--i-sky)" },
];

const BUMP_MS = 400; // a jolt landing the same tap twice is ignored

function Circle({ icon, color, label, on, error, onClick }: {
  icon: IconName; color: string; label: string; on?: boolean; error?: string | null; onClick: () => void;
}) {
  return (
    <button className="v5-circle" aria-pressed={!!on} data-error={!!error} onClick={onClick}>
      <span className="v5-ring"><Icon name={icon} size={28} style={{ color }} /></span>
      <span className="v5-circle-label">{error ?? label}</span>
    </button>
  );
}

export default function V5App() {
  const { lang, setLang, isRTL } = useLanguage();
  const s: V5Strings = STRINGS[lang];
  const speech = useSpeech();

  const [source, setSource] = useState<Source>("playlists");
  const [requests, setRequests] = useState<Partial<Record<RequestKey, boolean>>>({});
  const [errors, setErrors] = useState<Partial<Record<RequestKey, boolean>>>({});
  const [climate, setClimate] = useState<"cool" | "warm" | null>(null);
  const [tip, setTip] = useState<TipKey | null>(null);
  const [qr, setQr] = useState(false);
  const [sheet, setSheet] = useState<"settings" | "bt" | null>(null);
  const [confirmNew, setConfirmNew] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [isFS, setIsFS] = useState(false);

  const lastTap = useRef<Record<string, number>>({});
  const toastTimer = useRef<ReturnType<typeof setTimeout>>();

  const passBump = (key: string) => {
    const now = Date.now();
    if (now - (lastTap.current[key] ?? 0) < BUMP_MS) return false;
    lastTap.current[key] = now;
    return true;
  };

  const showToast = useCallback((msg: string) => {
    clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }, []);

  useEffect(() => {
    const onFS = () => setIsFS(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFS);
    return () => document.removeEventListener("fullscreenchange", onFS);
  }, []);

  // If the device can't speak a request, never show "Told Amish" — switch it
  // off and say so on the button for a few seconds.
  function failRequest(key: RequestKey) {
    setRequests((p) => ({ ...p, [key]: false }));
    setErrors((p) => ({ ...p, [key]: true }));
    setTimeout(() => setErrors((p) => ({ ...p, [key]: false })), 4000);
  }

  function toggleRequest(key: RequestKey) {
    if (!passBump(key)) return;
    const on = !requests[key];
    setRequests((p) => ({ ...p, [key]: on }));
    setErrors((p) => ({ ...p, [key]: false }));
    if (on) {
      speech.say(key, SPEECH.requests[key].on, () => failRequest(key));
    } else if (!speech.withdraw(key)) {
      // Only say "no need" if the request was actually heard.
      speech.say(`${key}:off`, SPEECH.requests[key].off);
    }
  }

  function tapClimate(side: "cool" | "warm") {
    if (!passBump("climate")) return;
    const dropped = speech.withdraw("climate");
    if (climate === side) {
      setClimate(null);
      if (!dropped) speech.say("climate:off", SPEECH.climate.off);
      return;
    }
    setClimate(side);
    speech.say("climate", SPEECH.climate[side], () => {
      setClimate(null);
      showToast(s.pleaseTell);
    });
  }

  // Tips: speak once; the same option again is silent; switching speaks only
  // the new one; a tip is never cancelled out loud (owner decision).
  function tapTip(key: TipKey) {
    if (!passBump("tip")) return;
    if (tip === key) {
      if (key === "revolut") setQr(true);
      return;
    }
    speech.withdraw("tip");
    setTip(key);
    speech.say("tip", SPEECH.tip[key], () => {
      setTip(null);
      showToast(s.pleaseTell);
    });
    if (key === "revolut") setQr(true);
  }

  function newRide() {
    speech.clear();
    lastTap.current = {};
    setRequests({});
    setErrors({});
    setClimate(null);
    setTip(null);
    setQr(false);
    setSheet(null);
    setConfirmNew(false);
    setSource("playlists");
    setLang("en");
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.().catch(() => {});
    else document.exitFullscreen?.().catch(() => {});
  }

  const reqLabel = (key: Exclude<RequestKey, "bluetooth">) => (requests[key] ? s.told : s.requests[key]);

  return (
    <div className="v5" data-lang={lang} dir={isRTL ? "rtl" : "ltr"}>
      {/* ── Hero: header, source, now playing ─────────────────────────── */}
      <section className="v5-hero">
        <header className="v5-header">
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span className="v5-wordmark">LuxPro</span>
            <span className="v5-micro" dir="ltr">v{APP_VERSION} · {BUILD_ID}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {LANGS.map((l) => (
              <button key={l.id} className="v5-lang" aria-pressed={lang === l.id} onClick={() => setLang(l.id)}>{l.label}</button>
            ))}
            <button className="v5-iconbtn" style={{ marginInlineStart: 8 }} aria-label={s.settings} onClick={() => { setConfirmNew(false); setSheet("settings"); }}>
              <Icon name="settings" size={18} />
            </button>
          </div>
        </header>

        <div className="v5-hero-glyph" aria-hidden>
          <Icon
            name={source === "radio" ? "radio" : source === "bluetooth" ? "bluetooth" : "headphones"}
            size={40}
            style={{ color: source === "radio" ? "var(--i-violet)" : source === "bluetooth" ? "var(--i-blue)" : "var(--i-pink)" }}
          />
          <span className="v5-hero-rule" />
        </div>

        <div className="v5-hero-foot">
          <div className="v5-tabs" role="tablist">
            {([["radio", s.radio], ["playlists", s.playlists], ["bluetooth", s.bluetooth]] as [Source, string][]).map(([id, label]) => (
              <button key={id} role="tab" className="v5-tab" aria-pressed={source === id} aria-selected={source === id} onClick={() => setSource(id)}>{label}</button>
            ))}
          </div>

          {source === "bluetooth" ? (
            <div style={{ display: "grid", gap: 10, marginTop: 4 }}>
              <div>
                <div className="v5-display">{s.btTitle}</div>
                <div className="v5-sub">{s.btSub}</div>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button className="v5-pill" aria-pressed={!!requests.bluetooth} onClick={() => toggleRequest("bluetooth")}>
                  <Icon name={requests.bluetooth ? "check" : "bluetooth"} size={16} />
                  {errors.bluetooth ? s.pleaseTell : requests.bluetooth ? s.told : s.btAsk}
                </button>
                <button className="v5-pill" onClick={() => setSheet("bt")}>{s.btHow}</button>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, marginTop: 4 }}>
              <div style={{ minWidth: 0 }}>
                <div className="v5-display">{s.heroIdleTitle}</div>
                <div className="v5-sub">{s.heroIdleSoon}</div>
              </div>
              {/* Media transport stays left-to-right in RTL; wired in v5.2 */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }} dir="ltr">
                <button className="v5-iconbtn" data-size="md" disabled aria-label="Previous"><Icon name="skip-back" size={18} /></button>
                <button className="v5-iconbtn v5-play" disabled aria-label="Play"><Icon name="play" size={24} /></button>
                <button className="v5-iconbtn" data-size="md" disabled aria-label="Next"><Icon name="skip-forward" size={18} /></button>
              </div>
            </div>
          )}
        </div>
      </section>

      <main className="v5-main">
        {/* ── Tip: three options up front, each says what happens ─────── */}
        <section className="v5-tip" aria-label={s.tipTitle}>
          <div className="v5-tip-head">
            <span className="v5-title">{tip ? s.tipThanksTitle : s.tipTitle}</span>
            <span className="v5-sub" style={{ color: "var(--gold)" }}>{tip ? s.tipThanksSub : s.tipSub}</span>
          </div>
          <div className="v5-tip-opts">
            {TIPS.map((t) => {
              const on = tip === t.key;
              return (
                <button key={t.key} className="v5-tip-opt" aria-pressed={on} onClick={() => tapTip(t.key)}>
                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Icon name={t.icon} size={20} style={{ color: on ? "currentColor" : t.color }} />
                    <span className="v5-label" style={{ color: "inherit", fontSize: 17 }}>{s.tip[t.key].label}</span>
                  </span>
                  <small>{on ? s.told : s.tip[t.key].sub}</small>
                </button>
              );
            })}
          </div>
        </section>

        {/* ── Ask Amish: every button a plain on/off request ──────────── */}
        <section aria-label={s.askAmish}>
          <div className="v5-caption" style={{ marginBottom: 8 }}>{s.askAmish}</div>
          <div className="v5-grid4">
            {COMFORT.map((it) => (
              <Circle key={it.key} icon={it.icon} color={it.color}
                label={reqLabel(it.key as Exclude<RequestKey, "bluetooth">)}
                on={!!requests[it.key]} error={errors[it.key] ? s.pleaseTell : null}
                onClick={() => toggleRequest(it.key)} />
            ))}
          </div>
          {/* Three under four, inset half a column so each sits between two above */}
          <div className="v5-grid3">
            {ROUTES.map((it) => (
              <Circle key={it.key} icon={it.icon} color={it.color}
                label={reqLabel(it.key as Exclude<RequestKey, "bluetooth">)}
                on={!!requests[it.key]} error={errors[it.key] ? s.pleaseTell : null}
                onClick={() => toggleRequest(it.key)} />
            ))}
          </div>
        </section>

        {/* ── Climate: Cooler | Warmer, no number ─────────────────────── */}
        <div className="v5-climate">
          {(["cool", "warm"] as const).map((side) => {
            const on = climate === side;
            return (
              <button key={side} data-side={side} aria-pressed={on} onClick={() => tapClimate(side)}>
                <Icon name={side === "cool" ? "snowflake" : "flame"} size={24} style={{ color: side === "cool" ? "var(--i-sky)" : "var(--i-orange)" }} />
                <span className="v5-label" style={{ fontSize: 17 }}>{side === "cool" ? s.cooler : s.warmer}</span>
                {on && <span className="v5-told"><Icon name="check" size={14} />{s.told}</span>}
              </button>
            );
          })}
        </div>

        {/* ── Play: five games, one tap each (built from v5.3) ─────────── */}
        <section aria-label={s.play}>
          <div className="v5-caption" style={{ marginBottom: 8 }}>{s.play}</div>
          <div className="v5-grid5">
            {GAMES.map((g) => (
              <Circle key={g.key} icon={g.icon} color={g.color} label={s.games[g.key]} onClick={() => showToast(s.gameSoon)} />
            ))}
          </div>
        </section>
      </main>

      {/* ── Settings ─────────────────────────────────────────────────── */}
      {sheet === "settings" && (
        <div className="v5-overlay" onClick={(e) => { if (e.target === e.currentTarget) setSheet(null); }}>
          <div className="v5-sheet" role="dialog" aria-label={s.settings}>
            <div className="v5-handle" />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
              <span className="v5-heading">{s.settings}</span>
              <button className="v5-pill" onClick={() => setSheet(null)}>{s.close}</button>
            </div>
            <button className="v5-row" onClick={toggleFullscreen}>
              <Icon name={isFS ? "close" : "present"} size={20} style={{ color: "var(--ink)" }} />
              <span className="v5-label">{isFS ? s.exitFullScreen : s.fullScreen}</span>
            </button>
            {/* Stand-in until Amish's phone remote (P8) resets the tablet */}
            {!confirmNew ? (
              <button className="v5-row" onClick={() => setConfirmNew(true)}>
                <Icon name="history" size={20} style={{ color: "var(--ink)" }} />
                <span style={{ display: "grid", gap: 2 }}>
                  <span className="v5-label">{s.newRide}</span>
                  <span className="v5-sub">{s.newRideSub}</span>
                </span>
              </button>
            ) : (
              <div className="v5-row" style={{ flexWrap: "wrap" }}>
                <span className="v5-label" style={{ flex: "1 1 auto" }}>{s.newRideConfirm}</span>
                <button className="v5-pill" onClick={() => setConfirmNew(false)}>{s.cancel}</button>
                <button className="v5-pill" aria-pressed onClick={newRide}>{s.confirmClear}</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Bluetooth how-to ─────────────────────────────────────────── */}
      {sheet === "bt" && (
        <div className="v5-overlay" onClick={(e) => { if (e.target === e.currentTarget) setSheet(null); }}>
          <div className="v5-sheet" role="dialog" aria-label={s.btHow}>
            <div className="v5-handle" />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
              <span className="v5-heading">{s.btHow}</span>
              <button className="v5-pill" onClick={() => setSheet(null)}>{s.close}</button>
            </div>
            <ol style={{ margin: 0, padding: 0, listStyle: "none" }}>
              {s.btSteps.map((step, i) => (
                <li key={i} className="v5-row">
                  <span className="v5-title" style={{ width: 28, color: "var(--muted)" }} dir="ltr">{i + 1}</span>
                  <span className="v5-label" style={{ fontWeight: 400 }}>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}

      {/* ── Revolut QR ───────────────────────────────────────────────── */}
      {qr && (
        <div className="v5-full" role="dialog" aria-label={s.qrTitle}>
          <span className="v5-heading">{s.qrTitle}</span>
          <div className="v5-qr">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/qr-tip.png" alt={s.qrTitle} width={260} height={260} />
          </div>
          <span className="v5-label" style={{ fontWeight: 400, color: "var(--body)", maxWidth: 420 }}>{s.qrSub}</span>
          <button className="v5-pill" style={{ minWidth: 160, height: 56 }} onClick={() => setQr(false)}>{s.done}</button>
        </div>
      )}

      {toast && <div className="v5-toast" role="status">{toast}</div>}
    </div>
  );
}
