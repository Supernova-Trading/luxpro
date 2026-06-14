"use client";

import { useState, useEffect } from "react";
import { LANG_FLAGS, type Lang } from "@/lib/translations";
import type { Translation } from "@/lib/translations";
import { Icon } from "./Icon";

interface Props {
  lang: Lang;
  t: Translation;
  onSetLang: (l: Lang) => void;
  onOpenSettings: () => void;
}

const LANGS: Lang[] = ["en", "es", "fr", "ar", "ru", "zh"];
const LANG_CODES: Record<Lang, string> = {
  en: "EN", es: "ES", fr: "FR", ar: "AR", ru: "RU", zh: "中文",
};

function etaLabel(seconds: number): string {
  if (seconds <= 0) return "Arriving";
  const m = Math.floor(seconds / 60);
  return m > 0 ? `${m} min` : "< 1 min";
}

// Self-contained ETA countdown (8 minutes hardcoded). Owning the 1 Hz tick
// here keeps the per-second re-render scoped to this pill instead of the
// whole app tree.
function EtaPill() {
  const [eta, setEta] = useState(8 * 60);
  useEffect(() => {
    const id = setInterval(() => setEta((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="flex items-center gap-1.5 rounded-lg px-3 py-1.5"
      style={{
        background: "var(--lp-eta-bg)",
        border: "1px solid var(--lp-eta-border)",
        backdropFilter: "blur(10px)",
      }}
    >
      <span
        style={{
          fontSize: "8px",
          letterSpacing: "2.5px",
          color: "var(--lp-text-faint)",
          textTransform: "uppercase",
          fontWeight: 700,
        }}
      >
        ETA
      </span>
      <span
        style={{
          fontSize: "13px",
          fontWeight: 800,
          color: "var(--lp-gold-text)",
          letterSpacing: "1px",
        }}
      >
        {etaLabel(eta)}
      </span>
    </div>
  );
}

export default function Header({ lang, t, onSetLang, onOpenSettings }: Props) {
  return (
    <header
      className="flex-shrink-0 flex items-stretch relative overflow-hidden"
      style={{
        minHeight: 110,
        background: "var(--lp-header-bg)",
        borderBottom: "1px solid rgba(200,168,75,0.20)",
        boxShadow: "var(--lp-header-shadow)",
      }}
    >
      {/* Ambient glow disc behind wordmark */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: "18%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: "280px",
          height: "80px",
          background: "radial-gradient(ellipse, rgba(200,168,75,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
          filter: "blur(16px)",
        }}
      />

      {/* Left — wordmark block */}
      <div
        className="flex flex-col justify-center px-7 py-4 relative"
        style={{
          flex: "1 1 0",
          borderRight: "1px solid var(--lp-header-divider)",
        }}
      >
        <div
          className="uppercase font-semibold mb-1"
          style={{
            fontSize: "8px",
            letterSpacing: "4px",
            color: "var(--lp-welcome-color)",
          }}
        >
          {t.welcomeAboard}
        </div>
        <div
          className="font-cormorant font-bold italic leading-tight"
          style={{
            fontSize: "clamp(18px, 3.5vw, 26px)",
            color: "var(--lp-header-title-color)",
            letterSpacing: "2px",
            textShadow: "var(--lp-title-text-shadow)",
          }}
        >
          {t.exploreTagline}
        </div>
        <div className="version-badge mt-2">LuxPro 4.1</div>
      </div>

      {/* Right — controls block */}
      <div
        className="flex flex-col justify-between items-end gap-2 px-4 py-3 flex-shrink-0"
        style={{ minWidth: 160 }}
      >
        {/* ETA + settings */}
        <div className="flex items-center gap-2 w-full justify-end">
          <EtaPill />

          {/* Settings button */}
          <button
            onClick={onOpenSettings}
            className="flex items-center justify-center rounded-lg transition-all"
            style={{
              width: 36,
              height: 32,
              background: "var(--lp-overlay-mid)",
              border: "1px solid var(--lp-overlay-border)",
              color: "var(--text-primary)",
              backdropFilter: "blur(8px)",
              transition: "box-shadow 200ms ease, border-color 200ms ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "var(--glow-subtle)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(200,168,75,0.40)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--lp-overlay-border)";
            }}
            title="Settings"
          >
            <Icon name="settings" size={17} />
          </button>
        </div>

        {/* Language buttons — 2 rows of 3 */}
        <div className="flex flex-col gap-1 items-end w-full">
          {[LANGS.slice(0, 3), LANGS.slice(3)].map((row, ri) => (
            <div key={ri} className="flex gap-1 justify-end">
              {row.map((l) => (
                <button
                  key={l}
                  onClick={() => onSetLang(l)}
                  className="flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-bold transition-all"
                  style={{
                    lineHeight: 1,
                    border: l === lang
                      ? "1px solid rgba(200,168,75,0.70)"
                      : "1px solid var(--lp-overlay-border)",
                    background: l === lang
                      ? "rgba(200,168,75,0.18)"
                      : "var(--lp-overlay-btn)",
                    color: l === lang ? "var(--lp-gold-text)" : "var(--lp-text-sub)",
                    boxShadow: l === lang ? "var(--glow-subtle)" : "none",
                    transition: "all 200ms ease",
                  }}
                >
                  <img
                    src={LANG_FLAGS[l]}
                    alt={l}
                    className="w-[22px] h-[15px] rounded-[3px] shadow-sm block"
                  />
                  <span>{LANG_CODES[l]}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
