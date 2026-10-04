"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "../../Icon";
import type { V5Strings } from "../strings";
import { newSnake, turn, step, type Dir, type Snake } from "./snake";
import { resolveColor, rounded, readBest, saveBest, prepare } from "./canvas";
import { useEndGuard } from "./useEndGuard";

// Snake for a moving car: big arrow buttons (no swipes), "Relaxed" speed by
// default, edges wrap round, pauses itself if the screen goes away.
// Home keeps the game, paused, until the passenger comes back (roadmap P5).
// Drawn on one canvas with requestAnimationFrame — the old Tab A stutters if
// every square is a DOM element re-rendering by React.
const COLS = 12;
const ROWS = 13;
type Speed = "relaxed" | "normal" | "fast";
const SPEEDS: Speed[] = ["relaxed", "normal", "fast"];
const STEP_MS: Record<Speed, number> = { relaxed: 280, normal: 190, fast: 130 };
const BEST_KEY = "luxpro.v5.snakeBest";

export interface SnakeSave { game: Snake; speed: Speed }

export default function SnakeGame({ s, saved, onSave, onClose }: {
  s: V5Strings;
  saved: SnakeSave | null;
  onSave: (g: SnakeSave) => void;
  onClose: () => void;
}) {
  const resumed = saved?.game.status === "playing";
  const [speed, setSpeed] = useState<Speed>(saved?.speed ?? "relaxed");
  const [status, setStatus] = useState<Snake["status"]>(saved?.game.status ?? "ready");
  const [score, setScore] = useState(saved?.game.score ?? 0);
  const [best, setBest] = useState(0);
  const [paused, setPaused] = useState(resumed);
  const [size, setSize] = useState(0);

  const game = useRef<Snake>(saved?.game ?? newSnake(COLS, ROWS));
  const pausedRef = useRef(resumed);
  const stepMs = useRef(STEP_MS[saved?.speed ?? "relaxed"]);
  const speedRef = useRef<Speed>(saved?.speed ?? "relaxed");
  const dirty = useRef(true);
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const colors = useRef<Record<string, string>>({});

  useEffect(() => { setBest(readBest(BEST_KEY)); }, []);
  useEffect(() => { stepMs.current = STEP_MS[speed]; speedRef.current = speed; }, [speed]);
  // Leaving for Home hands the game back to the app, to resume later.
  useEffect(() => () => onSave({ game: game.current, speed: speedRef.current }), [onSave]);
  useEffect(() => { pausedRef.current = paused; }, [paused]);

  // Biggest square size that fits the space between the header and controls.
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    colors.current = {
      cell: resolveColor(el, "--s1", "#1c1a17"),
      snake: resolveColor(el, "--i-green", "#5fbf7a"),
      head: resolveColor(el, "--i-teal", "#4cc3b4"),
      food: resolveColor(el, "--i-red", "#e4675d"),
      eye: resolveColor(el, "--s0", "#121110"),
    };
    const fit = () => {
      setSize(Math.max(16, Math.floor(Math.min(el.clientWidth / COLS, el.clientHeight / ROWS))));
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
    const pad = Math.max(1.5, size * 0.06);
    const rad = size * 0.22;

    ctx.fillStyle = c.cell;
    for (let i = 0; i < COLS * ROWS; i++) rounded(ctx, (i % COLS) * size + pad, Math.floor(i / COLS) * size + pad, size - pad * 2, size - pad * 2, rad);

    if (g.food >= 0) {
      ctx.fillStyle = c.food;
      ctx.beginPath();
      ctx.arc((g.food % COLS + 0.5) * size, (Math.floor(g.food / COLS) + 0.5) * size, size * 0.3, 0, Math.PI * 2);
      ctx.fill();
    }

    g.body.forEach((cell, k) => {
      ctx.fillStyle = k === 0 ? c.head : c.snake;
      ctx.globalAlpha = k === 0 ? 1 : Math.max(0.55, 1 - k * 0.02);
      rounded(ctx, (cell % COLS) * size + pad, Math.floor(cell / COLS) * size + pad, size - pad * 2, size - pad * 2, rad);
    });
    ctx.globalAlpha = 1;

    // Eyes face the way the snake is heading
    const hx = (g.body[0] % COLS + 0.5) * size, hy = (Math.floor(g.body[0] / COLS) + 0.5) * size;
    const f = size * 0.17, sd = size * 0.16;
    const [dx, dy] = g.dir === "up" ? [0, -1] : g.dir === "down" ? [0, 1] : g.dir === "left" ? [-1, 0] : [1, 0];
    ctx.fillStyle = c.eye;
    for (const side of [-1, 1]) {
      ctx.beginPath();
      ctx.arc(hx + dx * f + dy * sd * side, hy + dy * f + dx * sd * side, size * 0.07, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [size]);

  // One loop for the whole game: step on the clock, draw only after a change.
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let acc = 0;
    const frame = (t: number) => {
      const dt = Math.min(t - last, 250);
      last = t;
      const g = game.current;
      if (g.status === "playing" && !pausedRef.current) {
        acc += dt;
        while (acc >= stepMs.current) {
          acc -= stepMs.current;
          game.current = step(game.current);
          dirty.current = true;
        }
      } else acc = 0;
      if (dirty.current) {
        dirty.current = false;
        draw();
        const now = game.current;
        setScore(now.score);
        setStatus(now.status);
        if (now.status === "over" || now.status === "won") {
          if (saveBest(BEST_KEY, now.score)) setBest(now.score);
        }
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [draw]);

  // Pause when the tablet sleeps or the tab is hidden.
  useEffect(() => {
    const onHide = () => { if (document.hidden && game.current.status === "playing") setPaused(true); };
    document.addEventListener("visibilitychange", onHide);
    return () => document.removeEventListener("visibilitychange", onHide);
  }, []);

  const press = useCallback((d: Dir) => {
    if (pausedRef.current) return;
    game.current = turn(game.current, d);
    dirty.current = true;
  }, []);

  // Arrow keys too (desktop testing, keyboards)
  useEffect(() => {
    const map: Record<string, Dir> = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right" };
    const onKey = (e: KeyboardEvent) => { const d = map[e.key]; if (d) { e.preventDefault(); press(d); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [press]);

  function restart() {
    game.current = newSnake(COLS, ROWS);
    setPaused(false);
    dirty.current = true;
  }

  const playing = status === "playing";
  const over = status === "over" || status === "won";
  const againReady = useEndGuard(over);

  // Press on touch-down, not release: a car's motion makes taps slow to lift.
  const arrow = (d: Dir, rotate: number, cls: string) => (
    <button className={`v5-arrow ${cls}`} aria-label={d}
      onPointerDown={(e) => { e.preventDefault(); press(d); }}
      onClick={(e) => { if (e.detail === 0) press(d); }}>
      <Icon name="arrow-up" size={30} style={{ transform: `rotate(${rotate}deg)` }} />
    </button>
  );

  return (
    <div className="v5-game" role="dialog" aria-label={s.games.snake}>
      <div className="v5-game-bar">
        <button className="v5-pill" onClick={onClose}>
          <Icon name="chevron-left" size={18} className="v5-flip" />
          {s.home}
        </button>
        <span className="v5-heading">{s.games.snake}</span>
        <button className="v5-pill" style={{ justifySelf: "end" }} disabled={!playing} aria-pressed={paused}
          onClick={() => setPaused((p) => !p)}>
          <Icon name={paused ? "play" : "pause"} size={18} />
          {paused ? s.resume : s.pause}
        </button>
      </div>

      <div className="v5-seg" role="radiogroup" aria-label={s.games.snake}>
        {SPEEDS.map((sp) => (
          <button key={sp} role="radio" aria-checked={speed === sp} aria-pressed={speed === sp} onClick={() => setSpeed(sp)}>
            {s.speeds[sp]}
          </button>
        ))}
      </div>

      <div className="v5-mines-status">
        <span className="v5-mines-count">
          <span>{s.score}</span><b dir="ltr">{score}</b>
          <span style={{ marginInlineStart: 12 }}>{s.best}</span><b dir="ltr">{Math.max(best, score)}</b>
        </span>
      </div>

      <div className="v5-board-wrap" ref={wrap}>
        <div className="v5-snake-board" style={{ width: COLS * size, height: ROWS * size }}>
          <canvas ref={canvas} style={{ width: COLS * size, height: ROWS * size, display: "block" }} aria-hidden />
          {status === "ready" && <div className="v5-snake-note"><span>{s.snakeStart}</span></div>}
          {paused && playing && (
            <div className="v5-snake-note" data-solid>
              <span className="v5-heading">{s.paused}</span>
              <button className="v5-next" style={{ minWidth: 200 }} onClick={() => setPaused(false)}>
                <Icon name="play" size={20} />{s.resume}
              </button>
            </div>
          )}
          {over && (
            <div className="v5-snake-note" data-solid>
              <span className="v5-heading">{score > 0 ? s.wellPlayed : s.notThisTime}</span>
              <span className="v5-label" style={{ color: "var(--muted)" }}>{s.score} <b dir="ltr" style={{ color: "var(--ink)" }}>{score}</b></span>
              <button className="v5-next" style={{ minWidth: 200 }} disabled={!againReady} onClick={restart}>
                <Icon name="refresh" size={20} />{s.playAgain}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Physical directions: never mirrored for right-to-left */}
      <div className="v5-dpad" dir="ltr">
        {arrow("left", -90, "v5-arrow-left")}
        {arrow("up", 0, "v5-arrow-up")}
        {arrow("down", 180, "v5-arrow-down")}
        {arrow("right", 90, "v5-arrow-right")}
      </div>
    </div>
  );
}
