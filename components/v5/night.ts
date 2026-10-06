// Night mode timing (roadmap P6: dimmer after sunset). The car works around
// London, so a month-by-month table of local sunrise and sunset (UK clock,
// summer time included) is accurate to well within half an hour — no
// location permission and no network needed.
// Run tests: node --test "components/v5/*.test.mjs"

export type NightMode = "auto" | "on" | "off";

// [sunrise, sunset] in local hours for the middle of each month, London.
const SUN: [number, number][] = [
  [8.0, 16.3],   // Jan
  [7.3, 17.25],  // Feb
  [6.25, 18.1],  // Mar
  [6.25, 19.9],  // Apr (BST)
  [5.25, 20.75], // May
  [4.75, 21.35], // Jun
  [5.1, 21.15],  // Jul
  [5.85, 20.35], // Aug
  [6.65, 19.25], // Sep
  [7.45, 18.2],  // Oct
  [7.2, 16.25],  // Nov
  [7.95, 15.9],  // Dec
];

/** Dark outside? Dims from 20 minutes before sunset until sunrise. */
export function isDark(d: Date): boolean {
  const [rise, set] = SUN[d.getMonth()];
  const h = d.getHours() + d.getMinutes() / 60;
  return h < rise || h >= set - 1 / 3;
}

export function nightFor(mode: NightMode, d: Date): boolean {
  return mode === "on" || (mode === "auto" && isDark(d));
}
