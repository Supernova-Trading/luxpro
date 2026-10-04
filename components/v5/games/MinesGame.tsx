"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "../../Icon";
import type { QuizLevel, V5Strings } from "../strings";
import { newBoard, dig, toggleFlag, flagsLeft, type Board } from "./mines";

// Mines for a moving car: one board size with big squares (8 × 10), the level
// only changes how many mines. No timer, no long-press — a Dig / Flag switch
// instead, because a held finger in a car turns into an accidental dig.
const ROWS = 10;
const COLS = 8;
const MINES: Record<QuizLevel, number> = { easy: 10, medium: 14, hard: 18 };
const LEVELS: QuizLevel[] = ["easy", "medium", "hard"];
const GAP = 4;
const TAP_GUARD_MS = 300; // a jolt can land a second tap

const NUM_COLOR = ["", "var(--i-sky)", "var(--i-green)", "var(--i-orange)", "var(--i-violet)", "var(--i-pink)", "var(--i-teal)", "var(--ink)", "var(--muted)"];

export interface MinesSave { board: Board; level: QuizLevel }

export default function MinesGame({ s, saved, onSave, onClose }: {
  s: V5Strings;
  saved: MinesSave | null;
  onSave: (m: MinesSave) => void;
  onClose: () => void;
}) {
  const [level, setLevel] = useState<QuizLevel>(saved?.level ?? "easy");
  const [board, setBoard] = useState<Board>(saved?.board ?? newBoard(ROWS, COLS, MINES.easy));
  const [mode, setMode] = useState<"dig" | "flag">("dig");
  const [size, setSize] = useState(0);
  const wrap = useRef<HTMLDivElement>(null);
  const lastTap = useRef(0);

  // Keep the game if the passenger pops Home and comes back.
  useEffect(() => { onSave({ board, level }); }, [board, level, onSave]);

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
  }, []);

  function restart(l: QuizLevel = level) {
    setLevel(l);
    setBoard(newBoard(ROWS, COLS, MINES[l]));
    setMode("dig");
  }

  function tap(i: number) {
    const now = Date.now();
    if (now - lastTap.current < TAP_GUARD_MS) return;
    lastTap.current = now;
    setBoard((b) => (mode === "flag" && b.state !== "ready" ? toggleFlag(b, i) : dig(b, i)));
  }

  const over = board.state === "won" || board.state === "lost";
  const status =
    board.state === "won" ? s.minesWon
    : board.state === "lost" ? s.minesLost
    : board.state === "ready" ? s.minesStart
    : null;

  return (
    <div className="v5-game" role="dialog" aria-label={s.games.mines}>
      <div className="v5-game-bar">
        <button className="v5-pill" onClick={onClose}>
          <Icon name="chevron-left" size={18} className="v5-flip" />
          {s.home}
        </button>
        <span className="v5-heading">{s.games.mines}</span>
        <span aria-hidden />
      </div>

      <div className="v5-seg" role="radiogroup" aria-label={s.games.mines}>
        {LEVELS.map((l) => (
          <button key={l} role="radio" aria-checked={level === l} aria-pressed={level === l} onClick={() => restart(l)}>
            {s.levels[l]}
          </button>
        ))}
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
        <div className="v5-seg" data-n="2" role="radiogroup" aria-label={`${s.dig} / ${s.flag}`}>
          <button role="radio" aria-checked={mode === "dig"} aria-pressed={mode === "dig"} onClick={() => setMode("dig")}>
            <Icon name="hand" size={20} /> {s.dig}
          </button>
          <button role="radio" aria-checked={mode === "flag"} aria-pressed={mode === "flag"} onClick={() => setMode("flag")}>
            <Icon name="mine" size={20} /> {s.flag}
          </button>
        </div>
        <button className="v5-newgame" data-over={over} onClick={() => restart()}>
          <Icon name="refresh" size={20} />
          {s.newGame}
        </button>
      </div>
    </div>
  );
}
