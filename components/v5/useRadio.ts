"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import type { RadioStation } from "@/lib/radios";

// v5's own copy of the live app's hooks/useRadio.ts (left untouched), plus a
// dropout watchdog (v5.31, council 2026-10-06; impeccable reference/harden.md
// "network failures"): in a tunnel a stream can go silent while still
// "playing". If the stream's clock hasn't moved for ~8 s it reconnects, and
// it retries as soon as the tablet is back online. At most 3 tries in a row.
const CHECK_MS = 4000;
const STUCK_MS = 8000;
const RETRY_GAP_MS = 15_000;
const MAX_RETRIES = 3;

export function useRadio() {
  const [currentIdx, setCurrentIdx]       = useState(-1);
  const [playing, setPlaying]             = useState(false);
  const [volume, setVolumeState]          = useState(80);
  const [statusText, setStatusText]       = useState("");
  const [brokenStations, setBrokenStations] = useState<Set<number>>(new Set());

  const audioRef      = useRef<HTMLAudioElement | null>(null);
  const hlsRef        = useRef<import("hls.js").default | null>(null);
  const stationsRef   = useRef<RadioStation[]>([]);
  const idxRef        = useRef(-1);
  const wantPlay      = useRef(false); // the passenger wants sound (not paused or stopped)
  const lastTime      = useRef(-1);
  const stuckSince    = useRef(0);
  const lastRetry     = useRef(0);
  const retries       = useRef(0);
  const playRef       = useRef<(idx: number, stations: RadioStation[]) => void>(() => {});

  const setStations = useCallback((stations: RadioStation[]) => {
    stationsRef.current = stations;
  }, []);

  const _destroyHls = useCallback(() => {
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
  }, []);

  const _markBroken = useCallback((idx: number) => {
    setBrokenStations((prev) => { const s = new Set(prev); s.add(idx); return s; });
  }, []);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.src = "";
      audio.onerror = null;
    }
    _destroyHls();
    wantPlay.current = false;
    idxRef.current = -1;
    setCurrentIdx(-1);
    setPlaying(false);
    setStatusText("");
  }, [_destroyHls]);

  const play = useCallback(
    async (idx: number, stations: RadioStation[]) => {
      const station = stations[idx];
      if (!station) return;

      stationsRef.current = stations;
      if (idx !== idxRef.current) retries.current = 0;
      idxRef.current = idx;
      wantPlay.current = true;
      lastTime.current = -1;
      stuckSince.current = 0;
      setCurrentIdx(idx);
      setStatusText(`Loading ${station.n}…`);

      // Clear any previous broken state for re-selected station
      setBrokenStations((prev) => {
        const next = new Set(prev);
        next.delete(idx);
        return next;
      });

      if (!audioRef.current) {
        // No crossOrigin: nothing consumes CORS-clean audio (no Web Audio
        // analysis), and forcing CORS mode breaks stations without ACAO headers.
        audioRef.current = new Audio();
      }
      const audio = audioRef.current;
      audio.pause();
      _destroyHls();
      audio.onerror = null;
      audio.volume = volume / 100;

      // Attach a one-time error listener that marks the station offline
      audio.onerror = () => {
        _markBroken(idx);
        setStatusText(`${station.n} — offline`);
        setPlaying(false);
      };

      if (station.h) {
        // ── HLS stream ──────────────────────────────────────────────────────
        try {
          const Hls = (await import("hls.js")).default;
          if (Hls.isSupported()) {
            const hls = new Hls({ enableWorker: false, lowLatencyMode: false });
            hlsRef.current = hls;

            hls.loadSource(station.u);
            hls.attachMedia(audio);

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
              audio.play()
                .then(() => { setPlaying(true); setStatusText(""); })
                .catch(() => { setStatusText("Tap play to start"); setPlaying(false); });
            });

            hls.on(Hls.Events.ERROR, (_e: unknown, data: { fatal: boolean }) => {
              if (data.fatal) {
                _markBroken(idx);
                setStatusText(`${station.n} — offline`);
                setPlaying(false);
                _destroyHls();
              }
            });
          } else if (audio.canPlayType("application/vnd.apple.mpegurl")) {
            // Safari native HLS
            audio.src = station.u;
            audio.play()
              .then(() => { setPlaying(true); setStatusText(""); })
              .catch(() => setStatusText(`${station.n} — blocked`));
          } else {
            setStatusText("HLS not supported");
          }
        } catch {
          setStatusText("Failed to load HLS player");
        }
      } else {
        // ── Plain MP3 / AAC stream ───────────────────────────────────────────
        audio.src = station.u;
        audio.play()
          .then(() => { setPlaying(true); setStatusText(""); })
          .catch(() => {
            _markBroken(idx);
            setStatusText(`${station.n} — tap play to retry`);
            setPlaying(false);
          });
      }
    },
    [volume, _destroyHls, _markBroken]
  );

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      wantPlay.current = false;
      audio.pause();
      setPlaying(false);
    } else {
      wantPlay.current = true;
      audio.play().then(() => setPlaying(true)).catch(() => {});
    }
  }, [playing]);

  const prev = useCallback(() => {
    if (currentIdx > 0) play(currentIdx - 1, stationsRef.current);
  }, [currentIdx, play]);

  const next = useCallback(() => {
    if (currentIdx < stationsRef.current.length - 1) play(currentIdx + 1, stationsRef.current);
  }, [currentIdx, play]);

  const setVolume = useCallback((v: number) => {
    setVolumeState(v);
    if (audioRef.current) audioRef.current.volume = v / 100;
  }, []);

  useEffect(() => {
    return () => {
      _destroyHls();
      if (audioRef.current) {
        audioRef.current.onerror = null;
        audioRef.current.pause();
      }
    };
  }, [_destroyHls]);

  playRef.current = (idx, stations) => { void play(idx, stations); };

  // Dropout watchdog: reconnect a stream that has gone quiet.
  useEffect(() => {
    const retry = () => {
      if (retries.current >= MAX_RETRIES || Date.now() - lastRetry.current < RETRY_GAP_MS) return;
      retries.current += 1;
      lastRetry.current = Date.now();
      setPlaying(false);
      playRef.current(idxRef.current, stationsRef.current);
    };
    const t = setInterval(() => {
      const a = audioRef.current;
      if (!wantPlay.current || !a || idxRef.current < 0 || !navigator.onLine) { stuckSince.current = 0; return; }
      if (a.currentTime !== lastTime.current) {
        if (lastTime.current >= 0 && a.currentTime > lastTime.current) retries.current = 0; // really playing
        lastTime.current = a.currentTime;
        stuckSince.current = 0;
        return;
      }
      if (!stuckSince.current) { stuckSince.current = Date.now(); return; }
      if (Date.now() - stuckSince.current >= STUCK_MS) { stuckSince.current = 0; retry(); }
    }, CHECK_MS);
    const onOnline = () => {
      if (!wantPlay.current || idxRef.current < 0) return;
      retries.current = 0;
      lastRetry.current = 0;
      retry();
    };
    window.addEventListener("online", onOnline);
    return () => { clearInterval(t); window.removeEventListener("online", onOnline); };
  }, []);

  const currentStation = currentIdx >= 0 ? stationsRef.current[currentIdx] ?? null : null;

  return {
    play, stop, togglePlay, prev, next, setVolume, setStations,
    currentIdx, currentStation, playing, volume, statusText,
    brokenStations,
  };
}
