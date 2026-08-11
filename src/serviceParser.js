const BOOKS = {
  創: "創世記", 创: "創世記", 創世記: "創世記", 创世记: "創世記",
  出: "出埃及記", 出埃及記: "出埃及記", 出埃及记: "出埃及記",
  利: "利未記", 利未記: "利未記", 利未记: "利未記", 民: "民數記", 民數記: "民數記", 民数记: "民數記",
  申: "申命記", 申命記: "申命記", 申命记: "申命記", 書: "約書亞記", 书: "約書亞記", 約書亞: "約書亞記", 约书亚: "約書亞記",
  士: "士師記", 士師記: "士師記", 士师记: "士師記", 得: "路得記", 路得記: "路得記",
  撒上: "撒母耳記上", 撒下: "撒母耳記下", 王上: "列王紀上", 王下: "列王紀下", 代上: "歷代志上", 代下: "歷代志下",
  拉: "以斯拉記", 尼: "尼希米記", 斯: "以斯帖記", 伯: "約伯記", 詩: "詩篇", 诗: "詩篇", 詩篇: "詩篇", 诗篇: "詩篇",
  箴: "箴言", 傳: "傳道書", 传: "傳道書", 歌: "雅歌", 賽: "以賽亞書", 赛: "以賽亞書", 耶: "耶利米書", 哀: "耶利米哀歌",
  結: "以西結書", 结: "以西結書", 但: "但以理書", 何: "何西阿書", 珥: "約珥書", 摩: "阿摩司書", 俄: "俄巴底亞書",
  拿: "約拿書", 彌: "彌迦書", 哈: "哈巴谷書", 番: "西番雅書", 該: "哈該書", 该: "哈該書", 亞: "撒迦利亞書", 亚: "撒迦利亞書", 瑪: "瑪拉基書", 玛: "瑪拉基書",
  太: "馬太福音", 马太: "馬太福音", 馬太: "馬太福音", 馬太福音: "馬太福音", 马太福音: "馬太福音",
  可: "馬可福音", 馬可: "馬可福音", 马可: "馬可福音", 馬可福音: "馬可福音", 马可福音: "馬可福音",
  路: "路加福音", 路加: "路加福音", 路加福音: "路加福音", 約: "約翰福音", 约: "約翰福音", 約翰: "約翰福音", 约翰: "約翰福音", 約翰福音: "約翰福音", 约翰福音: "約翰福音",
  徒: "使徒行傳", 使徒: "使徒行傳", 羅: "羅馬書", 罗: "羅馬書", 林前: "哥林多前書", 林後: "哥林多後書", 林后: "哥林多後書",
  加: "加拉太書", 弗: "以弗所書", 腓: "腓立比書", 西: "歌羅西書", 帖前: "帖撒羅尼迦前書", 帖後: "帖撒羅尼迦後書", 帖后: "帖撒羅尼迦後書",
  提前: "提摩太前書", 提後: "提摩太後書", 提后: "提摩太後書", 多: "提多書", 門: "腓利門書", 门: "腓利門書", 來: "希伯來書", 来: "希伯來書",
  雅: "雅各書", 彼前: "彼得前書", 彼後: "彼得後書", 彼后: "彼得後書", 約一: "約翰一書", 约一: "約翰一書", 約二: "約翰二書", 约二: "約翰二書", 約三: "約翰三書", 约三: "約翰三書", 猶: "猶大書", 犹: "猶大書", 啟: "啟示錄", 启: "啟示錄"
};

