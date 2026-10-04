"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Icon, type IconName } from "../Icon";
import { useLanguage } from "@/hooks/useLanguage";
import { PLAYLISTS } from "@/lib/playlists";
import type { Lang } from "@/lib/translations";
import { STRINGS, SPEECH, type RequestKey, type TipKey, type GameKey, type V5Strings } from "./strings";
import { useSpeech } from "./useSpeech";
import { useMusic } from "./useMusic";
import MusicHero from "./MusicHero";
import { APP_VERSION, BUILD_ID } from "./version";

// LuxPro v5 — built from mockup D, only on design/v2-preview.
// Roadmap: https://claude.ai/artifact/7pmPGqhwDth9LT7PtEnugD
// v5.2: music (P3) + owner feedback — no "Told Amish" labels (check badge
// instead), and a lighter tip section without the gold box.

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

function Circle({ icon, color, label, on, onClick }: {
  icon: IconName; color: string; label: string; on?: boolean; onClick: () => void;
}) {
  return (
    <button className="v5-circle" aria-pressed={!!on} onClick={onClick}>
      <span className="v5-ring">
        <Icon name={icon} size={28} style={{ color }} />
        {on && <span className="v5-badge" aria-hidden><Icon name="check" size={13} strokeWidth={2.4} /></span>}
      </span>
      <span className="v5-circle-label">{label}</span>
    </button>
  );
}

