"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import { Icon, type IconName } from "../Icon";
import { useLanguage } from "@/hooks/useLanguage";
import { PLAYLISTS } from "./playlists";
import type { Lang } from "@/lib/translations";
import { STRINGS, SPEECH, ANNOUNCE, type RequestKey, type TipKey, type GameKey, type V5Strings } from "./strings";
import { useSpeech } from "./useSpeech";
import { useMusic } from "./useMusic";
import MusicHero from "./MusicHero";
import { GENRES, PLAYLIST_META, groupStations } from "./genres";
import { stationsFor } from "./stations";
import Driver, { type RideStage } from "./Driver";
import { Welcome, Farewell, NearlyBanner } from "./RideScreens";
import { useKiosk } from "./useKiosk";
import { useRemote } from "./remote/useRemote";
import type { RemoteCmd, TabletState } from "./remote/api";
import { useDeck } from "./useDeck";
import { nightFor, type NightMode } from "./night";
import WordGame from "./WordGame";
import GameBoundary from "./GameBoundary";
import RevolutQr from "./RevolutQr";
import Wordmark from "./Wordmark";
import { DEFAULT_DRIVER, readDriver, saveDriver, personalise, personaliseByLang, type DriverProfile } from "./driverProfile";
import { newPrize, answer as prizeAnswer, take as prizeTake, keepPlaying, restart as prizeRestart, lastCall as prizeLastCall, beats, upgrade, decline, TIER_KEYS, type Best, type PrizeGame } from "./games/prize";
import type { MinesSave } from "./games/MinesGame";
import type { SnakeSave } from "./games/SnakeGame";
import type { BlocksSave } from "./games/BlocksGame";

// Action games load only when opened (roadmap P5: keep the home screen light).
const MinesGame = dynamic(() => import("./games/MinesGame"), { ssr: false });
const SnakeGame = dynamic(() => import("./games/SnakeGame"), { ssr: false });
const BlocksGame = dynamic(() => import("./games/BlocksGame"), { ssr: false });

// LuxPro v5 — built from mockup D, only on design/v2-preview.
// Roadmap: https://claude.ai/artifact/7pmPGqhwDth9LT7PtEnugD
// v5.3: D's gold tip panel back, music chosen by genre (playlists and radio),
// Bluetooth actions on the right. Requests show a check badge, never "Told Amish".
// v5.5: Quiz and Riddles playable. v5.7: Mines. v5.8: Snake. v5.9: Blocks — all five games.

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
const QR_CLOSE_MS = 120_000; // the Revolut QR closes itself after 2 minutes
const SETTINGS_KEY = "luxpro.v5.settings"; // settings survive a reload; ride state doesn't
const FAREWELL_RESET_MS = 180_000; // after drop-off, the tablet resets itself for the next passenger
const NEARLY_MS = 20_000;          // how long the "Nearly there" banner stays
const HOLD_FOR_DRIVER_MS = 1500;   // hold the wordmark this long to open the Driver panel
const WELCOME_WAIT_S = 30;         // no language picked by then: carry on in English (owner, v5.24)
const END_TRIP_MS = 120_000;       // End trip: "nearly there" now, thank-you screen this much later (owner, v5.26)
const VOICE_MIN = 20; // the voice can be quieter, never silent: a muted request would look sent

// − / + in 10% steps, never a slider: precise sliding fails on bumps.
function Volume({ label, value, min = 0, onChange }: { label: string; value: number; min?: number; onChange: (v: number) => void }) {
  return (
    <div className="v5-vol" dir="ltr">
      <button className="v5-iconbtn" data-size="md" aria-label={`${label} −`} disabled={value <= min} onClick={() => onChange(value - 10)}><Icon name="minus" size={18} /></button>
      <span className="v5-vol-bar" aria-hidden>
        {Array.from({ length: 10 }, (_, i) => <i key={i} data-on={i < Math.round(value / 10)} />)}
      </span>
      <button className="v5-iconbtn" data-size="md" aria-label={`${label} +`} disabled={value >= 100} onClick={() => onChange(value + 10)}><Icon name="plus" size={18} /></button>
      <span className="v5-micro" style={{ minWidth: 40, textAlign: "end" }}>{value}%</span>
    </div>
  );
}

