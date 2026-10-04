// Run: node --test components/v5/games   (Node 23.6+ reads the .ts directly)
import { test } from "node:test";
import assert from "node:assert/strict";
import { newSnake, turn, step, nextCell, placeFood } from "./snake.ts";

const at = (s, r, c) => r * s.cols + c;

test("starts in the middle, length 3, food not on the snake", () => {
  for (let k = 0; k < 200; k++) {
    const s = newSnake(12, 13);
    assert.equal(s.body.length, 3);
    assert.equal(s.status, "ready");
    assert.ok(s.food >= 0 && !s.body.includes(s.food));
  }
});

test("doesn't move until the first arrow", () => {
  const s = newSnake(12, 13);
  assert.equal(step(s), s);
  const p = turn(s, "up");
  assert.equal(p.status, "playing");
  assert.equal(p.dir, "up");
});

test("first arrow straight back into the body starts forwards instead", () => {
  const s = turn(newSnake(12, 13), "left");
  assert.equal(s.status, "playing");
  assert.equal(s.dir, "right");
});

test("moves one square per step", () => {
  let s = turn(newSnake(12, 13, () => 0), "right");
  const head = s.body[0];
  s = step(s);
  assert.equal(s.body[0], head + 1);
  assert.equal(s.body.length, 3);
});

test("edges wrap round", () => {
  const s = { cols: 12, rows: 13 };
  assert.equal(nextCell(s, at(s, 0, 11), "right"), at(s, 0, 0));
  assert.equal(nextCell(s, at(s, 0, 0), "left"), at(s, 0, 11));
  assert.equal(nextCell(s, at(s, 0, 4), "up"), at(s, 12, 4));
  assert.equal(nextCell(s, at(s, 12, 4), "down"), at(s, 0, 4));
});

test("reversing into the neck is ignored", () => {
  let s = turn(newSnake(12, 13), "right");
  s = turn(s, "left");
  assert.deepEqual(s.queue, []);
});

test("two quick turns are both kept, a third waits", () => {
  let s = turn(newSnake(12, 13), "right");
  s = turn(s, "up");
  s = turn(s, "left");
  s = turn(s, "down");
  assert.deepEqual(s.queue, ["up", "left"]);
  s = step(s);
  assert.equal(s.dir, "up");
  s = step(s);
  assert.equal(s.dir, "left");
});

test("eating grows the snake, scores, and moves the food", () => {
  let s = turn(newSnake(12, 13), "right");
  s = { ...s, food: s.body[0] + 1 };
  const n = step(s, () => 0);
  assert.equal(n.body.length, 4);
  assert.equal(n.score, 1);
  assert.ok(!n.body.includes(n.food));
});

test("running into itself ends the game", () => {
  // A long snake curled so turning down then left hits its own body
  const cols = 12, rows = 13;
  let s = turn(newSnake(cols, rows), "right");
  s = { ...s, body: [at(s, 5, 5), at(s, 5, 4), at(s, 5, 3), at(s, 6, 3), at(s, 6, 4), at(s, 6, 5), at(s, 6, 6)], food: at(s, 0, 0) };
  s = turn(s, "down");
  s = step(s);
  assert.equal(s.status, "over");
});

test("moving into the square the tail is leaving is allowed", () => {
  // 2×2 loop: head chases tail
  let s = turn(newSnake(12, 13), "right");
  s = { ...s, body: [at(s, 0, 1), at(s, 0, 0), at(s, 1, 0), at(s, 1, 1)], dir: "down", queue: [], food: at(s, 9, 9) };
  s = step(s); // head moves to (1,1), where the tail was
  assert.equal(s.status, "playing");
});

test("no food left means the board is full", () => {
  assert.equal(placeFood({ cols: 2, rows: 1, body: [0, 1] }), -1);
});
