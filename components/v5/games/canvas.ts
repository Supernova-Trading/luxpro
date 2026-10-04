// Shared bits for the canvas games (Snake, Blocks).

// Canvas can't read CSS variables, and an old Chrome can't parse oklch():
// resolve each token through the browser and fall back to plain hex.
export function resolveColor(host: HTMLElement, token: string, fallback: string): string {
  const probe = document.createElement("span");
  probe.style.color = `var(${token})`;
  host.appendChild(probe);
  const css = getComputedStyle(probe).color;
  probe.remove();
  const ctx = document.createElement("canvas").getContext("2d");
  if (!ctx) return fallback;
  ctx.fillStyle = "#010203";
  ctx.fillStyle = css;
  return ctx.fillStyle === "#010203" ? fallback : (ctx.fillStyle as string);
}

/** Filled rounded rectangle (ctx.roundRect is too new for the old Tab A). */
export function rounded(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  ctx.fill();
}

/** Best score kept on the tablet; storage may be blocked, so never throw. */
export function readBest(key: string): number {
  try { return Number(localStorage.getItem(key)) || 0; } catch { return 0; }
}
export function saveBest(key: string, score: number): boolean {
  if (score <= readBest(key)) return false;
  try { localStorage.setItem(key, String(score)); } catch { /* fine */ }
  return true;
}

/** Size the canvas backing store for the screen's pixel density. */
export function prepare(cv: HTMLCanvasElement, w: number, h: number): CanvasRenderingContext2D | null {
  const ctx = cv.getContext("2d");
  if (!ctx) return null;
  const dpr = window.devicePixelRatio || 1;
  if (cv.width !== Math.round(w * dpr) || cv.height !== Math.round(h * dpr)) {
    cv.width = Math.round(w * dpr);
    cv.height = Math.round(h * dpr);
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);
  return ctx;
}
