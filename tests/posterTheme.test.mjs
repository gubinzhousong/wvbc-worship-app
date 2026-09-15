import test from "node:test";
import assert from "node:assert/strict";
import { getPosterTheme, easterDate } from "../src/posterTheme.js";
import { parseRawText, buildOutput } from "../src/serviceParser.js";
import { readPosterData } from "../src/poster.js";

test("December 6 sermon input selects Advent through the announcement pipeline", () => {
  for (const date of ["12月6号", "12月6日", "十二月六日"]) {
    const output = buildOutput(parseRawText(`${date}講道題目：盼望`));
    const theme = getPosterTheme(readPosterData(output).schedule, 2026);
    assert.equal(theme.id, "advent", date);
    assert.equal(theme.ink, "#40315e");
  }
});

test("Gregorian Easter handles different years", () => {
  for (const [year, date] of [[2024, "2024-03-31"], [2025, "2025-04-20"], [2026, "2026-04-05"], [2027, "2027-03-28"], [2038, "2038-04-25"]]) {
    assert.equal(new Date(easterDate(year)).toISOString().slice(0, 10), date);
  }
});

test("church season boundaries include cross-year Christmas", () => {
  for (const [date, id] of [["1月5日", "christmas"], ["1月6日", "ordinary"], ["2月17日", "ordinary"], ["2月18日", "lent"], ["4月4日", "lent"], ["4月5日", "easter"], ["5月23日", "easter"], ["5月24日", "pentecost"], ["5月25日", "ordinary"], ["11月28日", "ordinary"], ["11月29日", "advent"], ["12月24日", "advent"], ["12月25日", "christmas"]]) {
    assert.equal(getPosterTheme(date, 2026).id, id, date);
  }
});

test("explicit year wins; Chinese and ISO dates work", () => {
  assert.equal(getPosterTheme("2027年四月五日上午11:45", 2026).year, 2027);
  assert.equal(getPosterTheme("2027-03-28 上午11:45", 2026).id, "easter");
  assert.equal(getPosterTheme("3月28日", 2026).id, "lent");
  assert.equal(getPosterTheme("3月28日", 2027).id, "easter");
});

test("invalid dates do not silently select a theme", () => {
  for (const date of ["X月X日", "2月30日", "13月1日", "0月1日", "2026年2月29日"]) {
    assert.throws(() => getPosterTheme(date, 2026));
  }
  assert.throws(() => getPosterTheme("4月5日", 0));
  assert.doesNotThrow(() => getPosterTheme("2024年2月29日"));
});
