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
    case "fr": {
      const m = await import("./content-fr");
      return { topics: m.TOPICS_FR, riddles: m.RIDDLES_FR, quizEasy: m.QUIZ_FR.easy, quizMedium: m.QUIZ_FR.medium, quizHard: m.QUIZ_FR.hard };
    }
    case "ar": {
      const m = await import("./content-ar");
      return { topics: m.TOPICS_AR, riddles: m.RIDDLES_AR, quizEasy: m.QUIZ_AR.easy, quizMedium: m.QUIZ_AR.medium, quizHard: m.QUIZ_AR.hard };
    }
    case "ru": {
      const m = await import("./content-ru");
      return { topics: m.TOPICS_RU, riddles: m.RIDDLES_RU, quizEasy: m.QUIZ_EASY_RU, quizMedium: m.QUIZ_MEDIUM_RU, quizHard: m.QUIZ_HARD_RU };
    }
    case "zh": {
      const m = await import("./content-zh");
      return { topics: m.TOPICS_ZH, riddles: m.RIDDLES_ZH, quizEasy: m.QUIZ_EASY_ZH, quizMedium: m.QUIZ_MEDIUM_ZH, quizHard: m.QUIZ_HARD_ZH };
    }
    default:
      return EN_CONTENT;
  }
}
