"use client";

import { useEffect, useState } from "react";

// "Play again" ignores taps for a second after a game ends (roadmap P5), so
// the bump that ended the game can't also start the next one.
export function useEndGuard(over: boolean, ms = 1000): boolean {
  const [ready, setReady] = useState(true);
  useEffect(() => {
    if (!over) { setReady(true); return; }
    setReady(false);
    const t = setTimeout(() => setReady(true), ms);
    return () => clearTimeout(t);
  }, [over, ms]);
  return ready;
}
