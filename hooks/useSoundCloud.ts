"use client";

import { useState, useRef, useEffect, useCallback } from "react";

// Ported from Entertainment.tsx's inline widget logic so the preview can drive
// a hidden SoundCloud player with its own transport controls.
type ScWidget = {
  bind: (event: string, cb: () => void) => void;
  unbind: (event: string) => void;
  togglePause: () => void;
  next: () => void;
  prev: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getCurrentSound: (cb: (sound: any) => void) => void;
};
type ScApi = {
  Widget: ((iframe: HTMLIFrameElement) => ScWidget) & {
    Events: Record<string, string>;
  };
};

let scApiPromise: Promise<ScApi> | null = null;
function loadScApi(): Promise<ScApi> {
  if (typeof window === "undefined") return Promise.reject(new Error("no window"));
  const existing = (window as unknown as { SC?: ScApi }).SC;
  if (existing) return Promise.resolve(existing);
  if (!scApiPromise) {
    scApiPromise = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "https://w.soundcloud.com/player/api.js";
      s.async = true;
      s.onload = () => {
        const sc = (window as unknown as { SC?: ScApi }).SC;
        if (sc) resolve(sc);
        else reject(new Error("SC missing after load"));
      };
      s.onerror = () => { scApiPromise = null; reject(new Error("SC api.js failed")); };
      document.body.appendChild(s);
    });
  }
  return scApiPromise;
}

export function useSoundCloud() {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const widgetRef = useRef<ScWidget | null>(null);
  const [url, setUrl] = useState("");
  const [playing, setPlaying] = useState(false);
  const [title, setTitle] = useState("");
  const [artwork, setArtwork] = useState("");

  useEffect(() => {
    if (!url || !iframeRef.current) {
      setPlaying(false);
      setTitle("");
      setArtwork("");
      return;
    }
    let cancelled = false;
    let widget: ScWidget | null = null;

    loadScApi()
      .then((SC) => {
        if (cancelled || !iframeRef.current) return;
        const E = SC.Widget.Events;
        widget = SC.Widget(iframeRef.current);
        widgetRef.current = widget;

        const refreshTitle = () =>
          widget!.getCurrentSound((s) => {
            if (cancelled || !s) return;
            setTitle(s.title || "");
            // SoundCloud serves "-large" (100px); ask for the 300px rendition
            const art: string = s.artwork_url || s.user?.avatar_url || "";
            setArtwork(art.replace("-large", "-t300x300"));
          });

        widget.bind(E.READY, () => { if (!cancelled) refreshTitle(); });
        widget.bind(E.PLAY, () => {
          if (cancelled) return;
          setPlaying(true);
          refreshTitle();
        });
        widget.bind(E.PAUSE, () => { if (!cancelled) setPlaying(false); });
        widget.bind(E.FINISH, () => { if (!cancelled) setPlaying(false); });
      })
      .catch(() => {
        // api.js failed — controls stay inert
      });

    return () => {
      cancelled = true;
      if (widget) {
        try {
          const E = (window as unknown as { SC?: ScApi }).SC?.Widget.Events;
          if (E) {
            widget.unbind(E.READY);
            widget.unbind(E.PLAY);
            widget.unbind(E.PAUSE);
            widget.unbind(E.FINISH);
          }
        } catch {
          // best-effort cleanup
        }
      }
      widgetRef.current = null;
    };
  }, [url]);

  const load = useCallback((profileUrl: string) => {
    setUrl(
      `https://w.soundcloud.com/player/?url=${encodeURIComponent(profileUrl)}&color=%23000000&auto_play=true&hide_related=false&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=false`
    );
  }, []);
  const clear = useCallback(() => setUrl(""), []);
  const prev = useCallback(() => widgetRef.current?.prev(), []);
  const toggle = useCallback(() => widgetRef.current?.togglePause(), []);
  const next = useCallback(() => widgetRef.current?.next(), []);

  return { iframeRef, url, playing, title, artwork, load, clear, prev, toggle, next };
}
