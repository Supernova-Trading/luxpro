// The Quiz & Riddles prize ladder — pure rules, tested on their own
// (node --test "components/v5/games/*.test.mjs").
// Owner's design (2026-10-05): correct answers from Quiz and Riddles count
// together; at 5, 10, 15, 20 and 25 the passenger chooses "take the prize
// now" or "keep playing for a better one". Three lives make that a real
// choice and stop anyone winning by tapping at random: lose all three and
// any prize you passed up is gone. One prize per ride.

export const TIERS = [5, 10, 15, 20, 25] as const;
export type TierKey = "bronze" | "silver" | "gold" | "platinum" | "diamond";
export const TIER_KEYS: TierKey[] = ["bronze", "silver", "gold", "platinum", "diamond"];
export const LIVES = 3;

export type PrizeStatus = "playing" | "offer" | "claimed" | "bust";
export interface Prize {
  correct: number;
  lives: number;
  status: PrizeStatus;
  tier: number;   // tier on offer or claimed (index into TIERS), else -1
  atRisk: number; // highest tier passed up with "keep playing", else -1
  lastCall?: boolean; // offered once more because the ride is ending (v5.34)
}

export function newPrize(): Prize {
  return { correct: 0, lives: LIVES, status: "playing", tier: -1, atRisk: -1 };
}

/** Count an answer. Only counts while playing for a prize. */
export function answer(p: Prize, ok: boolean): Prize {
  if (p.status !== "playing") return p;
  if (ok) {
    const correct = p.correct + 1;
    const tier = (TIERS as readonly number[]).indexOf(correct);
    return tier >= 0 ? { ...p, correct, status: "offer", tier } : { ...p, correct };
  }
  const lives = p.lives - 1;
  return lives <= 0 ? { ...p, lives: 0, status: "bust" } : { ...p, lives };
}

/** "Take my prize": the ladder ends for this ride. */
export function take(p: Prize): Prize {
  return p.status === "offer" ? { ...p, status: "claimed" } : p;
}

export function isTopTier(tier: number): boolean {
  return tier === TIERS.length - 1;
}

/** "Keep playing": the prize on offer is now at risk. Not offered for the top prize. */
export function keepPlaying(p: Prize): Prize {
  if (p.status !== "offer" || isTopTier(p.tier) || p.lastCall) return p;
  return { ...p, status: "playing", atRisk: p.tier, tier: -1 };
}

/** End of the ride (v5.34, council): a prize passed up with "keep playing"
 *  is offered once more, so nobody leaves empty-handed right before the tip
 *  moment (impeccable reference/delight.md: match the emotional moment). */
export function lastCall(p: Prize): Prize {
  if (p.status === "offer") return p.lastCall ? p : { ...p, lastCall: true };
  if (p.status === "playing" && p.atRisk >= 0) return { ...p, status: "offer", tier: p.atRisk, atRisk: -1, lastCall: true };
  return p;
}

/** After losing all lives: a fresh ladder (no prize has been taken this ride). */
export function restart(p: Prize): Prize {
  return p.status === "bust" ? newPrize() : p;
}

/** Blocks (Amish, v5.39): the score at game over wins a prize. */
export const BLOCKS_POINTS = [100, 250, 500, 1000, 2000] as const;
export function blocksTier(score: number): number {
  let t = -1;
  BLOCKS_POINTS.forEach((p, i) => { if (score >= p) t = i; });
  return t;
}

/** Mines (Amish, v5.39): clearing the board wins Bronze, Silver or Gold. */
export const MINES_TIER: Record<"easy" | "medium" | "hard", number> = { easy: 0, medium: 1, hard: 2 };

/** The ride's prize (owner, v5.41): every game can be won, but the ride keeps
 *  only its BEST prize — Bronze in Quiz then Silver in Blocks means Silver.
 *  The driver hands over one treat, and his phone shows just that one. */
export type PrizeGame = "Quiz" | "Riddles" | "Blocks" | "Mines";
export interface Best { tier: number; game: PrizeGame }

/** True when this prize would be better than the one the ride already has. */
export function beats(best: Best | null, tier: number): boolean {
  return tier >= 0 && (!best || tier > best.tier);
}

export function upgrade(best: Best | null, tier: number, game: PrizeGame): Best | null {
  return beats(best, tier) ? { tier, game } : best;
}

/** Quiz offer that can't beat the ride's prize at the top of the ladder:
 *  close the ladder without taking anything. */
export function decline(p: Prize): Prize {
  return p.status === "offer" ? { ...p, status: "claimed" } : p;
}

/** Questions get harder as the passenger climbs: easy, then medium, then hard. */
export function levelFor(correct: number): "easy" | "medium" | "hard" {
  return correct < 10 ? "easy" : correct < 20 ? "medium" : "hard";
}

/** Next prize up from a number of correct answers, or -1 past the top. */
export function nextTier(correct: number): number {
  return (TIERS as readonly number[]).findIndex((t) => t > correct);
}
