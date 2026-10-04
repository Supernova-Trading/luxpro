"use client";

import { useState, useRef, useEffect, useCallback } from "react";

// v5's own SoundCloud driver. Method names checked against
// https://w.soundcloud.com/player/api.js (play/pause/toggle/next/prev/
// setVolume/getCurrentSound) — the live app's `togglePause` doesn't exist.
type ScWidget = {
  bind: (event: string, cb: () => void) => void;
  unbind: (event: string) => void;
  play: () => void;
  pause: () => void;
  next: () => void;
  prev: () => void;
  setVolume: (v: number) => void;
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

export function useSoundCloud() {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const widgetRef = useRef<ScWidget | null>(null);
  const volumeRef = useRef(60);
  const [src, setSrc] = useState("");
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const [track, setTrack] = useState<Track | null>(null);

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
        });
        widget.bind(E.PLAY, () => { if (!cancelled) { setPlaying(true); refresh(); } });
        widget.bind(E.PAUSE, () => { if (!cancelled) setPlaying(false); });
        widget.bind(E.FINISH, () => { if (!cancelled) setPlaying(false); });
        widget.bind(E.ERROR, () => { if (!cancelled) setFailed(true); });
      })
      .catch(() => { if (!cancelled) setFailed(true); });

    return () => {
      cancelled = true;
      clearTimeout(timeout);
      widgetRef.current = null;
    };
  }, [src]);

  /** Load a SoundCloud profile or set. autoplay=false shows its artwork without playing. */
  const load = useCallback((url: string, autoplay: boolean) => {
    setTrack(null);
    setSrc(
      `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&auto_play=${autoplay}&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=false`
    );
  }, []);
  const unload = useCallback(() => { setSrc(""); setTrack(null); }, []);
  const play = useCallback(() => widgetRef.current?.play(), []);
  const pause = useCallback(() => widgetRef.current?.pause(), []);
  const next = useCallback(() => widgetRef.current?.next(), []);
  const prev = useCallback(() => widgetRef.current?.prev(), []);
  const setVolume = useCallback((v: number) => {
    volumeRef.current = v;
    widgetRef.current?.setVolume(v);
  }, []);

  return { iframeRef, src, ready, playing, failed, track, load, unload, play, pause, next, prev, setVolume };
}
