"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "../../Icon";
import type { QuizLevel, V5Strings } from "../strings";
import { newBoard, dig, toggleFlag, flagsLeft, type Board } from "./mines";
import { useEndGuard } from "./useEndGuard";
import GamePrize from "./GamePrize";
import { MINES_TIER, type Prize } from "./prize";

// Mines for a moving car: one board size with big squares, the level only
// changes how many mines. No timer, no long-press — a Dig / Flag switch
// instead, because a held finger in a car turns into an accidental dig.
// One "Undo, was that a bump?" per game takes back the dig that hit a mine.
// v5.13 mockup (Amish's idea): the game opens in the lower half of the screen,
// under the tip box, so music and tips stay in view — a shorter 8 × 6 board
// keeps the squares as big as before. Same mine density as the 8 × 10 board.
// v5.39 (owner): the board grows with the level — Medium has twice the
// squares of Easy. Hard stays 8 rows high: more rows would make squares too
// small to tap in a moving car in the half panel (about 33 px already).
const SIZES: Record<QuizLevel, { rows: number; cols: number; mines: number }> = {
  easy: { rows: 6, cols: 8, mines: 6 },      // 48 squares
  medium: { rows: 8, cols: 12, mines: 13 },  // 96
  hard: { rows: 8, cols: 16, mines: 20 },    // 128
};
const LEVELS: QuizLevel[] = ["easy", "medium", "hard"];
const GAP = 4;
const TAP_GUARD_MS = 300; // a jolt can land a second tap

const NUM_COLOR = ["", "var(--i-sky)", "var(--i-green)", "var(--i-orange)", "var(--i-violet)", "var(--i-pink)", "var(--i-teal)", "var(--ink)", "var(--muted)"];

export interface MinesSave { board: Board; level: QuizLevel; before: Board | null; undoUsed: boolean }

