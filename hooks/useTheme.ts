"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import SunCalc from "suncalc";

// ── Fallback coordinates — Manchester, England, UK ────────────────────────────
// Change these if the vehicle operates in a different city.
const FALLBACK_LAT = 53.4808;
const FALLBACK_LNG = -2.2426;
// ─────────────────────────────────────────────────────────────────────────────

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

export function getSunTimesForDebug(lat = FALLBACK_LAT, lng = FALLBACK_LNG) {
  const { sunrise, sunset } = SunCalc.getTimes(new Date(), lat, lng);
  return { sunrise, sunset };
}

export function useTheme() {
  const [mode, setModeState] = useState<ThemeMode>("auto");
  const [resolved, setResolved] = useState<"light" | "dark">("dark");
  const modeRef = useRef<ThemeMode>("auto");
  const coordsRef = useRef({ lat: FALLBACK_LAT, lng: FALLBACK_LNG });

  const applyAuto = useCallback(() => {
    const { lat, lng } = coordsRef.current;
    setResolved(resolveAuto(lat, lng));
  }, []);

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
        setResolved(m);
      }
    },
    [applyAuto]
  );

  useEffect(() => {
    const initialMode = getStoredMode();
    modeRef.current = initialMode;
    setModeState(initialMode);

    // Silent geolocation check — never triggers a permission prompt.
    // Only reads coordinates if the user has already granted permission.
    if (typeof navigator !== "undefined" && navigator.permissions) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then((result) => {
          if (result.state === "granted") {
            navigator.geolocation.getCurrentPosition(
              (pos) => {
                coordsRef.current = {
                  lat: pos.coords.latitude,
                  lng: pos.coords.longitude,
                };
                if (modeRef.current === "auto") applyAuto();
              },
              () => { /* silently stay on Manchester fallback */ },
              { timeout: 5000, maximumAge: 300_000 }
            );
          }
        })
        .catch(() => { /* permissions API unavailable — use fallback */ });
    }

    // Set initial resolved theme
    if (initialMode === "auto") {
      applyAuto();
      const { lat, lng } = coordsRef.current;
      const { sunrise, sunset } = SunCalc.getTimes(new Date(), lat, lng);
      console.log(
        `[LuxPro theme] Auto mode — Manchester sunrise: ${sunrise.toLocaleTimeString()}, sunset: ${sunset.toLocaleTimeString()}`
      );
    } else {
      setResolved(initialMode);
    }

    // Re-evaluate every 15 minutes
    const interval = setInterval(() => {
      if (modeRef.current === "auto") applyAuto();
    }, 15 * 60 * 1000);

    return () => clearInterval(interval);
  }, [applyAuto]);

  // Apply resolved theme to document
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", resolved);
    }
  }, [resolved]);

  return { mode, setMode, resolved };
}
