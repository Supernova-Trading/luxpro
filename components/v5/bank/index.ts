import type { Lang } from "@/lib/translations";
import type { Bank } from "./types";

// Each language's questions load as their own chunk, only when Quiz or
// Riddles opens, so the home screen stays light on the old tablet.
export function loadBank(lang: Lang): Promise<Bank> {
  switch (lang) {
    case "es": return import("./es").then((m) => m.BANK);
    case "ur": return import("./ur").then((m) => m.BANK);
    default: return import("./en").then((m) => m.BANK);
  }
}

export type { Bank, Mcq } from "./types";
