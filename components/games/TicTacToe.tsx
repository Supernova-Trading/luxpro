"use client";

import { useState, useEffect } from "react";
import type { Translation } from "@/lib/translations";
import ActionBtn from "../ActionBtn";

type Cell = "X" | "O" | null;

const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function winnerOf(b: Cell[]): Cell {
  for (const [a, b1, c] of LINES) {
    if (b[a] && b[a] === b[b1] && b[a] === b[c]) return b[a];
  }
  return null;
}

// Light heuristic, not full minimax — win if possible, else block, else
// center, else a corner, else anywhere. Beatable on purpose; this is a
// 30-second car-ride distraction, not a serious opponent.
function carMove(b: Cell[]): number {
  const empty = b.map((v, i) => (v ? -1 : i)).filter((i) => i >= 0);
  for (const i of empty) {
    const copy = [...b]; copy[i] = "O";
    if (winnerOf(copy) === "O") return i;
  }
  for (const i of empty) {
    const copy = [...b]; copy[i] = "X";
    if (winnerOf(copy) === "X") return i;
  }
  if (b[4] === null) return 4;
  const corners = [0, 2, 6, 8].filter((i) => b[i] === null);
  if (corners.length) return corners[Math.floor(Math.random() * corners.length)];
  return empty[Math.floor(Math.random() * empty.length)];
}

export default function TicTacToe({ t }: { t: Translation }) {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [turn, setTurn] = useState<"player" | "car">("player");

  const win = winnerOf(board);
  const full = board.every((c) => c !== null);
  const over = !!win || full;

  useEffect(() => {
    if (turn !== "car" || over) return;
    const id = setTimeout(() => {
      setBoard((b) => {
        if (winnerOf(b) || b.every((c) => c !== null)) return b;
        const next = [...b];
        next[carMove(b)] = "O";
        return next;
      });
      setTurn("player");
    }, 500);
    return () => clearTimeout(id);
  }, [turn, over]);

  function tap(i: number) {
    if (board[i] || over || turn !== "player") return;
    const next = [...board]; next[i] = "X";
    setBoard(next);
    setTurn("car");
  }

  function reset() {
    setBoard(Array(9).fill(null));
    setTurn("player");
  }

  const status = win === "X" ? t.youWin : win === "O" ? t.youLose : full ? t.itsADraw : turn === "player" ? t.yourTurn : t.carTurn;

  return (
    <div>
      <div className="text-[15px] font-semibold text-center mb-3 text-primary">{status}</div>
      <div className="grid grid-cols-3 gap-2 mb-3.5 max-w-[220px] mx-auto">
        {board.map((c, i) => (
          <button
            key={i}
            onClick={() => tap(i)}
            className="aspect-square rounded-xl text-[28px] font-bold flex items-center justify-center"
            style={{
              background: "var(--lp-surface)",
              border: "1px solid var(--lp-border)",
              color: c === "X" ? "var(--lp-gold)" : "var(--text-secondary)",
            }}
          >
            {c === "X" ? "✕" : c === "O" ? "○" : ""}
          </button>
        ))}
      </div>
      {over && (
        <div className="flex justify-center">
          <ActionBtn accent onClick={reset}>↻ {t.newGame}</ActionBtn>
        </div>
      )}
    </div>
  );
}
