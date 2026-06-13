"use client";

import { useState, useEffect, useCallback } from "react";
import { T, LANG_LABELS, type Lang, type Translation } from "@/lib/translations";
import { RADIOS_BY_LANG, type RadioStation } from "@/lib/radios";
import { EN_CONTENT, loadContent, type LangContent } from "@/lib/content-by-lang";

export function useLanguage() {
  const [lang, setLangState] = useState<Lang>("en");
  const [content, setContent] = useState<LangContent>(EN_CONTENT);

  // Non-EN content is code-split; load it when the language changes. The
  // cancelled flag drops stale results if the passenger switches again
  // before the previous chunk resolves.
  useEffect(() => {
    let cancelled = false;
    loadContent(lang).then((c) => {
      if (!cancelled) setContent(c);
    });
    return () => { cancelled = true; };
  }, [lang]);

  const t: Translation = T[lang];
  const radios: RadioStation[] = RADIOS_BY_LANG[lang] ?? RADIOS_BY_LANG.en;
  const isRTL = lang === "ar";

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
  }, []);

  return { lang, setLang, t, radios, content, isRTL, langLabel: LANG_LABELS[lang] };
}
