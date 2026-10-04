"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Icon } from "../Icon";
import GamesGallery from "../games/GamesGallery";
import { pickRandom } from "../MiddleSplit";
import type { Translation } from "@/lib/translations";
import type { LangContent } from "@/lib/content-by-lang";
import type { Topic, Riddle, QuizItem } from "@/lib/content";
import type { PreviewStrings } from "@/lib/preview-strings";

interface Props {
  s: PreviewStrings;
  t: Translation;
  content: LangContent;
  onSpeak: (text: string) => void;
  onClose: () => void;
}

type View = "games" | "trivia" | "chat" | null;
type Level = "easy" | "medium" | "hard";
const tap = { scale: 0.98, transition: { duration: 0.08 } };

export default function PassTheTime({ s, t, content, onSpeak, onClose }: Props) {
  const { topics, riddles, quizEasy, quizMedium, quizHard } = content;
  const [view, setView] = useState<View>(null);
  const [triviaMode, setTriviaMode] = useState<"quiz" | "riddles">("quiz");
  const [level, setLevel] = useState<Level | null>(null);
  const [question, setQuestion] = useState<QuizItem | null>(null);
  const [riddle, setRiddle] = useState<Riddle | null>(null);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    setLevel(null); setQuestion(null); setRiddle(null); setTopic(null); setRevealed(false);
  }, [content]);

  const pool = (l: Level) => (l === "easy" ? quizEasy : l === "medium" ? quizMedium : quizHard);

  function open(next: Exclude<View, null>) {
    setView(next);
    setRevealed(false);
    if (next === "games") onSpeak("Amish, the passenger would like to play a game.");
    if (next === "chat") onSpeak("Amish, the passenger is open to chat.");
    if (next === "trivia") onSpeak("Amish, the passenger would like some trivia.");
  }

  function chooseLevel(l: Level) { setLevel(l); setQuestion(pickRandom(pool(l), null)); setRevealed(false); }
  function nextQuestion() {
    if (!level) { onSpeak("Please choose a difficulty level."); return; }
    setQuestion((prev) => pickRandom(pool(level), prev)); setRevealed(false);
  }
  function nextRiddle() { setRiddle((prev) => pickRandom(riddles, prev)); setRevealed(false); }
  function nextTopic() { setTopic((prev) => pickRandom(topics, prev)); }
  function playWithAmish(kind: "topic" | "quiz" | "riddle") {
    const msgs = {
      topic: "Amish, the passenger would like to play topics with you!",
      quiz: "Amish, the passenger would like to play quiz with you!",
      riddle: "Amish, the passenger would like to play riddles with you!",
    };
    onSpeak(msgs[kind]);
  }

  const answer = triviaMode === "quiz" ? question?.a : riddle?.a;

  return (
    <div className="max-w-[1000px]">
      {/* Header — back / title / close */}
      <div className="flex items-center justify-between gap-6 mb-6">
        {view ? (
          <motion.button whileTap={tap} className="bx-pill" onClick={() => setView(null)}>
            {s.back}
          </motion.button>
        ) : (
          <div className="bx-caption">{s.passTheTime}</div>
        )}
        <motion.button whileTap={tap} className="bx-pill" onClick={onClose}>
          {s.close}
        </motion.button>
      </div>

      {view === null && (
        <div>
          {([
            { id: "games",  title: s.games,  sub: s.gamesSub },
            { id: "trivia", title: s.trivia, sub: s.triviaSub },
            { id: "chat",   title: s.chat,   sub: s.chatSub },
          ] as const).map(({ id, title, sub }) => (
            <motion.button key={id} whileTap={tap} className="bx-row" style={{ minHeight: 84 }} onClick={() => open(id)}>
              <span className="bx-row-title is-lg">{title}</span>
              <span className="bx-caption">{sub}</span>
              <Icon name="chevron-right" size={20} className="bx-chevron" />
            </motion.button>
          ))}
        </div>
      )}

      {view === "games" && <GamesGallery t={t} />}

      {view === "trivia" && (
        <div>
          <div className="flex flex-wrap gap-2">
            <motion.button whileTap={tap} className="bx-pill" aria-pressed={triviaMode === "quiz"} onClick={() => { setTriviaMode("quiz"); setRevealed(false); }}>
              {t.quizTab}
            </motion.button>
            <motion.button whileTap={tap} className="bx-pill" aria-pressed={triviaMode === "riddles"} onClick={() => { setTriviaMode("riddles"); setRevealed(false); }}>
              {t.riddlesTab}
            </motion.button>
            {triviaMode === "quiz" && (
              <>
                <span className="mx-2" style={{ width: 1, background: "var(--bx-hairline)" }} />
                {(["easy", "medium", "hard"] as const).map((l) => (
                  <motion.button key={l} whileTap={tap} className="bx-pill" aria-pressed={level === l} onClick={() => chooseLevel(l)}>
                    {t[l]}
                  </motion.button>
                ))}
              </>
            )}
          </div>

          <div className="mt-10" style={{ minHeight: 160 }}>
            <div className="bx-question">
              {triviaMode === "quiz"
                ? question?.q ?? t.selectEasyMedHard
                : riddle?.q ?? t.tapNextRiddle}
            </div>
            {revealed && answer && (
              <div className="mt-6">
                <div className="bx-caption" style={{ color: "var(--bx-gold)" }}>{t.answer}</div>
                <div className="bx-display mt-1" style={{ color: "var(--bx-body)" }}>{answer}</div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mt-10">
            <motion.button whileTap={tap} className="bx-pill" onClick={triviaMode === "quiz" ? nextQuestion : nextRiddle}>
              {triviaMode === "quiz" ? t.nextQuestion : t.nextRiddle}
            </motion.button>
            <motion.button whileTap={tap} className="bx-pill" disabled={!answer} onClick={() => setRevealed(true)}>
              {t.showAnswer}
            </motion.button>
            <motion.button whileTap={tap} className="bx-pill" onClick={() => playWithAmish(triviaMode === "quiz" ? "quiz" : "riddle")}>
              {t.playDriver}
            </motion.button>
          </div>
        </div>
      )}

      {view === "chat" && (
        <div>
          <div style={{ minHeight: 200 }}>
            {topic && <div className="bx-caption">{topic.c}</div>}
            <div className="bx-question mt-2">
              {topic?.t ?? t.tapNext}
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-10">
            <motion.button whileTap={tap} className="bx-pill" onClick={nextTopic}>
              {t.nextTopic}
            </motion.button>
            <motion.button whileTap={tap} className="bx-pill" onClick={() => playWithAmish("topic")}>
              {t.playDriver}
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
}
