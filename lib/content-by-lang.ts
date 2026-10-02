import { TOPICS, RIDDLES, QUIZ_EASY, QUIZ_MEDIUM, QUIZ_HARD } from "./content";
import type { Topic, Riddle, QuizItem } from "./content";
import type { Lang } from "./translations";

export interface LangContent {
  topics:     Topic[];
  riddles:    Riddle[];
  quizEasy:   QuizItem[];
  quizMedium: QuizItem[];
  quizHard:   QuizItem[];
}

// English ships in the main bundle (default language, instant first paint).
export const EN_CONTENT: LangContent = {
  topics: TOPICS,
  riddles: RIDDLES,
  quizEasy: QUIZ_EASY,
  quizMedium: QUIZ_MEDIUM,
  quizHard: QUIZ_HARD,
};

// Non-English content is code-split: each language loads as its own chunk on
// first switch (~25-35 KB source each), keeping it out of First Load JS.
export async function loadContent(lang: Lang): Promise<LangContent> {
  switch (lang) {
    case "es": {
      const m = await import("./content-es");
      return { topics: m.TOPICS_ES, riddles: m.RIDDLES_ES, quizEasy: m.QUIZ_ES.easy, quizMedium: m.QUIZ_ES.medium, quizHard: m.QUIZ_ES.hard };
    }
    case "ur": {
      const m = await import("./content-ur");
      return { topics: m.TOPICS_UR, riddles: m.RIDDLES_UR, quizEasy: m.QUIZ_UR.easy, quizMedium: m.QUIZ_UR.medium, quizHard: m.QUIZ_UR.hard };
    }
    default:
      return EN_CONTENT;
  }
}
