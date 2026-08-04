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

const LABELS = /^(?:講道題目|讲道题目|證道題目|证道题目|主題經文|主题经文|宣召經文|宣召经文|默想經文|默想经文|敬拜詩歌|敬拜诗歌|回應詩歌|回应诗歌)\s*[:：]?/;
const SONG_HEADING = /^為.*?(?:預備|预备).*?(?:詩歌|诗歌)/;
const SECTION = {
  title: /(?:^|\d{1,2}月\d{1,2}(?:日|號|号)?\s*)(?:講道題目|讲道题目|證道題目|证道题目)\s*[:：]?\s*/,
  theme: /^(?:主題經文|主题经文)\s*[:：]?\s*/,
  call: /^(?:宣召經文|宣召经文)\s*[:：]?\s*/,
  meditation: /^(?:默想經文|默想经文)\s*[:：]?\s*/,
  worship: /^(?:敬拜詩歌|敬拜诗歌)\s*[:：]?\s*/,
  response: /^(?:回應詩歌|回应诗歌)\s*[:：]?\s*/
};
const INLINE_BOUNDARY = "(?:講道題目|讲道题目|證道題目|证道题目|證道|证道|主題經文|主题经文|主題|主题|宣召經文|宣召经文|默想經文|默想经文|敬拜詩歌|敬拜诗歌|回應詩歌|回应诗歌)";

function isBoundary(line) { return LABELS.test(line) || SONG_HEADING.test(line); }
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
function normalizeBook(value) { return BOOKS[value.replace(/\s/g, "")] || value.trim(); }
function inlineValue(raw, labels) {
  const label = `(?:${labels.join("|")})`;
  const match = raw.match(new RegExp(`${label}\\s*[:：]\\s*([\\s\\S]*?)(?=\\s*${INLINE_BOUNDARY}\\s*[:：]|$)`, "i"));
  return match?.[1]?.trim() || "";
}
function removeReferenceNotes(value) {
  return value.replace(/[（(][^（）()]*\d+\s*[:：]\s*\d+[^（）()]*[）)]/g, "").trim();
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
  const formalTitle = sectionLines(raw, SECTION.title).join(" ");
  const compactTheme = inlineValue(raw, ["主題", "主题"]);
  const title = formalTitle || removeReferenceNotes(compactTheme);
  const worshipDirect = sectionLines(raw, SECTION.worship).join(" ") || inlineValue(raw, ["敬拜詩歌", "敬拜诗歌"]);
  const responseDirect = sectionLines(raw, SECTION.response).join(" ") || inlineValue(raw, ["回應詩歌", "回应诗歌"]);
  const songHeadingIndex = raw.replace(/\r/g, "").split("\n").findIndex((line) => SONG_HEADING.test(line.trim()));
  const songLines = songHeadingIndex < 0 ? [] : raw.replace(/\r/g, "").split("\n").slice(songHeadingIndex + 1).filter((line) => line.trim() && !isBoundary(line.trim()));
  const worshipSong = worshipDirect || cleanSong(songLines.find((line) => /[（(]\s*敬拜詩歌\s*[）)]/.test(line)) || "");
  const responseSong = responseDirect || cleanSong(songLines.find((line) => /[（(]\s*(?:回應詩歌|回应诗歌)\s*[）)]/.test(line)) || "");
  const date = raw.match(/(\d{1,2})\s*月\s*(\d{1,2})\s*(?:日|號|号)?/) || raw.match(/\d{4}\s*[/-]\s*(\d{1,2})\s*[/-]\s*(\d{1,2})/) || [];
  const callSource = sectionLines(raw, SECTION.call).join("\n") || inlineValue(raw, ["宣召經文", "宣召经文"]);
  const meditationSource = sectionLines(raw, SECTION.meditation).join("\n") || inlineValue(raw, ["默想經文", "默想经文"]);
  const themeSource = sectionLines(raw, SECTION.theme).join("\n") || compactTheme;
  const callScripture = normalizeScripture(callSource);
  const parsed = {
    date: date[1] ? `${Number(date[1])}月${Number(date[2])}日` : "",
    sermonTitle: title,
    themeScripture: normalizeScripture(themeSource, true),
    callToWorship: callScripture,
    callScripture,
    meditationScripture: normalizeScripture(meditationSource),
    worshipSong, responseSong
  };
  return parsed;
}

export function buildOutput(fields) {
  return `WVBC國語崇拜（${fields.date || "X月X日"}上午11:45）
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
[主題经文]：${fields.themeScripture}
[證道題目]：${fields.sermonTitle}
主講：曾昶牧師
[默想經文]：${fields.meditationScripture}
[回應詩歌]：${fields.responseSong ? `《${fields.responseSong}》` : ""}

四、以關懷相交敬拜神
歡迎來賓、彼此問安、報告及代禱

五、以領受祝福敬拜神
牧師祝福`;
}
