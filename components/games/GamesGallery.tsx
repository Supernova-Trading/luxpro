"use client";

import { useState } from "react";
import type { Translation } from "@/lib/translations";
import TicTacToe from "./TicTacToe";
import RockPaperScissors from "./RockPaperScissors";
import MemoryMatch from "./MemoryMatch";

type GameId = "tictactoe" | "rps" | "memory";

interface Props {
  t: Translation;
}

// Mounted only while the "Classic Games" panel is open (see MiddleSplit) —
// closing and reopening the panel naturally resets back to the gallery view,
// since this component (and its selected-game state) unmounts with it.
export default function GamesGallery({ t }: Props) {
  const [selected, setSelected] = useState<GameId | null>(null);

  const games: { id: GameId; icon: string; label: string }[] = [
    { id: "tictactoe", icon: "⭕", label: t.ticTacToe },
    { id: "rps",       icon: "✊", label: t.rockPaperScissors },
    { id: "memory",    icon: "🧠", label: t.memoryMatch },
  ];

  if (!selected) {
    return (
      <div className="p-4">
        <div
          className="text-[11px] tracking-[2.5px] uppercase mb-3 font-semibold text-center"
          style={{ color: "var(--text-muted)" }}
        >
          {t.gamesGalleryTitle}
        </div>
        <div className="grid grid-cols-3 gap-2.5">
          {games.map(({ id, icon, label }) => (
            <button
              key={id}
              onClick={() => setSelected(id)}
              className="flex flex-col items-center gap-2 py-5 px-2 rounded-2xl text-center"
              style={{ background: "var(--lp-surface)", border: "1px solid var(--lp-border)" }}
            >
              <div className="text-[32px]">{icon}</div>
              <div className="text-[12px] font-bold uppercase tracking-[1px]" style={{ color: "var(--text-primary)" }}>
                {label}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <button
        onClick={() => setSelected(null)}
        className="mb-3.5 text-[11px] tracking-[1.5px] font-bold uppercase"
        style={{ color: "var(--lp-gold)" }}
      >
        {t.backToGames}
      </button>
      {selected === "tictactoe" && <TicTacToe t={t} />}
      {selected === "rps" && <RockPaperScissors t={t} />}
      {selected === "memory" && <MemoryMatch t={t} />}
    </div>
  );
}
