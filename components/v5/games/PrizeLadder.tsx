"use client";

import type { V5Strings } from "../strings";
import { TIER_KEYS } from "./prize";

// The prize ladder at the top of Snake and Blocks (owner, v5.43: "the same
// format as the quiz across all games") — the points for Bronze … Diamond,
// what's passed, what's next, and how far to go.
export default function PrizeLadder({ s, points, score }: { s: V5Strings; points: readonly number[]; score: number }) {
  const name = (i: number) => s.tiers[TIER_KEYS[i]];
  const up = points.findIndex((p) => p > score);
  return (
    <>
      <div className="v5-ladder v5-game-ladder" dir="ltr">
        {points.map((p, i) => (
          <span key={p} data-state={score >= p ? "passed" : up === i ? "next" : undefined}>
            <b>{p}</b>
            <small>{name(i)}</small>
          </span>
        ))}
      </div>
      <div className="v5-ladder-cap">
        <span>{s.pointsWord.replace("{n}", String(score))}</span>
        {up >= 0 && <span>{s.nextPrize.replace("{n}", String(points[up] - score)).replace("{tier}", name(up))}</span>}
      </div>
    </>
  );
}
