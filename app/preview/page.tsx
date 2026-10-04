"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import { Icon, type IconName } from "@/components/Icon";
import Listen from "@/components/preview/Listen";
import AskAmish from "@/components/preview/AskAmish";
import Climate from "@/components/preview/Climate";
import Sheet from "@/components/preview/Sheet";
import PassTheTime from "@/components/preview/PassTheTime";
import TipSheet from "@/components/preview/TipSheet";
import SettingsPanel from "@/components/preview/SettingsPanel";
import { BluetoothSheet, ContactSheet, QRSheet } from "@/components/preview/InfoSheets";

import { useLanguage } from "@/hooks/useLanguage";
import { useVoice } from "@/hooks/useVoice";
import { useRadio } from "@/hooks/useRadio";
import type { Lang } from "@/lib/translations";
import { PREVIEW_STRINGS } from "@/lib/preview-strings";

const LANGS: { id: Lang; label: string }[] = [
  { id: "en", label: "EN" },
  { id: "es", label: "ES" },
  { id: "ur", label: "اردو" },
];
const tap = { scale: 0.97, transition: { duration: 0.1 } };

function useFullscreen() {
  const [isFS, setIsFS] = useState(false);
  useEffect(() => {
    const handler = () => setIsFS(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);
  function toggle() {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
    else document.exitFullscreen?.();
  }
  return { isFS, toggle };
}

// Portrait single column for the vertically-mounted Tab A (~640×968 with
// Chrome's URL bar, ~640×1024 fullscreen). Order follows the council's
// passenger-first ranking: greeting → Ask Amish → climate → music → extras.
export default function PreviewPage() {
  const { lang, setLang, t, radios, content, isRTL } = useLanguage();
  const { speak, voiceMode, setVoiceMode } = useVoice(lang);
  const radio = useRadio();
  const { isFS, toggle: toggleFS } = useFullscreen();
  const s = PREVIEW_STRINGS[lang];

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [sheet, setSheet] = useState<"pass" | "tip" | "qr" | "bt" | "contact" | null>(null);
  const closeSheet = () => setSheet(null);

  // Greeting follows the passenger's clock — resolved after mount so the
  // server render can't disagree with it.
  const [daypart, setDaypart] = useState<"morning" | "afternoon" | "evening" | null>(null);
  useEffect(() => {
    const h = new Date().getHours();
    setDaypart(h < 12 ? "morning" : h < 18 ? "afternoon" : "evening");
  }, []);

  useEffect(() => {
    const id = setTimeout(() => {
      speak("Welcome aboard. My name is Amish. Sit back, relax, and enjoy your ride.");
    }, 900);
    return () => clearTimeout(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSetLang(l: Lang) {
    setLang(l);
    radio.stop();
  }

  function handleShowBT() {
    speak("To connect Bluetooth, find My Volvo Car in your phone settings.");
    setSheet("bt");
  }

  const extras: { id: "pass" | "tip"; icon: IconName; color: string; label: string; sub: string }[] = [
    { id: "pass", icon: "gamepad", color: "var(--icon-violet)",     label: s.passTheTime, sub: s.passTheTimeSub },
    { id: "tip",  icon: "cash",    color: "var(--accent-positive)", label: s.tipAmish,    sub: s.tipSub },
  ];

  return (
    <div
      className="bx relative flex flex-col overflow-hidden"
      style={{ height: "100dvh" }}
      data-lang={lang}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <header className="flex items-center justify-between px-4 flex-shrink-0" style={{ height: 56 }}>
        <div className="bx-wordmark">LuxPro</div>
        <div className="flex items-center">
          {LANGS.map(({ id, label }) => (
            <button key={id} className="bx-nav" aria-pressed={id === lang} onClick={() => handleSetLang(id)}>
              {label}
            </button>
          ))}
          <motion.button
            whileTap={tap}
            className="bx-icon-btn ms-2"
            aria-label={s.settings}
            aria-expanded={settingsOpen}
            data-settings-toggle
            onClick={() => setSettingsOpen((v) => !v)}
          >
            <Icon name="settings" size={18} />
          </motion.button>
        </div>
      </header>

      <SettingsPanel
        open={settingsOpen}
        s={s}
        voiceMode={voiceMode}
        isFullscreen={isFS}
        onClose={() => setSettingsOpen(false)}
        onContact={() => { speak("Connecting you to Amish now."); setSheet("contact"); }}
        onToggleFS={toggleFS}
        onSetVoiceMode={setVoiceMode}
      />

      <main className="flex-1 min-h-0 flex flex-col justify-between gap-4 px-4 pt-1 pb-4">
        <h1 className="bx-display" style={{ minHeight: 36 }}>
          {daypart ? s.greeting[daypart] : ""}
        </h1>

        <AskAmish s={s} onSpeak={speak} />

        <Climate s={s} onSpeak={speak} />

        <Listen s={s} lang={lang} radios={radios} radio={radio} onSpeak={speak} onShowBT={handleShowBT} />

        <div className="grid grid-cols-2 gap-2">
          {extras.map(({ id, icon, color, label, sub }) => (
            <motion.button key={id} whileTap={tap} className="bx-tile bx-tile--row" style={{ minHeight: 76 }} onClick={() => setSheet(id)}>
              <Icon name={icon} size={24} style={{ color, flexShrink: 0 }} />
              <span className="flex flex-col min-w-0 flex-1">
                <span className="bx-label">{label}</span>
                <span className="bx-sub truncate">{sub}</span>
              </span>
              <Icon name="chevron-right" size={18} className="bx-chevron" />
            </motion.button>
          ))}
        </div>
      </main>

      <Sheet open={sheet === "pass"}>
        <PassTheTime s={s} t={t} content={content} onSpeak={speak} onClose={closeSheet} />
      </Sheet>
      <Sheet open={sheet === "tip"}>
        <TipSheet s={s} t={t} onSpeak={speak} onShowQR={() => setSheet("qr")} onClose={closeSheet} />
      </Sheet>
      <Sheet open={sheet === "qr"}>
        <QRSheet s={s} t={t} onClose={closeSheet} />
      </Sheet>
      <Sheet open={sheet === "bt"}>
        <BluetoothSheet s={s} t={t} onClose={closeSheet} />
      </Sheet>
      <Sheet open={sheet === "contact"}>
        <ContactSheet s={s} onClose={closeSheet} />
      </Sheet>
    </div>
  );
}
