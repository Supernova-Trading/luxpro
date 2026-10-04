"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Translation } from "@/lib/translations";
import type { Topic, Riddle, QuizItem } from "@/lib/content";
import type { LangContent } from "@/lib/content-by-lang";
import GamesGallery from "./games/GamesGallery";
import ActionBtn from "./ActionBtn";
import { Icon, type IconName } from "./Icon";

const panelVariants = {
  hidden: { opacity: 0, height: 0, overflow: "hidden" },
  visible: { opacity: 1, height: "auto", overflow: "visible" },
};

// Glass panel style — consistent with Entertainment (matches the deployed look)
const glassPanelStyle: React.CSSProperties = {
  background: "var(--card-bg)",
  backdropFilter: "blur(32px)",
  WebkitBackdropFilter: "blur(32px)",
  border: "1px solid var(--card-border)",
  boxShadow: "var(--lp-shadow-glass)",
};

type Mode = "games" | "chat" | "trivia" | null;
type GameType = "quiz" | "riddles";
type QuizLevel = "easy" | "medium" | "hard" | null;

// True per-click random pick, excluding the immediately-previous item so the
// same topic/riddle/question can't repeat back-to-back. Replaces the old
// shuffle-once-then-walk-through-the-array approach, which felt repetitive
// on a tablet that stays open for a whole shift without reloading.
export function pickRandom<T>(pool: T[], exclude: T | null): T {
  if (pool.length <= 1) return pool[0];
  let choice: T;
  do {
    choice = pool[Math.floor(Math.random() * pool.length)];
  } while (choice === exclude);
  return choice;
}

interface Props {
  t: Translation;
  onSpeak: (text: string) => void;
  content: LangContent;
}

