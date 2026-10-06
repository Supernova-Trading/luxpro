"use client";

import { Icon } from "../Icon";
import type { Lang } from "@/lib/translations";
import { STRINGS, type V5Strings } from "./strings";

// Pickup and drop-off screens (roadmap P8). Amish starts them from the Driver
// panel today; his phone remote will trigger the same screens later.

const LANG_CHOICES: { id: Lang; label: string }[] = [
  { id: "en", label: "English" },
  { id: "es", label: "Español" },
  { id: "ur", label: "اردو" },
];

/** Welcome: each language button is written in its own language. */
export function Welcome({ onBegin, secondsLeft }: { onBegin: (l: Lang) => void; secondsLeft: number }) {
  const en = STRINGS.en;
  return (
    <div className="v5-ride v5-welcome" role="dialog" aria-label={en.welcomeTitle}>
      <span className="v5-wordmark">LuxPro</span>
      <div className="v5-ride-head">
        <span className="v5-ride-title">{en.welcomeTitle}</span>
        <span className="v5-ride-sub">{en.welcomeDriver}</span>
      </div>
      <div className="v5-ride-langs">
        {LANG_CHOICES.map((l) => (
          <button key={l.id} className="v5-ride-lang" data-lang={l.id} dir={l.id === "ur" ? "rtl" : "ltr"} onClick={() => onBegin(l.id)}>
            <span className="v5-ride-lang-name">{l.label}</span>
            <span className="v5-ride-lang-hint">{STRINGS[l.id].chooseLanguage}</span>
          </button>
        ))}
      </div>
      <span className="v5-sub" style={{ maxWidth: 420 }}>{en.welcomeNote}</span>
      <span className="v5-micro" aria-live="off">Continuing in English in {secondsLeft}s</span>
    </div>
  );
}

/** Farewell: thanks, a belongings reminder, and one last easy way to tip. */
export function Farewell({ s, tipped, tipButtons, phone }: {
  s: V5Strings;
  tipped: boolean;
  tipButtons: React.ReactNode;
  phone: string;
}) {
  return (
    <div className="v5-ride v5-farewell" role="dialog" aria-label={s.farewellTitle}>
      <span className="v5-wordmark">LuxPro</span>
      <div className="v5-ride-head">
        <span className="v5-ride-title">{s.farewellTitle}</span>
        <span className="v5-ride-sub" style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
          <Icon name="hand" size={20} style={{ color: "var(--i-lemon)", flexShrink: 0 }} />
          {s.farewellBelongings}
        </span>
      </div>
      {tipped ? (
        <span className="v5-title" style={{ color: "var(--gold)" }}>{s.farewellTipped}</span>
      ) : (
        <section className="v5-tip" aria-label={s.tipTitle} style={{ width: "100%", maxWidth: 560 }}>
          <div className="v5-tip-head">
            <span className="v5-title">{s.tipTitle}</span>
            <span className="v5-sub" style={{ color: "var(--gold)" }}>{s.tipHint}</span>
          </div>
          {tipButtons}
        </section>
      )}
      <div className="v5-ride-foot">
        <span className="v5-ride-sub">{s.farewellBye}</span>
        <span className="v5-sub">{s.contactAmish} · <span dir="ltr">{phone}</span></span>
      </div>
    </div>
  );
}

/** "Nearly there": a banner over the top of the screen for a few seconds. */
export function NearlyBanner({ s, onClose }: { s: V5Strings; onClose: () => void }) {
  return (
    <button className="v5-nearly" role="status" onClick={onClose}>
      <Icon name="map-pin" size={22} style={{ color: "var(--gold)", flexShrink: 0 }} />
      <span style={{ display: "grid", gap: 2, textAlign: "start" }}>
        <span className="v5-label">{s.nearlyThere}</span>
        <span className="v5-sub">{s.nearlySub}</span>
      </span>
    </button>
  );
}
