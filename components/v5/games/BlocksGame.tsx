"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Icon, type IconName } from "../../Icon";
import type { V5Strings } from "../strings";
import {
  newBlocks, start, move, rotate, tick, softDrop, landing, cellsOf, fallMs, resting, lockPiece, LOCK_MS,
  type Blocks, type Key,
} from "./blocks";
import { resolveColor, rounded, readBest, saveBest, prepare } from "./canvas";
import GamePrize from "./GamePrize";
import PrizeLadder from "./PrizeLadder";
import { BLOCKS_POINTS, blocksTier, type Best } from "./prize";
import { useEndGuard } from "./useEndGuard";

// Blocks for a moving car (roadmap P5): four big buttons — Left, Right,
// Rotate, Down — no swipes and no instant drop. Left / Right / Down repeat
// while held; a resting piece waits half a second before it locks.
// "Relaxed" speed by default. Home keeps the game, paused. Canvas + one rAF loop.
const COLS = 10;
// v5.15 (Amish): opens in the lower half, under the tip box, like Mines —
// 12 rows instead of 20 so the squares stay big enough to follow in a car.
const ROWS = 12;
type Speed = "relaxed" | "normal" | "fast";
const SPEEDS: Speed[] = ["relaxed", "normal", "fast"];
const FALL: Record<Speed, [number, number]> = { relaxed: [1000, 400], normal: [750, 200], fast: [500, 120] };
const BEST_KEY = "luxpro.v5.blocksBest";
const REPEAT_DELAY = 260;
const REPEAT_EVERY = 110;

const PIECE_TOKENS: Record<Key, [string, string]> = {
  I: ["--i-sky", "#5bb8e8"], O: ["--i-lemon", "#e5cf5a"], T: ["--i-violet", "#a68be8"],
  S: ["--i-green", "#5fbf7a"], Z: ["--i-red", "#e4675d"], J: ["--i-blue", "#6c8ff0"], L: ["--i-orange", "#ec9a4f"],
};

type Action = "left" | "right" | "rotate" | "down";

export interface BlocksSave { game: Blocks; speed: Speed }

