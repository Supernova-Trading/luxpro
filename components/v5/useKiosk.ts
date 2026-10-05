"use client";

import { useEffect } from "react";

// Kiosk behaviour a web page can manage on its own (roadmap P8). A full lock —
// passengers unable to leave Chrome at all — needs the tablet's own screen
// pinning or a kiosk-browser app; this covers everything short of that.
export function useKiosk(on: boolean) {
  // Keep the screen awake for the whole ride (re-taken whenever the page shows).
  useEffect(() => {
    type Lock = { release: () => Promise<void> };
    const wl = (navigator as Navigator & { wakeLock?: { request: (t: "screen") => Promise<Lock> } }).wakeLock;
    if (!wl) return;
    let lock: Lock | null = null;
    const take = () => { wl.request("screen").then((l) => { lock = l; }).catch(() => {}); };
    const onShow = () => { if (document.visibilityState === "visible") take(); };
    take();
    document.addEventListener("visibilitychange", onShow);
    return () => { document.removeEventListener("visibilitychange", onShow); lock?.release().catch(() => {}); };
  }, []);

  useEffect(() => {
    if (!on) return;
    // Back button stays in the app.
    history.pushState({ luxpro: 1 }, "");
    const onBack = () => history.pushState({ luxpro: 1 }, "");
    // No long-press menus (save image, open in new tab…).
    const noMenu = (e: Event) => e.preventDefault();
    // Back to full screen on the next touch if anything dropped it.
    const toFull = () => {
      if (!document.fullscreenElement) document.documentElement.requestFullscreen?.().catch(() => {});
    };
    // No pull-to-refresh.
    const root = document.documentElement;
    const before = root.style.overscrollBehavior;
    root.style.overscrollBehavior = "none";
    window.addEventListener("popstate", onBack);
    window.addEventListener("contextmenu", noMenu);
    window.addEventListener("pointerdown", toFull);
    return () => {
      window.removeEventListener("popstate", onBack);
      window.removeEventListener("contextmenu", noMenu);
      window.removeEventListener("pointerdown", toFull);
      root.style.overscrollBehavior = before;
    };
  }, [on]);
}
