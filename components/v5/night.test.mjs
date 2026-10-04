// Run: node --test "components/v5/*.test.mjs"
import { test } from "node:test";
import assert from "node:assert/strict";
import { isDark, nightFor } from "./night.ts";

const at = (m, h, min = 0) => new Date(2026, m, 15, h, min);

test("winter afternoon gets dark early", () => {
  assert.equal(isDark(at(11, 15, 0)), false);  // Dec 3pm
  assert.equal(isDark(at(11, 16, 30)), true);  // Dec 4:30pm
});

test("summer evening stays light late", () => {
  assert.equal(isDark(at(5, 20, 30)), false);  // Jun 8:30pm
  assert.equal(isDark(at(5, 21, 30)), true);   // Jun 9:30pm
});

test("before sunrise is dark, after is light", () => {
  assert.equal(isDark(at(0, 7, 30)), true);    // Jan 7:30am
  assert.equal(isDark(at(0, 8, 30)), false);   // Jan 8:30am
});

test("dims 20 minutes before sunset", () => {
  assert.equal(isDark(at(9, 17, 45)), false);  // Oct, sunset ~18:12
  assert.equal(isDark(at(9, 17, 55)), true);
});

test("on and off override the clock", () => {
  assert.equal(nightFor("on", at(5, 12)), true);
  assert.equal(nightFor("off", at(11, 23)), false);
  assert.equal(nightFor("auto", at(11, 23)), true);
});
