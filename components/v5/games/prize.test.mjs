// Run: node --test "components/v5/games/*.test.mjs"   (Node 23.6+ reads the .ts directly)
import { test } from "node:test";
import assert from "node:assert/strict";
import { newPrize, answer, take, keepPlaying, restart, levelFor, nextTier, isTopTier, TIERS } from "./prize.ts";

const right = (p, n) => { for (let i = 0; i < n; i++) p = answer(p, true); return p; };

test("starts with 3 lives and nothing won", () => {
  const p = newPrize();
  assert.deepEqual([p.correct, p.lives, p.status, p.tier, p.atRisk], [0, 3, "playing", -1, -1]);
});

test("5 correct offers the first prize", () => {
  const p = right(newPrize(), 5);
  assert.equal(p.status, "offer");
  assert.equal(p.tier, 0);
});

test("no more answers count while an offer is open", () => {
  const p = right(newPrize(), 5);
  assert.equal(answer(p, true), p);
  assert.equal(answer(p, false), p);
});

test("taking the prize ends the ladder", () => {
  let p = take(right(newPrize(), 5));
  assert.equal(p.status, "claimed");
  assert.equal(p.tier, 0);
  assert.equal(answer(p, true), p);
  assert.equal(keepPlaying(p), p);
});

test("keep playing puts the offered prize at risk and climbs on", () => {
  let p = keepPlaying(right(newPrize(), 5));
  assert.equal(p.status, "playing");
  assert.equal(p.atRisk, 0);
  p = right(p, 5);
  assert.equal(p.status, "offer");
  assert.equal(p.tier, 1);
});

test("three wrong answers lose everything passed up", () => {
  let p = keepPlaying(right(newPrize(), 5));
  p = answer(answer(answer(p, false), false), false);
  assert.equal(p.status, "bust");
  assert.equal(p.lives, 0);
  assert.equal(p.atRisk, 0); // the Bronze that was passed up
});

test("wrong answers cost a life but keep the count", () => {
  let p = right(newPrize(), 3);
  p = answer(p, false);
  assert.equal(p.correct, 3);
  assert.equal(p.lives, 2);
});

test("start again after losing gives a fresh ladder", () => {
  let p = answer(answer(answer(newPrize(), false), false), false);
  assert.equal(p.status, "bust");
  p = restart(p);
  assert.deepEqual([p.correct, p.lives, p.status], [0, 3, "playing"]);
});

test("the top prize can only be taken", () => {
  let p = newPrize();
  for (let t = 0; t < TIERS.length - 1; t++) p = keepPlaying(right(p, 5));
  p = right(p, 5);
  assert.equal(p.status, "offer");
  assert.equal(isTopTier(p.tier), true);
  assert.equal(keepPlaying(p), p);
  assert.equal(take(p).status, "claimed");
});

test("questions get harder as the count climbs", () => {
  assert.equal(levelFor(0), "easy");
  assert.equal(levelFor(9), "easy");
  assert.equal(levelFor(10), "medium");
  assert.equal(levelFor(20), "hard");
});

test("next prize up", () => {
  assert.equal(nextTier(0), 0);
  assert.equal(nextTier(5), 1);
  assert.equal(nextTier(24), 4);
  assert.equal(nextTier(25), -1);
});

test("a guesser rarely reaches the first prize", () => {
  // 1 in 4 chance per question, 3 lives: well under 2% reach 5 correct
  let wins = 0;
  const runs = 20000;
  for (let r = 0; r < runs; r++) {
    let p = newPrize();
    while (p.status === "playing") p = answer(p, Math.random() < 0.25);
    if (p.status === "offer") wins++;
  }
  assert.ok(wins / runs < 0.02, `guessers won ${((wins / runs) * 100).toFixed(1)}%`);
});

test("the ride ending offers a passed-up prize once more", async () => {
  const { lastCall } = await import("./prize.ts");
  let p = newPrize();
  for (let i = 0; i < 5; i++) p = answer(p, true);   // Bronze on offer
  p = keepPlaying(p);                                 // gambled it
  p = answer(p, true);
  const lc = lastCall(p);
  assert.equal(lc.status, "offer");
  assert.equal(lc.tier, 0);
  assert.equal(lc.atRisk, -1);
  assert.equal(lc.lastCall, true);
  assert.equal(keepPlaying(lc), lc); // no "keep playing" on the last call
  assert.equal(lastCall(newPrize()).status, "playing"); // nothing at stake: no pop-up
  assert.equal(lastCall(take(lc)).status, "claimed");   // already taken: nothing
});
