import { WM_PIN, WM_RATIO, WM_VIEWBOX, WM_WORD } from "./wordmarkPaths";

// The LuxPro wordmark (v5.38, brand option A "Coachline", owner 2026-10-06):
// the name set wide, a gold pinstripe beneath, like the hand-painted line on a
// coachbuilt car (awesome-design-md bugatti/DESIGN.md:207, the wordmark is the
// brand). `draw` lets the stripe draw itself in on Welcome and Farewell — the
// app's one signature moment (impeccable reference/delight.md:11).
export default function Wordmark({ width = 132, draw = false }: { width?: number; draw?: boolean }) {
  return (
    <svg className="v5-wm" viewBox={WM_VIEWBOX} width={width} height={Math.round(width * WM_RATIO * 10) / 10} role="img" aria-label="LuxPro">
      <path d={WM_WORD} fill="currentColor" />
      <path d={WM_PIN} fill="var(--gold)" className={draw ? "v5-wm-pin v5-wm-draw" : "v5-wm-pin"} />
    </svg>
  );
}
