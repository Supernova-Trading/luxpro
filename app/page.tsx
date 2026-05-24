"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";

import Header from "@/components/Header";
import VoiceBar from "@/components/VoiceBar";
import Entertainment from "@/components/Entertainment";
import TipBanner from "@/components/TipBanner";
import ChatAndTips from "@/components/ChatAndTips";
import Journey from "@/components/Journey";
import ComfortItems from "@/components/ComfortItems";
import SettingsMenu from "@/components/SettingsMenu";
import { BluetoothModal, PhoneModal, ReplyModal, AdminModal } from "@/components/Modals";
import Toast from "@/components/Toast";

import { useLanguage } from "@/hooks/useLanguage";
import { useVoice } from "@/hooks/useVoice";
import { useRadio } from "@/hooks/useRadio";
import type { Lang } from "@/lib/translations";

// ─── ETA countdown: 8 minutes hardcoded ─────────────────────────────────────
function useEta() {
  const [eta, setEta] = useState(8 * 60);
  useEffect(() => {
    const id = setInterval(() => setEta((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);
  return eta;
}

// ─── Toast helper ─────────────────────────────────────────────────────────────
function useToast() {
  const [msg, setMsg] = useState("");
  const [show, setShow] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  const toast = useCallback((m: string) => {
    setMsg(m);
    setShow(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setShow(false), 2400);
  }, []);

  return { toastMsg: msg, toastShow: show, toast };
}

// ─── Fullscreen ───────────────────────────────────────────────────────────────
function useFullscreen() {
  const [isFS, setIsFS] = useState(false);
  useEffect(() => {
    const handler = () => setIsFS(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  function toggle() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }

  return { isFS, toggle };
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function LuxProPage() {
  const { lang, setLang, t, radios, content, isRTL } = useLanguage();
  const { speak, speaking, voiceMode, setVoiceMode } = useVoice(lang);
  const radio = useRadio();
  const eta = useEta();
  const { toastMsg, toastShow, toast } = useToast();
  const { isFS, toggle: toggleFS } = useFullscreen();

  // Theme
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Modal visibility
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [btOpen, setBtOpen] = useState(false);
  const [phoneOpen, setPhoneOpen] = useState(false);
  const [replyOpen, setReplyOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  // Welcome speech on load
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
    const labels: Record<Lang, string> = { en: "English", es: "Español", fr: "Français", ar: "العربية", ru: "Русский", zh: "中文" };
    toast(labels[l]);
  }

  function handleShowBT() {
    speak("To connect Bluetooth, find My Volvo Car in your phone settings.");
    setBtOpen(true);
  }

  function handleShowPhone() {
    speak("Connecting you to Amish now.");
    setPhoneOpen(true);
  }

  return (
    <div
      className={`flex flex-col h-screen overflow-hidden relative ${isRTL ? "dir-rtl" : ""}`}
      style={{ background: "var(--lp-bg)" }}
    >
      {/* Header */}
      <Header
        lang={lang}
        t={t}
        eta={eta}
        onSetLang={handleSetLang}
        onOpenSettings={() => setSettingsOpen((v) => !v)}
      />

      {/* Settings dropdown (positioned absolutely over main) */}
      <SettingsMenu
        open={settingsOpen}
        t={t}
        voiceMode={voiceMode}
        theme={theme}
        onClose={() => setSettingsOpen(false)}
        onShowPhone={handleShowPhone}
        onShowReply={() => setReplyOpen(true)}
        onShowAdmin={() => setAdminOpen(true)}
        onToggleFS={toggleFS}
        onToggleTheme={() => setTheme((v) => (v === "dark" ? "light" : "dark"))}
        onSetVoiceMode={setVoiceMode}
        isFullscreen={isFS}
      />

      {/* Voice bar */}
      <VoiceBar speaking={speaking} text={speaking ? "" : t.vr} />

      {/* Scrollable main content */}
      <main
        className="flex-1 overflow-y-auto"
        style={{ padding: "18px 22px 28px", display: "flex", flexDirection: "column", gap: 18, background: "var(--lp-bg)" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <Entertainment
            t={t}
            radios={radios}
            radio={radio}
            onSpeak={speak}
            onShowBT={handleShowBT}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
        >
          <ChatAndTips t={t} onSpeak={speak} content={content} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.24 }}
        >
          <Journey t={t} onSpeak={speak} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.36 }}
        >
          <ComfortItems t={t} onSpeak={speak} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.48 }}
        >
          <TipBanner t={t} />
        </motion.div>
      </main>

      {/* Modals */}
      <BluetoothModal show={btOpen}    t={t} onClose={() => setBtOpen(false)} />
      <PhoneModal     show={phoneOpen} t={t} onClose={() => setPhoneOpen(false)} />
      <ReplyModal     show={replyOpen} t={t} onClose={() => setReplyOpen(false)} onSpeak={speak} />
      <AdminModal
        show={adminOpen}
        t={t}
        voiceMode={voiceMode}
        onClose={() => setAdminOpen(false)}
        onSetVoiceMode={setVoiceMode}
        onToast={toast}
      />

      {/* Toast */}
      <Toast message={toastMsg} show={toastShow} />
    </div>
  );
}
