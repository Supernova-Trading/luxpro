"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "../Icon";
import type { Lang } from "@/lib/translations";
import type { LangContent } from "@/lib/content-by-lang";
import type { QuizLevel, V5Strings } from "./strings";
import type { Deck } from "./useDeck";

// Quiz and Riddles: one full screen, big targets for a moving car.
// Question → "Show answer" → "Next". Random order; nothing repeats until the
// whole list has been played, across rides too (useDeck).
// The answer stays hidden until asked for, so Amish can play along.
const LEVELS: QuizLevel[] = ["easy", "medium", "hard"];

export default function WordGame({ kind, s, lang, content, deck, level, onLevel, asked, onAsk, onClose }: {
  kind: "quiz" | "riddles";
  s: V5Strings;
  lang: Lang;
  content: LangContent;
  deck: Deck;
  level: QuizLevel;
  onLevel: (l: QuizLevel) => void;
  asked: boolean;
  onAsk: () => void;
  onClose: () => void;
}) {
  const pool = kind === "riddles"
    ? content.riddles
    : level === "easy" ? content.quizEasy : level === "medium" ? content.quizMedium : content.quizHard;
  const poolKey = kind === "riddles" ? `${lang}:riddles` : `${lang}:quiz:${level}`;

  const [idx, setIdx] = useState(-1);
  const [revealed, setRevealed] = useState(false);
  const [count, setCount] = useState(0);
  const lastNext = useRef(0);

  // New pool (first open, level or language change, or translated content
  // arriving): deal a fresh card from that pool.
  useEffect(() => {
    setIdx(deck.draw(poolKey, pool.length));
    setRevealed(false);
    setCount(1);
  }, [poolKey, pool, deck]);

  function next() {
    const now = Date.now();
    if (now - lastNext.current < 400) return; // bump guard
    lastNext.current = now;
    setIdx((cur) => deck.draw(poolKey, pool.length, cur));
    setRevealed(false);
    setCount((c) => c + 1);
  }

  const item = pool[idx] ?? pool[0];
  const caption = (kind === "quiz" ? s.questionN : s.riddleN).replace("{n}", String(count));

  return (
    <div className="v5-game" role="dialog" aria-label={s.games[kind]}>
      <div className="v5-game-bar">
        <button className="v5-pill" onClick={onClose}>
          <Icon name="chevron-left" size={18} className="v5-flip" />
          {s.home}
        </button>
        <span className="v5-heading">{s.games[kind]}</span>
        <span aria-hidden />
      </div>

      {kind === "quiz" && (
        <div className="v5-seg" role="radiogroup" aria-label={s.games.quiz}>
          {LEVELS.map((l) => (
            <button key={l} role="radio" aria-checked={level === l} aria-pressed={level === l} onClick={() => onLevel(l)}>
              {s.levels[l]}
            </button>
          ))}
        </div>
      )}

      <section className="v5-qcard" aria-live="polite">
        <span className="v5-caption" dir="auto">
          {caption}{kind === "quiz" ? ` · ${s.levels[level]}` : ""}
        </span>
        {!item ? (
          <p className="v5-label" style={{ fontWeight: 400, color: "var(--body)" }}>{s.questionsFailed}</p>
        ) : (
        <>
        <p className="v5-question">{item.q}</p>
        {revealed ? (
          <div className="v5-answer">
            <span className="v5-caption" style={{ color: "var(--gold)" }}>{s.answerLabel}</span>
            <span className="v5-answer-text">{item.a}</span>
          </div>
        ) : (
          <button className="v5-reveal" onClick={() => setRevealed(true)}>
            <Icon name="eye" size={22} />
            {s.showAnswer}
          </button>
        )}
        </>
        )}
      </section>

      <div className="v5-game-foot">
        <button className="v5-gtile v5-amish" aria-pressed={asked} onClick={onAsk}>
          <span className="v5-gtile-icon"><Icon name="comment" size={20} style={{ color: "var(--i-teal)" }} /></span>
          <span style={{ display: "grid", gap: 2, minWidth: 0 }}>
            <span className="v5-label">{s.playWithAmish}</span>
            <span className="v5-sub">{s.playWithAmishSub}</span>
          </span>
          {asked && <span className="v5-badge" aria-hidden style={{ top: 8, insetInlineEnd: 8 }}><Icon name="check" size={13} strokeWidth={2.4} /></span>}
        </button>
        <button className="v5-next" onClick={next}>
          {kind === "quiz" ? s.nextQuestion : s.nextRiddle}
          <Icon name="chevron-right" size={22} className="v5-flip" />
        </button>
      </div>
    </div>
  );
}
