"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { Translation } from "@/lib/translations";
import type { VoiceMode } from "@/hooks/useVoice";

// ─── Shared glass overlay backdrop ──────────────────────────────────────────
function Overlay({ show, id, onClose, children }: {
  show: boolean;
  id: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key={id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.20 }}
          className="fixed inset-0 z-[600] flex items-center justify-center"
          style={{ background: "rgba(8,12,17,0.90)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 12 }}
            animate={{ scale: 1,    opacity: 1, y: 0  }}
            exit={{    scale: 0.96, opacity: 0, y: 6  }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="rounded-[28px] p-7 text-center min-w-[300px] max-w-[390px] w-full mx-4 relative overflow-hidden"
            style={{
              background: "var(--overlay-bg)",
              backdropFilter: "blur(40px)",
              WebkitBackdropFilter: "blur(40px)",
              border: "1px solid rgba(200,168,75,0.30)",
              boxShadow: "0 32px 80px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.07)",
            }}
          >
            {/* Gold top shimmer line */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                top: 0, left: "20%", right: "20%",
                height: "1px",
                background: "linear-gradient(90deg, transparent, rgba(200,168,75,0.55), transparent)",
              }}
            />
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ModalClose({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="rounded-xl py-2.5 px-7 text-[11px] tracking-[2px] uppercase font-bold mt-1 transition-colors"
      style={{
        background: "var(--lp-surface-mid)",
        border: "1px solid var(--lp-border)",
        color: "var(--text-primary)",
      }}
    >
      {label}
    </motion.button>
  );
}

// ─── Bluetooth modal ─────────────────────────────────────────────────────────
interface BTProps { show: boolean; t: Translation; onClose: () => void; }
export function BluetoothModal({ show, t, onClose }: BTProps) {
  return (
    <Overlay show={show} id="bt" onClose={onClose}>
      <div className="text-[42px] mb-3">📱</div>
      <div className="text-[10px] tracking-[3px] uppercase mb-1.5 font-semibold" style={{ color: "var(--text-muted)" }}>
        {t.btConnect}
      </div>
      <div className="rounded-xl p-3.5 mb-3.5 text-left" style={{ background: "rgba(200,168,75,0.10)", border: "2px solid rgba(200,168,75,0.50)" }}>
        <div className="text-[9px] tracking-[2.5px] uppercase mb-1 font-semibold" style={{ color: "var(--text-muted)" }}>{t.btDeviceName}</div>
        <div className="font-cormorant text-[22px] font-bold tracking-[2px]" style={{ color: "var(--lp-gold)", textShadow: "0 0 16px rgba(200,168,75,0.35)" }}>
          My Volvo Car
        </div>
      </div>
      <div className="rounded-xl p-4 mb-3.5 text-left" style={{ background: "var(--lp-surface)", border: "1px solid var(--lp-border)" }}>
        <ol className="list-decimal pl-5 space-y-1">
          {[t.btStep1, t.btStep2, t.btStep3, t.btStep4, t.btStep5].map((step, i) => (
            <li key={i} className="text-[14px] leading-relaxed font-medium" style={{ color: "var(--text-primary)" }} dangerouslySetInnerHTML={{ __html: step }} />
          ))}
        </ol>
      </div>
      <ModalClose label={t.close} onClick={onClose} />
    </Overlay>
  );
}

// ─── Phone modal ──────────────────────────────────────────────────────────────
interface PhoneProps { show: boolean; t: Translation; onClose: () => void; }
export function PhoneModal({ show, t, onClose }: PhoneProps) {
  return (
    <Overlay show={show} id="phone" onClose={onClose}>
      <div className="text-[42px] mb-3">📞</div>
      <div className="text-[10px] tracking-[3px] uppercase mb-1.5 font-semibold" style={{ color: "var(--text-muted)" }}>{t.contactDriver}</div>
      <div className="font-cormorant text-[28px] font-bold text-primary tracking-[3px] mb-2" style={{ textShadow: "0 0 20px rgba(255,255,255,0.15)" }}>Amish</div>
      <a href="tel:07438537561" className="block text-[22px] font-bold tracking-[2px] mb-4 no-underline" style={{ color: "var(--lp-gold)", textShadow: "0 0 16px rgba(200,168,75,0.40)" }}>
        07438 537 561
      </a>
      <ModalClose label={t.close} onClick={onClose} />
    </Overlay>
  );
}

// ─── Reply modal ──────────────────────────────────────────────────────────────
interface ReplyProps { show: boolean; t: Translation; onClose: () => void; onSpeak: (text: string) => void; }
export function ReplyModal({ show, t, onClose, onSpeak }: ReplyProps) {
  const messages = [
    { icon: "🛑", text: "Can we stop briefly?" },
    { icon: "🌡️", text: "Could you adjust the temperature?" },
    { icon: "🔇", text: "I need silence please" },
    { icon: "⭐", text: "Thank you for great service!" },
  ];

  function sendMsg(msg: string) {
    onSpeak(`Amish, the passenger says: ${msg}`);
    onClose();
  }

  return (
    <Overlay show={show} id="reply" onClose={onClose}>
      <div className="text-[42px] mb-3">💬</div>
      <div className="text-[10px] tracking-[3px] uppercase mb-1.5 font-semibold" style={{ color: "var(--text-muted)" }}>{t.replyDriver}</div>
      <div className="font-cormorant text-[28px] font-bold text-primary tracking-[3px] mb-3.5" style={{ textShadow: "0 0 20px rgba(255,255,255,0.15)" }}>Amish</div>
      <div className="flex flex-col gap-2.5 mb-3.5">
        {messages.map(({ icon, text }) => (
          <motion.button
            key={text}
            whileTap={{ scale: 0.97 }}
            onClick={() => sendMsg(text)}
            className="rounded-xl py-3 px-4 text-[11px] font-bold transition-colors text-left"
            style={{ background: "var(--lp-surface)", border: "1px solid var(--lp-border)", color: "var(--text-primary)" }}
          >
            {icon} {text}
          </motion.button>
        ))}
      </div>
      <ModalClose label={t.close} onClick={onClose} />
    </Overlay>
  );
}

// ─── Admin modal ──────────────────────────────────────────────────────────────
interface AdminProps {
  show: boolean;
  t: Translation;
  voiceMode: VoiceMode;
  onClose: () => void;
  onSetVoiceMode: (m: VoiceMode) => void;
  onToast: (msg: string) => void;
}
export function AdminModal({ show, t, voiceMode, onClose, onSetVoiceMode, onToast }: AdminProps) {
  const actions = [
    { label: "➕ Add Playlist",    key: "add-playlist" },
    { label: "✏️ Edit Playlist",   key: "edit-playlist" },
    { label: "🗑️ Remove Playlist", key: "remove-playlist" },
    { label: "➕ Add Song",        key: "add-song" },
    { label: "✏️ Edit Song",       key: "edit-song" },
    { label: "🗑️ Remove Song",     key: "remove-song" },
  ];

  return (
    <Overlay show={show} id="admin" onClose={onClose}>
      <div className="text-[42px] mb-3">🔧</div>
      <div className="text-[10px] tracking-[3px] uppercase mb-1.5 font-semibold" style={{ color: "var(--text-muted)" }}>{t.adminPanel}</div>
      <div className="font-cormorant text-[20px] font-bold text-primary tracking-[2px] mb-3" style={{ textShadow: "0 0 20px rgba(255,255,255,0.10)" }}>
        LuxPro 4.1
      </div>

      <div className="grid grid-cols-2 gap-2.5 mb-4">
        {actions.map(({ label, key }) => (
          <motion.button
            key={key}
            whileTap={{ scale: 0.96 }}
            onClick={() => { onToast(`Admin: ${key}`); onClose(); }}
            className="rounded-xl py-2.5 px-2 text-[10px] font-bold"
            style={{ background: "var(--lp-surface)", border: "1px solid var(--lp-border)", color: "var(--text-primary)" }}
          >
            {label}
          </motion.button>
        ))}
      </div>

      <div className="mb-4 text-left">
        <div className="text-[9px] tracking-[2px] uppercase font-semibold mb-2" style={{ color: "var(--text-muted)" }}>Voice Output Language</div>
        <div className="flex gap-2">
          {(["driver", "passenger"] as VoiceMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => onSetVoiceMode(mode)}
              className="flex-1 py-2.5 rounded-xl text-[10px] tracking-[1px] uppercase font-bold transition-all"
              style={
                voiceMode === mode
                  ? { background: "var(--lp-gold)", color: "var(--text-on-accent)", boxShadow: "var(--glow-subtle)" }
                  : { background: "var(--lp-surface-mid)", color: "var(--text-secondary)", border: "1px solid var(--lp-border)" }
              }
            >
              {mode === "driver" ? "🎙 English (Driver)" : "🌐 Match Passenger"}
            </button>
          ))}
        </div>
        <p className="text-[9px] mt-1.5 leading-relaxed" style={{ color: "var(--text-muted)" }}>
          English keeps voice prompts in English so Amish always understands.<br />
          Match Passenger speaks in the passenger&apos;s selected UI language.
        </p>
      </div>

      <ModalClose label={t.close} onClick={onClose} />
    </Overlay>
  );
}

// ─── Tip QR modal (Bank Transfer) ──────────────────────────────────────────────
interface QRProps { show: boolean; t: Translation; onClose: () => void; }
export function TipQRModal({ show, t, onClose }: QRProps) {
  return (
    <Overlay show={show} id="tip-qr" onClose={onClose}>
      <div className="text-[10px] tracking-[3px] uppercase mb-3 font-semibold" style={{ color: "var(--text-muted)" }}>
        {t.scanToTip}
      </div>
      <div className="rounded-2xl p-4 mb-3.5 inline-block" style={{ background: "#ffffff", border: "1px solid var(--lp-border-gold)" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/qr-tip.png" alt={t.scanToTip} className="block" style={{ width: 200, height: 200 }} />
      </div>
      <div className="font-cormorant text-[20px] font-bold tracking-[2px] mb-1" style={{ color: "var(--lp-gold)", textShadow: "0 0 16px rgba(200,168,75,0.35)" }}>
        Amish
      </div>
      <p className="text-[12px] leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
        {t.qrCaption}
      </p>
      <ModalClose label={t.close} onClick={onClose} />
    </Overlay>
  );
}