function SectionHead({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="v5-section-head">
      <span className="v5-section-title">{title}</span>
      <span className="v5-section-rule" aria-hidden />
      {hint && <span className="v5-section-hint">{hint}</span>}
    </div>
  );
}

function Circle({ icon, color, label, on, badge = "check", onClick }: {
  icon: IconName; color: string; label: string; on?: boolean; badge?: IconName; onClick: () => void;
}) {
  return (
    <button className="v5-circle" aria-pressed={!!on} onClick={onClick}>
      <span className="v5-ring">
        <Icon name={icon} size={28} style={{ color }} />
        {on && <span className="v5-badge" aria-hidden><Icon name={badge} size={13} strokeWidth={2.4} /></span>}
      </span>
      <span className="v5-circle-label">{label}</span>
    </button>
  );
}

export default function V5App() {
  const { lang, setLang, isRTL, radios: liveRadios } = useLanguage();
  // The live station list plus v5's extra stations (stations.ts)
  const radios = useMemo(() => stationsFor(lang, liveRadios), [lang, liveRadios]);
  // The driver's details fill every word, spoken line and the QR (v5.35)
  const [driver, setDriver] = useState<DriverProfile>(DEFAULT_DRIVER);
  useEffect(() => { setDriver(readDriver()); }, []);
  const T = useMemo(() => ({
    en: personalise(STRINGS.en, driver, "en"),
    es: personalise(STRINGS.es, driver, "es"),
    ur: personalise(STRINGS.ur, driver, "ur"),
  }), [driver]);
  const SP = useMemo(() => personalise(SPEECH, driver, "en"), [driver]);
  const AN = useMemo(() => personaliseByLang(ANNOUNCE, driver), [driver]);
  const driverName = lang === "ur" && driver.nameUr ? driver.nameUr : driver.name;
  const s: V5Strings = T[lang];
  const music = useMusic(radios, lang);
  const [voiceVol, setVoiceVol] = useState(100);
  const [nightMode, setNightMode] = useState<NightMode>("auto");
  const [night, setNight] = useState(false);
  const [qrFailed, setQrFailed] = useState(false);
  const speech = useSpeech(music.duck, voiceVol / 100);
  const deck = useDeck();

  const [requests, setRequests] = useState<Partial<Record<RequestKey, boolean>>>({});
  const [climate, setClimate] = useState<"cool" | "warm" | null>(null);
  const [tip, setTip] = useState<TipKey | null>(null);
  const [qr, setQr] = useState(false);
  const [sheet, setSheet] = useState<"settings" | "bt" | "picker" | null>(null);
  // Ride stages (P8): welcome at pickup, the app during the ride, farewell at drop-off.
  const [stage, setStage] = useState<RideStage>("welcome");
  const [nearly, setNearly] = useState(false);
  const [endAt, setEndAt] = useState<number | null>(null); // the drop-off chain is running
  const [driverOpen, setDriverOpen] = useState(false);
  const [kiosk, setKiosk] = useState(true);
  const holdTimer = useRef<ReturnType<typeof setTimeout>>();
  const [toast, setToast] = useState<string | null>(null);
  const [isFS, setIsFS] = useState(false);
  const [game, setGame] = useState<GameKey | null>(null);
  // Games left via Home wait, paused, until the passenger comes back (roadmap P5).
  const [minesSave, setMinesSave] = useState<MinesSave | null>(null);
  const [snakeSave, setSnakeSave] = useState<SnakeSave | null>(null);
  const [blocksSave, setBlocksSave] = useState<BlocksSave | null>(null);
  const resumable: Partial<Record<GameKey, boolean>> = {
    mines: minesSave?.board.state === "playing",
    snake: snakeSave?.game.status === "playing",
    blocks: blocksSave?.game.status === "playing",
  };
  // One prize ladder per ride, shared by Quiz and Riddles (games/prize.ts).
  const [prize, setPrize] = useState(newPrize);
  const [best, setBest] = useState<Best | null>(null); // the ride's best prize so far (v5.41)
  const [asked, setAsked] = useState<Partial<Record<"quiz" | "riddles", boolean>>>({});

  const lastTap = useRef<Record<string, number>>({});
  // Half-screen games (Mines v5.13, Snake and Blocks v5.15) start just under
  // the tip box (Amish's idea), so music and tips stay in view while playing.
  const tipRef = useRef<HTMLElement>(null);
  const [halfTop, setHalfTop] = useState(0);
  useEffect(() => {
    const measure = () => setHalfTop(Math.round((tipRef.current?.getBoundingClientRect().bottom ?? 0) + 8));
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [game, lang]);
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

  // Settings (not ride state) come back after a reload.
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}");
      if (typeof saved.voiceVolume === "number") setVoiceVol(Math.max(VOICE_MIN, Math.min(100, saved.voiceVolume)));
      if (saved.night === "auto" || saved.night === "on" || saved.night === "off") setNightMode(saved.night);
      if (typeof saved.kiosk === "boolean") setKiosk(saved.kiosk);
    } catch { /* storage blocked: defaults */ }
  }, []);

  function saveSettings(next: { voiceVolume?: number; night?: NightMode; kiosk?: boolean }) {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify({ voiceVolume: voiceVol, night: nightMode, kiosk, ...next }));
    } catch { /* fine */ }
  }

  function changeVoiceVol(v: number) {
    const next = Math.max(VOICE_MIN, Math.min(100, Math.round(v / 10) * 10));
    setVoiceVol(next);
    saveSettings({ voiceVolume: next });
  }

  function changeNight(m: NightMode) {
    setNightMode(m);
    saveSettings({ night: m });
  }

  function changeKiosk(on: boolean) {
    setKiosk(on);
    saveSettings({ kiosk: on });
  }

  useKiosk(kiosk);

  // The End-trip chain: thank-you screen when the 2 minutes are up.
  useEffect(() => {
    if (!endAt) return;
    const t = setTimeout(() => { setEndAt(null); endRide(); }, Math.max(0, endAt - Date.now()));
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endAt]);

  // Welcome: no language picked within WELCOME_WAIT_S → English, app shown.
  const [welcomeLeft, setWelcomeLeft] = useState(WELCOME_WAIT_S);
  useEffect(() => {
    if (stage !== "welcome") return;
    setWelcomeLeft(WELCOME_WAIT_S);
    const started = Date.now();
    const t = setInterval(() => {
      const left = WELCOME_WAIT_S - Math.floor((Date.now() - started) / 1000);
      if (left <= 0) { clearInterval(t); setStage("ride"); } else setWelcomeLeft(left);
    }, 1000);
    return () => clearInterval(t);
  }, [stage]);

  // Drop-off: the farewell stays a few minutes, then the tablet resets itself.
  useEffect(() => {
    if (stage !== "farewell") return;
    const t = setTimeout(resetForNext, FAREWELL_RESET_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  useEffect(() => {
    if (!nearly) return;
    const t = setTimeout(() => setNearly(false), NEARLY_MS);
    return () => clearTimeout(t);
  }, [nearly]);

  // Amish's phone remote: what the tablet reports, and his commands.
  const rideReport: TabletState = {
    stage,
    lang,
    requests: (Object.keys(requests) as RequestKey[]).filter((k) => requests[k]),
    climate,
    tip,
    prize: { correct: prize.correct, status: prize.status, tier: prize.tier },
    best, // the one prize the driver hands over (v5.41)
    music: {
      source: music.source,
      title: music.source === "radio" ? music.radio.currentStation?.n ?? "" : music.source === "playlists" ? music.sc.track?.title ?? "" : "",
      playing: music.source === "radio" ? music.radio.playing : music.sc.playing,
    },
    volume: music.volume,
    endAt,
  };
  const phone = useRemote(rideReport, (cmd: RemoteCmd) => {
    if (cmd === "new_passenger") newPassenger();
    else if (cmd === "nearly") nearlyThere();
    else if (cmd === "end_ride") endRide();
    else if (cmd === "end_trip") endTrip();
    else if (cmd === "cancel_end") cancelEnd();
    // Amish's phone can turn the music up or down in 10% steps (v5.25)
    else if (cmd === "vol_up") music.nudgeVolume(10);
    else if (cmd === "vol_down") music.nudgeVolume(-10);
    // "Refresh tablet" from the driver's phone (v5.36, owner): a fresh start
    // when the tablet seems stuck; the phone shows "done" once it's back.
    else if (cmd === "reload") setTimeout(() => window.location.reload(), 400);
  });

  // Hold the wordmark to open Amish's Driver panel (a tap does nothing).
  const holdStart = () => { clearTimeout(holdTimer.current); holdTimer.current = setTimeout(() => setDriverOpen(true), HOLD_FOR_DRIVER_MS); };
  const holdEnd = () => clearTimeout(holdTimer.current);

  // Night: re-checked every minute so the screen dims at sunset on its own.
  useEffect(() => {
    const check = () => setNight(nightFor(nightMode, new Date()));
    check();
    const t = setInterval(check, 60_000);
    return () => clearInterval(t);
  }, [nightMode]);

  useEffect(() => {
    if (!qr) return;
    setQrFailed(false); // each opening tries the image again
    const t = setTimeout(() => setQr(false), QR_CLOSE_MS);
    return () => clearTimeout(t);
  }, [qr]);

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
      speech.say(key, SP.requests[key].on, () => failRequest(key));
    } else if (!speech.withdraw(key)) {
      // Only say "no need" if the request was actually heard.
      speech.say(`${key}:off`, SP.requests[key].off);
    }
  }

  function tapClimate(side: "cool" | "warm") {
    if (!passBump("climate")) return;
    const dropped = speech.withdraw("climate");
    if (climate === side) {
      setClimate(null);
      if (!dropped) speech.say("climate:off", SP.climate.off);
      return;
    }
    setClimate(side);
    speech.say("climate", SP.climate[side], () => {
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
    speech.say("tip", SP.tip[key], () => {
      setTip(null);
      showToast(s.didntHear);
    });
    if (key === "revolut") setQr(true);
  }

  function openGame(key: GameKey) {
    setGame(key);
  }

  // "Play with Amish": said once per game per ride; a repeat tap is silent.
  function askDriverToPlay(key: "quiz" | "riddles") {
    if (!passBump(`game:${key}`) || asked[key]) return;
    setAsked((p) => ({ ...p, [key]: true }));
    speech.say(`game:${key}`, SP.games[key], () => {
      setAsked((p) => ({ ...p, [key]: false }));
      showToast(s.didntHear);
    });
  }

  // Taking a prize is said to Amish (always in English) — he hears it himself,
  // so a prize can't be claimed with a screenshot or a story.
  function takePrize() {
    const won = prizeTake(prize);
    if (won === prize || !beats(best, won.tier)) return;
    setPrize(won);
    awardBest(won.tier, game === "riddles" ? "Riddles" : "Quiz", `with ${won.correct} correct answers`);
  }

  // The ride keeps only its best prize (owner, v5.41): a better prize from any
  // game replaces it, a lower one doesn't count. The driver hears each change,
  // and his phone shows just the one prize to hand over.
  function awardBest(tier: number, from: PrizeGame, detail: string) {
    if (!beats(best, tier)) return;
    const old = best;
    setBest(upgrade(best, tier, from));
    const name = T.en.tiers[TIER_KEYS[tier]];
    const line = old ? SP.prizeUpgrade(name, T.en.tiers[TIER_KEYS[old.tier]], from, detail) : SP.gamePrize(name, from, detail);
    speech.say("prize", line, () => showToast(s.didntHear));
  }

  // Blocks and Mines prizes (Amish, v5.39) feed the same best-of-ride prize.
  function takeGamePrize(tier: number, from: "Snake" | "Blocks" | "Mines", detail: string) {
    awardBest(tier, from, detail);
  }

  function newRide() {
    speech.clear();
    music.reset();
    // The question deck is deliberately kept: Amish shouldn't hear repeats.
    lastTap.current = {};
    setGame(null);
    setMinesSave(null);
    setSnakeSave(null);
    setBlocksSave(null);
    setPrize(newPrize());
    setBest(null);
    setAsked({});
    setRequests({});
    setClimate(null);
    setTip(null);
    setQr(false);
    setSheet(null);
    setNearly(false);
    setEndAt(null);
    setLang("en");
  }

  function newPassenger() {
    newRide();
    setStage("welcome");
    speech.announce("announce", AN.welcome, "en");
  }

  // Domino (owner, v5.26): Amish presses End trip about 2 minutes before
  // arriving → "nearly there" banner and voice now → thank-you screen and
  // voice 2 minutes later → the tablet resets itself 3 minutes after that.
  function endTrip() {
    if (stage === "farewell" || endAt) return;
    if (stage === "welcome") setStage("ride");
    setNearly(true);
    speech.announce("announce", AN.nearly, lang);
    setEndAt(Date.now() + END_TRIP_MS);
    // A prize passed up or still waiting: offer it once more before arriving
    const lc = prizeLastCall(prize);
    if (lc !== prize && beats(best, lc.tier)) {
      setPrize(lc);
      if (game !== "quiz" && game !== "riddles") setGame("quiz");
    }
  }

  function cancelEnd() {
    setEndAt(null);
    setNearly(false);
  }

  // After the farewell: back to Welcome quietly (nobody in the car to greet).
  function resetForNext() {
    newRide();
    setStage("welcome");
  }

  function nearlyThere() {
    if (stage !== "ride") return;
    setNearly(true);
    speech.announce("announce", AN.nearly, lang);
  }

  // Amish hears which language the passenger chose (owner, v5.29): one
  // word in the English voice — "English." / "Spanish." / "Urdu."
  function sayLanguage(l: Lang) {
    speech.withdraw("lang");
    speech.say("lang", `${{ en: "English", es: "Spanish", ur: "Urdu" }[l]}.`);
  }

  function switchLang(l: Lang) {
    if (l === lang) return;
    setLang(l);
    sayLanguage(l);
  }

  function beginRide(l: Lang) {
    setLang(l);
    sayLanguage(l);
    setStage("ride");
    // The language tap is a real touch, so full screen is allowed here.
    if (kiosk && !document.fullscreenElement) document.documentElement.requestFullscreen?.().catch(() => {});
  }

  function endRide() {
    setGame(null);
    setSheet(null);
    setQr(false);
    setNearly(false);
    setEndAt(null);
    setStage("farewell");
    // The spoken goodbye follows the time of day, like the screen (v5.43)
    speech.announce("announce", new Date().getHours() >= 17 ? AN.arrivedEvening : AN.arrived, lang);
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.().catch(() => {});
    else document.exitFullscreen?.().catch(() => {});
  }

  // Cash / Uber / Revolut — in the tip section and again on the farewell screen.
  const tipOpts = (
    <div className="v5-tip-opts">
      {TIPS.map((t) => {
        const on = tip === t.key;
        return (
          <button key={t.key} className="v5-tip-opt" aria-pressed={on} onClick={() => tapTip(t.key)}>
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Icon name={on ? "check" : t.icon} size={20} style={{ color: on ? "currentColor" : t.color }} />
              <span className="v5-label" style={{ color: "inherit" }}>{s.tip[t.key].label}</span>
            </span>
            <small>{s.tip[t.key].sub}</small>
          </button>
        );
      })}
    </div>
  );

  const closeOnScrim = (e: React.MouseEvent) => { if (e.target === e.currentTarget) setSheet(null); };

  const header = (
    <header className="v5-header">
      <span className="v5-wordmark v5-hold" onPointerDown={holdStart} onPointerUp={holdEnd} onPointerLeave={holdEnd} onPointerCancel={holdEnd}><Wordmark width={132} /></span>
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        {LANGS.map((l) => (
          <button key={l.id} className="v5-lang" aria-pressed={lang === l.id} onClick={() => switchLang(l.id)}>{l.label}</button>
        ))}
        <button className="v5-iconbtn" style={{ marginInlineStart: 8 }} aria-label={s.settings} onClick={() => setSheet("settings")}>
          <Icon name="settings" size={18} />
        </button>
      </div>
    </header>
  );

  return (
    <div className="v5" data-lang={lang} data-night={night} dir={isRTL ? "rtl" : "ltr"}>
      <MusicHero
        s={s}
        lang={lang}
        music={music}
        header={header}
        onPicker={() => setSheet("picker")}
        btOn={!!requests.bluetooth}
        onBtAsk={() => toggleRequest("bluetooth")}
        onBtHow={() => setSheet("bt")}
      />

      <main className="v5-main">
        {/* ── Tip: headline + three options; gold only once one is chosen ── */}
        <section className="v5-tip" aria-label={s.tipTitle} ref={tipRef}>
          <div className="v5-tip-head">
            <span className="v5-title">{s.tipTitle}</span>
            <span className="v5-sub" style={{ color: "var(--gold)" }}>{s.tipHint}</span>
          </div>
          {tipOpts}
        </section>

        {/* ── Ask Amish: on/off; "on" shows as a gold ring + check badge ── */}
        <section aria-label={s.askDriver}>
          <SectionHead title={s.askDriver} hint={s.askDriverHint} />
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
        <section aria-label={s.climateTitle}>
        <SectionHead title={s.climateTitle} />
        <div className="v5-climate">
          {(["cool", "warm"] as const).map((side) => {
            const on = climate === side;
            return (
              <button key={side} data-side={side} aria-pressed={on} onClick={() => tapClimate(side)}>
                <Icon name={on ? "check" : side === "cool" ? "snowflake" : "flame"} size={24}
                  style={{ color: on ? "var(--gold)" : side === "cool" ? "var(--i-sky)" : "var(--i-orange)" }} />
                <span className="v5-label">{side === "cool" ? s.cooler : s.warmer}</span>
              </button>
            );
          })}
        </div>
        </section>

        {/* ── Play: five games, one tap each (built from v5.3) ─────────── */}
        <section aria-label={s.gamesTitle}>
          <SectionHead title={s.gamesTitle} hint={s.gamesHint} />
          <div className="v5-grid5">
            {GAMES.map((g) => (
              <Circle key={g.key} icon={g.icon} color={g.color} label={resumable[g.key] ? s.resume : s.games[g.key]}
                on={resumable[g.key]} badge="play" onClick={() => openGame(g.key)} />
            ))}
          </div>
        </section>
      </main>

      {/* ── Station / playlist picker, with volume ───────────────────── */}
      {sheet === "picker" && (
        <div className="v5-overlay" onClick={closeOnScrim}>
          <div className="v5-sheet" role="dialog" aria-label={music.source === "radio" ? s.chooseStation : s.chooseMusic}>
            <div className="v5-handle" />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span className="v5-heading">{music.source === "radio" ? s.chooseStation : s.chooseMusic}</span>
              <button className="v5-pill" onClick={() => setSheet(null)}>{s.close}</button>
            </div>
            <Volume label={s.volume} value={music.volume} onChange={music.setVolume} />
            {music.source === "radio" ? (
              // Compact (owner, v5.17): one line per genre — its name, then its
              // stations three across — so 20 stations need little scrolling.
              <div className="v5-genre-list">
                {groupStations(radios).map(({ genre, items }) => (
                  <div key={genre} className="v5-genre-row">
                    <span className="v5-genre-name">
                      <Icon name={GENRES[genre].icon} size={16} style={{ color: GENRES[genre].color, flexShrink: 0 }} />
                      <span>{GENRES[genre].label[lang]}</span>
                    </span>
                    <div className="v5-pick" data-compact>
                      {items.map(({ st, idx }) => {
                        const offline = music.radio.brokenStations.has(idx) && music.radio.currentIdx !== idx;
                        return (
                          <button key={st.n + idx} className="v5-chip" aria-pressed={music.radio.currentIdx === idx} data-offline={offline}
                            aria-label={offline ? `${st.n} · ${s.offline}` : st.n}
                            onClick={() => { music.chooseStation(idx); setSheet(null); }}>
                            <span className="v5-chip-text">{st.n}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Playlists as genres, three across: styles first, then around the world
              (["style", "world"] as const).map((group) => (
                <div key={group}>
                  <div className="v5-genre-head"><span className="v5-caption">{group === "style" ? s.byStyle : s.aroundWorld}</span></div>
                  <div className="v5-pick" data-compact>
                    {PLAYLISTS.map((pl, i) => ({ pl, i, meta: PLAYLIST_META[pl.n] }))
                      .filter(({ meta }) => (meta?.group ?? "style") === group)
                      .map(({ pl, i, meta }) => (
                        <button key={pl.n} className="v5-gtile" aria-pressed={music.plIdx === i}
                          onClick={() => { music.choosePlaylist(i); setSheet(null); }}>
                          <span className="v5-gtile-icon"><Icon name={meta?.icon ?? "music-note"} size={16} style={{ color: meta?.color ?? "var(--ink)" }} /></span>
                          <span className="v5-chip-text">{meta?.label[lang] ?? pl.n}</span>
                        </button>
                      ))}
                  </div>
                </div>
              ))
            )}
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
            {/* Voice to Amish: always English (owner decision), so it's shown, not chosen */}
            <div className="v5-row">
              <Icon name="comment" size={20} style={{ color: "var(--i-teal)" }} />
              <span className="v5-set-text">
                <span className="v5-label">{s.voiceTo}</span>
                <span className="v5-sub">{s.voiceWhy}</span>
              </span>
              <span className="v5-set-value">{s.voiceEnglish}</span>
            </div>
            <div className="v5-row v5-row-stack">
              <span className="v5-set-line">
                <Icon name="volume" size={20} style={{ color: "var(--ink)" }} />
                <span className="v5-label" style={{ flex: 1 }}>{s.voiceVolume}</span>
                <button className="v5-pill" onClick={() => { if (passBump("test")) speech.say("test", SP.test); }}>
                  <Icon name="play" size={16} />{s.testVoice}
                </button>
              </span>
              <Volume label={s.voiceVolume} value={voiceVol} min={VOICE_MIN} onChange={changeVoiceVol} />
            </div>
            <div className="v5-row v5-row-stack">
              <span className="v5-set-line">
                <Icon name="headphones" size={20} style={{ color: "var(--ink)" }} />
                <span className="v5-label">{s.musicVolume}</span>
              </span>
              <Volume label={s.musicVolume} value={music.volume} onChange={music.setVolume} />
            </div>
            <div className="v5-row v5-row-stack">
              <span className="v5-set-line">
                <Icon name="moon" size={20} style={{ color: "var(--i-violet)" }} />
                <span className="v5-set-text">
                  <span className="v5-label">{s.nightMode}</span>
                  <span className="v5-sub">{s.nightSub}</span>
                </span>
              </span>
              <div className="v5-seg" role="radiogroup" aria-label={s.nightMode}>
                {(["auto", "on", "off"] as const).map((m) => (
                  <button key={m} role="radio" aria-checked={nightMode === m} aria-pressed={nightMode === m} onClick={() => changeNight(m)}>
                    {s.nightModes[m]}
                  </button>
                ))}
              </div>
            </div>
            {/* Shown as text, not a tel: link: a tap would open the dialler and leave the app (kiosk, v5.30) */}
            <div className="v5-row">
              <Icon name="phone" size={20} style={{ color: "var(--i-green)" }} />
              <span className="v5-set-text">
                <span className="v5-label">{s.contactDriver}</span>
                <span className="v5-sub">{s.contactSub}</span>
              </span>
              <span className="v5-set-phone" dir="ltr" style={{ userSelect: "text" }}>{driver.phone}</span>
            </div>
            {/* Full screen and New ride are Amish's now: Driver panel (hold the LuxPro name) */}
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

      {/* ── Games: a crash closes just that game (v5.30) ───────────────── */}
      <GameBoundary key={game ?? "none"} onError={() => { setGame(null); showToast(s.gameError); }}>
      {(game === "quiz" || game === "riddles") && (
        <WordGame
          kind={game}
          s={s}
          lang={lang}
          deck={deck}
          prize={prize}
          onAnswer={(ok) => setPrize((p) => prizeAnswer(p, ok))}
          onTake={takePrize}
          onDecline={() => setPrize((p) => decline(p))}
          best={best}
          onKeep={() => setPrize((p) => keepPlaying(p))}
          onRestart={() => setPrize((p) => prizeRestart(p))}
          asked={!!asked[game]}
          onAsk={() => askDriverToPlay(game)}
          onClose={() => setGame(null)}
          top={halfTop}
        />
      )}
      {game === "snake" && <SnakeGame s={s} saved={snakeSave} onSave={setSnakeSave} onClose={() => setGame(null)} top={halfTop} hold={!!sheet || qr}
        ridePrize={best} onPrize={(tier, score) => takeGamePrize(tier, "Snake", `with ${score} points`)} />}
      {game === "blocks" && <BlocksGame s={s} saved={blocksSave} onSave={setBlocksSave} onClose={() => setGame(null)} top={halfTop} hold={!!sheet || qr}
        ridePrize={best} onPrize={(tier, score) => takeGamePrize(tier, "Blocks", `with ${score} points`)} />}
      {game === "mines" && (
        <MinesGame s={s} saved={minesSave} onSave={setMinesSave} onClose={() => setGame(null)} top={halfTop}
          best={best} onPrize={(tier, level) => takeGamePrize(tier, "Mines", `on the ${T.en.levels[level]} board`)} />
      )}
      </GameBoundary>

      {/* ── Revolut QR ───────────────────────────────────────────────── */}
      {qr && (
        <div className="v5-full" role="dialog" aria-label={s.qrTitle}>
          <span className="v5-heading">{s.qrTitle}</span>
          {qrFailed ? (
            // The image is on the tablet, so this is rare — but never a blank square
            <div style={{ display: "grid", gap: 12, maxWidth: 420 }}>
              <span className="v5-label" style={{ fontWeight: 400, color: "var(--body)" }}>{s.qrFailed}</span>
              <span className="v5-title" style={{ color: "var(--gold)" }} dir="auto">{s.qrHandle}</span>
            </div>
          ) : (
            <div className="v5-qr">
              <RevolutQr driver={driver} alt={s.qrTitle} onFail={() => setQrFailed(true)} />
              <span className="v5-qr-handle" dir="ltr">@{driver.revolut}</span>
            </div>
          )}
          {!qrFailed && <span className="v5-label" style={{ fontWeight: 400, color: "var(--body)", maxWidth: 420 }}>{s.qrSub}</span>}
          <button className="v5-pill" style={{ minWidth: 160, height: 56 }} onClick={() => setQr(false)}>{s.backToRide}</button>
        </div>
      )}

      {nearly && stage === "ride" && <NearlyBanner s={s} onClose={() => setNearly(false)} />}
      {stage === "welcome" && <Welcome T={T} driver={driver} onBegin={beginRide} secondsLeft={welcomeLeft} />}
      {stage === "farewell" && <Farewell s={s} name={driverName} trips={driver.trips} tipped={!!tip} tipButtons={tipOpts} phone={driver.phone}
        prize={best ? s.tiers[TIER_KEYS[best.tier]] : null} />}
      {driverOpen && (
        <Driver
          stage={stage}
          isFS={isFS}
          kiosk={kiosk}
          phone={phone}
          onClose={() => setDriverOpen(false)}
          onNewPassenger={newPassenger}
          endAt={endAt}
          onEndTrip={endTrip}
          onCancelEnd={cancelEnd}
          onFullscreen={toggleFullscreen}
          onKiosk={changeKiosk}
          driver={driver}
          onDriver={(p) => { saveDriver(p); setDriver(p); }}
        />
      )}

      {toast && <div className="v5-toast" role="status">{toast}</div>}

      {/* Hidden SoundCloud player — driven entirely by the hero's controls */}
      {/* Android sometimes needs one tap inside the player itself (v5.23) */}
      {music.sc.needsTap && music.source === "playlists" && (
        <div className="v5-sc-tap" role="dialog" aria-label={s.tapToStart}>
          <span className="v5-label">{s.tapToStart}</span>
          <span className="v5-sc-slot" aria-hidden />
          <button className="v5-pill" onClick={() => music.sc.pause()}>{s.close}</button>
        </div>
      )}
      {music.sc.src && (
        <iframe
          key={music.sc.src}
          ref={music.sc.iframeRef}
          src={music.sc.src}
          title="Playlist player"
          allow="autoplay"
          // No popups or page changes: the player's SoundCloud links can't take
          // the passenger out of the app when it is shown for a tap (v5.30)
          sandbox="allow-scripts allow-same-origin allow-presentation"
          aria-hidden={!(music.sc.needsTap && music.source === "playlists")}
          tabIndex={-1}
          className={music.sc.needsTap && music.source === "playlists" ? "v5-sc-frame" : undefined}
          style={music.sc.needsTap && music.source === "playlists" ? undefined : { position: "absolute", width: 1, height: 1, opacity: 0, pointerEvents: "none", border: 0 }}
        />
      )}
    </div>
  );
}
