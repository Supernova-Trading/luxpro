"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Icon, type IconName } from "../../Icon";
import type { V5Strings } from "../strings";
import {
  newBlocks, start, move, rotate, tick, softDrop, hardDrop, landing, cellsOf, fallMs,
  type Blocks, type Key,
} from "./blocks";
import { resolveColor, rounded, readBest, saveBest, prepare } from "./canvas";

// Blocks for a moving car: big buttons only (no swipes), "Relaxed" speed by
// default, Left / Right / Down repeat while held, Drop ignores a second
// press for 0.4 s so a jolt can't drop two pieces. Canvas + one rAF loop.
const COLS = 10;
const ROWS = 20;
type Speed = "relaxed" | "normal" | "fast";
const SPEEDS: Speed[] = ["relaxed", "normal", "fast"];
const FALL: Record<Speed, [number, number]> = { relaxed: [1000, 400], normal: [750, 200], fast: [500, 120] };
const BEST_KEY = "luxpro.v5.blocksBest";
const REPEAT_DELAY = 260;
const REPEAT_EVERY = 110;
const DROP_GUARD_MS = 400;

const PIECE_TOKENS: Record<Key, [string, string]> = {
  I: ["--i-sky", "#5bb8e8"], O: ["--i-lemon", "#e5cf5a"], T: ["--i-violet", "#a68be8"],
  S: ["--i-green", "#5fbf7a"], Z: ["--i-red", "#e4675d"], J: ["--i-blue", "#6c8ff0"], L: ["--i-orange", "#ec9a4f"],
};

type Action = "left" | "right" | "rotate" | "down" | "drop";

export default function BlocksGame({ s, onClose }: { s: V5Strings; onClose: () => void }) {
  const [speed, setSpeed] = useState<Speed>("relaxed");
  const [view, setView] = useState({ status: "ready" as Blocks["status"], score: 0, lines: 0, level: 1, next: "T" as Key });
  const [best, setBest] = useState(0);
  const [paused, setPaused] = useState(false);
  const [size, setSize] = useState(0);

  const game = useRef<Blocks>(newBlocks(COLS, ROWS));
  const pausedRef = useRef(false);
  const speedRef = useRef<Speed>("relaxed");
  const dirty = useRef(true);
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const nextCanvas = useRef<HTMLCanvasElement>(null);
  const colors = useRef<Record<string, string>>({});
  const repeat = useRef<{ t?: ReturnType<typeof setTimeout>; i?: ReturnType<typeof setInterval> }>({});
  const lastDrop = useRef(0);

  useEffect(() => { setBest(readBest(BEST_KEY)); }, []);
  useEffect(() => { speedRef.current = speed; }, [speed]);
  useEffect(() => { pausedRef.current = paused; }, [paused]);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const c: Record<string, string> = {
      cell: resolveColor(el, "--s1", "#1c1a17"),
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
    const frame = (t: number) => {
      const dt = Math.min(t - last, 250);
      last = t;
      if (game.current.status === "playing" && !pausedRef.current) {
        acc += dt;
        const [base, floor] = FALL[speedRef.current];
        let every = fallMs(game.current.level, base, floor);
        while (acc >= every) {
          acc -= every;
          game.current = tick(game.current);
          dirty.current = true;
          every = fallMs(game.current.level, base, floor);
        }
      } else acc = 0;
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
    if (a === "drop") {
      const now = Date.now();
      if (now - lastDrop.current < DROP_GUARD_MS) return;
      lastDrop.current = now;
    }
    game.current =
      a === "left" ? move(g, -1)
      : a === "right" ? move(g, 1)
      : a === "rotate" ? rotate(g)
      : a === "down" ? softDrop(g)
      : hardDrop(g);
    dirty.current = true;
  }, []);

  const stopRepeat = useCallback(() => {
    clearTimeout(repeat.current.t);
    clearInterval(repeat.current.i);
    repeat.current = {};
  }, []);
  useEffect(() => stopRepeat, [stopRepeat]);

  useEffect(() => {
    const map: Record<string, Action> = { ArrowLeft: "left", ArrowRight: "right", ArrowUp: "rotate", ArrowDown: "down", " ": "drop" };
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
      {(a === "rotate" || a === "drop" || a === "down") && <span className="v5-arrow-label">{label}</span>}
    </button>
  );

  return (
    <div className="v5-game" role="dialog" aria-label={s.games.blocks}>
      <div className="v5-game-bar">
        <button className="v5-pill" onClick={onClose}>
          <Icon name="chevron-left" size={18} className="v5-flip" />
          {s.home}
        </button>
        <span className="v5-heading">{s.games.blocks}</span>
        <button className="v5-pill" style={{ justifySelf: "end" }} disabled={!playing} aria-pressed={paused}
          onClick={() => { stopRepeat(); setPaused((p) => !p); }}>
          <Icon name={paused ? "play" : "pause"} size={18} />
          {paused ? s.resume : s.pause}
        </button>
      </div>

      <div className="v5-seg" role="radiogroup" aria-label={s.games.blocks}>
        {SPEEDS.map((sp) => (
          <button key={sp} role="radio" aria-checked={speed === sp} aria-pressed={speed === sp} onClick={() => setSpeed(sp)}>
            {s.speeds[sp]}
          </button>
        ))}
      </div>

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
            {over && (
              <div className="v5-snake-note" data-solid>
                <span className="v5-heading">{s.gameOver}</span>
                <span className="v5-label" style={{ color: "var(--muted)" }}>{s.score} <b dir="ltr" style={{ color: "var(--ink)" }}>{view.score}</b></span>
                <button className="v5-next" style={{ minWidth: 180 }} onClick={restart}>
                  <Icon name="refresh" size={20} />{s.playAgain}
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
          {([[s.score, view.score], [s.best, Math.max(best, view.score)], [s.lines, view.lines], [s.level, view.level]] as [string, number][]).map(([label, n]) => (
            <div key={label} className="v5-blocks-stat">
              <span className="v5-caption">{label}</span>
              <b dir="ltr">{n}</b>
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
        {control("drop", "download", s.drop, "v5-b-drop")}
      </div>
    </div>
  );
}
