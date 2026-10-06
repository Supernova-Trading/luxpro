"use client";

import { useState } from "react";
import { Icon } from "../../Icon";
import type { V5Strings } from "../strings";
import { TIER_KEYS, type Prize } from "./prize";

// The end-of-game pop-up for Blocks and Mines (Amish, v5.39): the result,
// the prize it wins, and "Take my prize" — the same look and wording as the
// Quiz prize, so passengers learn it once. Still one prize per ride across
// all games; taking one is said to the driver (App.takeGamePrize).
export default function GamePrize({ s, caption, tier, prize, ladder, hint, ready, onTake, onAgain }: {
  s: V5Strings;
  caption: string;           // "320 points" / "Medium board cleared"
  tier: number;              // prize won (index into the tiers), -1 for none
  prize: Prize;              // the ride's prize state (one per ride)
  ladder?: readonly number[]; // Blocks: the points for each prize, shown as a scoreboard
  hint?: string;             // when no prize: how to win one
  ready: boolean;            // the end-of-game tap guard has passed
  onTake: () => void;
  onAgain: () => void;
}) {
  const [took, setTook] = useState(false);
  const name = (i: number) => s.tiers[TIER_KEYS[i]];
  const already = prize.status === "claimed" && !took; // a prize was taken earlier this ride
  const label = tier >= 0 ? s.wonPrize.replace("{tier}", name(tier)) : s.notThisTime;

  return (
    <div className="v5-prize-overlay" role="alertdialog" aria-label={label}>
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
      {tier >= 0 ? (
        <>
          <span className="v5-prize-tier">{name(tier)}</span>
          <span className="v5-coachline" aria-hidden />
          <span className="v5-heading">
            {took ? s.claimedTitle.replace("{tier}", name(tier)) : already ? s.wellPlayed : label}
          </span>
          <span className="v5-sub">{already ? s.oneRidePrize.replace("{tier}", name(prize.tier)) : s.prizeWhat}</span>
        </>
      ) : (
        <>
          <span className="v5-heading">{s.notThisTime}</span>
          {hint && <span className="v5-sub">{hint}</span>}
        </>
      )}
      <div className="v5-prize-actions">
        {tier >= 0 && !already && !took && (
          <button className="v5-next" data-gold disabled={!ready} onClick={() => { setTook(true); onTake(); }}>
            <Icon name="check" size={20} />{s.takePrize}
          </button>
        )}
        <button className={tier >= 0 && !already && !took ? "v5-newgame" : "v5-next"} disabled={!ready} onClick={onAgain}>
          <Icon name="refresh" size={20} />{s.playAgain}
        </button>
      </div>
    </div>
  );
}
