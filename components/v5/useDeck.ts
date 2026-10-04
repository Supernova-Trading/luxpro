"use client";

import { useCallback, useRef } from "react";

// A shuffled deck per pool ("en:quiz:easy", "es:riddles"…): nothing repeats
// within a ride until the pool runs out, then it reshuffles without handing
// back the card just shown. "New ride" resets every deck.
export function useDeck() {
  const seen = useRef<Record<string, Set<number>>>({});

  const draw = useCallback((key: string, size: number, current = -1): number => {
    if (size <= 0) return -1;
    let used = seen.current[key];
    if (!used || used.size >= size) {
      used = new Set(size > 1 && current >= 0 ? [current] : []);
      seen.current[key] = used;
    }
    const free: number[] = [];
    for (let i = 0; i < size; i++) if (!used.has(i)) free.push(i);
    const pick = free[Math.floor(Math.random() * free.length)];
    used.add(pick);
    return pick;
  }, []);

  const reset = useCallback(() => { seen.current = {}; }, []);

  return { draw, reset };
}

export type Deck = ReturnType<typeof useDeck>;
