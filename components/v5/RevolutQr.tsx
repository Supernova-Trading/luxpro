"use client";

import { useEffect, useState } from "react";
import { revolutLink, type DriverProfile } from "./driverProfile";

// The Revolut tipping QR (v5.35; v5.39 owner: "the current one is low
// quality"). Drawn on the tablet as a sharp vector from the driver's Revolut
// username — Amish's included (his old image encoded the same link,
// https://revolut.me/amishg4sqm, checked 2026-10-06). Plain black on white,
// with an "R" badge in the middle; the high error-correction level (H) keeps
// it scannable with the badge covering the centre.
export default function RevolutQr({ driver, alt, onFail }: { driver: DriverProfile; alt: string; onFail: () => void }) {
  const [svg, setSvg] = useState<string | null>(null);

  useEffect(() => {
    if (!driver.revolut) { onFail(); return; }
    let off = false;
    setSvg(null);
    import("qrcode")
      .then((Q) => Q.toString(revolutLink(driver), { type: "svg", errorCorrectionLevel: "H", margin: 0, color: { dark: "#000000", light: "#0000" } }))
      .then((s) => { if (!off) setSvg(s); })
      .catch(() => { if (!off) onFail(); });
    return () => { off = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [driver.revolut]);

  return (
    <div className="v5-qr-code" role="img" aria-label={alt}>
      {svg && <span className="v5-qr-svg" dangerouslySetInnerHTML={{ __html: svg }} />}
      {svg && <span className="v5-qr-badge" aria-hidden>R</span>}
    </div>
  );
}