// Three mutually-exclusive triggers — CLASSIC GAMES (gallery of mini-games),
// OPEN TO CHAT (inline topics panel), TRIVIA (inline panel with a Quiz/Riddles
// toggle inside). Panels expand inline, matching the deployed Open-to-Chat
// behaviour (not overlay sheets).
export default function MiddleSplit({ t, onSpeak, content }: Props) {
  const { topics, riddles, quizEasy, quizMedium, quizHard } = content;

  const [mode, setMode] = useState<Mode>(null);
  const [gameType, setGameType] = useState<GameType>("quiz");

  // Topics
  const [curTopic, setCurTopic] = useState<Topic | null>(null);

  // Riddles
  const [curRiddle, setCurRiddle] = useState<Riddle | null>(null);
  const [showRA, setShowRA] = useState(false);

  // Quiz
  const [quizLevel, setQuizLevel] = useState<QuizLevel>(null);
  const [curQ, setCurQ] = useState<QuizItem | null>(null);
  const [showAns, setShowAns] = useState(false);

  function quizPool(level: QuizLevel): QuizItem[] {
    return level === "easy" ? quizEasy : level === "medium" ? quizMedium : level === "hard" ? quizHard : [];
  }

  // Reset when content language changes
  const prevTopics = useRef(topics);
  useEffect(() => {
    if (prevTopics.current === topics) return;
    prevTopics.current = topics;
    setCurTopic(null);
    setCurRiddle(null); setShowRA(false);
    setQuizLevel(null); setCurQ(null); setShowAns(false);
  }, [topics, riddles]);

  function tapCard(target: Exclude<Mode, null>) {
    if (mode === target) {
      setMode(null);
      // The reveal state must not leak into the next time this panel opens —
      // otherwise the answer shows immediately on reopen even though the
      // passenger hasn't tapped "Show Answer" again.
      if (target === "trivia") { setShowAns(false); setShowRA(false); }
      return;
    }
    setMode(target);
    if (target === "games") onSpeak("Amish, the passenger would like to play a game.");
    if (target === "chat")  onSpeak("Amish, the passenger is open to chat.");
    if (target === "trivia") onSpeak("Amish, the passenger would like some trivia.");
  }

  // Topics
  function nextTopic() { setCurTopic((prev) => pickRandom(topics, prev)); }
  function redoTopic() { if (curTopic) onSpeak("Repeating topic."); else nextTopic(); }

  // Riddles
  function nextRiddle() { setCurRiddle((prev) => pickRandom(riddles, prev)); setShowRA(false); }

  // Quiz
  function setLevel(l: QuizLevel) {
    setQuizLevel(l); setCurQ(pickRandom(quizPool(l), null)); setShowAns(false);
  }
  function nextQ() {
    if (!quizLevel) { onSpeak("Please choose a difficulty level."); return; }
    setCurQ((prev) => pickRandom(quizPool(quizLevel), prev)); setShowAns(false);
  }

  function playWithDriver(type: "topic" | "quiz" | "riddle") {
    const msgs: Record<string, string> = {
      topic:  "Amish, the passenger would like to play topics with you!",
      quiz:   "Amish, the passenger would like to play quiz with you!",
      riddle: "Amish, the passenger would like to play riddles with you!",
    };
    onSpeak(msgs[type]);
  }

  const levelStyles: Record<string, { bg: string; border: string }> = {
    easy:   { bg: "rgba(74,222,128,0.14)",  border: "rgba(74,222,128,0.55)" },
    medium: { bg: "rgba(200,168,75,0.14)",  border: "rgba(200,168,75,0.55)" },
    hard:   { bg: "rgba(248,113,113,0.14)", border: "rgba(248,113,113,0.55)" },
  };

  const cards: { id: Exclude<Mode, null>; icon: IconName; color: string; label: string; sub: string }[] = [
    { id: "games",  icon: "gamepad",   color: "var(--icon-violet)", label: t.games,    sub: t.gamesSub },
    { id: "chat",   icon: "comment",   color: "var(--icon-cyan)", label: t.openChat, sub: t.chatSub  },
    { id: "trivia", icon: "lightbulb", color: "var(--icon-yellow)", label: t.playGame, sub: t.gameSub  },
  ];

  return (
    <div>
      {/* Three triggers — flat surface, no backdrop-filter: decorative cost
          without elevation payoff on 3 simultaneous small tiles (impeccable/
          DESIGN.md:287). The panel below keeps blur — it's a real overlay. */}
      <div className="grid grid-cols-3 gap-3.5 mb-3.5">
        {cards.map(({ id, icon, color, label, sub }) => {
          const active = mode === id;
          return (
            <motion.div
              key={id}
              whileTap={{ scale: 0.97, transition: { duration: 0.08 } }}
              onClick={() => tapCard(id)}
              className="cursor-pointer rounded-[18px] flex flex-col items-center gap-2.5 py-5 px-3 text-center"
              style={{
                background: active ? "var(--active-bg)" : "var(--lp-surface)",
                border: active ? "1px solid var(--active-border)" : "1px solid var(--lp-border)",
                boxShadow: active ? "inset 0 0 0 1.5px var(--active-ring)" : "var(--tile-shadow)",
                transition: "border-color 200ms ease, background 200ms ease, box-shadow 200ms ease",
              }}
            >
              <Icon name={icon} size={32} style={{ color: active ? "var(--active-text)" : color }} />
              <div
                className="text-[15px] tracking-[2px] font-extrabold uppercase"
                style={{ color: active ? "var(--active-text)" : "var(--text-primary)" }}
              >
                {label}
              </div>
              <div
                className="text-[11px] tracking-[0.5px] font-medium"
                style={{ color: active ? "var(--text-secondary)" : "var(--text-muted)" }}
              >
                {sub}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Classic Games — gallery of mini-games */}
      <AnimatePresence>
        {mode === "games" && (
          <motion.div
            key="games"
            initial="hidden" animate="visible" exit="hidden"
            variants={panelVariants}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="rounded-[18px] overflow-hidden"
            style={glassPanelStyle}
          >
            <GamesGallery t={t} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Open to Chat — inline topics panel */}
      <AnimatePresence>
        {mode === "chat" && (
          <motion.div
            key="chat"
            initial="hidden" animate="visible" exit="hidden"
            variants={panelVariants}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="rounded-[18px] overflow-hidden"
            style={glassPanelStyle}
          >
            <div className="p-4">
              <div
                className="rounded-2xl p-6 text-center min-h-[130px] flex flex-col items-center justify-center mb-3.5"
                style={{ background: "var(--lp-surface)", border: "1px solid var(--lp-border)" }}
              >
                {curTopic ? (
                  <div className="text-[38px] mb-2 leading-none">{curTopic.i}</div>
                ) : (
                  <Icon name="dice" size={38} style={{ color: "var(--text-muted)", marginBottom: 8 }} />
                )}
                <div className="text-[18px] font-semibold text-primary leading-relaxed">
                  {curTopic?.t ?? t.tapNext}
                </div>
                {curTopic && (
                  <div className="text-[10px] tracking-[2px] uppercase mt-2 font-semibold" style={{ color: "rgba(200,168,75,0.65)" }}>
                    {curTopic.c}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2">
                <ActionBtn onClick={nextTopic}>▶ {t.nextTopic}</ActionBtn>
                <ActionBtn onClick={redoTopic}>↻ {t.redo}</ActionBtn>
                <ActionBtn accent onClick={() => playWithDriver("topic")}><Icon name="gamepad" size={14} /> {t.playDriver}</ActionBtn>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trivia — inline panel with Quiz/Riddles toggle inside */}
      <AnimatePresence>
        {mode === "trivia" && (
          <motion.div
            key="trivia"
            initial="hidden" animate="visible" exit="hidden"
            variants={panelVariants}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="rounded-[18px] overflow-hidden"
            style={glassPanelStyle}
          >
            {/* Quiz / Riddles toggle */}
            <div className="flex" style={{ borderBottom: "1px solid var(--lp-border)", background: "var(--lp-surface)" }}>
              {(["quiz", "riddles"] as GameType[]).map((g) => {
                const on = gameType === g;
                return (
                  <button
                    key={g}
                    onClick={() => setGameType(g)}
                    className="flex-1 py-3.5 px-2 text-center text-[12px] tracking-[1.5px] font-bold uppercase transition-all"
                    style={{
                      color: on ? "var(--active-accent)" : "var(--text-muted)",
                      borderBottom: on ? "2px solid var(--active-accent)" : "2px solid transparent",
                    }}
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <Icon name={g === "quiz" ? "lightbulb" : "help-circle"} size={15} />
                      {g === "quiz" ? t.quizTab : t.riddlesTab}
                    </span>
                  </button>
                );
              })}
            </div>

            {gameType === "quiz" ? (
              <div className="p-4">
                <div className="grid grid-cols-3 gap-2.5 mb-3.5">
                  {(["easy", "medium", "hard"] as const).map((l) => (
                    <button
                      key={l}
                      onClick={() => setLevel(l)}
                      className="py-3 px-1.5 rounded-xl text-[12px] tracking-[1.5px] uppercase font-bold transition-all flex items-center justify-center gap-1.5"
                      style={{
                        background: quizLevel === l ? levelStyles[l].bg : "var(--lp-surface-mid)",
                        border: quizLevel === l ? `1px solid ${levelStyles[l].border}` : "1px solid var(--lp-border)",
                        color: "var(--text-primary)",
                      }}
                    >
                      <Icon name={l === "easy" ? "smile" : l === "medium" ? "lightbulb" : "flame"} size={14} style={{ color: levelStyles[l].border }} />
                      {t[l]}
                    </button>
                  ))}
                </div>
                <div
                  className="rounded-2xl px-5 py-5 text-center mb-3.5"
                  style={{ background: "var(--lp-surface)", border: "1px solid var(--lp-border)" }}
                >
                  <div className="text-[11px] tracking-[2.5px] uppercase mb-2 font-semibold" style={{ color: "var(--text-muted)" }}>
                    {curQ ? `${quizLevel?.charAt(0).toUpperCase()}${quizLevel?.slice(1)}` : t.chooseLevel}
                  </div>
                  <div className="text-[18px] font-semibold text-primary leading-relaxed">
                    {curQ?.q ?? t.selectEasyMedHard}
                  </div>
                </div>
                <AnimatePresence>
                  {showAns && curQ && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                      className="rounded-2xl px-4 py-4 mb-3.5"
                      style={{ background: "rgba(200,168,75,0.14)", border: "1px solid var(--lp-border-gold)" }}
                    >
                      <div className="text-[10px] tracking-[2.5px] uppercase mb-1.5 font-bold" style={{ color: "var(--lp-gold-text)" }}>{t.answer}</div>
                      <div className="text-[16px] font-semibold leading-relaxed text-primary">{curQ.a}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="grid grid-cols-3 gap-2">
                  <ActionBtn onClick={nextQ}>▶ {t.nextQuestion}</ActionBtn>
                  <ActionBtn accent onClick={() => setShowAns(true)}><Icon name="check" size={14} /> {t.showAnswer}</ActionBtn>
                  <ActionBtn onClick={() => playWithDriver("quiz")}><Icon name="gamepad" size={14} /> {t.playDriver}</ActionBtn>
                </div>
              </div>
            ) : (
              <div className="p-4">
                <div
                  className="rounded-2xl px-5 py-5 text-center min-h-[130px] flex flex-col items-center justify-center mb-3.5"
                  style={{ background: "var(--lp-surface)", border: "1px solid var(--lp-border)" }}
                >
                  {curRiddle ? (
                    <div className="text-[38px] mb-2 leading-none">{curRiddle.i}</div>
                  ) : (
                    <Icon name="help-circle" size={38} style={{ color: "var(--text-muted)", marginBottom: 8 }} />
                  )}
                  <div className="text-[18px] font-semibold text-primary leading-relaxed">
                    {curRiddle?.q ?? t.tapNextRiddle}
                  </div>
                </div>
                <AnimatePresence>
                  {showRA && curRiddle && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                      className="rounded-2xl px-4 py-4 mb-3.5"
                      style={{ background: "rgba(200,168,75,0.14)", border: "1px solid var(--lp-border-gold)" }}
                    >
                      <div className="text-[10px] tracking-[2.5px] uppercase mb-1.5 font-bold" style={{ color: "var(--lp-gold-text)" }}>{t.answer}</div>
                      <div className="text-[16px] font-semibold leading-relaxed text-primary">{curRiddle.a}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="grid grid-cols-3 gap-2">
                  <ActionBtn onClick={nextRiddle}>▶ {t.nextRiddle}</ActionBtn>
                  <ActionBtn accent onClick={() => setShowRA(true)}><Icon name="check" size={14} /> {t.showAnswer}</ActionBtn>
                  <ActionBtn onClick={() => playWithDriver("riddle")}><Icon name="gamepad" size={14} /> {t.playDriver}</ActionBtn>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
