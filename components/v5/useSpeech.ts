"use client";

import { useCallback, useEffect, useRef } from "react";

// Speech to Amish. Messages queue instead of cutting each other off, so back-
// to-back requests are both heard (council round 4, in-car UX). A request
// withdrawn before its message is spoken is dropped silently.
type Item = { key: string; text: string; onError?: () => void; lang?: string; voice?: SpeechSynthesisVoice | null };

const BCP47: Record<string, string> = { en: "en-GB", es: "es-ES", ur: "ur-PK" };

// Android Chrome sometimes never fires onend (or drops the utterance).
// After this long a line counts as finished so the queue keeps moving;
// if it never even started, the request is marked "didn't hear" (v5.30).
const watchdogMs = (text: string) => 5000 + text.length * 100;

export function useSpeech(onDuck?: (ducked: boolean) => void, volume = 1) {
  const duckRef = useRef(onDuck);
  duckRef.current = onDuck;
  const volumeRef = useRef(volume);
  volumeRef.current = Math.max(0, Math.min(1, volume));
  const queue = useRef<Item[]>([]);
  const current = useRef<Item | null>(null);
  const voice = useRef<SpeechSynthesisVoice | null>(null);
  // Kept in a ref: an utterance held only in a local variable can be
  // garbage-collected before its onend fires.
  const utter = useRef<SpeechSynthesisUtterance | null>(null);
  const watchdog = useRef<ReturnType<typeof setTimeout>>();

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
      clearTimeout(watchdog.current);
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
    utter.current = u;
    let started = false;
    u.onstart = () => { started = true; };
    u.lang = item.lang ?? "en-GB";
    u.volume = volumeRef.current;
    const v = item.voice !== undefined ? item.voice : voice.current;
    try { if (v) u.voice = v; } catch { /* odd voice object: the default voice still speaks */ }
    const next = () => {
      if (current.current !== item) return; // a late event from a line already finished or cleared
      clearTimeout(watchdog.current);
      current.current = null;
      utter.current = null;
      pumpRef.current();
    };
    u.onend = next;
    u.onerror = (e) => {
      if (current.current !== item) return;
      if (e.error !== "interrupted" && e.error !== "canceled") item.onError?.();
      next();
    };
    clearTimeout(watchdog.current);
    watchdog.current = setTimeout(() => {
      if (current.current !== item) return;
      if (!started) {
        item.onError?.();
        try { window.speechSynthesis.cancel(); } catch { /* nothing to stop */ }
      }
      next();
    }, watchdogMs(item.text));
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
    utter.current = null;
    clearTimeout(watchdog.current);
    duckRef.current?.(false);
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
  }, []);

  /** Speak to the passenger in their language when the tablet has that voice,
   *  otherwise in English (v5.24: the driver buttons' announcements). */
  const announce = useCallback((key: string, lines: Record<string, string>, lang: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    let item: Item = { key, text: lines.en };
    if (lang !== "en" && lines[lang]) {
      const want = (BCP47[lang] ?? lang).toLowerCase();
      const voices = window.speechSynthesis.getVoices();
      const v = voices.find((x) => x.lang?.toLowerCase().replace("_", "-") === want)
        ?? voices.find((x) => x.lang?.toLowerCase().startsWith(lang));
      if (v) item = { key, text: lines[lang], lang: v.lang, voice: v };
    }
    queue.current = queue.current.filter((q) => q.key !== key); // a repeat replaces the waiting one
    queue.current.push(item);
    pumpRef.current();
  }, []);

  return { say, withdraw, clear, announce };
}
