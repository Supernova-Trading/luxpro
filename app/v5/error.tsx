"use client";

import { useEffect, useState } from "react";

// A crash anywhere in v5 shows this calm screen instead of Chrome's
// "Application error" page, then reloads itself (council 2026-10-06).
// Pattern: next-shadcn-dashboard-starter src/app/dashboard/overview/@*/error.tsx
// (segment error.tsx with a retry); impeccable reference/harden.md (recover,
// don't strand the user).
const RELOAD_S = 5;

export default function V5Error({ error }: { error: Error & { digest?: string } }) {
  const [left, setLeft] = useState(RELOAD_S);

  useEffect(() => {
    console.error("LuxPro v5 error", error);
  }, [error]);

  useEffect(() => {
    const until = Date.now() + RELOAD_S * 1000;
    const t = setInterval(() => {
      const s = Math.ceil((until - Date.now()) / 1000);
      if (s <= 0) { clearInterval(t); window.location.reload(); }
      else setLeft(s);
    }, 250);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="v5" data-lang="en" dir="ltr">
      <div className="v5-ride" role="alert">
        <span className="v5-wordmark">LuxPro</span>
        <div className="v5-ride-head">
          <span className="v5-ride-title">One moment</span>
          <span className="v5-ride-sub">The screen is restarting. It will be back in a few seconds.</span>
        </div>
        <button className="v5-pill" onClick={() => window.location.reload()}>Restart now</button>
        <span className="v5-micro" aria-live="off">Restarting in {left}s</span>
      </div>
    </div>
  );
}