export default function V5App() {
  const { lang, setLang, isRTL, radios } = useLanguage();
  const s: V5Strings = STRINGS[lang];
  const music = useMusic(radios, lang);
  const speech = useSpeech(music.duck);

  const [requests, setRequests] = useState<Partial<Record<RequestKey, boolean>>>({});
  const [climate, setClimate] = useState<"cool" | "warm" | null>(null);
  const [tip, setTip] = useState<TipKey | null>(null);
  const [qr, setQr] = useState(false);
  const [sheet, setSheet] = useState<"settings" | "bt" | "picker" | null>(null);
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
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  }, []);

  useEffect(() => {
    const onFS = () => setIsFS(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFS);
    return () => document.removeEventListener("fullscreenchange", onFS);
  }, []);

  // If the device can't speak a request, it must not look sent: switch it off
  // and tell the passenger to say it directly.
  function failRequest(key: RequestKey) {
    setRequests((p) => ({ ...p, [key]: false }));
    showToast(s.didntHear);
  }

  function toggleRequest(key: RequestKey) {
    if (!passBump(key)) return;
    const on = !requests[key];
    setRequests((p) => ({ ...p, [key]: on }));
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
      showToast(s.didntHear);
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
      showToast(s.didntHear);
    });
    if (key === "revolut") setQr(true);
  }

  function newRide() {
    speech.clear();
    music.reset();
    lastTap.current = {};
    setRequests({});
    setClimate(null);
    setTip(null);
    setQr(false);
    setSheet(null);
    setConfirmNew(false);
    setLang("en");
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.().catch(() => {});
    else document.exitFullscreen?.().catch(() => {});
  }

  const closeOnScrim = (e: React.MouseEvent) => { if (e.target === e.currentTarget) setSheet(null); };

  const header = (
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
  );

  return (
    <div className="v5" data-lang={lang} dir={isRTL ? "rtl" : "ltr"}>
      <MusicHero
        s={s}
        music={music}
        header={header}
        onPicker={() => setSheet("picker")}
        btOn={!!requests.bluetooth}
        onBtAsk={() => toggleRequest("bluetooth")}
        onBtHow={() => setSheet("bt")}
      />

      <main className="v5-main">
        {/* ── Tip: headline + three options; gold only once one is chosen ── */}
        <section className="v5-tip" aria-label={s.tipTitle}>
          <div className="v5-tip-head">
            <span className="v5-title">{tip ? s.tipThanksTitle : s.tipTitle}</span>
            <span className="v5-sub">{tip ? s.tipThanksSub : s.tipHint}</span>
          </div>
          <div className="v5-tip-opts">
            {TIPS.map((t) => {
              const on = tip === t.key;
              return (
                <button key={t.key} className="v5-tip-opt" aria-pressed={on} onClick={() => tapTip(t.key)}>
                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Icon name={on ? "check" : t.icon} size={20} style={{ color: on ? "currentColor" : t.color }} />
                    <span className="v5-label" style={{ color: "inherit", fontSize: 17 }}>{s.tip[t.key].label}</span>
                  </span>
                  <small>{s.tip[t.key].sub}</small>
                </button>
              );
            })}
          </div>
        </section>

        {/* ── Ask Amish: on/off; "on" shows as a gold ring + check badge ── */}
        <section aria-label={s.askAmish}>
          <div className="v5-caption" style={{ marginBottom: 8 }}>{s.askAmish}</div>
          <div className="v5-grid4">
            {COMFORT.map((it) => (
              <Circle key={it.key} icon={it.icon} color={it.color}
                label={s.requests[it.key as Exclude<RequestKey, "bluetooth">]}
                on={!!requests[it.key]} onClick={() => toggleRequest(it.key)} />
            ))}
          </div>
          {/* Three under four, inset half a column so each sits between two above */}
          <div className="v5-grid3">
            {ROUTES.map((it) => (
              <Circle key={it.key} icon={it.icon} color={it.color}
                label={s.requests[it.key as Exclude<RequestKey, "bluetooth">]}
                on={!!requests[it.key]} onClick={() => toggleRequest(it.key)} />
            ))}
          </div>
        </section>

        {/* ── Climate: Cooler | Warmer, no number ─────────────────────── */}
        <div className="v5-climate">
          {(["cool", "warm"] as const).map((side) => {
            const on = climate === side;
            return (
              <button key={side} data-side={side} aria-pressed={on} onClick={() => tapClimate(side)}>
                <Icon name={on ? "check" : side === "cool" ? "snowflake" : "flame"} size={24}
                  style={{ color: on ? "var(--gold)" : side === "cool" ? "var(--i-sky)" : "var(--i-orange)" }} />
                <span className="v5-label" style={{ fontSize: 17 }}>{side === "cool" ? s.cooler : s.warmer}</span>
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

      {/* ── Station / playlist picker, with volume ───────────────────── */}
      {sheet === "picker" && (
        <div className="v5-overlay" onClick={closeOnScrim}>
          <div className="v5-sheet" role="dialog" aria-label={music.source === "radio" ? s.chooseStation : s.choosePlaylist}>
            <div className="v5-handle" />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span className="v5-heading">{music.source === "radio" ? s.chooseStation : s.choosePlaylist}</span>
              <button className="v5-pill" onClick={() => setSheet(null)}>{s.close}</button>
            </div>
            {/* Volume: − / + steps, no slider — precise sliding fails on bumps */}
            <div className="v5-vol" dir="ltr">
              <span className="v5-caption" style={{ minWidth: 72 }}>{s.volume}</span>
              <button className="v5-iconbtn" data-size="md" aria-label={`${s.volume} −`} onClick={() => music.setVolume(music.volume - 10)}><Icon name="minus" size={18} /></button>
              <span className="v5-vol-bar" aria-hidden>
                {Array.from({ length: 10 }, (_, i) => <i key={i} data-on={i < Math.round(music.volume / 10)} />)}
              </span>
              <button className="v5-iconbtn" data-size="md" aria-label={`${s.volume} +`} onClick={() => music.setVolume(music.volume + 10)}><Icon name="plus" size={18} /></button>
            </div>
            <div className="v5-pick">
              {music.source === "radio"
                ? radios.map((st, i) => {
                    const offline = music.radio.brokenStations.has(i) && music.radio.currentIdx !== i;
                    return (
                      <button key={st.n + i} aria-pressed={music.radio.currentIdx === i} data-offline={offline}
                        onClick={() => { music.chooseStation(i); setSheet(null); }}>
                        <span style={{ display: "grid", minWidth: 0 }}>
                          <span className="v5-label" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{st.n}</span>
                          {offline && <span className="v5-sub">{s.offline}</span>}
                        </span>
                        {music.radio.currentIdx === i && <Icon name="check" size={18} style={{ color: "var(--gold)", flexShrink: 0 }} />}
                      </button>
                    );
                  })
                : PLAYLISTS.map((pl, i) => (
                    <button key={pl.n} aria-pressed={music.plIdx === i}
                      onClick={() => { music.choosePlaylist(i); setSheet(null); }}>
                      <span className="v5-label">{pl.n}</span>
                      {music.plIdx === i && <Icon name="check" size={18} style={{ color: "var(--gold)", flexShrink: 0 }} />}
                    </button>
                  ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Settings ─────────────────────────────────────────────────── */}
      {sheet === "settings" && (
        <div className="v5-overlay" onClick={closeOnScrim}>
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
        <div className="v5-overlay" onClick={closeOnScrim}>
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

      {/* Hidden SoundCloud player — driven entirely by the hero's controls */}
      {music.sc.src && (
        <iframe
          key={music.sc.src}
          ref={music.sc.iframeRef}
          src={music.sc.src}
          title="Playlist player"
          allow="autoplay"
          aria-hidden
          tabIndex={-1}
          style={{ position: "absolute", width: 1, height: 1, opacity: 0, pointerEvents: "none", border: 0 }}
        />
      )}
    </div>
  );
}
