// Run: node --test components/v5/games   (Node 23.6+ reads the .ts directly)
import { test } from "node:test";
import assert from "node:assert/strict";
import { newBoard, withMines, neighbours, dig, toggleFlag, flagsLeft } from "./mines.ts";

test("first dig is never a mine, and its neighbours are clear", () => {
  for (let k = 0; k < 300; k++) {
    const b = newBoard(10, 8, 18);
    const at = Math.floor(Math.random() * 80);
    const after = dig(b, at);
    assert.notEqual(after.state, "lost");
    assert.equal(after.cells[at].mine, false);
    for (const j of neighbours(after, at)) assert.equal(after.cells[j].mine, false);
    assert.equal(after.cells.filter((c) => c.mine).length, 18);
  }
});

test("numbers count neighbouring mines", () => {
  // 3×3, mines in two corners
  const b = withMines(3, 3, [0, 8]);
  assert.deepEqual(b.cells.map((c) => c.n), [0, 1, 0, 1, 2, 1, 0, 1, 0]);
});

test("digging an empty square opens its whole empty region, and stops at numbers", () => {
  // 4×4 with one mine bottom-right
  const b = dig(withMines(4, 4, [15]), 0);
  const open = b.cells.map((c) => c.open);
  assert.equal(open[15], false);
  assert.equal(open.filter(Boolean).length, 15);
  assert.equal(b.state, "won");
});

test("flood fill never opens a flagged square", () => {
  let b = withMines(4, 4, [15]);
  b = toggleFlag(b, 1);
  b = dig(b, 0);
  assert.equal(b.cells[1].open, false);
  assert.equal(b.cells[1].flag, true);
  assert.equal(b.state, "playing");
});

test("digging a flagged square does nothing", () => {
  let b = withMines(3, 3, [4]);
  b = toggleFlag(b, 4);
  const same = dig(b, 4);
  assert.equal(same, b);
});

test("hitting a mine loses and shows every unflagged mine", () => {
  let b = withMines(3, 3, [0, 8]);
  b = toggleFlag(b, 8);
  b = dig(b, 0);
  assert.equal(b.state, "lost");
  assert.equal(b.hit, 0);
  assert.equal(b.cells[0].open, true);
  assert.equal(b.cells[8].open, false); // correctly flagged stays a flag
});

test("no moves after the game ends", () => {
  const lost = dig(withMines(3, 3, [0]), 0);
  assert.equal(dig(lost, 8), lost);
  assert.equal(toggleFlag(lost, 8), lost);
});

test("winning flags every mine", () => {
  let b = withMines(2, 2, [3]);
  b = dig(b, 0); b = dig(b, 1); b = dig(b, 2);
  assert.equal(b.state, "won");
  assert.equal(b.cells[3].flag, true);
  assert.equal(flagsLeft(b), 0);
});

test("flags left counts down and back up", () => {
  let b = withMines(3, 3, [0, 8]);
  assert.equal(flagsLeft(b), 2);
  b = toggleFlag(b, 4);
  assert.equal(flagsLeft(b), 1);
  b = toggleFlag(b, 4);
  assert.equal(flagsLeft(b), 2);
});

test("an open square can't be flagged", () => {
  let b = withMines(3, 3, [0]);
  b = dig(b, 8);
  assert.equal(toggleFlag(b, 8), b);
});
