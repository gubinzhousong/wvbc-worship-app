// The editable announcement is the source of truth, including manual corrections.
export function readPosterData(output) {
  const lines = output.replace(/\r/g, "").split("\n");
  const labels = {
    sermonTitle: /^(?:證道題目|证道题目|講道題目|讲道题目)$/,
    scripture: /^(?:主題經文|主题经文)$/,
    speaker: /^(?:主講|主讲|講員|讲员)$/,
    location: /^(?:地點|地点)$/,
    worshipSong: /^(?:敬拜詩歌|敬拜诗歌)$/,
    responseSong: /^(?:回應詩歌|回应诗歌)$/,
    call: /^(?:宣召經文|宣召经文)$/,
    meditation: /^(?:默想經文|默想经文)$/,
  };
  const data = { schedule: "", sermonTitle: "", details: [] };
  const values = {};
  let active = "";
  const notices = [];
  let inNotices = false;
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) { active = ""; continue; }
    if (/^WVBC\s*[國国][語语]崇拜/.test(line)) {
      data.schedule = line.replace(/^WVBC\s*[國国][語语]崇拜\s*/, "").replace(/^[（(]|[）)]$/g, "");
      active = "";
      continue;
    }
    if (/^[一二三四五六七八九十]+[、.．]/.test(line)) {
      inNotices = /關懷|关怀/.test(line);
      active = "";
      continue;
    }
    const match = line.match(/^\[?([^\]：:]+)\]?\s*[:：]\s*(.*)$/);
    const key = match && Object.keys(labels).find((key) => labels[key].test(match[1]));
    if (key) {
      active = key;
      values[key] = match[2];
    } else if (match || /^\[/.test(line)) {
      active = "";
      if (inNotices) notices.push(line);
    } else if (active) {
      values[active] += "\n" + line;
    } else if (inNotices) notices.push(line);
  }
  data.sermonTitle = values.sermonTitle || "";
  for (const [key, label] of [["scripture", "主題經文"], ["speaker", "講員"], ["location", "地點"], ["worshipSong", "敬拜詩歌"], ["responseSong", "回應詩歌"], ["call", "宣召經文"], ["meditation", "默想經文"]]) {
    if (values[key]?.trim()) data.details.push({ label, value: values[key].trim() });
  }
  if (notices.length) data.details.push({ label: "通知", value: notices.join("\n") });
  if (!data.sermonTitle || !data.schedule) throw new Error("请保留通知首行的日期时间，以及「證道題目：」内容后再生成 Poster。");
  return data;
}

export function wrapText(context, text, width) {
  const lines = [];
  for (const paragraph of text.split("\n")) {
    let remaining = paragraph;
    while (context.measureText(remaining).width > width) {
      const segments = typeof Intl.Segmenter === "function"
        ? [...new Intl.Segmenter("zh-Hant", { granularity: "word" }).segment(remaining)]
        : [...remaining.matchAll(/\S+\s*/g)].map((m) => ({ index: m.index, segment: m[0] }));
      const candidates = segments.map(({ index, segment }) => index + segment.length)
        .filter((end) => end < remaining.length && context.measureText(remaining.slice(0, end)).width <= width)
        .filter((end) => !/^[，。、；：！？）》】」』]/.test(remaining.slice(end).trimStart()) && !/[（《【「『]$/.test(remaining.slice(0, end).trimEnd()));
      const natural = candidates.filter((end) => /[，。、；：！？\s]$/.test(remaining.slice(0, end)));
      // Prefer phrase punctuation, then word boundaries. Never choose a fixed
      // character count; every candidate is measured with the actual canvas font.
      const useful = natural.filter((end) => context.measureText(remaining.slice(0, end)).width >= width * .5);
      let end = useful.at(-1) ?? candidates.at(-1);
      if (!end) {
        // An indivisible token is wider than the column: request an editorial
        // break rather than inventing one inside a name or phrase.
        throw new Error("此行过长且找不到自然断行位置，请在当前通知中手动换行后重新生成。");
      }
      lines.push(remaining.slice(0, end).trimEnd());
      remaining = remaining.slice(end).trimStart();
    }
    lines.push(remaining);
  }
  return lines;
}

