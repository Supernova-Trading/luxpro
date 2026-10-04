"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "../Icon";
import type { VoiceMode } from "@/hooks/useVoice";
import type { PreviewStrings } from "@/lib/preview-strings";

interface Props {
  open: boolean;
  s: PreviewStrings;
  voiceMode: VoiceMode;
  isFullscreen: boolean;
  onClose: () => void;
  onContact: () => void;
  onToggleFS: () => void;
  onSetVoiceMode: (m: VoiceMode) => void;
}

const tap = { scale: 0.98, transition: { duration: 0.08 } };

// Anchored under the gear in the 56px top bar. Surface-card tone, hairline
// edge, square corners — no glass, no shadow (bugatti DESIGN.md:319, :322).
export default function SettingsPanel({
  open, s, voiceMode, isFullscreen, onClose, onContact, onToggleFS, onSetVoiceMode,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDown(e: PointerEvent) {
      const target = e.target as HTMLElement;
      if (ref.current?.contains(target) || target.closest("[data-settings-toggle]")) return;
      onClose();
    }
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0 } }}
          transition={{ duration: 0.15 }}
          className="absolute z-50 px-6 py-2"
          style={{
            top: 56,
            insetInlineEnd: 16,
            width: 360,
            background: "var(--bx-raised)",
            border: "1px solid var(--bx-hairline)",
          }}
        >
          <motion.button whileTap={tap} className="bx-row" onClick={() => { onClose(); onContact(); }}>
            <span className="bx-row-title is-sm">{s.contactAmish}</span>
            <Icon name="chevron-right" size={18} className="bx-chevron" />
          </motion.button>
          <motion.button whileTap={tap} className="bx-row" onClick={() => { onClose(); onToggleFS(); }}>
            <span className="bx-row-title is-sm">
              {isFullscreen ? s.exitFullScreen : s.fullScreen}
            </span>
          </motion.button>
          <div className="py-4">
            <div className="bx-caption mb-3">{s.voiceOutput}</div>
            <div className="flex gap-2">
              <motion.button whileTap={tap} className="bx-pill" aria-pressed={voiceMode === "driver"} onClick={() => onSetVoiceMode("driver")}>
                {s.voiceDriver}
              </motion.button>
              <motion.button whileTap={tap} className="bx-pill" aria-pressed={voiceMode === "passenger"} onClick={() => onSetVoiceMode("passenger")}>
                {s.voicePassenger}
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
