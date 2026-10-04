"use client";

import { useCallback, useEffect, useRef } from "react";

// Speech to Amish. Messages queue instead of cutting each other off, so back-
// to-back requests are both heard (council round 4, in-car UX). A request
// withdrawn before its message is spoken is dropped silently.
type Item = { key: string; text: string; onError?: () => void };

export function useSpeech(onDuck?: (ducked: boolean) => void, volume = 1) {
  const duckRef = useRef(onDuck);
  duckRef.current = onDuck;
  const volumeRef = useRef(volume);
  volumeRef.current = Math.max(0, Math.min(1, volume));
  const queue = useRef<Item[]>([]);
  const current = useRef<Item | null>(null);
  const voice = useRef<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const synth = window.speechSynthesis;
    const pick = () => {
      const voices = synth.getVoices();
      voice.current =
        voices.find((v) => v.lang === "en-GB") ??
        voices.find((v) => v.lang?.toLowerCase().startsWith("en")) ??
        null;
    };
    pick();
    synth.addEventListener?.("voiceschanged", pick);
    return () => {
      synth.removeEventListener?.("voiceschanged", pick);
      synth.cancel();
    };
  }, []);

  const pumpRef = useRef<() => void>(() => {});
  pumpRef.current = () => {
    if (current.current) return;
    if (queue.current.length === 0) {
      duckRef.current?.(false); // queue drained: music back up
      return;
    }
    duckRef.current?.(true); // music dips while Amish is spoken to
    const item = queue.current.shift()!;
    current.current = item;
    const u = new SpeechSynthesisUtterance(item.text);
    u.lang = "en-GB";
    u.volume = volumeRef.current;
    if (voice.current) u.voice = voice.current;
    const next = () => {
      current.current = null;
      pumpRef.current();
    };
    u.onend = next;
    u.onerror = (e) => {
      if (e.error !== "interrupted" && e.error !== "canceled") item.onError?.();
      next();
    };
    window.speechSynthesis.speak(u);
  };

  /** Queue a line for Amish. Calls onError if this device can't speak it. */
  const say = useCallback((key: string, text: string, onError?: () => void) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      onError?.();
      return;
    }
    queue.current.push({ key, text, onError });
    pumpRef.current();
  }, []);

  /** Drop a not-yet-spoken line. Returns true if one was dropped. */
  const withdraw = useCallback((key: string) => {
    const i = queue.current.findIndex((q) => q.key === key);
    if (i === -1) return false;
    queue.current.splice(i, 1);
    return true;
  }, []);

  const clear = useCallback(() => {
    queue.current = [];
    current.current = null;
    duckRef.current?.(false);
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
  }, []);

  return { say, withdraw, clear };
}
