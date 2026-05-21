"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import type { RadioStation } from "@/lib/radios";

export function useRadio() {
  const [currentIdx, setCurrentIdx] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolumeState] = useState(80);
  const [statusText, setStatusText] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hlsRef = useRef<import("hls.js").default | null>(null);
  const stationsRef = useRef<RadioStation[]>([]);

  // Expose stations for prev/next navigation
  const setStations = useCallback((stations: RadioStation[]) => {
    stationsRef.current = stations;
  }, []);

  const _destroyHls = useCallback(() => {
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.src = "";
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

      // Lazily create audio element once
      if (!audioRef.current) {
        audioRef.current = new Audio();
        audioRef.current.crossOrigin = "anonymous";
      }
      const audio = audioRef.current;
      audio.pause();
      _destroyHls();

      audio.volume = volume / 100;

      if (station.h) {
        // HLS stream
        try {
          const Hls = (await import("hls.js")).default;
          if (Hls.isSupported()) {
            const hls = new Hls({
              enableWorker: false, // safer for tablet browsers
              lowLatencyMode: false,
            });
            hlsRef.current = hls;

            hls.loadSource(station.u);
            hls.attachMedia(audio);

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
              audio
                .play()
                .then(() => {
                  setPlaying(true);
                  setStatusText("");
                })
                .catch(() => {
                  setStatusText("Tap play to start");
                  setPlaying(false);
                });
            });

            hls.on(Hls.Events.ERROR, (_e: unknown, data: { fatal: boolean; type: string }) => {
              if (data.fatal) {
                setStatusText(`${station.n} — stream error`);
                setPlaying(false);
                _destroyHls();
              }
            });
          } else if (audio.canPlayType("application/vnd.apple.mpegurl")) {
            // Safari native HLS
            audio.src = station.u;
            audio
              .play()
              .then(() => { setPlaying(true); setStatusText(""); })
              .catch(() => setStatusText(`${station.n} — blocked`));
          } else {
            setStatusText("HLS not supported on this browser");
          }
        } catch {
          setStatusText("Failed to load HLS player");
        }
      } else {
        // Plain MP3 / AAC stream
        audio.src = station.u;
        audio
          .play()
          .then(() => { setPlaying(true); setStatusText(""); })
          .catch(() => {
            setStatusText(`${station.n} — tap play to retry`);
            setPlaying(false);
          });
      }
    },
    [volume, _destroyHls]
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      _destroyHls();
      audioRef.current?.pause();
    };
  }, [_destroyHls]);

  const currentStation =
    currentIdx >= 0 ? stationsRef.current[currentIdx] ?? null : null;

  return {
    play,
    stop,
    togglePlay,
    prev,
    next,
    setVolume,
    setStations,
    currentIdx,
    currentStation,
    playing,
    volume,
    statusText,
  };
}
