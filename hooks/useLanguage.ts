"use client";

import { useState, useCallback } from "react";
import { T, LANG_LABELS, type Lang, type Translation } from "@/lib/translations";
import { RADIOS_BY_LANG, type RadioStation } from "@/lib/radios";
import { getContent, type LangContent } from "@/lib/content-by-lang";

export function useLanguage() {
  const [lang, setLangState] = useState<Lang>("en");

  const t: Translation = T[lang];
  const radios: RadioStation[] = RADIOS_BY_LANG[lang] ?? RADIOS_BY_LANG.en;
  const content: LangContent = getContent(lang);
  const isRTL = lang === "ar";

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
  }, []);

  return { lang, setLang, t, radios, content, isRTL, langLabel: LANG_LABELS[lang] };
}
