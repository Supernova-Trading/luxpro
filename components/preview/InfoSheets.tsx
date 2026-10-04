"use client";

import { motion } from "framer-motion";
import type { Translation } from "@/lib/translations";
import type { PreviewStrings } from "@/lib/preview-strings";

const tap = { scale: 0.98, transition: { duration: 0.08 } };

function SheetHeader({ title, closeLabel, onClose }: { title: string; closeLabel: string; onClose: () => void }) {
  return (
    <div className="flex items-center justify-between gap-6 mb-8">
      <div className="bx-display">{title}</div>
      <motion.button whileTap={tap} className="bx-pill" onClick={onClose}>
        {closeLabel}
      </motion.button>
    </div>
  );
}

// ─── Bluetooth: device name as the statement, steps as hairline rows ─────────
export function BluetoothSheet({ s, t, onClose }: { s: PreviewStrings; t: Translation; onClose: () => void }) {
  const steps = [t.btStep1, t.btStep2, t.btStep3, t.btStep4, t.btStep5.replace(/\s*✅/, "")];
  return (
    <div className="max-w-[880px]">
      <SheetHeader title={s.btTitle} closeLabel={s.close} onClose={onClose} />
      <div className="bx-caption">{s.btLookFor}</div>
      <div className="bx-display-lg mt-1 mb-8">My Volvo Car</div>
      <ol>
        {steps.map((step, i) => (
          <li key={i} className="bx-row" style={{ minHeight: 52 }}>
            <span className="bx-caption" style={{ width: 24 }}>{i + 1}</span>
            {/* Static translation strings with <strong> markup — not user input */}
            <span className="bx-row-title is-sm" style={{ color: "var(--bx-body)" }} dangerouslySetInnerHTML={{ __html: step }} />
          </li>
        ))}
      </ol>
    </div>
  );
}

// ─── Contact Amish ───────────────────────────────────────────────────────────
export function ContactSheet({ s, onClose }: { s: PreviewStrings; onClose: () => void }) {
  return (
    <div className="max-w-[880px]">
      <SheetHeader title={s.contactAmish} closeLabel={s.close} onClose={onClose} />
      <div className="bx-caption">Amish</div>
      <div className="bx-display-lg mt-1 mb-8" dir="ltr" style={{ textAlign: "start" }}>07438 537 561</div>
      <a href="tel:07438537561" className="bx-pill" style={{ textDecoration: "none" }}>
        {s.call}
      </a>
    </div>
  );
}

// ─── Revolut QR ──────────────────────────────────────────────────────────────
export function QRSheet({ s, t, onClose }: { s: PreviewStrings; t: Translation; onClose: () => void }) {
  return (
    <div className="max-w-[880px]">
      <SheetHeader title={s.revolut} closeLabel={s.close} onClose={onClose} />
      <div className="flex items-center gap-10">
        {/* QR codes need a light quiet zone to scan reliably */}
        <div style={{ background: "oklch(0.985 0.002 90)", padding: 16, lineHeight: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/qr-tip.png" alt={t.scanToTip} width={240} height={240} />
        </div>
        <div>
          <div className="bx-caption">{s.tipAmish}</div>
          <div className="bx-display mt-2" style={{ maxWidth: 420 }}>{t.qrCaption}</div>
        </div>
      </div>
    </div>
  );
}