export default function BlocksGame({ s, saved: savedIn, onSave, onClose, top, hold, ridePrize, onPrize }: {
  s: V5Strings;
  saved: BlocksSave | null;
  onSave: (g: BlocksSave) => void;
  onClose: () => void;
  top: number;   // where the half-screen panel starts (just under the tip box)
  hold: boolean; // something is open on top of the panel
  ridePrize: Best | null; // the ride's best prize so far (v5.41)
  onPrize: (tier: number, score: number) => void;
}) {
  // A game saved on the old full-screen board doesn't fit this one.
  const saved = savedIn && savedIn.game.rows === ROWS && savedIn.game.cols === COLS ? savedIn : null;
  const g0 = saved?.game ?? null;
  const resumed = g0?.status === "playing";
  const [speed, setSpeed] = useState<Speed>(saved?.speed ?? "relaxed");
  const [view, setView] = useState({
    status: g0?.status ?? ("ready" as Blocks["status"]),
    score: g0?.score ?? 0, lines: g0?.lines ?? 0, level: g0?.level ?? 1, next: g0?.next ?? ("T" as Key),
  });
  const [best, setBest] = useState(0);
  // "+300" next to the score when lines clear, so passengers see what a line is worth (owner, v5.43)
  const [gain, setGain] = useState(0);
  const [gainKey, setGainKey] = useState(0);
  const lastLines = useRef({ lines: 0, score: 0 });
  useEffect(() => {
    const was = lastLines.current;
    if (view.lines > was.lines && view.score > was.score) { setGain(view.score - was.score); setGainKey((k) => k + 1); }
    lastLines.current = { lines: view.lines, score: view.score };
  }, [view.lines, view.score]);
  useEffect(() => {
    if (!gain) return;
    const t = setTimeout(() => setGain(0), 1600);
    return () => clearTimeout(t);
  }, [gain, gainKey]);
  const [paused, setPaused] = useState(resumed);
  const [size, setSize] = useState(0);

  const game = useRef<Blocks>(g0 ?? newBlocks(COLS, ROWS));
  const pausedRef = useRef(resumed);
  const speedRef = useRef<Speed>(saved?.speed ?? "relaxed");
  const dirty = useRef(true);
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const nextCanvas = useRef<HTMLCanvasElement>(null);
  const colors = useRef<Record<string, string>>({});
  const repeat = useRef<{ t?: ReturnType<typeof setTimeout>; i?: ReturnType<typeof setInterval> }>({});

  useEffect(() => { setBest(readBest(BEST_KEY)); }, []);
  useEffect(() => { speedRef.current = speed; }, [speed]);
  useEffect(() => { pausedRef.current = paused; }, [paused]);
  // A sheet or the tip QR opened over the panel: pause, the passenger is busy.
  useEffect(() => {
    if (hold && game.current.status === "playing") setPaused(true);
  }, [hold]);
  // Leaving for Home hands the game back to the app, to resume later.
  useEffect(() => () => onSave({ game: game.current, speed: speedRef.current }), [onSave]);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const c: Record<string, string> = {
      cell: resolveColor(el, "--s0", "#100e0b"), // wells on the half panel (--s1)
      line: resolveColor(el, "--line-strong", "#3a3631"),
    };
    (Object.keys(PIECE_TOKENS) as Key[]).forEach((k) => { c[k] = resolveColor(el, PIECE_TOKENS[k][0], PIECE_TOKENS[k][1]); });
    colors.current = c;
    const fit = () => {
      setSize(Math.max(12, Math.floor(Math.min(el.clientWidth / COLS, el.clientHeight / ROWS))));
      dirty.current = true;
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const draw = useCallback(() => {
    const cv = canvas.current;
    if (!cv || !size) return;
    const ctx = prepare(cv, COLS * size, ROWS * size);
    if (!ctx) return;
    const c = colors.current;
    const g = game.current;
    const pad = Math.max(1, size * 0.06);
    const rad = size * 0.18;
    const sq = (r: number, col: number) => rounded(ctx, col * size + pad, r * size + pad, size - pad * 2, size - pad * 2, rad);

    ctx.fillStyle = c.cell;
    for (let i = 0; i < COLS * ROWS; i++) sq(Math.floor(i / COLS), i % COLS);

    g.board.forEach((k, i) => { if (k) { ctx.fillStyle = c[k]; sq(Math.floor(i / COLS), i % COLS); } });

    if (g.status !== "over") {
      // Ghost: where the piece will land
      ctx.globalAlpha = 0.22;
      ctx.fillStyle = c[g.piece.key];
      for (const [r, col] of cellsOf(landing(g))) if (r >= 0) sq(r, col);
      ctx.globalAlpha = 1;
      for (const [r, col] of cellsOf(g.piece)) if (r >= 0) sq(r, col);
    }

    // Next piece, centred in its box
    const nc = nextCanvas.current;
    if (nc) {
      const box = Math.round(size * 0.8) * 4;
      const nctx = prepare(nc, box, box);
      if (nctx) {
        const cs = box / 4;
        const cells = cellsOf({ key: g.next, rot: 0, x: 0, y: 0 });
        const rs = cells.map(([r]) => r), cols = cells.map(([, col]) => col);
        const offR = (4 - (Math.max(...rs) - Math.min(...rs) + 1)) / 2 - Math.min(...rs);
        const offC = (4 - (Math.max(...cols) - Math.min(...cols) + 1)) / 2 - Math.min(...cols);
        nctx.fillStyle = c[g.next];
        for (const [r, col] of cells) rounded(nctx, (col + offC) * cs + 1.5, (r + offR) * cs + 1.5, cs - 3, cs - 3, cs * 0.18);
      }
    }
  }, [size]);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let acc = 0;
    let rest = 0; // how long the piece has been resting
    const frame = (t: number) => {
      const dt = Math.min(t - last, 250);
      last = t;
      if (game.current.status === "playing" && !pausedRef.current) {
        acc += dt;
        const [base, floor] = FALL[speedRef.current];
        let every = fallMs(game.current.level, base, floor);
        while (acc >= every) {
          acc -= every;
          const n = tick(game.current);
          if (n !== game.current) { game.current = n; dirty.current = true; }
          every = fallMs(game.current.level, base, floor);
        }
        // Half a second on the floor before it locks (sliding off a ledge resets this)
        if (resting(game.current)) {
          rest += dt;
          if (rest >= LOCK_MS) { game.current = lockPiece(game.current); rest = 0; acc = 0; dirty.current = true; }
        } else rest = 0;
      } else { acc = 0; rest = 0; }
      if (dirty.current) {
        dirty.current = false;
        draw();
        const g = game.current;
        setView((v) =>
          v.status === g.status && v.score === g.score && v.lines === g.lines && v.level === g.level && v.next === g.next
            ? v : { status: g.status, score: g.score, lines: g.lines, level: g.level, next: g.next });
        if (g.status === "over" && saveBest(BEST_KEY, g.score)) setBest(g.score);
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [draw]);

  useEffect(() => {
    const onHide = () => { if (document.hidden && game.current.status === "playing") setPaused(true); };
    document.addEventListener("visibilitychange", onHide);
    return () => document.removeEventListener("visibilitychange", onHide);
  }, []);

  const act = useCallback((a: Action) => {
    if (pausedRef.current) return;
    const g = game.current;
    if (g.status === "ready") { game.current = start(g); dirty.current = true; return; }
    game.current =
      a === "left" ? move(g, -1)
      : a === "right" ? move(g, 1)
      : a === "rotate" ? rotate(g)
      : softDrop(g);
    dirty.current = true;
  }, []);

  const stopRepeat = useCallback(() => {
    clearTimeout(repeat.current.t);
    clearInterval(repeat.current.i);
    repeat.current = {};
  }, []);
  useEffect(() => stopRepeat, [stopRepeat]);

  useEffect(() => {
    const map: Record<string, Action> = { ArrowLeft: "left", ArrowRight: "right", ArrowUp: "rotate", ArrowDown: "down" };
    const onKey = (e: KeyboardEvent) => { const a = map[e.key]; if (a) { e.preventDefault(); act(a); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [act]);

  function restart() {
    stopRepeat();
    game.current = newBlocks(COLS, ROWS);
    setPaused(false);
    dirty.current = true;
  }

  const playing = view.status === "playing";
  const over = view.status === "over";
  const againReady = useEndGuard(over);

  // Act on touch-down; Left / Right / Down keep going while held.
  const control = (a: Action, icon: IconName, label: string, cls: string, rotateDeg = 0, held = false) => (
    <button className={`v5-arrow ${cls}`} aria-label={label}
      onPointerDown={(e) => {
        e.preventDefault();
        act(a);
        if (held) {
          stopRepeat();
          repeat.current.t = setTimeout(() => { repeat.current.i = setInterval(() => act(a), REPEAT_EVERY); }, REPEAT_DELAY);
        }
      }}
      onPointerUp={stopRepeat} onPointerLeave={stopRepeat} onPointerCancel={stopRepeat}
      onClick={(e) => { if (e.detail === 0) act(a); }}>
      <Icon name={icon} size={28} style={rotateDeg ? { transform: `rotate(${rotateDeg}deg)` } : undefined} />
      {(a === "rotate" || a === "down") && <span className="v5-arrow-label">{label}</span>}
    </button>
  );

  return (
    <div className="v5-game" data-half role="dialog" aria-label={s.games.blocks} style={{ top }}>
      {/* One row: Close, speed, Pause — the half panel has no room for a title */}
      <div className="v5-half-bar">
        <button className="v5-pill" onClick={onClose}>
          <Icon name="chevron-down" size={18} />
          {s.close}
        </button>
        <div className="v5-seg" role="radiogroup" aria-label={s.games.blocks}>
          {SPEEDS.map((sp) => (
            <button key={sp} role="radio" aria-checked={speed === sp} aria-pressed={speed === sp} onClick={() => setSpeed(sp)}>
              {s.speeds[sp]}
            </button>
          ))}
        </div>
        <button className="v5-iconbtn" disabled={!playing} aria-pressed={paused} aria-label={paused ? s.resume : s.pause}
          onClick={() => { stopRepeat(); setPaused((p) => !p); }}>
          <Icon name={paused ? "play" : "pause"} size={18} />
        </button>
      </div>

      {/* The prize ladder, the same format as the Quiz (owner, v5.43) */}
      <PrizeLadder s={s} points={BLOCKS_POINTS} score={view.score} />

      <div className="v5-blocks-main">
        <div className="v5-board-wrap" ref={wrap}>
          <div className="v5-snake-board" style={{ width: COLS * size, height: ROWS * size }}>
            <canvas ref={canvas} style={{ width: COLS * size, height: ROWS * size, display: "block" }} aria-hidden />
            {view.status === "ready" && <div className="v5-snake-note"><span>{s.blocksStart}</span></div>}
            {paused && playing && (
              <div className="v5-snake-note" data-solid>
                <span className="v5-heading">{s.paused}</span>
                <button className="v5-next" style={{ minWidth: 180 }} onClick={() => setPaused(false)}>
                  <Icon name="play" size={20} />{s.resume}
                </button>
              </div>
            )}
          </div>
        </div>

        <aside className="v5-blocks-side">
          <div className="v5-blocks-next">
            <span className="v5-caption">{s.nextPiece}</span>
            <canvas ref={nextCanvas} style={{ width: Math.round(size * 0.8) * 4, height: Math.round(size * 0.8) * 4, display: "block" }} aria-hidden />
          </div>
          {/* Score and lines only: the prize ladder above now carries the targets (v5.43) */}
          {([[s.score, view.score], [s.lines, view.lines]] as [string, number][]).map(([label, n]) => (
            <div key={label} className="v5-blocks-stat">
              <span className="v5-caption">{label}</span>
              <b dir="ltr">{n}</b>
              {label === s.score && gain > 0 && <span className="v5-gain" key={gainKey} dir="ltr">+{gain}</span>}
            </div>
          ))}
        </aside>
      </div>

      {/* Physical directions: never mirrored for right-to-left */}
      <div className="v5-dpad v5-dpad-blocks" dir="ltr">
        {control("left", "arrow-up", "Left", "v5-b-left", -90, true)}
        {control("right", "arrow-up", "Right", "v5-b-right", 90, true)}
        {control("rotate", "refresh", s.rotate, "v5-b-rotate")}
        {control("down", "arrow-up", s.down, "v5-b-down", 180, true)}
      </div>
      {over && (
        <GamePrize s={s} caption={s.pointsWord.replace("{n}", String(view.score))} tier={blocksTier(view.score)} best={ridePrize}
          ladder={BLOCKS_POINTS} ready={againReady} onAgain={restart}
          hint={s.pointsToWin.replace("{n}", String(BLOCKS_POINTS[0])).replace("{tier}", s.tiers.bronze)}
          onTake={() => onPrize(blocksTier(view.score), view.score)} />
      )}
    </div>
  );
}
