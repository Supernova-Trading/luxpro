"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Translation } from "@/lib/translations";
import type { Topic, Riddle, QuizItem } from "@/lib/content";
import type { LangContent } from "@/lib/content-by-lang";

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

type Mode = "quiet" | "chat" | "game" | null;
type GameType = "quiz" | "riddles";
type QuizLevel = "easy" | "medium" | "hard" | null;

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

interface Props {
  t: Translation;
  onSpeak: (text: string) => void;
  content: LangContent;
}

// Three mutually-exclusive triggers — QUIET (instant signal, no panel), OPEN TO
// CHAT (inline topics panel), PLAY A GAME (inline panel with a Quiz/Riddles
// toggle inside). Panels expand inline, matching the deployed Open-to-Chat
// behaviour (not overlay sheets).
export default function MiddleSplit({ t, onSpeak, content }: Props) {
  const { topics, riddles, quizEasy, quizMedium, quizHard } = content;

  const [mode, setMode] = useState<Mode>(null);
  const [gameType, setGameType] = useState<GameType>("quiz");

  // Topics
  const [tPool, setTPool] = useState<Topic[]>(() => shuffle(topics));
  const [tIdx, setTIdx] = useState(-1);

  // Riddles
  const [rPool, setRPool] = useState<Riddle[]>(() => shuffle(riddles));
  const [rIdx, setRIdx] = useState(-1);
  const [showRA, setShowRA] = useState(false);

  // Quiz
  const [quizLevel, setQuizLevel] = useState<QuizLevel>(null);
  const [qPool, setQPool] = useState<QuizItem[]>([]);
  const [qIdx, setQIdx] = useState(-1);
  const [showAns, setShowAns] = useState(false);

  // Reset pools when content language changes
  const prevTopics = useRef(topics);
  useEffect(() => {
    if (prevTopics.current === topics) return;
    prevTopics.current = topics;
    setTPool(shuffle(topics)); setTIdx(-1);
    setRPool(shuffle(riddles)); setRIdx(-1); setShowRA(false);
    setQuizLevel(null); setQPool([]); setQIdx(-1); setShowAns(false);
  }, [topics, riddles]);

  function tapCard(target: Exclude<Mode, null>) {
    if (mode === target) { setMode(null); return; }
    setMode(target);
    if (target === "quiet") onSpeak("Amish, the passenger would prefer a quiet ride please.");
    if (target === "chat")  onSpeak("Amish, the passenger is open to chat.");
    if (target === "game")  onSpeak("Amish, the passenger would like to play a game.");
  }

  // Topics
  function nextTopic() {
    let pool = tPool, idx = tIdx + 1;
    if (idx >= pool.length) { pool = shuffle(topics); setTPool(pool); idx = 0; }
    setTIdx(idx);
  }
  function redoTopic() { if (tIdx >= 0) onSpeak("Repeating topic."); else nextTopic(); }
  const curTopic = tIdx >= 0 ? tPool[tIdx] : null;

  // Riddles
  function nextRiddle() {
    let pool = rPool, idx = rIdx + 1;
    if (idx >= pool.length) { pool = shuffle(riddles); setRPool(pool); idx = 0; }
    setRIdx(idx); setShowRA(false);
  }
  const curRiddle = rIdx >= 0 ? rPool[rIdx] : null;

  // Quiz
  function setLevel(l: QuizLevel) {
    const data = l === "easy" ? quizEasy : l === "medium" ? quizMedium : quizHard;
    setQuizLevel(l); setQPool(shuffle(data)); setQIdx(0); setShowAns(false);
  }
  function nextQ() {
    if (!quizLevel) { onSpeak("Please choose a difficulty level."); return; }
    const idx = qIdx + 1 >= qPool.length ? 0 : qIdx + 1;
    if (idx === 0) setQPool(shuffle(qPool));
    setQIdx(idx); setShowAns(false);
  }
  const curQ = qIdx >= 0 && qPool.length > 0 ? qPool[qIdx] : null;

  function playWithDriver(type: "topic" | "quiz" | "riddle") {
    const msgs: Record<string, string> = {
      topic:  "Amish, the passenger would like to play topics with you!",
      quiz:   "Amish, the passenger would like to play quiz with you!",
      riddle: "Amish, the passenger would like to play riddles with you!",
    };
    onSpeak(msgs[type]);
  }

  const levelColors: Record<string, string> = {
    easy:   "linear-gradient(135deg,#065F46,#10B981)",
    medium: "linear-gradient(135deg,#92400E,#F59E0B)",
    hard:   "linear-gradient(135deg,#7F1D1D,#DC2626)",
  };

  const cards: { id: Exclude<Mode, null>; icon: string; label: string; sub: string }[] = [
    { id: "quiet", icon: "🤫", label: t.quiet,    sub: t.quietSub },
    { id: "chat",  icon: "💬", label: t.openChat, sub: t.chatSub  },
    { id: "game",  icon: "🎮", label: t.playGame, sub: t.gameSub  },
  ];

  return (
    <div>
      {/* Three triggers — glass cards (matches deployed Open-to-Chat treatment) */}
      <div className="grid grid-cols-3 gap-3.5 mb-3.5">
        {cards.map(({ id, icon, label, sub }) => {
          const active = mode === id;
          return (
            <motion.div
              key={id}
              whileTap={{ scale: 0.97, transition: { duration: 0.08 } }}
              onClick={() => tapCard(id)}
              className="cursor-pointer rounded-[18px] flex flex-col items-center gap-2.5 py-5 px-3 text-center"
              style={{
                background: active ? "rgba(200,168,75,0.10)" : "var(--lp-surface)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                border: active ? "1px solid rgba(200,168,75,0.55)" : "1px solid var(--lp-border)",
                boxShadow: active
                  ? "0 0 24px rgba(200,168,75,0.20), 0 8px 32px rgba(0,0,0,0.40)"
                  : "0 8px 32px rgba(0,0,0,0.40), inset 0 1px 0 rgba(255,255,255,0.06)",
                transition: "border-color 200ms ease, box-shadow 200ms ease, background 200ms ease",
              }}
            >
              <div className="text-[36px]">{icon}</div>
              <div
                className="text-[15px] tracking-[2px] font-extrabold uppercase"
                style={{ color: active ? "var(--lp-gold)" : "var(--text-primary)" }}
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
                <div className="text-[38px] mb-2">{curTopic?.i ?? "🎲"}</div>
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
                <ActionBtn color="dark"   onClick={nextTopic}>▶ {t.nextTopic}</ActionBtn>
                <ActionBtn color="orange" onClick={redoTopic}>↻ {t.redo}</ActionBtn>
                <ActionBtn color="green"  onClick={() => playWithDriver("topic")}>🎮 {t.playDriver}</ActionBtn>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Play a Game — inline panel with Quiz/Riddles toggle inside */}
      <AnimatePresence>
        {mode === "game" && (
          <motion.div
            key="game"
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
                      color: on ? "var(--lp-gold)" : "var(--text-muted)",
                      borderBottom: on ? "2px solid var(--lp-gold)" : "2px solid transparent",
                    }}
                  >
                    {g === "quiz" ? `🧠 ${t.quizTab}` : `❓ ${t.riddlesTab}`}
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
                      className="py-3 px-1.5 rounded-xl text-[12px] tracking-[1.5px] uppercase font-bold transition-all"
                      style={{
                        background: quizLevel === l ? levelColors[l] : "var(--lp-surface-mid)",
                        border: quizLevel === l
                          ? `1px solid ${l === "easy" ? "#34D399" : l === "medium" ? "#FBBF24" : "#F87171"}`
                          : "1px solid var(--lp-border)",
                        color: quizLevel === l ? "#fff" : "var(--text-secondary)",
                      }}
                    >
                      {l === "easy" ? "😄" : l === "medium" ? "🧠" : "🔥"} {t[l]}
                    </button>
                  ))}
                </div>
                <div
                  className="rounded-2xl px-5 py-5 text-center mb-3.5"
                  style={{ background: "var(--lp-surface)", border: "1px solid var(--lp-border)" }}
                >
                  <div className="text-[11px] tracking-[2.5px] uppercase mb-2 font-semibold" style={{ color: "var(--text-muted)" }}>
                    {curQ ? `Question ${qIdx + 1} — ${quizLevel?.charAt(0).toUpperCase()}${quizLevel?.slice(1)}` : t.chooseLevel}
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
                      style={{ background: "linear-gradient(135deg,#065F46,#10B981)", border: "1px solid #34D399" }}
                    >
                      <div className="text-[10px] tracking-[2.5px] text-[#A7F3D0] uppercase mb-1.5 font-bold">{t.answer}</div>
                      <div className="text-[16px] font-semibold text-white leading-relaxed">{curQ.a}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="grid grid-cols-3 gap-2">
                  <ActionBtn color="dark"   onClick={nextQ}>▶ {t.nextQuestion}</ActionBtn>
                  <ActionBtn color="green"  onClick={() => setShowAns(true)}>✓ {t.showAnswer}</ActionBtn>
                  <ActionBtn color="orange" onClick={() => playWithDriver("quiz")}>🎮 {t.playDriver}</ActionBtn>
                </div>
              </div>
            ) : (
              <div className="p-4">
                <div
                  className="rounded-2xl px-5 py-5 text-center min-h-[130px] flex flex-col items-center justify-center mb-3.5"
                  style={{ background: "var(--lp-surface)", border: "1px solid var(--lp-border)" }}
                >
                  <div className="text-[38px] mb-2">{curRiddle?.i ?? "🧩"}</div>
                  {curRiddle && (
                    <div className="text-[11px] tracking-[2.5px] uppercase mb-2 font-semibold" style={{ color: "var(--text-muted)" }}>
                      Riddle {rIdx + 1}
                    </div>
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
                      style={{ background: "linear-gradient(135deg,#065F46,#10B981)", border: "1px solid #34D399" }}
                    >
                      <div className="text-[10px] tracking-[2.5px] text-[#A7F3D0] uppercase mb-1.5 font-bold">{t.answer}</div>
                      <div className="text-[16px] font-semibold text-white leading-relaxed">{curRiddle.a}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="grid grid-cols-3 gap-2">
                  <ActionBtn color="dark"   onClick={nextRiddle}>▶ {t.nextRiddle}</ActionBtn>
                  <ActionBtn color="green"  onClick={() => setShowRA(true)}>✓ {t.showAnswer}</ActionBtn>
                  <ActionBtn color="orange" onClick={() => playWithDriver("riddle")}>🎮 {t.playDriver}</ActionBtn>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

type BtnColor = "dark" | "green" | "orange";
function ActionBtn({ color, onClick, children }: { color: BtnColor; onClick: () => void; children: React.ReactNode }) {
  const bg: Record<BtnColor, string> = {
    dark:   "var(--lp-surface-mid)",
    green:  "linear-gradient(135deg,#059669,#10B981)",
    orange: "linear-gradient(135deg,#F97316,#FB923C)",
  };
  const border: Record<BtnColor, string> = { dark: "var(--lp-border)", green: "transparent", orange: "transparent" };
  return (
    <motion.button
      whileTap={{ scale: 0.95, transition: { duration: 0.08 } }}
      onClick={onClick}
      className="py-3.5 px-2 rounded-xl text-[11px] tracking-[1.5px] uppercase font-bold cursor-pointer"
      style={{
        background: bg[color],
        border: `1px solid ${border[color]}`,
        color: color === "dark" ? "var(--text-primary)" : "#fff",
        transition: "opacity 150ms ease",
      }}
    >
      {children}
    </motion.button>
  );
}
