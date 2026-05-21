"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Translation } from "@/lib/translations";
import type { VoiceMode } from "@/hooks/useVoice";

interface Props {
  open: boolean;
  t: Translation;
  voiceMode: VoiceMode;
  onClose: () => void;
  onShowPhone: () => void;
  onShowReply: () => void;
  onShowAdmin: () => void;
  onToggleFS: () => void;
  onSetVoiceMode: (m: VoiceMode) => void;
  isFullscreen: boolean;
}

export default function SettingsMenu({
  open, t, voiceMode, onClose, onShowPhone, onShowReply, onShowAdmin, onToggleFS, onSetVoiceMode, isFullscreen,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onClose]);

  const items = [
    { icon: "📞", label: t.contactDriver, action: () => { onClose(); onShowPhone(); } },
    { icon: "💬", label: t.replyDriver,   action: () => { onClose(); onShowReply(); } },
    { icon: "🔧", label: t.adminPanel,    action: () => { onClose(); onShowAdmin(); } },
    { icon: isFullscreen ? "✕" : "⛶",  label: isFullscreen ? "Exit Fullscreen" : t.fullScreen, action: () => { onClose(); onToggleFS(); } },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, scale: 0.95, y: -6, transformOrigin: "top right" }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -4 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="absolute top-[120px] right-5 z-50 rounded-2xl p-2 min-w-[240px]"
          style={{
            background: "rgba(13,17,23,0.92)",
            backdropFilter: "blur(40px)",
            WebkitBackdropFilter: "blur(40px)",
            border: "1px solid rgba(200,168,75,0.30)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.60), 0 0 0 1px rgba(255,255,255,0.04)",
          }}
        >
          {/* Gold top accent line */}
          <div
            style={{
              position: "absolute",
              top: 0, left: "16px", right: "16px",
              height: "1px",
              background: "linear-gradient(90deg, transparent, rgba(200,168,75,0.50), transparent)",
              borderRadius: "1px",
            }}
          />

          {items.map(({ icon, label, action }) => (
            <motion.button
              key={label}
              whileTap={{ scale: 0.97 }}
              onClick={action}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-left rounded-xl transition-colors"
              style={{ color: "rgba(255,255,255,0.85)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.07)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
            >
              <span className="text-[20px]">{icon}</span>
              <span className="text-[13px] tracking-[1.5px] uppercase font-semibold">{label}</span>
            </motion.button>
          ))}

          {/* Voice mode toggle */}
          <div
            className="mx-2 my-1 pt-2"
            style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div
              className="px-2 pb-1.5 text-[9px] tracking-[2px] uppercase font-semibold"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              Voice Output
            </div>
            <div className="flex gap-1.5 px-2 pb-1">
              {(["driver", "passenger"] as VoiceMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => onSetVoiceMode(mode)}
                  className="flex-1 py-2 rounded-lg text-[10px] tracking-[1px] uppercase font-bold transition-all"
                  style={
                    voiceMode === mode
                      ? { background: "var(--lp-gold)", color: "#0D1117", boxShadow: "var(--glow-subtle)" }
                      : { background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.60)", border: "1px solid rgba(255,255,255,0.10)" }
                  }
                >
                  {mode === "driver" ? "🎙 Driver" : "🌐 Passenger"}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