const LABELS = /^(?:講道題目|讲道题目|證道題目|证道题目|主題經文|主题经文|宣召經文|宣召经文|默想經文|默想经文|敬拜詩歌|敬拜诗歌|回應詩歌|回应诗歌|講員|讲员|主講|主讲)\s*[:：]?/;
const SONG_HEADING = /(?:[詩诗]歌(?:建議|建议)?如下|[選选][詩诗]如下|敬拜(?:及|和)回[應应][詩诗]歌|為.*?(?:本週|本周|主日).*?(?:預備|预备)[詩诗]歌(?:兩首|两首)?)/;
const SECTION = {
  title: /(?:^|\d{1,2}月\d{1,2}(?:日|號|号)?\s*)(?:講道題目|讲道题目|證道題目|证道题目)\s*[:：]?\s*/,
  theme: /^(?:主題經文|主题经文)\s*[:：]?\s*/,
  call: /^(?:宣召經文|宣召经文)\s*[:：]?\s*/,
  meditation: /^(?:默想經文|默想经文)\s*[:：]?\s*/,
  worship: /^(?:敬拜詩歌|敬拜诗歌)\s*[:：]?\s*/,
  response: /^(?:回應詩歌|回应诗歌)\s*[:：]?\s*/
};
const INLINE_BOUNDARY = "(?:講道題目|讲道题目|證道題目|证道题目|證道|证道|主題經文|主题经文|主題|主题|宣召經文|宣召经文|默想經文|默想经文|敬拜詩歌|敬拜诗歌|回應詩歌|回应诗歌|講員|讲员|主講|主讲)";
const DATE_WITH_TITLE = /^(?:(?:[一二三四五六七八九十]{1,3}|\d{1,2})\s*月\s*(?:[一二三四五六七八九十]{1,3}|\d{1,2})\s*(?:日|號|号)\s*)?(?:講道題目|讲道题目|證道題目|证道题目)\s*[:：]/;

const SIMPLIFIED_TO_TRADITIONAL = {
  讲: "講", 题: "題", 经: "經", 诗: "詩", 应: "應", 愿: "願", 宝: "寶", 贵: "貴", 祷: "禱", 马: "馬", 罗: "羅",
  书: "書", 约: "約", 传: "傳", 师: "師", 员: "員", 国: "國", 语: "語", 发: "發", 现: "現", 这: "這", 个: "個",
  为: "為", 与: "與", 关: "關", 怀: "懷", 欢: "歡", 来: "來", 宾: "賓", 报: "報", 领: "領", 临: "臨", 终: "終",
  无: "無", 稣: "穌", 样: "樣", 爱: "愛", 顾: "顧", 数: "數", 圣: "聖", 旧: "舊", 灵: "靈", 义: "義", 里: "裏",
  后: "後", 会: "會", 众: "眾", 复: "復", 兴: "興", 门: "門", 开: "開", 启: "啟", 录: "錄", 创: "創", 记: "記",
  历: "歷", 该: "該", 亚: "亞", 玛: "瑪", 仪: "儀", 赞: "讚", 听: "聽", 园: "園", 证: "證", 预: "預", 备: "備",
  见: "見", 觉: "覺", 进: "進", 过: "過", 处: "處", 东: "東", 长: "長", 总: "總", 让: "讓", 从: "從", 将: "將",
  话: "話", 实: "實", 华: "華", 荣: "榮", 属: "屬", 献: "獻", 称: "稱", 颂: "頌", 纪: "紀", 选: "選"
};

export function toTraditional(text = "") {
  return [...String(text)].map((character) => SIMPLIFIED_TO_TRADITIONAL[character] || character).join("").replaceAll("儞", "祢");
}

export function chineseNumberToInteger(value) {
  if (/^\d+$/.test(value)) return Number(value);
  if (!/^[一二三四五六七八九十]+$/.test(value)) return NaN;
  const digits = { 一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9 };
  if (value === "十") return 10;
  const parts = value.split("十");
  if (parts.length > 2) return NaN;
  if (parts.length === 1) return digits[value] || NaN;
  const tens = parts[0] ? digits[parts[0]] : 1;
  const ones = parts[1] ? digits[parts[1]] : 0;
  return tens && Number.isInteger(ones) ? tens * 10 + ones : NaN;
}

function extractServiceDate(raw) {
  const chineseOrArabic = "[一二三四五六七八九十]{1,3}|\\d{1,2}";
  const match = raw.match(new RegExp(`(${chineseOrArabic})\\s*月\\s*(${chineseOrArabic})\\s*(?:日|號|号)`));
  if (match) {
    const month = chineseNumberToInteger(match[1]);
    const day = chineseNumberToInteger(match[2]);
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) return `${month}月${day}日`;
    return "";
  }
  const numeric = raw.match(/\d{4}\s*[/-]\s*(\d{1,2})\s*[/-]\s*(\d{1,2})/);
  if (!numeric) return "";
  const month = Number(numeric[1]);
  const day = Number(numeric[2]);
  return month >= 1 && month <= 12 && day >= 1 && day <= 31 ? `${month}月${day}日` : "";
}

