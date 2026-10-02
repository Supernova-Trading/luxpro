"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Translation } from "@/lib/translations";
import ActionBtn from "../ActionBtn";

type Choice = "rock" | "paper" | "scissors";
const CHOICES: { id: Choice; icon: string }[] = [
  { id: "rock", icon: "✊" },
  { id: "paper", icon: "✋" },
  { id: "scissors", icon: "✌️" },
];
const BEATS: Record<Choice, Choice> = { rock: "scissors", paper: "rock", scissors: "paper" };

export default function RockPaperScissors({ t }: { t: Translation }) {
  const [you, setYou] = useState<Choice | null>(null);
  const [car, setCar] = useState<Choice | null>(null);

  function play(choice: Choice) {
    const carChoice = CHOICES[Math.floor(Math.random() * CHOICES.length)].id;
    setYou(choice);
    setCar(carChoice);
  }

  function reset() { setYou(null); setCar(null); }

  const result = you && car ? (you === car ? "draw" : BEATS[you] === car ? "win" : "lose") : null;
  const icon = (c: Choice) => CHOICES.find((x) => x.id === c)!.icon;
  const label = (c: Choice) => (c === "rock" ? t.rock : c === "paper" ? t.paper : t.scissors);

  return (
    <div>
      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div key="pick" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="text-[15px] font-semibold text-center mb-3.5 text-primary">{t.yourTurn}</div>
            <div className="grid grid-cols-3 gap-2.5">
              {CHOICES.map(({ id, icon }) => (
                <button
                  key={id}
                  onClick={() => play(id)}
                  className="flex flex-col items-center gap-1.5 py-5 rounded-2xl"
                  style={{ background: "var(--lp-surface)", border: "1px solid var(--lp-border)" }}
                >
                  <div className="text-[34px]">{icon}</div>
                  <div className="text-[11px] font-bold uppercase tracking-[1px] text-secondary">{label(id)}</div>
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div key="result" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div
              className="text-[16px] font-bold text-center mb-3.5"
              style={{ color: result === "win" ? "var(--accent-positive)" : "var(--text-primary)" }}
            >
              {result === "win" ? t.youWin : result === "lose" ? t.youLose : t.itsADraw}
            </div>
            <div className="flex items-center justify-center gap-6 mb-3.5">
              <div className="text-center">
                <div className="text-[46px]">{icon(you!)}</div>
                <div className="text-[10px] uppercase tracking-[1.5px] mt-1 text-muted">{t.youPicked}</div>
              </div>
              <div className="text-[18px] text-muted">vs</div>
              <div className="text-center">
                <div className="text-[46px]">{icon(car!)}</div>
                <div className="text-[10px] uppercase tracking-[1.5px] mt-1 text-muted">{t.carPicked}</div>
              </div>
            </div>
            <div className="flex justify-center">
              <ActionBtn accent onClick={reset}>↻ {t.newGame}</ActionBtn>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
