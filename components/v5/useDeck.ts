"use client";

import { useCallback, useRef } from "react";

// A shuffled deck per pool ("en:quiz:easy", "es:riddles"…). Every card is
// picked at random, and nothing repeats until the whole pool has been played.
// The deck is remembered across rides and page reloads (Amish's request,
// 2026-10-04): he hears every ride, so the next passenger must not start on
// questions he heard an hour ago. When a pool runs out it reshuffles without
// handing back the card just shown.
const STORE = "luxpro.v5.deck";

function load(): Record<string, number[]> {
  try { return JSON.parse(localStorage.getItem(STORE) || "{}") ?? {}; } catch { return {}; }
}
function save(seen: Record<string, Set<number>>) {
  try {
    const out: Record<string, number[]> = {};
    for (const k in seen) out[k] = Array.from(seen[k]);
    localStorage.setItem(STORE, JSON.stringify(out));
  } catch { /* storage blocked: the deck still works for this session */ }
}

export function useDeck() {
  const seen = useRef<Record<string, Set<number>> | null>(null);

  const draw = useCallback((key: string, size: number, current = -1): number => {
    if (size <= 0) return -1;
    if (!seen.current) {
      seen.current = {};
      const stored = load();
      for (const k in stored) seen.current[k] = new Set(stored[k]);
    }
    let used = seen.current[key];
    // Content lists can change between builds: forget indices that no longer exist.
    if (used) used = new Set(Array.from(used).filter((i) => i < size));
    if (!used || used.size >= size) used = new Set(size > 1 && current >= 0 ? [current] : []);
    const free: number[] = [];
    for (let i = 0; i < size; i++) if (!used.has(i)) free.push(i);
    const pick = free[Math.floor(Math.random() * free.length)];
    used.add(pick);
    seen.current[key] = used;
    save(seen.current);
    return pick;
  }, []);

  return { draw };
}

export type Deck = ReturnType<typeof useDeck>;
