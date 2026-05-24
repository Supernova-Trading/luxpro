import { TOPICS, RIDDLES, QUIZ_EASY, QUIZ_MEDIUM, QUIZ_HARD } from "./content";
import { TOPICS_ES, RIDDLES_ES, QUIZ_ES } from "./content-es";
import { TOPICS_FR, RIDDLES_FR, QUIZ_FR } from "./content-fr";
import { TOPICS_AR, RIDDLES_AR, QUIZ_AR } from "./content-ar";
import { TOPICS_RU, RIDDLES_RU, QUIZ_EASY_RU, QUIZ_MEDIUM_RU, QUIZ_HARD_RU } from "./content-ru";
import { TOPICS_ZH, RIDDLES_ZH, QUIZ_EASY_ZH, QUIZ_MEDIUM_ZH, QUIZ_HARD_ZH } from "./content-zh";
import type { Topic, Riddle, QuizItem } from "./content";
import type { Lang } from "./translations";

export interface LangContent {
  topics:     Topic[];
  riddles:    Riddle[];
  quizEasy:   QuizItem[];
  quizMedium: QuizItem[];
  quizHard:   QuizItem[];
}

export function getContent(lang: Lang): LangContent {
  switch (lang) {
    case "es": return { topics: TOPICS_ES, riddles: RIDDLES_ES, quizEasy: QUIZ_ES.easy, quizMedium: QUIZ_ES.medium, quizHard: QUIZ_ES.hard };
    case "fr": return { topics: TOPICS_FR, riddles: RIDDLES_FR, quizEasy: QUIZ_FR.easy, quizMedium: QUIZ_FR.medium, quizHard: QUIZ_FR.hard };
    case "ar": return { topics: TOPICS_AR, riddles: RIDDLES_AR, quizEasy: QUIZ_AR.easy, quizMedium: QUIZ_AR.medium, quizHard: QUIZ_AR.hard };
    case "ru": return { topics: TOPICS_RU, riddles: RIDDLES_RU, quizEasy: QUIZ_EASY_RU, quizMedium: QUIZ_MEDIUM_RU, quizHard: QUIZ_HARD_RU };
    case "zh": return { topics: TOPICS_ZH, riddles: RIDDLES_ZH, quizEasy: QUIZ_EASY_ZH, quizMedium: QUIZ_MEDIUM_ZH, quizHard: QUIZ_HARD_ZH };
    default:   return { topics: TOPICS,    riddles: RIDDLES,    quizEasy: QUIZ_EASY,    quizMedium: QUIZ_MEDIUM,    quizHard: QUIZ_HARD    };
  }
}