export default function MinesGame({ s, saved, onSave, onClose, top, prize, onPrize }: {
  s: V5Strings;
  saved: MinesSave | null;
  onSave: (m: MinesSave) => void;
  onClose: () => void;
  top: number; // where the half-screen panel starts (just under the tip box)
  prize: Prize; // the ride's prize (one per ride, shared with Quiz and Blocks)
  onPrize: (tier: number, level: QuizLevel) => void;
}) {
  const fresh = !saved || saved.board.rows !== SIZES[saved.level].rows || saved.board.cols !== SIZES[saved.level].cols;
  const [level, setLevel] = useState<QuizLevel>(saved?.level ?? "easy");
  const [board, setBoard] = useState<Board>(!fresh && saved ? saved.board : newBoard(SIZES[saved?.level ?? "easy"].rows, SIZES[saved?.level ?? "easy"].cols, SIZES[saved?.level ?? "easy"].mines));
  const [mode, setMode] = useState<"dig" | "flag">("dig");
  const [before, setBefore] = useState<Board | null>(saved?.before ?? null); // the board before the last dig
  const [undoUsed, setUndoUsed] = useState(saved?.undoUsed ?? false);
  const [size, setSize] = useState(0);
  const ROWS = board.rows;
  const COLS = board.cols;
  const wrap = useRef<HTMLDivElement>(null);
  const lastTap = useRef(0);

  // Keep the game if the passenger pops Home and comes back.
  useEffect(() => { onSave({ board, level, before, undoUsed }); }, [board, level, before, undoUsed, onSave]);

  // Squares as large as the space allows (the old Tab A can't rely on
  // container-query units, so measure).
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const fit = () => {
      const w = (el.clientWidth - GAP * (COLS - 1)) / COLS;
      const h = (el.clientHeight - GAP * (ROWS - 1)) / ROWS;
      setSize(Math.max(24, Math.floor(Math.min(w, h))));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ROWS, COLS]);

  function restart(l: QuizLevel = level) {
    setLevel(l);
    setBoard(newBoard(SIZES[l].rows, SIZES[l].cols, SIZES[l].mines));
    setMode("dig");
    setBefore(null);
    setUndoUsed(false);
  }

  function undo() {
    if (!before || undoUsed) return;
    setBoard(before);
    setUndoUsed(true);
  }

  function tap(i: number) {
    const now = Date.now();
    if (now - lastTap.current < TAP_GUARD_MS) return;
    lastTap.current = now;
    if (mode === "flag" && board.state !== "ready") { setBoard(toggleFlag(board, i)); return; }
    const next = dig(board, i);
    if (next === board) return;
    setBefore(board);
    setBoard(next);
  }

  const over = board.state === "won" || board.state === "lost";
  const againReady = useEndGuard(over);
  const canUndo = board.state === "lost" && !undoUsed && !!before;
  const status =
    board.state === "won" ? s.wellPlayed
    : board.state === "lost" ? s.notThisTime
    : board.state === "ready" ? s.minesStart
    : null;

  return (
    <div className="v5-game" data-half role="dialog" aria-label={s.games.mines} style={{ top }}>
      {/* One row: Home, then the level — the half panel has no room for a title */}
      <div className="v5-half-bar">
        {/* The home screen is still in view, so this closes the panel rather than going "Home" */}
        <button className="v5-pill" onClick={onClose}>
          <Icon name="chevron-down" size={18} />
          {s.close}
        </button>
        <div className="v5-seg" role="radiogroup" aria-label={s.games.mines}>
          {LEVELS.map((l) => (
            <button key={l} role="radio" aria-checked={level === l} aria-pressed={level === l} onClick={() => restart(l)}>
              {s.levels[l]}
            </button>
          ))}
        </div>
      </div>

      <div className="v5-mines-status" data-state={board.state}>
        <span className="v5-mines-count">
          <Icon name="mine" size={18} style={{ color: "var(--i-red)" }} />
          <span>{s.minesLeft}</span>
          <b dir="ltr">{flagsLeft(board)}</b>
        </span>
        {status && <span className="v5-mines-msg">{status}</span>}
      </div>

      <div className="v5-board-wrap" ref={wrap}>
        {size > 0 && (
          <div className="v5-board" dir="ltr" data-mode={mode}
            style={{ gridTemplateColumns: `repeat(${COLS}, ${size}px)`, gridAutoRows: `${size}px`, gap: GAP }}>
            {board.cells.map((c, i) => {
              const label = c.open ? (c.mine ? "mine" : String(c.n || "")) : c.flag ? "flag" : "";
              return (
                <button key={i} className="v5-cell" data-open={c.open} data-hit={board.hit === i}
                  aria-label={label || `${Math.floor(i / COLS) + 1}, ${(i % COLS) + 1}`}
                  disabled={over || c.open}
                  onClick={() => tap(i)}
                  style={{ fontSize: Math.round(size * 0.42), color: c.open && !c.mine ? NUM_COLOR[c.n] : undefined }}>
                  {c.open
                    ? c.mine ? <span className="v5-mine-dot" /> : c.n || ""
                    : c.flag ? <Icon name="mine" size={Math.round(size * 0.46)} style={{ color: "var(--i-red)" }} /> : ""}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="v5-game-foot">
        {/* After a mine: one chance to take back a dig a bump may have caused */}
        {canUndo ? (
          <button className="v5-undo" onClick={undo}>
            <Icon name="history" size={20} />
            {s.undoBump}
          </button>
        ) : (
          <div className="v5-seg" data-n="2" role="radiogroup" aria-label={`${s.dig} / ${s.flag}`}>
            <button role="radio" aria-checked={mode === "dig"} aria-pressed={mode === "dig"} onClick={() => setMode("dig")}>
              <Icon name="hand" size={20} /> {s.dig}
            </button>
            <button role="radio" aria-checked={mode === "flag"} aria-pressed={mode === "flag"} onClick={() => setMode("flag")}>
              <Icon name="mine" size={20} /> {s.flag}
            </button>
          </div>
        )}
        <button className="v5-newgame" data-over={over} disabled={over && !againReady} onClick={() => restart()}>
          <Icon name="refresh" size={20} />
          {s.newGame}
        </button>
      </div>
      {board.state === "won" && (
        <GamePrize s={s} caption={s.boardCleared.replace("{level}", s.levels[level])} tier={MINES_TIER[level]} prize={prize}
          ready={againReady} onAgain={() => restart()} onTake={() => onPrize(MINES_TIER[level], level)} />
      )}
    </div>
  );
}
