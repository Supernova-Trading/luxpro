// Mines — pure game rules, no React, so they can be tested on their own
// (node --test "components/v5/games/*.test.mjs"). Every move returns a new board.
// The first dig is always safe: mines are laid only after it, away from
// that square and its neighbours, so a passenger never loses on tap one.

export interface Cell { mine: boolean; open: boolean; flag: boolean; n: number }
export type MinesState = "ready" | "playing" | "won" | "lost";
export interface Board {
  rows: number;
  cols: number;
  mines: number;
  cells: Cell[];
  state: MinesState;
  hit: number; // the mine that ended the game, or -1
}

export function newBoard(rows: number, cols: number, mines: number): Board {
  const cells: Cell[] = Array.from({ length: rows * cols }, () => ({ mine: false, open: false, flag: false, n: 0 }));
  return { rows, cols, mines, cells, state: "ready", hit: -1 };
}

export function neighbours(b: Pick<Board, "rows" | "cols">, i: number): number[] {
  const r = Math.floor(i / b.cols), c = i % b.cols, out: number[] = [];
  for (let dr = -1; dr <= 1; dr++)
    for (let dc = -1; dc <= 1; dc++) {
      if (!dr && !dc) continue;
      const rr = r + dr, cc = c + dc;
      if (rr >= 0 && rr < b.rows && cc >= 0 && cc < b.cols) out.push(rr * b.cols + cc);
    }
  return out;
}

/** A board with mines at fixed squares, already playing (tests and replays). */
export function withMines(rows: number, cols: number, at: number[]): Board {
  const b = newBoard(rows, cols, at.length);
  for (const i of at) b.cells[i].mine = true;
  count(b);
  b.state = "playing";
  return b;
}

function count(b: Board) {
  b.cells.forEach((cell, i) => { cell.n = neighbours(b, i).filter((j) => b.cells[j].mine).length; });
}

function copy(b: Board): Board {
  return { ...b, cells: b.cells.map((c) => ({ ...c })) };
}

/** Lay mines anywhere except `safe` and its neighbours (fewer kept clear on tiny boards). */
export function placeMines(b: Board, safe: number, rand: () => number = Math.random): Board {
  const next = copy(b);
  const keep = new Set([safe, ...neighbours(b, safe)]);
  let pool = next.cells.map((_, i) => i).filter((i) => !keep.has(i));
  if (pool.length < next.mines) pool = next.cells.map((_, i) => i).filter((i) => i !== safe);
  for (let k = 0; k < next.mines && pool.length; k++) {
    const pick = Math.floor(rand() * pool.length);
    next.cells[pool[pick]].mine = true;
    pool.splice(pick, 1);
  }
  count(next);
  next.state = "playing";
  return next;
}

export function dig(b: Board, i: number, rand: () => number = Math.random): Board {
  if (b.state === "won" || b.state === "lost") return b;
  if (b.cells[i].open || b.cells[i].flag) return b;
  const next = b.state === "ready" ? placeMines(b, i, rand) : copy(b);

  if (next.cells[i].mine) {
    next.state = "lost";
    next.hit = i;
    next.cells.forEach((c) => { if (c.mine && !c.flag) c.open = true; });
    return next;
  }

  // Flood-fill open squares with no neighbouring mines (never through flags).
  const stack = [i];
  while (stack.length) {
    const j = stack.pop()!;
    const cell = next.cells[j];
    if (cell.open || cell.flag || cell.mine) continue;
    cell.open = true;
    if (cell.n === 0) stack.push(...neighbours(next, j));
  }

  if (next.cells.every((c) => c.mine || c.open)) {
    next.state = "won";
    next.cells.forEach((c) => { if (c.mine) c.flag = true; });
  }
  return next;
}

export function toggleFlag(b: Board, i: number): Board {
  if (b.state === "won" || b.state === "lost" || b.cells[i].open) return b;
  const next = copy(b);
  next.cells[i].flag = !next.cells[i].flag;
  return next;
}

export function flagsLeft(b: Board): number {
  return b.mines - b.cells.filter((c) => c.flag).length;
}
