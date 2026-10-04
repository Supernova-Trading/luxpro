"use client";

import { useEffect, useState } from "react";

// One-off device check at /v5/diag (moved from /lab/diag in P6): open on the tablet, photograph, send. Tells us the
// real viewport and whether this Chrome supports what the new design uses
// (oklch / color-mix need Chrome 111+, dvh needs 108+).
export default function Diag() {
  const [rows, setRows] = useState<[string, string][]>([]);

  useEffect(() => {
    const measure = () => {
      const chrome = navigator.userAgent.match(/Chrome\/(\d+)/)?.[1] ?? "not Chrome";
      const model = navigator.userAgent.match(/Android [^;)]+;\s*([^;)]+)/)?.[1] ?? "unknown";
      const yes = (ok: boolean) => (ok ? "yes" : "NO");
      setRows([
        ["Screen (CSS px)", `${window.innerWidth} × ${window.innerHeight}`],
        ["Visible area", window.visualViewport ? `${Math.round(window.visualViewport.width)} × ${Math.round(window.visualViewport.height)}` : "n/a"],
        ["Pixel ratio", String(window.devicePixelRatio)],
        ["Device screen", `${screen.width} × ${screen.height}`],
        ["Orientation", screen.orientation?.type ?? "n/a"],
        ["Chrome version", chrome],
        ["Device model", model],
        ["oklch colours", yes(CSS.supports("color", "oklch(0.5 0.1 90)"))],
        ["color-mix", yes(CSS.supports("color", "color-mix(in srgb, red 50%, blue)"))],
        ["dvh units", yes(CSS.supports("height", "100dvh"))],
        ["Touch screen", yes(window.matchMedia("(pointer: coarse)").matches)],
        ["Voice (speech)", yes("speechSynthesis" in window)],
      ]);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#111", color: "#f5f2ea", fontFamily: "system-ui, sans-serif", padding: 24 }}>
      <h1 style={{ fontSize: 26, marginBottom: 6 }}>LuxPro tablet check</h1>
      <p style={{ fontSize: 16, opacity: 0.7, marginBottom: 20 }}>Please take a photo of this screen and send it.</p>
      <table style={{ width: "100%", fontSize: 20, borderCollapse: "collapse" }}>
        <tbody>
          {rows.map(([k, v]) => (
            <tr key={k} style={{ borderBottom: "1px solid #333" }}>
              <td style={{ padding: "10px 0", opacity: 0.75 }}>{k}</td>
              <td style={{ padding: "10px 0", textAlign: "right", fontWeight: 600, color: v === "NO" ? "#ff7b7b" : undefined }}>{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
