"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "../Icon";
import type { Lang } from "@/lib/translations";
import type { V5Strings } from "./strings";
import type { Deck } from "./useDeck";
import { loadBank, type Bank, type Mcq } from "./bank";
import { TIERS, TIER_KEYS, beats, isTopTier, levelFor, nextTier, type Best, type Prize } from "./games/prize";
import { useEndGuard } from "./games/useEndGuard";

// Quiz and Riddles as one prize game (owner, 2026-10-05): four options, one
// try, no "Show answer" — passengers were reading the answer and claiming a
// win. Correct answers from both games climb one ladder (5 · 10 · 15 · 20 ·
// 25); the rules live in games/prize.ts. Quiz questions get harder as the
// passenger climbs. Random order, no repeats until a list is used up (useDeck).
const PICK_GUARD_MS = 400; // a jolt as the next question appears isn't an answer
// Riddles (owner, v5.21): 20 seconds to think before the options appear (can
// be skipped), and one hint per riddle — the answer's first letter. That
// makes them a puzzle, not a second quiz. Prizes count the same.
const THINK_S = 20;

/** First letter of an answer, after "a / the / un / la…". */
function firstLetter(answer: string): string {
  const core = answer.replace(/^(a|an|the|un|una|unos|unas|el|la|los|las)\s+/i, "").trim();
  return (core[0] ?? "").toUpperCase();
}

