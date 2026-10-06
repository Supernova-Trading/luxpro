"use client";

import { useState, useRef, useEffect, useCallback } from "react";

// v5's own SoundCloud driver. Method names checked against
// https://w.soundcloud.com/player/api.js (play/pause/toggle/next/prev/skip/
// getSounds/setVolume/getCurrentSound) — the live app's `togglePause` doesn't exist.
// v5.19 shuffle (owner): a playlist starts on a random song, Next and the end
// of a song pick another at random, and songs already heard are remembered
// across rides (like the quiz deck) so Amish and passengers don't hear the
// same ones again until most of the playlist has played.
type ScWidget = {
  bind: (event: string, cb: () => void) => void;
  unbind: (event: string) => void;
  play: () => void;
  pause: () => void;
  next: () => void;
  prev: () => void;
  setVolume: (v: number) => void;
  skip: (index: number) => void;
  getPosition: (cb: (ms: number) => void) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getSounds: (cb: (sounds: any[]) => void) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getCurrentSound: (cb: (sound: any) => void) => void;
};
type ScApi = { Widget: ((iframe: HTMLIFrameElement) => ScWidget) & { Events: Record<string, string> } };

let apiPromise: Promise<ScApi> | null = null;
function loadApi(): Promise<ScApi> {
  const w = window as unknown as { SC?: ScApi };
  if (w.SC) return Promise.resolve(w.SC);
  if (!apiPromise) {
    apiPromise = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "https://w.soundcloud.com/player/api.js";
      s.async = true;
      s.onload = () => (w.SC ? resolve(w.SC) : reject(new Error("SC missing")));
      s.onerror = () => { apiPromise = null; reject(new Error("SC api.js failed")); };
      document.body.appendChild(s);
    });
  }
  return apiPromise;
}

export type Track = { title: string; artist: string; artwork: string };

const PLAYED_KEY = "luxpro.v5.songs";

/** A random song index this playlist hasn't played yet (remembered on the tablet). */
function drawSong(url: string, size: number, current: number): number {
  let all: Record<string, number[]> = {};
  try { all = JSON.parse(localStorage.getItem(PLAYED_KEY) || "{}") || {}; } catch { /* storage blocked */ }
  let played = new Set((all[url] || []).filter((i) => i < size));
  if (played.size >= size - 1) played = new Set(current >= 0 ? [current] : []); // nearly all heard: start over
  played.add(current);
  const free: number[] = [];
  for (let i = 0; i < size; i++) if (!played.has(i)) free.push(i);
  const pick = free.length ? free[Math.floor(Math.random() * free.length)] : Math.floor(Math.random() * size);
  played.add(pick);
  all[url] = Array.from(played).filter((i) => i >= 0);
  try { localStorage.setItem(PLAYED_KEY, JSON.stringify(all)); } catch { /* fine */ }
  return pick;
}

