// Blocks — pure game rules (falling-block puzzle), no React or canvas, so they
// can be tested on their own (node --test "components/v5/games/*.test.mjs"). Every move
// returns a new state. Car-friendly choices: one rotate button (clockwise)
// with simple wall kicks, and a resting piece gets one full fall-interval
// of grace before it locks, so a jolt doesn't fix it in the wrong place.

export type Key = "I" | "O" | "T" | "S" | "Z" | "J" | "L";
export type BlocksStatus = "ready" | "playing" | "over";
export interface Piece { key: Key; rot: number; x: number; y: number }
export interface Blocks {
  cols: number;
  rows: number;
  board: (Key | null)[]; // row-major, row 0 at the top
  piece: Piece;
  next: Key;
  bag: Key[];
  score: number;
  lines: number;
  level: number;
  status: BlocksStatus;
}

export const KEYS: Key[] = ["I", "O", "T", "S", "Z", "J", "L"];

// [row, col] inside an n×n box, spawn orientation.
const SHAPES: Record<Key, { n: number; cells: [number, number][] }> = {
  I: { n: 4, cells: [[1, 0], [1, 1], [1, 2], [1, 3]] },
  O: { n: 2, cells: [[0, 0], [0, 1], [1, 0], [1, 1]] },
  T: { n: 3, cells: [[0, 1], [1, 0], [1, 1], [1, 2]] },
  S: { n: 3, cells: [[0, 1], [0, 2], [1, 0], [1, 1]] },
  Z: { n: 3, cells: [[0, 0], [0, 1], [1, 1], [1, 2]] },
  J: { n: 3, cells: [[0, 0], [1, 0], [1, 1], [1, 2]] },
  L: { n: 3, cells: [[0, 2], [1, 0], [1, 1], [1, 2]] },
};

const LINE_POINTS = [0, 100, 300, 500, 800];
const KICKS = [0, -1, 1, -2, 2];

/** Board squares a piece covers: [row, col] pairs (rows may be negative, above the top). */
export function cellsOf(p: Piece): [number, number][] {
  const { n, cells } = SHAPES[p.key];
  return cells.map(([r, c]) => {
    for (let k = 0; k < ((p.rot % 4) + 4) % 4; k++) [r, c] = [c, n - 1 - r]; // clockwise
    return [r + p.y, c + p.x] as [number, number];
  });
}

export function fits(s: Pick<Blocks, "cols" | "rows" | "board">, p: Piece): boolean {
  return cellsOf(p).every(([r, c]) =>
    c >= 0 && c < s.cols && r < s.rows && (r < 0 || s.board[r * s.cols + c] === null));
}

function shuffle(rand: () => number): Key[] {
  const bag = [...KEYS];
  for (let i = bag.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [bag[i], bag[j]] = [bag[j], bag[i]];
  }
  return bag;
}

/** Take the next key from a 7-piece bag: every shape once per seven pieces. */
function draw(bag: Key[], rand: () => number): [Key, Key[]] {
  const b = bag.length ? bag : shuffle(rand);
  return [b[0], b.slice(1)];
}

function spawn(key: Key, cols: number): Piece {
  return { key, rot: 0, x: Math.floor((cols - SHAPES[key].n) / 2), y: 0 };
}

export function newBlocks(cols = 10, rows = 20, rand: () => number = Math.random): Blocks {
  const [first, bag1] = draw([], rand);
  const [next, bag] = draw(bag1, rand);
  return {
    cols, rows, board: Array(cols * rows).fill(null),
    piece: spawn(first, cols), next, bag, score: 0, lines: 0, level: 1, status: "ready",
  };
}

export function start(s: Blocks): Blocks {
  return s.status === "ready" ? { ...s, status: "playing" } : s;
}

export function move(s: Blocks, dx: number): Blocks {
  if (s.status !== "playing") return s;
  const p = { ...s.piece, x: s.piece.x + dx };
  return fits(s, p) ? { ...s, piece: p } : s;
}

export function rotate(s: Blocks): Blocks {
  if (s.status !== "playing" || s.piece.key === "O") return s;
  const turned = { ...s.piece, rot: (s.piece.rot + 1) % 4 };
  for (const dx of KICKS) {
    const p = { ...turned, x: turned.x + dx };
    if (fits(s, p)) return { ...s, piece: p };
  }
  // Last try: one row up (rotating on the floor)
  const up = { ...turned, y: turned.y - 1 };
  return fits(s, up) ? { ...s, piece: up } : s;
}

/** Where the piece would land (for the faint "ghost" preview). */
export function landing(s: Blocks): Piece {
  let p = s.piece;
  while (fits(s, { ...p, y: p.y + 1 })) p = { ...p, y: p.y + 1 };
  return p;
}

function lock(s: Blocks, rand: () => number): Blocks {
  const board = [...s.board];
  let above = false;
  for (const [r, c] of cellsOf(s.piece)) {
    if (r < 0) above = true;
    else board[r * s.cols + c] = s.piece.key;
  }
  if (above) return { ...s, board, status: "over" };

  // Clear full rows, shifting everything above down.
  const kept: (Key | null)[][] = [];
  let cleared = 0;
  for (let r = 0; r < s.rows; r++) {
    const row = board.slice(r * s.cols, (r + 1) * s.cols);
    if (row.every((k) => k !== null)) cleared++;
    else kept.push(row);
  }
  const empty = Array.from({ length: cleared }, () => Array<Key | null>(s.cols).fill(null));
  const nextBoard = [...empty, ...kept].flat();

  const lines = s.lines + cleared;
  const score = s.score + LINE_POINTS[cleared] * s.level;
  const level = 1 + Math.floor(lines / 10);
  const [after, bag] = draw(s.bag, rand);
  const piece = spawn(s.next, s.cols);
  const out: Blocks = { ...s, board: nextBoard, piece, next: after, bag, lines, score, level };
  if (!fits(out, piece)) out.status = "over";
  return out;
}

/** Gravity: fall one row, or lock if resting (the resting interval is the grace). */
export function tick(s: Blocks, rand: () => number = Math.random): Blocks {
  if (s.status !== "playing") return s;
  const p = { ...s.piece, y: s.piece.y + 1 };
  return fits(s, p) ? { ...s, piece: p } : lock(s, rand);
}

/** "Down" button: one row faster, +1 point; locks only if already resting. */
export function softDrop(s: Blocks, rand: () => number = Math.random): Blocks {
  if (s.status !== "playing") return s;
  const p = { ...s.piece, y: s.piece.y + 1 };
  return fits(s, p) ? { ...s, piece: p, score: s.score + 1 } : lock(s, rand);
}

/** "Drop" button: straight to the bottom and lock, +2 points per row. */
export function hardDrop(s: Blocks, rand: () => number = Math.random): Blocks {
  if (s.status !== "playing") return s;
  const p = landing(s);
  return lock({ ...s, piece: p, score: s.score + 2 * (p.y - s.piece.y) }, rand);
}

/** Fall interval for a level at a speed setting (ms). */
export function fallMs(level: number, base: number, floor: number): number {
  return Math.max(floor, Math.round(base * Math.pow(0.85, level - 1)));
}
