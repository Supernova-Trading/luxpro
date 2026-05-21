"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { LANG_VOICE, type Lang } from "@/lib/translations";

export type VoiceMode = "driver" | "passenger";

export function useVoice(lang: Lang) {
  const [speaking, setSpeaking] = useState(false);
  const [voiceMode, setVoiceMode] = useState<VoiceMode>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("lp_voice_mode") as VoiceMode) ?? "driver";
    }
    return "driver";
  });

  // Persist voice mode preference
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("lp_voice_mode", voiceMode);
    }
  }, [voiceMode]);

  // Prime the voices list on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const synth = window.speechSynthesis;
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = () => synth.getVoices();
    }
    synth.getVoices();
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (typeof window === "undefined") return;
      const synth = window.speechSynthesis;
      synth.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.92;
      utterance.pitch = 1.0;
      utterance.volume = 1;

      // Voice language: driver mode always en-US so Amish understands;
      // passenger mode speaks in the selected UI language
      const targetLang = voiceMode === "driver" ? "en-US" : LANG_VOICE[lang];
      utterance.lang = targetLang;

      const voices = synth.getVoices();
      const preferred =
        voices.find((v) => v.name === "Samantha") ||
        voices.find((v) => v.lang === targetLang) ||
        voices.find((v) => v.lang.startsWith(targetLang.split("-")[0]));
      if (preferred) utterance.voice = preferred;

      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);

      synth.speak(utterance);
    },
    [lang, voiceMode]
  );

  const cancel = useCallback(() => {
    if (typeof window === "undefined") return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, []);

  return { speak, speaking, voiceMode, setVoiceMode, cancel };
}
