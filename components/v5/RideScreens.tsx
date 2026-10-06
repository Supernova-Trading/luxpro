"use client";

import { Icon } from "../Icon";
import type { Lang } from "@/lib/translations";
import type { V5Strings } from "./strings";
import type { DriverProfile } from "./driverProfile";
import Wordmark from "./Wordmark";

// Pickup and drop-off screens (roadmap P8), started from the Driver panel or
// the driver's phone remote.

const LANG_CHOICES: { id: Lang; label: string }[] = [
  { id: "en", label: "English" },
  { id: "es", label: "Español" },
  { id: "ur", label: "اردو" },
];

/** Five gold stars (owner, v5.33: like the 4.33 tip banner's ★★★★★;
 *  awesome-design-md airbnb/DESIGN.md rating-display). */
function Stars({ size = 18 }: { size?: number }) {
  return (
    <span className="v5-stars" role="img" aria-label="5 stars">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden>
          <path d="M12 2.6l2.82 6.03 6.6.76-4.9 4.5 1.33 6.52L12 17.12l-5.85 3.29 1.33-6.52-4.9-4.5 6.6-.76z" />
        </svg>
      ))}
    </span>
  );
}

/** The driver's card (owner, v5.35): the name gets its own tile — a gold
 *  initial, the name large, stars and the executive line. Modelled on
 *  awesome-design-md airbnb/DESIGN.md host-card (line 286). No rating number. */
function DriverCard({ s, name, label, trips }: { s: V5Strings; name: string; label: string; trips: number }) {
  const initial = Array.from(name.trim())[0]?.toLocaleUpperCase() ?? "";
  const line = trips > 0 ? `${s.driverTitle} · ${s.driverTrips}` : s.driverTitle;
  return (
    <div className="v5-dcard">
      <span className="v5-dcard-mono" aria-hidden>{initial}</span>
      <span className="v5-dcard-text">
        <span className="v5-dcard-label">{label}</span>
        <span className="v5-dcard-name">{name}</span>
        <span className="v5-dcard-meta"><Stars size={16} /><span className="v5-profile-line">{line}</span></span>
      </span>
    </div>
  );
}

/** Welcome (v5.33 layout, v5.35 driver card): greeting and the driver up top,
 *  then the question and the languages as ruled rows — composed, not a stack
 *  of identical cards (impeccable SKILL.md absolute bans: identical card
 *  grids). Each row says what tapping it does, in its own language
 *  (impeccable reference/ux-writing.md: name the action). */
export function Welcome({ T, driver, onBegin, secondsLeft }: {
  T: Record<Lang, V5Strings>;
  driver: DriverProfile;
  onBegin: (l: Lang) => void;
  secondsLeft: number;
}) {
  const en = T.en;
  return (
    <div className="v5-ride v5-welcome" role="dialog" aria-label={en.welcomeTitle}>
      <div className="v5-welcome-top">
        <span className="v5-wordmark"><Wordmark width={176} draw /></span>
        <span className="v5-ride-title">{en.welcomeTitle}</span>
        <DriverCard s={en} name={driver.name} label={en.driverToday} trips={driver.trips} />
      </div>
      <div className="v5-welcome-low">
        <span className="v5-welcome-q">{en.chooseLanguageTitle}</span>
        <div className="v5-ride-langs">
          {LANG_CHOICES.map((l) => (
            <button key={l.id} className="v5-ride-lang" data-lang={l.id} dir={l.id === "ur" ? "rtl" : "ltr"} onClick={() => onBegin(l.id)}>
              <span className="v5-ride-lang-name">{l.label}</span>
              <span className="v5-ride-lang-hint">{T[l.id].chooseLanguage}</span>
              <Icon name="chevron-right" size={22} className="v5-flip v5-ride-lang-go" />
            </button>
          ))}
        </div>
        <span className="v5-sub">{en.welcomeNote}</span>
        <span className="v5-micro" aria-live="off">Continuing in English in {secondsLeft}s</span>
      </div>
    </div>
  );
}

/** Farewell: thanks, a belongings reminder, and one last easy way to tip. */
export function Farewell({ s, name, trips, tipped, tipButtons, phone, prize }: {
  s: V5Strings;
  name: string;   // the driver, in the passenger's language
  trips: number;
  tipped: boolean;
  tipButtons: React.ReactNode;
  phone: string;
  prize?: string | null; // tier name when a prize was won this ride
}) {
  return (
    <div className="v5-ride v5-farewell" role="dialog" aria-label={s.farewellTitle}>
      <span className="v5-wordmark"><Wordmark width={176} draw /></span>
      <div className="v5-ride-head">
        <span className="v5-ride-title">{s.farewellTitle}</span>
        <DriverCard s={s} name={name} label={s.yourDriver} trips={trips} />
        <span className="v5-ride-sub" style={{ display: "inline-flex", alignItems: "center", gap: 10, marginTop: 8 }}>
          <Icon name="hand" size={20} style={{ color: "var(--i-lemon)", flexShrink: 0 }} />
          {s.farewellBelongings}
        </span>
        {prize && <span className="v5-ride-sub" style={{ color: "var(--gold)" }}>{s.farewellPrize.replace("{tier}", prize)}</span>}
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
        <span className="v5-sub">{s.contactDriver} · <span dir="ltr">{phone}</span></span>
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
