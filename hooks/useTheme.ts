"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import SunCalc from "suncalc";

// ── Fallback coordinates — Manchester, England, UK ────────────────────────────
const FALLBACK_LAT = 53.4808;
const FALLBACK_LNG = -2.2426;
// ─────────────────────────────────────────────────────────────────────────────

// Safety re-check interval — catches clock jumps and tab-backgrounded cases
const SAFETY_INTERVAL_MS = 3 * 60 * 1000; // 3 minutes

export type ThemeMode = "light" | "dark" | "auto";

function getStoredMode(): ThemeMode {
  if (typeof window === "undefined") return "auto";
  const stored = localStorage.getItem("lp-theme-mode") as ThemeMode | null;
  return stored ?? "auto";
}

function resolveAuto(lat: number, lng: number): "light" | "dark" {
  const now = new Date();
  const { sunrise, sunset } = SunCalc.getTimes(now, lat, lng);
  return now >= sunrise && now < sunset ? "light" : "dark";
}

function getNextTransition(lat: number, lng: number): Date {
  const now = new Date();
  const { sunrise, sunset } = SunCalc.getTimes(now, lat, lng);

  if (now < sunrise) return sunrise;
  if (now < sunset) return sunset;

  // After today's sunset — next transition is tomorrow's sunrise
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return SunCalc.getTimes(tomorrow, lat, lng).sunrise;
}

export function getSunTimesForDebug(lat = FALLBACK_LAT, lng = FALLBACK_LNG) {
  const { sunrise, sunset } = SunCalc.getTimes(new Date(), lat, lng);
  return { sunrise, sunset };
}

export function useTheme() {
  const [mode, setModeState] = useState<ThemeMode>("auto");
  const [resolved, setResolved] = useState<"light" | "dark">("dark");

  const modeRef        = useRef<ThemeMode>("auto");
  const coordsRef      = useRef({ lat: FALLBACK_LAT, lng: FALLBACK_LNG });
  const flipTimerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const safetyRef      = useRef<ReturnType<typeof setInterval> | null>(null);
  const watchIdRef     = useRef<number | null>(null);

  // ── Precision flip scheduler ─────────────────────────────────────────────
  // Clears any pending timer, finds the next sunrise/sunset, and sets a new
  // timeout that fires exactly at that moment then chains itself.
  const scheduleFlip = useCallback(() => {
    if (flipTimerRef.current !== null) {
      clearTimeout(flipTimerRef.current);
      flipTimerRef.current = null;
    }
    if (modeRef.current !== "auto") return;

    const { lat, lng } = coordsRef.current;
    const nextFlip = getNextTransition(lat, lng);
    const msUntil  = Math.max(nextFlip.getTime() - Date.now(), 0);

    console.log(
      `[LuxPro theme] Next flip scheduled at ${nextFlip.toLocaleTimeString()} ` +
      `(in ${Math.round(msUntil / 60_000)} min) — ` +
      `coords ${lat.toFixed(4)}, ${lng.toFixed(4)}`
    );

    flipTimerRef.current = setTimeout(() => {
      if (modeRef.current !== "auto") return;
      const r = resolveAuto(coordsRef.current.lat, coordsRef.current.lng);
      setResolved(r);
      scheduleFlip(); // chain: schedule the one after this
    }, msUntil);
  }, []);

  // ── Apply and schedule from current state ────────────────────────────────
  const applyAuto = useCallback(() => {
    const { lat, lng } = coordsRef.current;
    setResolved(resolveAuto(lat, lng));
    scheduleFlip();
  }, [scheduleFlip]);

  // ── Public setter ─────────────────────────────────────────────────────────
  const setMode = useCallback(
    (m: ThemeMode) => {
      modeRef.current = m;
      setModeState(m);
      if (typeof window !== "undefined") {
        localStorage.setItem("lp-theme-mode", m);
      }
      if (m === "auto") {
        applyAuto();
      } else {
        // Manual override — cancel the auto timer
        if (flipTimerRef.current !== null) {
          clearTimeout(flipTimerRef.current);
          flipTimerRef.current = null;
        }
        setResolved(m);
      }
    },
    [applyAuto]
  );

  // ── Main setup effect ────────────────────────────────────────────────────
  useEffect(() => {
    const initialMode = getStoredMode();
    modeRef.current = initialMode;
    setModeState(initialMode);

    if (initialMode === "auto") {
      applyAuto();
    } else {
      setResolved(initialMode);
    }

    // ── watchPosition — live location following ──────────────────────────
    // A single call; the browser prompts for permission once and then streams
    // updates. Falls back silently to Manchester if denied or unavailable.
    if (typeof navigator !== "undefined" && "geolocation" in navigator) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude: lat, longitude: lng } = pos.coords;
          const prev = coordsRef.current;
          // Only act if the position changed meaningfully (>50 m threshold
          // avoids pointless reschedules for GPS jitter)
          const deltaLat = Math.abs(lat - prev.lat);
          const deltaLng = Math.abs(lng - prev.lng);
          const moved = deltaLat > 0.0005 || deltaLng > 0.0005; // ~50 m

          coordsRef.current = { lat, lng };

          if (modeRef.current === "auto" && moved) {
            // Recompute theme and reschedule flip for the new location
            setResolved(resolveAuto(lat, lng));
            scheduleFlip();
          }
        },
        () => {
          // Permission denied or error — silently continue on Manchester fallback
          console.log("[LuxPro theme] Geolocation unavailable — using Manchester fallback");
        },
        {
          enableHighAccuracy: false,
          timeout: 10_000,
          maximumAge: 60_000,
        }
      );
    }

    // ── Safety interval — catches clock jumps / backgrounded tabs ────────
    safetyRef.current = setInterval(() => {
      if (modeRef.current !== "auto") return;
      const { lat, lng } = coordsRef.current;
      const correct = resolveAuto(lat, lng);
      setResolved((prev) => {
        if (prev !== correct) {
          console.log(`[LuxPro theme] Safety check corrected theme to ${correct}`);
        }
        return correct;
      });
      // Reschedule in case the timer drifted after backgrounding
      scheduleFlip();
    }, SAFETY_INTERVAL_MS);

    return () => {
      if (flipTimerRef.current !== null)  clearTimeout(flipTimerRef.current);
      if (safetyRef.current !== null)     clearInterval(safetyRef.current);
      if (watchIdRef.current !== null)    navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, [applyAuto, scheduleFlip]);

  // ── Apply resolved theme to document ────────────────────────────────────
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", resolved);
    }
  }, [resolved]);

  return { mode, setMode, resolved };
}