export function referenceSermonLines(text) {
  // Editorial line break explicitly approved in the official PNG. It must also
  // survive the existing notice parser joining a multi-line input into one line.
  const reference = text.match(/^新約聖經中的禱告\s*[-－–]\s*5\s*司提反殉道時的臨終禱告$/);
  if (reference) return "新約聖經中的禱告 - 5\n司提反殉道時的臨終禱告";
  if (text.includes("\n")) return text;
  // The reference puts a numbered series heading above its subtitle.
  return text.replace(/^(.+?\s+[-－–]\s*\d+)\s+(.+)$/, "$1\n$2");
}

export async function createPoster(output) {
  const data = readPosterData(output);
  await document.fonts.ready;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("此浏览器无法生成图片，请使用支持 Canvas 的浏览器。");
  // Fixed layout measured from the supplied 1024 × 1536 official reference.
  const font = '"Times New Roman", "Noto Serif TC", "PMingLiU", "Songti TC", "SimSun", serif';
  const navy = "#07285c", gold = "#d89a16", cream = "#fffdf5";
  const width = 1024, cardX = 45, cardWidth = 936, railWidth = 113;
  const textX = 197, right = 953;
  const sections = [];
  let section;
  // Keep all five sections from the same current editable notification, including
  // prayers, creed and blessing. Remove only the announcement's square brackets.
  for (const raw of output.replace(/\r/g, "").split("\n")) {
    const line = raw.trim();
    const heading = line.match(/^([一二三四五])、\s*(.+)$/);
    if (heading) {
      section = { number: heading[1], title: heading[2], rows: [] };
      sections.push(section);
    } else if (section && line) {
      const clean = line.replace(/\[([^\]]+)\]/g, "$1");
      const sermon = clean.match(/^(?:證道題目|证道题目|講道題目|讲道题目)\s*[:：]\s*(.*)$/);
      if (sermon) section.rows.push({ text: sermon[1], sermon: true });
      else if (section.rows.at(-1)?.sermon && !/[:：]/.test(clean)) section.rows.at(-1).text += "\n" + clean;
      else section.rows.push({ text: clean.replace(/^詩歌\s*[:：]/, "詩歌："), sermon: false });
    }
  }
  if (sections.length !== 5) throw new Error("请保留当前通知的五个崇拜部分标题（一、至五、）后再生成 Poster。");
  const blocks = [];
  let y = 326;
  function measure(text, size, bold, available) {
    ctx.font = `${bold ? 700 : 400} ${size}px ${font}`;
    return wrapText(ctx, text, available);
  }
  for (const [index, item] of sections.entries()) {
    const title = measure(item.title, 44, true, right - textX);
    let localY = 18 + title.length * 62;
    const rows = [];
    for (const row of item.rows) {
      const indent = row.sermon ? 166 : 0;
      const lines = measure(row.sermon ? referenceSermonLines(row.text) : row.text, row.sermon ? 36 : 32, row.sermon, right - textX - indent);
      rows.push({ ...row, lines, indent, y: localY });
      localY += lines.length * (row.sermon ? 47 : 43);
    }
    const height = Math.max([213, 214, 368, 146, 144][index], localY + 4);
    blocks.push({ ...item, title, rows, y, height });
    y += height + 14;
  }
  const height = Math.max(1536, y - 14 + 70);
  if (height > 16000) throw new Error("通知内容过长，无法生成单张清晰海报，请精简当前通知后重试。");
  canvas.width = width; canvas.height = height;
  ctx.fillStyle = cream; ctx.fillRect(0, 0, width, height);
  ctx.textBaseline = "top";
  function drawText(text, x, y, size, bold = false, color = navy) {
    ctx.font = `${bold ? 700 : 400} ${size}px ${font}`;
    ctx.fillStyle = color; ctx.fillText(text, x, y);
    // Some system Ming fonts lack a bold face; retain the reference's strong
    // headings and sermon emphasis even when Canvas cannot synthesize that face.
    if (bold) {
      ctx.strokeStyle = color; ctx.lineWidth = size >= 60 ? 1.1 : 1.25;
      ctx.lineJoin = "round"; ctx.strokeText(text, x, y);
    }
  }
  function centered(text, y, size, bold = false) {
    ctx.font = `${bold ? 700 : 400} ${size}px ${font}`;
    drawText(text, (width - ctx.measureText(text).width) / 2, y, size, bold);
  }
  centered("WVBC國語崇拜", 40, 94, true);
  // The reference's gold divider, endpoint dots and central diamond flourish.
  ctx.strokeStyle = gold; ctx.fillStyle = gold; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(254, 166); ctx.lineTo(770, 166); ctx.stroke();
  for (const x of [254, 770]) { ctx.beginPath(); ctx.arc(x, 166, 5.5, 0, Math.PI * 2); ctx.fill(); }
  ctx.fillStyle = cream;
  for (const [x, halfW, halfH] of [[512, 24, 15], [512, 11, 9]]) {
    ctx.beginPath(); ctx.moveTo(x, 166 - halfH); ctx.quadraticCurveTo(x + 6, 161, x + halfW, 166);
    ctx.quadraticCurveTo(x + 6, 170, x, 166 + halfH); ctx.quadraticCurveTo(x - 6, 170, x - halfW, 166);
    ctx.quadraticCurveTo(x - 6, 161, x, 166 - halfH); ctx.fill(); ctx.stroke();
  }
  const schedule = data.schedule.replace(/(\d+日)\s*(上午|下午|晚上|早上)(.+)/, "$1（$2$3）");
  const location = data.details.find((item) => item.label === "地點")?.value || "";
  // Header text also wraps; move the cards down if weekly header content grows.
  const scheduleLines = measure(schedule, 46, true, 920);
  let headerY = 196;
  for (const line of scheduleLines) { centered(line, headerY, 46, true); headerY += 59; }
  if (location) {
    for (const line of measure("地點：" + location, 40, true, 920)) { centered(line, headerY, 40, true); headerY += 51; }
  }
  // Header capacity is checked before drawing cards to avoid silent overlaps.
  const headerExtra = Math.max(0, headerY + 20 - 326);
  if (headerExtra) {
    // Resize while preserving the already painted header.
    const header = ctx.getImageData(0, 0, width, Math.min(height, Math.ceil(headerY)));
    if (height + headerExtra > 16000) throw new Error("日期或地点内容过长，请精简后重试。");
    canvas.height = height + headerExtra;
    ctx.fillStyle = cream; ctx.fillRect(0, 0, width, canvas.height);
    ctx.putImageData(header, 0, 0); ctx.textBaseline = "top";
  }
  for (const block of blocks) {
    const top = block.y + headerExtra;
    ctx.save();
    ctx.beginPath(); ctx.roundRect(cardX, top, cardWidth, block.height, 13); ctx.clip();
    const rail = ctx.createLinearGradient(cardX, top, cardX + railWidth, top + block.height);
    rail.addColorStop(0, "#102f50"); rail.addColorStop(1, "#0c2c4f");
    ctx.fillStyle = rail; ctx.fillRect(cardX, top, railWidth, block.height);
    ctx.restore();
    ctx.strokeStyle = gold; ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.roundRect(cardX, top, cardWidth, block.height, 13); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cardX + railWidth, top); ctx.lineTo(cardX + railWidth, top + block.height); ctx.stroke();
    drawText(block.number, 71, top + 31, 64, false, "#f1c557");
    block.title.forEach((line, i) => drawText(line, textX, top + 18 + i * 62, 44, true));
    for (const row of block.rows) {
      if (row.sermon) drawText("證道題目：", textX, top + row.y, 32);
      row.lines.forEach((line, i) => drawText(line, textX + row.indent, top + row.y + i * (row.sermon ? 47 : 43), row.sermon ? 36 : 32, row.sermon));
    }
  }
  const blob = await new Promise((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("PNG 生成失败，请重试。")), "image/png"));
  const filename = `WVBC-主日崇拜-${data.schedule.replace(/[\\/:*?"<>|]/g, "-").slice(0, 70)}.png`;
  return { blob, filename };
}
