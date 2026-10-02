"use client";

import { useState } from "react";
import type { Translation } from "@/lib/translations";
import ActionBtn from "../ActionBtn";

const ICONS = ["🎵", "🎨", "🚗", "⚽", "🍕", "🎬"];

function newDeck(): string[] {
  const deck = [...ICONS, ...ICONS];
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

export default function MemoryMatch({ t }: { t: Translation }) {
  const [deck, setDeck] = useState<string[]>(() => newDeck());
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [busy, setBusy] = useState(false);

  const won = matched.length === deck.length;

  function tap(i: number) {
    if (busy || flipped.includes(i) || matched.includes(i) || flipped.length === 2) return;
    const next = [...flipped, i];
    setFlipped(next);
    if (next.length === 2) {
      setBusy(true);
      const [a, b] = next;
      if (deck[a] === deck[b]) {
        setMatched((m) => [...m, a, b]);
        setFlipped([]);
        setBusy(false);
      } else {
        setTimeout(() => { setFlipped([]); setBusy(false); }, 700);
      }
    }
  }

  function reset() {
    setDeck(newDeck());
    setFlipped([]);
    setMatched([]);
    setBusy(false);
  }

  return (
    <div>
      <div className="text-[15px] font-semibold text-center mb-3 text-primary">
        {won ? t.allMatched : t.tapToFlip}
      </div>
      <div className="grid grid-cols-4 gap-2 mb-3.5 max-w-[280px] mx-auto">
        {deck.map((icon, i) => {
          const shown = flipped.includes(i) || matched.includes(i);
          return (
            <button
              key={i}
              onClick={() => tap(i)}
              className="aspect-square rounded-xl text-[22px] flex items-center justify-center"
              style={{
                background: matched.includes(i) ? "rgba(200,168,75,0.14)" : "var(--lp-surface)",
                border: matched.includes(i) ? "1px solid var(--lp-border-gold)" : "1px solid var(--lp-border)",
              }}
            >
              {shown ? icon : ""}
            </button>
          );
        })}
      </div>
      {won && (
        <div className="flex justify-center">
          <ActionBtn accent onClick={reset}>↻ {t.newGame}</ActionBtn>
        </div>
      )}
    </div>
  );
}
