// Run: node --test "components/v5/games/*.test.mjs"   (Node 23.6+ reads the .ts directly)
import { test } from "node:test";
import assert from "node:assert/strict";
import { newBlocks, start, move, rotate, tick, softDrop, hardDrop, landing, cellsOf, fits, fallMs, KEYS } from "./blocks.ts";

const playing = (key, extra = {}) => {
  const s = start(newBlocks(10, 20, () => 0));
  return { ...s, piece: { key, rot: 0, x: key === "I" ? 3 : key === "O" ? 4 : 3, y: 0 }, ...extra };
};
const fillRow = (board, r, except = -1) => { for (let c = 0; c < 10; c++) if (c !== except) board[r * 10 + c] = "Z"; };

test("waits for the first button before falling", () => {
  const s = newBlocks();
  assert.equal(tick(s), s);
  assert.equal(start(s).status, "playing");
});

test("every shape comes once in each run of seven", () => {
  let s = start(newBlocks());
  const seen = [s.piece.key];
  for (let k = 0; k < 13; k++) { s = hardDrop({ ...s, board: s.board.map(() => null) }); seen.push(s.piece.key); }
  for (const run of [seen.slice(0, 7), seen.slice(7, 14)]) assert.deepEqual([...run].sort(), [...KEYS].sort());
});

test("walls stop sideways moves", () => {
  let s = playing("O");
  for (let k = 0; k < 10; k++) s = move(s, -1);
  assert.equal(Math.min(...cellsOf(s.piece).map(([, c]) => c)), 0);
  for (let k = 0; k < 20; k++) s = move(s, 1);
  assert.equal(Math.max(...cellsOf(s.piece).map(([, c]) => c)), 9);
});

test("rotating four times returns to the start", () => {
  let s = playing("T", {});
  s = { ...s, piece: { ...s.piece, y: 5 } };
  const before = cellsOf(s.piece).sort().join();
  for (let k = 0; k < 4; k++) s = rotate(s);
  assert.equal(cellsOf(s.piece).sort().join(), before);
});

test("O doesn't rotate", () => {
  const s = playing("O");
  assert.equal(rotate(s), s);
});

test("rotating against a wall kicks the piece back inside", () => {
  // Vertical I hugging the right wall, rotate to horizontal
  let s = playing("I");
  s = { ...s, piece: { key: "I", rot: 1, x: 7, y: 5 } };
  assert.ok(Math.max(...cellsOf(s.piece).map(([, c]) => c)) === 9);
  s = rotate(s);
  assert.equal(s.piece.rot, 2);
  assert.ok(fits(s, s.piece));
});

test("hard drop lands where the ghost shows, and scores 2 per row", () => {
  const s = playing("O");
  const ghost = landing(s);
  const n = hardDrop(s);
  for (const [r, c] of cellsOf(ghost)) assert.equal(n.board[r * 10 + c], "O");
  assert.equal(n.score, 2 * (ghost.y - s.piece.y));
});

test("a resting piece locks on the next tick, not before", () => {
  let s = playing("O");
  s = { ...s, piece: landing(s) };
  assert.equal(s.board.filter(Boolean).length, 0); // resting, still movable
  const locked = tick(s);
  assert.equal(locked.board.filter(Boolean).length, 4);
  assert.equal(locked.piece.y, 0); // the next piece has spawned
});

test("soft drop moves down a row for 1 point", () => {
  const s = playing("T");
  const n = softDrop(s);
  assert.equal(n.piece.y, s.piece.y + 1);
  assert.equal(n.score, 1);
});

test("a full row clears and the rows above drop down", () => {
  const s = playing("I");
  const board = [...s.board];
  fillRow(board, 19, 9);       // bottom row, gap at the right
  board[18 * 10 + 0] = "S";    // a block above that should fall one row
  // Vertical I dropped into the gap
  const n = hardDrop({ ...s, board, piece: { key: "I", rot: 1, x: 7, y: 0 } });
  assert.equal(n.lines, 1);
  assert.equal(n.board[19 * 10 + 0], "S");
  assert.equal(n.board[19 * 10 + 9], "I");
  assert.equal(n.board.filter(Boolean).length, 1 + 3);
});

test("four rows at once score 800 × level", () => {
  const s = playing("I");
  const board = [...s.board];
  for (let r = 16; r < 20; r++) fillRow(board, r, 0);
  const n = hardDrop({ ...s, board, piece: { key: "I", rot: 1, x: -2, y: 0 } });
  assert.equal(n.lines, 4);
  assert.equal(n.score - 2 * 16, 800);
  assert.equal(n.board.filter(Boolean).length, 0);
});

test("level goes up every 10 lines", () => {
  const s = { ...playing("I"), lines: 9 };
  const board = [...s.board];
  fillRow(board, 19, 0);
  const n = hardDrop({ ...s, board, piece: { key: "I", rot: 1, x: -2, y: 0 } });
  assert.equal(n.lines, 10);
  assert.equal(n.level, 2);
});

test("game over when a new piece has no room", () => {
  const s = playing("O");
  const board = [...s.board];
  for (let r = 1; r < 20; r++) fillRow(board, r, r % 2 ? 0 : 9);
  const n = hardDrop({ ...s, board, piece: { ...s.piece, y: -1 } });
  assert.equal(n.status, "over");
  assert.equal(move(n, 1), n);
});

test("falls faster with each level, never below the floor", () => {
  assert.equal(fallMs(1, 1000, 350), 1000);
  assert.ok(fallMs(3, 1000, 350) < fallMs(2, 1000, 350));
  assert.equal(fallMs(30, 1000, 350), 350);
});

test("game over when the next piece can't appear at the top", () => {
  const s = playing("O", { next: "T" });
  const board = [...s.board];
  for (let c = 2; c < 8; c++) { board[0 * 10 + c] = "Z"; board[1 * 10 + c] = "Z"; }
  // Drop the O down the far left; the T then spawns into the filled top rows
  const n = hardDrop({ ...s, board, piece: { key: "O", rot: 0, x: 0, y: 0 } });
  assert.equal(n.status, "over");
});
