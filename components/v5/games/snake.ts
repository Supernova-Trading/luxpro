// Snake — pure game rules, no React or canvas, so they can be tested on their
// own (node --test components/v5/games). Every move returns a new state.
// Car-friendly choices: the edges wrap round instead of ending the game, and
// up to two turns are queued so a quick double tap isn't lost between steps.

export type Dir = "up" | "down" | "left" | "right";
export type SnakeStatus = "ready" | "playing" | "over" | "won";
export interface Snake {
  cols: number;
  rows: number;
  body: number[]; // cell indices, head first
  dir: Dir;
  queue: Dir[];
  food: number;
  score: number;
  status: SnakeStatus;
}

const OPPOSITE: Record<Dir, Dir> = { up: "down", down: "up", left: "right", right: "left" };
const MAX_QUEUE = 2;

export function newSnake(cols: number, rows: number, rand: () => number = Math.random): Snake {
  const r = Math.floor(rows / 2), c = Math.floor(cols / 2);
  const body = [r * cols + c, r * cols + c - 1, r * cols + c - 2];
  const s: Snake = { cols, rows, body, dir: "right", queue: [], food: -1, score: 0, status: "ready" };
  s.food = placeFood(s, rand);
  return s;
}

/** A random empty square, or -1 when the snake fills the board. */
export function placeFood(s: Pick<Snake, "cols" | "rows" | "body">, rand: () => number = Math.random): number {
  const taken = new Set(s.body);
  const free: number[] = [];
  for (let i = 0; i < s.cols * s.rows; i++) if (!taken.has(i)) free.push(i);
  return free.length ? free[Math.floor(rand() * free.length)] : -1;
}

/** Queue a turn. Reversing into the neck is ignored; the first turn starts the game. */
export function turn(s: Snake, d: Dir): Snake {
  if (s.status === "over" || s.status === "won") return s;
  const last = s.queue.length ? s.queue[s.queue.length - 1] : s.dir;
  if (s.status === "ready") {
    // Starting: any direction except straight back into the body.
    if (d === OPPOSITE[s.dir]) return { ...s, status: "playing" };
    return { ...s, dir: d, queue: [], status: "playing" };
  }
  if (d === last || d === OPPOSITE[last] || s.queue.length >= MAX_QUEUE) return s;
  return { ...s, queue: [...s.queue, d] };
}

export function nextCell(s: Pick<Snake, "cols" | "rows">, from: number, d: Dir): number {
  let r = Math.floor(from / s.cols), c = from % s.cols;
  if (d === "up") r = (r - 1 + s.rows) % s.rows;
  if (d === "down") r = (r + 1) % s.rows;
  if (d === "left") c = (c - 1 + s.cols) % s.cols;
  if (d === "right") c = (c + 1) % s.cols;
  return r * s.cols + c;
}

/** One tick: move, eat, grow, or crash into itself. */
export function step(s: Snake, rand: () => number = Math.random): Snake {
  if (s.status !== "playing") return s;
  const [dir, ...queue] = s.queue.length ? s.queue : [s.dir];
  const head = nextCell(s, s.body[0], dir);
  const eats = head === s.food;
  // The tail moves away this tick unless the snake is growing.
  const body = eats ? s.body : s.body.slice(0, -1);
  if (body.includes(head)) return { ...s, dir, queue, status: "over" };
  const next: Snake = { ...s, dir, queue: s.queue.length ? queue : [], body: [head, ...body] };
  if (eats) {
    next.score = s.score + 1;
    next.food = placeFood(next, rand);
    if (next.food < 0) next.status = "won";
  }
  return next;
}