function cleanTitleValue(text) {
  const value = text.trim();
  const trailingAside = value.match(/^(.+?)[，,；;]\s*[^，,；;]+[！!]$/);
  return (trailingAside?.[1] || value).trim();
}

function extractSermonTitle(raw) {
  const lines = raw.replace(/\r/g, "").split("\n");
  const titleLabel = /(?:講道題目|讲道题目|證道題目|证道题目)\s*[:：]/;
  const nextField = /^(?:主題經文|主题经文|宣召經文|宣召经文|默想經文|默想经文|敬拜詩歌|敬拜诗歌|回應詩歌|回应诗歌)\s*[:：]/;
  const start = lines.findIndex((line) => titleLabel.test(line));
  if (start === -1) return "";

  const labelMatch = lines[start].match(titleLabel);
  const initial = lines[start].slice(labelMatch.index + labelMatch[0].length).trim();
  const titleLines = initial ? [initial] : [];
  for (let index = start + 1; index < lines.length; index += 1) {
    const line = lines[index].trim();
    if (nextField.test(line)) break;
    if (!line) continue;
    titleLines.push(line);
  }
  return titleLines.join(" ");
}

function isBoundary(line) { return LABELS.test(line) || DATE_WITH_TITLE.test(line) || SONG_HEADING.test(line); }
function sectionLines(raw, marker) {
  const lines = raw.replace(/\r/g, "").split("\n");
  const start = lines.findIndex((line) => marker.test(line.trim()));
  if (start === -1) return [];
  const initial = lines[start].trim().replace(marker, "").trim();
  const result = initial ? [initial] : [];
  for (let i = start + 1; i < lines.length; i += 1) {
    const line = lines[i].trim();
    if (isBoundary(line)) break;
    if (line) result.push(line);
  }
  return result;
}
function cleanSong(text) { return text.replace(/^\s*\d+\s*[.)、】【）]\s*/, "").replace(/[（(]\s*(?:敬拜詩歌|敬拜诗歌|回應詩歌|回应诗歌)\s*[）)]/g, "").trim(); }
function directSongValue(raw, labels, allowShortAliases = false) {
  const effectiveLabels = allowShortAliases ? [...labels, labels[0].startsWith("敬拜") ? "敬拜" : "回應", ...(labels[0].startsWith("回") ? ["回应"] : [])] : labels;
  const labelPattern = new RegExp(`(?:${effectiveLabels.join("|")})\\s*[:：]`, "i");
  const match = raw.match(labelPattern);
  if (!match) return "";
  const remainder = raw.slice(match.index + match[0].length);
  const [labelLine = "", ...followingLines] = remainder.replace(/\r/g, "").split("\n");
  const shortBoundary = allowShortAliases ? "|敬拜|回應|回应" : "";
  const sameLine = labelLine.split(new RegExp(`\\s+(?=(?:${INLINE_BOUNDARY}${shortBoundary})\\s*[:：])`), 1)[0].trim();
  if (sameLine) {
    const continuation = [];
    for (const candidate of followingLines) {
      if (!/^\s+\S/.test(candidate)) break;
      const line = candidate.trim();
      if (isBoundary(line) || (allowShortAliases && /^(?:敬拜|回應|回应)\s*[:：]/.test(line)) || extractServiceDate(line)) break;
      continuation.push(line);
    }
    return cleanExtractedSong(`${sameLine}${continuation.join("")}`);
  }
  for (const candidate of followingLines) {
    const line = candidate.trim();
    if (!line) continue;
    if (isBoundary(line) || (allowShortAliases && /^(?:敬拜|回應|回应)\s*[:：]/.test(line)) || extractServiceDate(line)) return "";
    return cleanExtractedSong(line);
  }
  return "";
}

function cleanExtractedSong(text) {
  const traditional = toTraditional(text).trim();
  const quoted = traditional.match(/[「『《“"]([\s\S]*?)[」』》”"]/);
  if (quoted) return quoted[1].trim();
  return traditional
    .replace(/^\s*[１２12]\s*[.．、)）]\s*/, "")
    .split(/\r?\n/, 1)[0]
    .split(/[\/／]/, 1)[0]
    .replace(/[【\[（(]\s*(?:敬拜詩歌|回應詩歌)\s*[】\]）)]/g, "")
    .trim();
}