function shuffled(item: Mcq): string[] {
  const out = [item.a, ...item.w];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export default function WordGame({ kind, s, lang, deck, prize, onAnswer, onTake, onDecline, best, onKeep, onRestart, asked, onAsk, onClose, top }: {
  kind: "quiz" | "riddles";
  s: V5Strings;
  lang: Lang;
  deck: Deck;
  prize: Prize;
  onAnswer: (ok: boolean) => void;
  onTake: () => void;
  onDecline: () => void;   // a Diamond that can't beat the ride's prize: close the ladder
  best: Best | null;       // the ride's best prize so far (v5.41)
  onKeep: () => void;
  onRestart: () => void;
  asked: boolean;
  onAsk: () => void;
  onClose: () => void;
  top: number; // v5.22 (owner): the half-screen panel under the tip box, like the other games
}) {
  const [bank, setBank] = useState<Bank | null>(null);
  const [failed, setFailed] = useState(false);
  const [level, setLevel] = useState(levelFor(prize.correct));
  const [idx, setIdx] = useState(-1);
  const [picked, setPicked] = useState<string | null>(null);
  const [count, setCount] = useState(0);
  const [justClaimed, setJustClaimed] = useState(false);
  const [thinkLeft, setThinkLeft] = useState(0);
  const [hinted, setHinted] = useState(false);
  const shownAt = useRef(0);
  const lastNext = useRef(0);
  const correctRef = useRef(prize.correct);
  correctRef.current = prize.correct;

  const poolOf = (b: Bank, lv: typeof level) => (kind === "riddles" ? b.riddles : b[lv]);
  const keyOf = (lv: typeof level) => (kind === "riddles" ? `${lang}:mc:riddles` : `${lang}:mc:${lv}`);

  // This language's questions (their own chunk).
  useEffect(() => {
    let off = false;
    setFailed(false);
    loadBank(lang).then((b) => { if (!off) setBank(b); }).catch(() => { if (!off) setFailed(true); });
    return () => { off = true; };
  }, [lang]);

  // First question for this bank.
  useEffect(() => {
    if (!bank) return;
    const lv = levelFor(correctRef.current);
    setLevel(lv);
    setIdx(deck.draw(keyOf(lv), poolOf(bank, lv).length));
    setPicked(null);
    setCount(1);
    startThinking();
    shownAt.current = Date.now();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bank, deck]);

  // The level only moves on "Next", never under an answer being read.
  function next(freshLadder = false) {
    if (!bank) return;
    const now = Date.now();
    if (now - lastNext.current < 400) return;
    lastNext.current = now;
    const lv = levelFor(freshLadder ? 0 : prize.correct);
    const pool = poolOf(bank, lv);
    setIdx((cur) => deck.draw(keyOf(lv), pool.length, lv === level ? cur : -1));
    setLevel(lv);
    setPicked(null);
    setCount((c) => c + 1);
    startThinking();
    shownAt.current = now;
  }

  function startThinking() {
    setHinted(false);
    setThinkLeft(kind === "riddles" ? THINK_S : 0);
  }

  function showOptionsNow() {
    setThinkLeft(0);
    shownAt.current = Date.now(); // the pick guard starts when the options appear
  }

  // Think-time countdown (riddles)
  useEffect(() => {
    if (thinkLeft <= 0) return;
    const t = setTimeout(() => {
      if (thinkLeft === 1) shownAt.current = Date.now();
      setThinkLeft(thinkLeft - 1);
    }, 1000);
    return () => clearTimeout(t);
  }, [thinkLeft]);

  const item = bank ? poolOf(bank, level)[idx] : undefined;
  const options = useMemo(() => (item ? shuffled(item) : []), [item]);

  function pick(opt: string) {
    if (!item || picked !== null || Date.now() - shownAt.current < PICK_GUARD_MS) return;
    setPicked(opt);
    onAnswer(opt === item.a);
  }

  const offerReady = useEndGuard(prize.status === "offer");
  const bustReady = useEndGuard(prize.status === "bust");
  const tierName = (t: number) => (t >= 0 ? s.tiers[TIER_KEYS[t]] : "");
  const up = nextTier(prize.correct);
  const counting = prize.status !== "claimed";
  const caption = (kind === "quiz" ? s.questionN : s.riddleN).replace("{n}", String(count))
    + (kind === "quiz" ? ` · ${s.levels[level]}` : "");

  return (
    <div className="v5-game v5-word" data-half role="dialog" aria-label={s.games[kind]} style={{ top }}>
      {/* One row: Close, the prize ladder (5 · 10 · 15 · 20 · 25 correct), lives */}
      <div className="v5-half-bar">
        <button className="v5-pill" onClick={onClose}>
          <Icon name="chevron-down" size={18} />
          {s.close}
        </button>
      <div className="v5-ladder" dir="ltr">
        {TIERS.map((t, i) => {
          const state = prize.status === "claimed" && prize.tier === i ? "won"
            : prize.correct >= t ? "passed"
            : counting && up === i ? "next" : "";
          return (
            <span key={t} data-state={state}>
              <b>{t}</b>
              <small>{tierName(i)}</small>
            </span>
          );
        })}
      </div>
        {counting && (
          <span className="v5-lives" role="img" aria-label={`${s.lives}: ${prize.lives}`}>
            {[0, 1, 2].map((i) => <i key={i} data-lost={i >= prize.lives} />)}
          </span>
        )}
      </div>
      <div className="v5-ladder-cap">
        {counting ? (
          <>
            <span>{s.correctCount.replace("{n}", String(prize.correct))}</span>
            {up >= 0 && <span>{s.nextPrize.replace("{n}", String(TIERS[up] - prize.correct)).replace("{tier}", tierName(up))}</span>}
          </>
        ) : (
          <span style={{ color: "var(--gold)" }}>{s.claimedBanner.replace("{tier}", tierName(best ? best.tier : prize.tier))}</span>
        )}
      </div>

      <section className="v5-qcard" aria-live="polite">
        <span className="v5-caption" dir="auto">
          {picked === null ? caption : picked === item?.a ? s.correctWord : s.wrongWord}
        </span>
        {failed || (bank && !item) ? (
          <p className="v5-label" style={{ fontWeight: 400, color: "var(--body)" }}>{s.questionsFailed}</p>
        ) : (
          <p className="v5-question">{item?.q ?? ""}</p>
        )}
        {kind === "riddles" && item && picked === null && (
          hinted ? (
            <span className="v5-hint" dir="auto">{s.hintText.replace("{x}", firstLetter(item.a))}</span>
          ) : (
            <button className="v5-pill" onClick={() => setHinted(true)}>
              <Icon name="lightbulb" size={18} style={{ color: "var(--i-lemon)" }} />{s.hint}
            </button>
          )
        )}
      </section>

      {thinkLeft > 0 && item ? (
        <div className="v5-think" role="timer" aria-label={`${s.thinkTime} ${thinkLeft}`}>
          <span className="v5-think-n" dir="ltr">{thinkLeft}</span>
          <span className="v5-label" style={{ color: "var(--body)" }}>{s.thinkTime}</span>
          <button className="v5-newgame" onClick={showOptionsNow}>{s.showOptions}</button>
        </div>
      ) : (
      <div className="v5-opts">
        {options.map((opt, i) => {
          const result = picked === null ? undefined : opt === item?.a ? "right" : opt === picked ? "wrong" : undefined;
          return (
            <button key={opt} className="v5-opt" data-result={result} data-dim={picked !== null && !result}
              disabled={picked !== null || prize.status === "offer" || prize.status === "bust"}
              onClick={() => pick(opt)}>
              <span className="v5-opt-letter" dir="ltr">
                {result === "right" ? <Icon name="check" size={16} strokeWidth={2.4} />
                  : result === "wrong" ? <Icon name="close" size={16} strokeWidth={2.4} />
                  : "ABCD"[i]}
              </span>
              <span>{opt}</span>
            </button>
          );
        })}
      </div>
      )}

      <div className="v5-game-foot">
        <button className="v5-gtile v5-amish" aria-pressed={asked} onClick={onAsk}>
          <span className="v5-gtile-icon"><Icon name="comment" size={20} style={{ color: "var(--i-teal)" }} /></span>
          <span style={{ display: "grid", gap: 2, minWidth: 0 }}>
            <span className="v5-label">{s.playWithDriver}</span>
            <span className="v5-sub">{s.playWithDriverSub}</span>
          </span>
          {asked && <span className="v5-badge" aria-hidden style={{ top: 8, insetInlineEnd: 8 }}><Icon name="check" size={13} strokeWidth={2.4} /></span>}
        </button>
        <button className="v5-next" disabled={picked === null && !failed} onClick={() => next()}>
          {kind === "quiz" ? s.nextQuestion : s.nextRiddle}
          <Icon name="chevron-right" size={22} className="v5-flip" />
        </button>
      </div>

      {/* Milestone: take the prize now, or keep playing for the next one */}
      {prize.status === "offer" && (
        <div className="v5-prize-overlay" role="alertdialog" aria-label={(prize.lastCall ? s.lastCallTitle : s.wonPrize).replace("{tier}", tierName(prize.tier))}>
          <span className="v5-caption">{s.correctCount.replace("{n}", String(prize.correct))}</span>
          <span className="v5-prize-tier">{tierName(prize.tier)}</span>
          <span className="v5-coachline" aria-hidden />
          <span className="v5-heading">{(prize.lastCall ? s.lastCallTitle : s.wonPrize).replace("{tier}", tierName(prize.tier))}</span>
          {/* The ride keeps only its best prize (v5.41): say what this one means */}
          <span className="v5-sub">
            {!beats(best, prize.tier) && best ? s.keptPrize.replace("{tier}", tierName(best.tier))
              : best ? s.replacesPrize.replace("{tier}", tierName(best.tier)) : s.prizeWhat}
          </span>
          <div className="v5-prize-actions">
            {beats(best, prize.tier) && (
              <button className="v5-next" data-gold disabled={!offerReady} onClick={() => { setJustClaimed(true); onTake(); }}>
                <Icon name="check" size={20} />{s.takePrize}
              </button>
            )}
            {prize.lastCall ? null : isTopTier(prize.tier) ? (
              beats(best, prize.tier) ? <span className="v5-sub">{s.topPrize}</span>
                : <button className="v5-next" disabled={!offerReady} onClick={onDecline}>{s.done}</button>
            ) : (
              <>
                <button className="v5-newgame" disabled={!offerReady} onClick={onKeep}>
                  {s.keepPlayingFor.replace("{tier}", tierName(prize.tier + 1))}
                </button>
                <span className="v5-sub">{s.riskNote.replace("{tier}", tierName(prize.tier + 1))}</span>
              </>
            )}
          </div>
        </div>
      )}

      {prize.status === "claimed" && justClaimed && (
        <div className="v5-prize-overlay" role="alertdialog" aria-label={s.claimedTitle.replace("{tier}", tierName(prize.tier))}>
          <span className="v5-prize-tier">{tierName(prize.tier)}</span>
          <span className="v5-coachline" aria-hidden />
          <span className="v5-heading">{s.claimedTitle.replace("{tier}", tierName(prize.tier))}</span>
          <span className="v5-sub">{s.prizeWhat}</span>
          <div className="v5-prize-actions">
            <button className="v5-next" onClick={() => setJustClaimed(false)}>{s.done}</button>
          </div>
        </div>
      )}

      {prize.status === "bust" && (
        <div className="v5-prize-overlay" role="alertdialog" aria-label={s.bustTitle}>
          <span className="v5-heading">{s.bustTitle}</span>
          {prize.atRisk >= 0 && beats(best, prize.atRisk) && <span className="v5-label">{s.bustLost.replace("{tier}", tierName(prize.atRisk))}</span>}
          <span className="v5-sub">{s.bustSub}</span>
          <div className="v5-prize-actions">
            <button className="v5-next" disabled={!bustReady} onClick={() => { onRestart(); next(true); }}>
              <Icon name="refresh" size={20} />{s.startAgain}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
