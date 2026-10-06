"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "../../Icon";
import type { V5Strings } from "../strings";
import { beats, TIER_KEYS, type Best } from "./prize";

// The end-of-game pop-up for Snake, Blocks and Mines (Amish, v5.39): the
// result and the prize it wins. v5.43 (owner): the prize is given the moment
// the game ends — no "Take my prize" tap that a passenger might miss, so the
// driver's phone always shows it. The ride keeps only its best prize (v5.41):
// a better one replaces it, a lower one doesn't count.
export default function GamePrize({ s, caption, tier, best, ladder, hint, ready, onTake, onAgain }: {
  s: V5Strings;
  caption: string;            // "320 points" / "Medium board cleared"
  tier: number;               // prize won (index into the tiers), -1 for none
  best: Best | null;          // the ride's best prize so far
  ladder?: readonly number[]; // the points for each prize, shown as a scoreboard
  hint?: string;              // when no prize: how to win one
  ready: boolean;             // the end-of-game tap guard has passed
  onTake: () => void;         // award it (said to the driver, shown on his phone)
  onAgain: () => void;
}) {
  const name = (i: number) => s.tiers[TIER_KEYS[i]];
  const [before] = useState(best);          // the ride's prize when the game ended
  const won = beats(before, tier);           // this game's prize is the new best
  const given = useRef(false);
  useEffect(() => {
    if (won && !given.current) { given.current = true; onTake(); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const heading = tier < 0 ? s.notThisTime : won ? s.claimedTitle.replace("{tier}", name(tier)) : s.wellPlayed;
  return (
    <div className="v5-prize-overlay" role="alertdialog" aria-label={heading}>
      <span className="v5-caption">{caption}</span>
      {ladder && (
        <div className="v5-ladder v5-prize-ladder" aria-hidden>
          {ladder.map((pts, i) => (
            <span key={pts} data-state={i === tier ? "won" : i < tier ? "passed" : undefined}>
              <b dir="ltr">{pts}</b>
              <small>{name(i)}</small>
            </span>
          ))}
        </div>
      )}
      {tier >= 0 && (
        <>
          <span className="v5-prize-tier">{name(tier)}</span>
          <span className="v5-coachline" aria-hidden />
        </>
      )}
      <span className="v5-heading">{heading}</span>
      <span className="v5-sub">
        {tier < 0 ? hint
          : !won && before ? s.keptPrize.replace("{tier}", name(before.tier))
          : before ? s.replacesPrize.replace("{tier}", name(before.tier)) : s.prizeWhat}
      </span>
      <div className="v5-prize-actions">
        <button className="v5-next" disabled={!ready} onClick={onAgain}>
          <Icon name="refresh" size={20} />{s.playAgain}
        </button>
      </div>
    </div>
  );
}
