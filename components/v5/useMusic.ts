"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRadio } from "@/hooks/useRadio";
import { PLAYLISTS } from "./playlists";
import type { RadioStation } from "@/lib/radios";
import type { Lang } from "@/lib/translations";
import { useSoundCloud } from "./useSoundCloud";

export type Source = "radio" | "playlists" | "bluetooth";

const DEFAULT_VOLUME = 60;
const DUCK_RATIO = 0.3; // music dips to 30% while the tablet speaks to Amish
const STALL_MS = 10_000; // a station still loading after 10 s counts as offline (roadmap P3/P6)

// One place for everything audio. useRadio is the live app's hook, imported
// unchanged; SoundCloud runs through v5's own driver.
export function useMusic(radios: RadioStation[], lang: Lang) {
  const radio = useRadio();
  const sc = useSoundCloud();
  const [source, setSourceState] = useState<Source>("playlists");
  const [plIdx, setPlIdx] = useState(0);
  const [volume, setVolumeState] = useState(DEFAULT_VOLUME);
  const volumeRef = useRef(DEFAULT_VOLUME);
  const duckedRef = useRef(false);

  const { setVolume: radioSetVolume, stop: radioStop } = radio;

  // A stream that never starts shows "Offline · tap play to try again"
  // instead of an endless "Loading…"; play is then the retry.
  const [stalled, setStalled] = useState(false);
  const loading = radio.statusText.startsWith("Loading");
  useEffect(() => {
    setStalled(false);
    if (!loading) return;
    const t = setTimeout(() => setStalled(true), STALL_MS);
    return () => clearTimeout(t);
  }, [loading, radio.currentIdx]);

  // Signal lost (tunnels, dead spots): say so rather than spin.
  const [online, setOnline] = useState(true);
  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => { window.removeEventListener("online", update); window.removeEventListener("offline", update); };
  }, []);
  const { setVolume: scSetVolume, load: scLoad } = sc;

  // Start with the first playlist loaded but paused, so its artwork fills the
  // hero from the first second without music starting on its own.
  useEffect(() => {
    radioSetVolume(DEFAULT_VOLUME);
    scLoad(PLAYLISTS[0].u, false);
  }, [radioSetVolume, scLoad]);

  // Station lists differ per language: stop the radio when it changes.
  const firstLang = useRef(true);
  useEffect(() => {
    if (firstLang.current) { firstLang.current = false; return; }
    radioStop();
  }, [lang, radioStop]);

  const apply = useCallback((v: number) => { radioSetVolume(v); scSetVolume(v); }, [radioSetVolume, scSetVolume]);

  const setVolume = useCallback((v: number) => {
    const c = Math.max(0, Math.min(100, Math.round(v)));
    volumeRef.current = c;
    setVolumeState(c);
    if (!duckedRef.current) apply(c);
  }, [apply]);

  const duck = useCallback((on: boolean) => {
    if (duckedRef.current === on) return;
    duckedRef.current = on;
    apply(on ? Math.round(volumeRef.current * DUCK_RATIO) : volumeRef.current);
  }, [apply]);

  // One source at a time; switching never auto-plays the new one.
  function setSource(next: Source) {
    if (next === source) return;
    if (next !== "radio") radio.stop();
    if (next !== "playlists") sc.pause();
    setSourceState(next);
  }

  function choosePlaylist(i: number) {
    setPlIdx(i);
    sc.load(PLAYLISTS[i].u, true);
  }

  function chooseStation(i: number) {
    radio.play(i, radios);
  }

  function togglePlay(openPicker: () => void) {
    if (source === "playlists") {
      if (sc.failed) { sc.load(PLAYLISTS[plIdx].u, true); return; }
      if (sc.playing) sc.pause(); else sc.play();
      return;
    }
    if (source === "radio") {
      const i = radio.currentIdx;
      if (i < 0) { openPicker(); return; }
      // Offline or never started: a fresh play() is the "Try again".
      if (radio.brokenStations.has(i) || (!radio.playing && radio.statusText)) { radio.play(i, radios); return; }
      radio.togglePlay();
    }
  }

  // Previous / next wrap round instead of going dead at the ends.
  function step(dir: 1 | -1) {
    if (source === "playlists") { if (dir > 0) sc.next(); else sc.prev(); return; }
    if (source === "radio" && radios.length) {
      const from = radio.currentIdx < 0 ? (dir > 0 ? -1 : 0) : radio.currentIdx;
      radio.play((from + dir + radios.length) % radios.length, radios);
    }
  }

  function reset() {
    radio.stop();
    setSourceState("playlists");
    setPlIdx(0);
    sc.load(PLAYLISTS[0].u, false);
    setVolume(DEFAULT_VOLUME);
  }

  return { radio, sc, stalled, online, source, setSource, plIdx, volume, setVolume, duck, choosePlaylist, chooseStation, togglePlay, step, reset };
}

export type Music = ReturnType<typeof useMusic>;
