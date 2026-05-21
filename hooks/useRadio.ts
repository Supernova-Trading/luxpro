"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import type { RadioStation } from "@/lib/radios";

export function useRadio() {
  const [currentIdx, setCurrentIdx]       = useState(-1);
  const [playing, setPlaying]             = useState(false);
  const [volume, setVolumeState]          = useState(80);
  const [statusText, setStatusText]       = useState("");
  const [brokenStations, setBrokenStations] = useState<Set<number>>(new Set());

  const audioRef      = useRef<HTMLAudioElement | null>(null);
  const hlsRef        = useRef<import("hls.js").default | null>(null);
  const stationsRef   = useRef<RadioStation[]>([]);

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
    setCurrentIdx(-1);
    setPlaying(false);
    setStatusText("");
  }, [_destroyHls]);

  const play = useCallback(
    async (idx: number, stations: RadioStation[]) => {
      const station = stations[idx];
      if (!station) return;

      stationsRef.current = stations;
      setCurrentIdx(idx);
      setStatusText(`Loading ${station.n}…`);

      // Clear any previous broken state for re-selected station
      setBrokenStations((prev) => {
        const next = new Set(prev);
        next.delete(idx);
        return next;
      });

      if (!audioRef.current) {
        audioRef.current = new Audio();
        audioRef.current.crossOrigin = "anonymous";
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
      audio.pause();
      setPlaying(false);
    } else {
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

  const currentStation = currentIdx >= 0 ? stationsRef.current[currentIdx] ?? null : null;

  return {
    play, stop, togglePlay, prev, next, setVolume, setStations,
    currentIdx, currentStation, playing, volume, statusText,
    brokenStations,
  };
}
