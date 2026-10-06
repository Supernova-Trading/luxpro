"use client";

import { useEffect, useState } from "react";
import { DEFAULT_DRIVER, revolutLink, type DriverProfile } from "./driverProfile";

// The Revolut tipping QR (v5.35). Amish keeps his tested image
// (public/qr-tip.png, confirmed scanning to his page 2026-10-06); any other
// driver's QR is drawn on the tablet from their Revolut username.
export default function RevolutQr({ driver, alt, onFail }: { driver: DriverProfile; alt: string; onFail: () => void }) {
  const isDefault = driver.revolut === DEFAULT_DRIVER.revolut;
  const [src, setSrc] = useState<string | null>(isDefault ? "/qr-tip.png" : null);

  useEffect(() => {
    if (isDefault) { setSrc("/qr-tip.png"); return; }
    if (!driver.revolut) { onFail(); return; }
    let off = false;
    import("qrcode")
      .then((Q) => Q.toDataURL(revolutLink(driver), { width: 520, margin: 0, errorCorrectionLevel: "M", color: { dark: "#000000", light: "#00000000" } }))
      .then((u) => { if (!off) setSrc(u); })
      .catch(() => { if (!off) onFail(); });
    return () => { off = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [driver.revolut, isDefault]);

  // eslint-disable-next-line @next/next/no-img-element
  return src ? <img src={src} alt={alt} width={260} height={260} onError={onFail} /> : <div style={{ width: 260, height: 260 }} />;
}