export function useSoundCloud() {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const widgetRef = useRef<ScWidget | null>(null);
  const volumeRef = useRef(60);
  const urlRef = useRef("");          // the playlist/profile being played
  const autoplayRef = useRef(false);
  const shuffledRef = useRef(false);  // first random jump done for this playlist
  const historyRef = useRef<number[]>([]);
  const [src, setSrc] = useState("");
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const [track, setTrack] = useState<Track | null>(null);
  // Android Chrome sometimes reports "playing" while a hidden cross-origin
  // player makes no sound until it is tapped once. If the song hasn't moved
  // 3 s after Play, the app shows the player for one tap (v5.23).
  const [needsTap, setNeedsTap] = useState(false);
  const wantPlay = useRef(false);
  const checkTimer = useRef<ReturnType<typeof setTimeout>>();

  /** After a Play: if the position is still at 0 three seconds later, ask for a tap. */
  const checkStarted = useCallback(() => {
    wantPlay.current = true;
    clearTimeout(checkTimer.current);
    checkTimer.current = setTimeout(() => {
      const w = widgetRef.current;
      if (!w || !wantPlay.current) return;
      w.getPosition((ms) => { if (wantPlay.current && (ms ?? 0) < 300) setNeedsTap(true); });
    }, 3000);
  }, []);

  /** Jump to a random unheard song and play it. */
  const jumpRandom = useCallback((w: ScWidget) => {
    w.getSounds((list) => {
      const n = list?.length || 0;
      if (n < 2) { w.play(); return; }
      const cur = historyRef.current[historyRef.current.length - 1] ?? -1;
      const i = drawSong(urlRef.current, n, cur);
      historyRef.current.push(i);
      w.skip(i);
      setTimeout(() => w.play(), 300);
      checkStarted();
    });
  }, [checkStarted]);

  useEffect(() => {
    setReady(false);
    setPlaying(false);
    setFailed(false);
    if (!src || !iframeRef.current) return;
    let cancelled = false;
    let widget: ScWidget | null = null;
    // A playlist that never reports ready within 15s counts as failed.
    const timeout = setTimeout(() => { if (!cancelled) setFailed(true); }, 15000);

    loadApi()
      .then((SC) => {
        if (cancelled || !iframeRef.current) return;
        const E = SC.Widget.Events;
        widget = SC.Widget(iframeRef.current);
        widgetRef.current = widget;
        const refresh = () =>
          widget!.getCurrentSound((s) => {
            if (cancelled || !s) return;
            const art: string = s.artwork_url || s.user?.avatar_url || "";
            setTrack({ title: s.title || "", artist: s.user?.username || "", artwork: art.replace("-large", "-t500x500") });
          });
        widget.bind(E.READY, () => {
          if (cancelled) return;
          clearTimeout(timeout);
          setReady(true);
          widget!.setVolume(volumeRef.current);
          refresh();
          // Chosen with a tap: start straight on a random song
          if (autoplayRef.current) { shuffledRef.current = true; jumpRandom(widget!); }
        });
        widget.bind(E.PLAY, () => { if (!cancelled) { setPlaying(true); refresh(); } });
        // (A blocked start also fires PAUSE, so this must not cancel the
        // "did it really start?" check — only our own pause() does.)
        widget.bind(E.PAUSE, () => { if (!cancelled) setPlaying(false); });
        // The song really is moving: the one-tap prompt can go.
        widget.bind(E.PLAY_PROGRESS, () => { if (!cancelled) setNeedsTap(false); });
        // End of a song: carry on with another random one
        widget.bind(E.FINISH, () => { if (!cancelled) { setPlaying(false); jumpRandom(widget!); } });
        widget.bind(E.ERROR, () => { if (!cancelled) setFailed(true); });
      })
      .catch(() => { if (!cancelled) setFailed(true); });

    return () => {
      cancelled = true;
      clearTimeout(timeout);
      widgetRef.current = null;
    };
  }, [src, jumpRandom]);

  /** Load a SoundCloud profile or set. autoplay=false shows its artwork without playing. */
  const load = useCallback((url: string, autoplay: boolean) => {
    // The same playlist again: the player is already loaded, so just play
    // another random song instead of reloading it.
    if (url === urlRef.current && widgetRef.current) {
      if (autoplay) { shuffledRef.current = true; jumpRandom(widgetRef.current); }
      else { widgetRef.current.pause(); shuffledRef.current = false; } // new ride: paused, next Play is random
      return;
    }
    setTrack(null);
    urlRef.current = url;
    autoplayRef.current = autoplay;
    shuffledRef.current = false;
    historyRef.current = [];
    setSrc(
      `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&auto_play=${autoplay}&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=false`
    );
  }, [jumpRandom]);
  const unload = useCallback(() => { setSrc(""); setTrack(null); }, []);
  // The first Play on a preloaded playlist jumps to a random song first.
  const play = useCallback(() => {
    const w = widgetRef.current;
    if (!w) return;
    // Start sound inside this tap (some tablets only allow it here), then
    // move to a random song while it is already playing.
    w.play();
    checkStarted();
    if (!shuffledRef.current) { shuffledRef.current = true; jumpRandom(w); }
  }, [jumpRandom, checkStarted]);
  const pause = useCallback(() => { wantPlay.current = false; setNeedsTap(false); widgetRef.current?.pause(); }, []);
  const next = useCallback(() => {
    const w = widgetRef.current;
    if (w) { shuffledRef.current = true; jumpRandom(w); }
  }, [jumpRandom]);
  // Previous goes back to the song heard before, not the one above it in the list.
  const prev = useCallback(() => {
    const w = widgetRef.current;
    if (!w) return;
    const h = historyRef.current;
    if (h.length >= 2) { h.pop(); w.skip(h[h.length - 1]); setTimeout(() => w.play(), 300); }
    else w.prev();
  }, []);
  const setVolume = useCallback((v: number) => {
    volumeRef.current = v;
    widgetRef.current?.setVolume(v);
  }, []);

  return { iframeRef, src, ready, playing, failed, track, needsTap, load, unload, play, pause, next, prev, setVolume };
}
