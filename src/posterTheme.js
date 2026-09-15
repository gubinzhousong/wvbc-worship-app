import { chineseNumberToInteger } from "./serviceParser.js";

const palettes = {
  ordinary: ["常年期 · 教会深蓝色", "#07285c", "#d89a16", "#fffdf5", "#102f50", "#0c2c4f"],
  lent: ["预苦期 · 紫色", "#503064", "#b59951", "#fcf9fd", "#58396d", "#3d254f"],
  advent: ["将临期 · 紫色", "#40315e", "#b79a50", "#faf9fd", "#4b3a70", "#302445"],
  easter: ["复活期 · 金色", "#654b18", "#b0882e", "#fffdf5", "#70551f", "#503b15"],
  pentecost: ["圣灵降临节 · 红色", "#782b2b", "#be9442", "#fffaf6", "#873333", "#5c2020"],
  christmas: ["圣诞期 · 红金色", "#702b35", "#bd963f", "#fffdf5", "#7b303c", "#54202a"],
  thanksgiving: ["感恩节主题 · 枫叶红", "#792e25", "#cb943f", "#fffaf2", "#c44732", "#a83227"],
};
const DAY = 86400000;

// Gregorian Easter (Meeus/Jones/Butcher); UTC dates avoid DST boundary shifts.
export function easterDate(year) {
  const a = year % 19, b = Math.floor(year / 100), c = year % 100;
  const d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4), k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const n = h + l - 7 * m + 114;
  return Date.UTC(year, Math.floor(n / 31) - 1, n % 31 + 1);
}

export function getPosterTheme(schedule, fallbackYear = new Date().getFullYear()) {
  const chinese = schedule.match(/(?:(\d{4})\s*年\s*)?([\d一二三四五六七八九十]+)\s*月\s*([\d一二三四五六七八九十]+)\s*[日号號]/);
  const numeric = schedule.match(/(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  const match = chinese || numeric;
  if (!match) throw new Error("请在通知首行填写有效聚会日期（例如 2026年4月5日）。");
  const year = match[1] ? Number(match[1]) : Number(fallbackYear);
  const month = chineseNumberToInteger(match[2]), day = chineseNumberToInteger(match[3]);
  const date = Date.UTC(year, month - 1, day);
  const check = new Date(date);
  if (!Number.isInteger(year) || year < 1583 || year > 9999 || check.getUTCMonth() !== month - 1 || check.getUTCDate() !== day) {
    throw new Error("请填写有效聚会日期和年份（1583–9999）。");
  }
  const easter = easterDate(year);
  const christmas = Date.UTC(year, 11, 25);
  const adventAnchor = Date.UTC(year, 10, 27);
  const advent = adventAnchor + ((7 - new Date(adventAnchor).getUTCDay()) % 7) * DAY;
  let id = "ordinary";
  if (date >= christmas || (month === 1 && day <= 5)) id = "christmas";
  else if (date >= advent) id = "advent";
  else if (month === 10) id = "thanksgiving";
  else if (date === easter + 49 * DAY) id = "pentecost";
  else if (date >= easter && date < easter + 49 * DAY) id = "easter";
  else if (date >= easter - 46 * DAY && date < easter) id = "lent";
  const [label, ink, accent, background, railStart, railEnd] = palettes[id];
  return { id, label, year, ink, accent, background, railStart, railEnd, number: id === "ordinary" ? "#f1c557" : "#ffe3a0" };
}