function numberedSongs(raw) {
  const heading = raw.match(SONG_HEADING);
  if (!heading) return [];
  const section = raw.slice(heading.index + heading[0].length);
  const matches = [...section.matchAll(/(?:^|\s)([１２12])\s*[.．、)）]\s*([\s\S]*?)(?=(?:\s+[１２12]\s*[.．、)）])|(?:\s+(?:講道題目|讲道题目|證道題目|证道题目|主題經文|主题经文|宣召經文|宣召经文|默想經文|默想经文|敬拜詩歌|敬拜诗歌|回應詩歌|回应诗歌)\s*[:：])|$)/g)];
  const numbered = matches.map((match) => ({
    number: match[1] === "１" ? 1 : match[1] === "２" ? 2 : Number(match[1]),
    name: cleanExtractedSong(match[2]),
    role: /[【\[（(]\s*回[應应][詩诗]歌/.test(match[2]) ? "response" : /[【\[（(]\s*敬拜[詩诗]歌/.test(match[2]) ? "worship" : ""
  })).filter((item) => item.name).slice(0, 2);
  if (numbered.length) return numbered;

  const quoted = [...section.matchAll(/[「『《“"]([\s\S]*?)[」』》”"]/g)].slice(0, 2);
  return quoted.map((match, index) => ({
    number: index + 1,
    name: toTraditional(match[1].trim()),
    role: /回[應应][詩诗]歌/.test(match[0]) ? "response" : /敬拜[詩诗]歌/.test(match[0]) ? "worship" : ""
  }));
}

function withoutNumberedSongItems(raw) {
  const heading = raw.match(SONG_HEADING);
  if (!heading) return raw;
  const sectionStart = heading.index;
  const remainder = raw.slice(sectionStart + heading[0].length);
  const nextWhitelistedField = remainder.match(/(?:講道題目|讲道题目|證道題目|证道题目|主題經文|主题经文|宣召經文|宣召经文|默想經文|默想经文)\s*[:：]/);
  const sectionEnd = nextWhitelistedField ? sectionStart + heading[0].length + nextWhitelistedField.index : raw.length;
  return `${raw.slice(0, sectionStart)} ${raw.slice(sectionEnd)}`;
}

function normalizeBook(value) { return BOOKS[value.replace(/\s/g, "")] || value.trim(); }
function inlineValue(raw, labels) {
  const label = `(?:${labels.join("|")})`;
  const match = raw.match(new RegExp(`${label}\\s*[:：]\\s*([\\s\\S]*?)(?=\\s*${INLINE_BOUNDARY}\\s*[:：]|$)`, "i"));
  return match?.[1]?.trim() || "";
}
function removeReferenceNotes(value) {
  return value.replace(/[（(][^（）()]*\d+\s*[:：]\s*\d+[^（）()]*[）)]/g, "").trim();
}

function whitelistedScriptureSource(value) {
  return value.replace(/\r/g, "").split("\n").filter((line) =>
    /^\s*[【\[]?\s*[\u3400-\u9fff]{1,8}\s*\d+\s*[:：]\s*\d+/.test(line)
  ).join("\n");
}

export function normalizeScripture(text, preserveNote = false) {
  const references = [...text.matchAll(/[【\[]?\s*([\u3400-\u9fff]{1,8})\s*(\d+)\s*[:：]\s*(\d+)(?:\s*[—–-]\s*(\d+))?\s*[】\]]?/g)]
    .map((match) => ({ book: normalizeBook(match[1]), chapter: Number(match[2]), verse: Number(match[3]), end: match[4] ? Number(match[4]) : Number(match[3]), dash: match[0].includes("–") ? "–" : "-" }));
  if (!references.length) return "";
  const bookGroups = [];
  for (const reference of references) {
    let group = bookGroups.at(-1);
    if (!group || group.book !== reference.book) { group = { book: reference.book, refs: [] }; bookGroups.push(group); }
    group.refs.push(reference);
  }
  const output = bookGroups.map(({ book, refs }) => {
    const chapterParts = [];
    for (let index = 0; index < refs.length;) {
      const chapter = refs[index].chapter;
      const verses = [];
      while (index < refs.length && refs[index].chapter === chapter) verses.push(refs[index++]);
      const compact = [];
      for (let j = 0; j < verses.length;) {
        const start = verses[j]; let end = start.end; j += 1;
        while (j < verses.length && verses[j].verse === end + 1) { end = verses[j].end; j += 1; }
        compact.push(end === start.verse ? `${start.verse}` : `${start.verse}${preserveNote ? start.dash : "-"}${end}`);
      }
      chapterParts.push(`${chapter}:${compact.join("、")}`);
    }
    return `${book}${chapterParts.join("、")}`;
  }).join("、");
  if (!preserveNote) return output;
  const note = text.match(/[（(]\s*([^（）()]+?)\s*[）)]/)?.[1]?.trim();
  if (note && /\d+\s*[:：]\s*\d+/.test(note)) return output;
  return note ? `${output}（${note}）` : output;
}

export function parseRawText(raw) {
  const fieldText = withoutNumberedSongItems(raw);
  const formalTitle = extractSermonTitle(fieldText);
  const compactTheme = inlineValue(fieldText, ["主題", "主题"]);
  const title = formalTitle || removeReferenceNotes(compactTheme);
  const hasSongContext = SONG_HEADING.test(raw);
  const worshipDirect = directSongValue(raw, ["敬拜詩歌", "敬拜诗歌"], hasSongContext);
  const responseDirect = directSongValue(raw, ["回應詩歌", "回应诗歌"], hasSongContext);
  const songHeadingIndex = raw.replace(/\r/g, "").split("\n").findIndex((line) => SONG_HEADING.test(line.trim()));
  const songLines = songHeadingIndex < 0 ? [] : raw.replace(/\r/g, "").split("\n").slice(songHeadingIndex + 1).filter((line) => line.trim() && !isBoundary(line.trim()));
  const numbered = numberedSongs(raw);
  const worshipSong = worshipDirect || numbered.find((item) => item.role === "worship")?.name || numbered.find((item) => item.number === 1 && item.role !== "response")?.name || cleanSong(songLines.find((line) => /[（(]\s*敬拜詩歌\s*[）)]/.test(line)) || "");
  const responseSong = responseDirect || numbered.find((item) => item.role === "response")?.name || numbered.find((item) => item.number === 2 && item.role !== "worship")?.name || cleanSong(songLines.find((line) => /[（(]\s*(?:回應詩歌|回应诗歌)\s*[）)]/.test(line)) || "");
  const callSource = sectionLines(fieldText, SECTION.call).join("\n") || inlineValue(fieldText, ["宣召經文", "宣召经文"]);
  const meditationSource = sectionLines(fieldText, SECTION.meditation).join("\n") || inlineValue(fieldText, ["默想經文", "默想经文"]);
  const themeSource = sectionLines(fieldText, SECTION.theme).join("\n") || compactTheme;
  const compactThemeReference = compactTheme.match(/[（(]\s*([\u3400-\u9fff]{1,8}\s*\d+\s*[:：]\s*\d+(?:\s*[—–-]\s*\d+)?)\s*[）)]/)?.[1] || "";
  const whitelistedThemeSource = whitelistedScriptureSource(themeSource) || compactThemeReference;
  const callScripture = normalizeScripture(whitelistedScriptureSource(callSource));
  const parsed = {
    date: extractServiceDate(raw),
    sermonTitle: toTraditional(cleanTitleValue(title)),
    themeScripture: normalizeScripture(whitelistedThemeSource, true),
    callToWorship: callScripture,
    callScripture,
    meditationScripture: normalizeScripture(whitelistedScriptureSource(meditationSource)),
    worshipSong: toTraditional(worshipSong), responseSong: toTraditional(responseSong)
  };
  return parsed;
}

export function buildOutput(fields) {
  return toTraditional(`WVBC國語崇拜（${fields.date || "X月X日"}上午11:45）
地點：Fireside room

一、以等候宣告敬拜神
宣召經文：${fields.callToWorship}
[詩歌]：《要等候主》
[使徒信經]

二、以揚聲讚美敬拜神
[敬拜詩歌]：${fields.worshipSong ? `《${fields.worshipSong}》` : ""}
[禱告]
[主禱文]

三、以聆聽信息敬拜神
[主題經文]：${fields.themeScripture}
[證道題目]：${fields.sermonTitle}
主講：曾昶牧師
[默想經文]：${fields.meditationScripture}
[回應詩歌]：${fields.responseSong ? `《${fields.responseSong}》` : ""}

四、以關懷相交敬拜神
歡迎來賓、彼此問安、報告及代禱

五、以領受祝福敬拜神
牧師祝福`);
}
