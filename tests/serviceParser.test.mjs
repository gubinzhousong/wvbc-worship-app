import assert from "node:assert/strict";
import test from "node:test";
import { buildOutput, chineseNumberToInteger, parseRawText, toTraditional } from "../src/serviceParser.js";

const input = `7月12日講道題目：
新約聖經中的禱告 - 2
西面的臨終無憾之禱

主題經文：
路加福音2:28-32

宣召經文：
【詩25:4】耶和華啊，求你將你的道指示我，將你的路教訓我！
【詩25:5】求你以你的真理引導我，教訓我，因為你是救我的　神。我終日等候你。

默想經文：
【詩71:5】主－耶和華啊，你是我所盼望的；從我年幼，你是我所倚靠的。
【詩143:8】求你使我清晨得聽你慈愛之言，因我倚靠你；求你使我知道當行的路，因我的心仰望你。
【加5:5】我們靠著聖靈，憑著信心，等候所盼望的義。
【加5:18】但你們若被聖靈引導，就不在律法以下。

為7月12號中文主日崇拜預備詩歌兩首：
1）主我願像你（敬拜詩歌）
2）無人像耶穌這樣愛顧我（回應詩歌）`;

test("parses labeled pastoral source into the required announcement", () => {
  const fields = parseRawText(input);
  assert.equal(fields.date, "7月12日");
  assert.equal(fields.sermonTitle, "新約聖經中的禱告 - 2 西面的臨終無憾之禱");
  assert.equal(fields.callScripture, "詩篇25:4-5");
  assert.equal(fields.meditationScripture, "詩篇71:5、143:8、加拉太書5:5、18");
  assert.match(buildOutput(fields), /宣召經文：詩篇25:4-5/);
  assert.doesNotMatch(buildOutput(fields), /耶和華啊/);
});

const july26Input = `7月26日講道題目：
新約聖經中的禱告 - 3
主耶穌在客西馬尼園的禱告

主題經文：
馬太福音26:39–44(及平行經文）

宣召經文：
【詩40:6】祭物和禮物，你不喜悅；你已經開通我的耳朵。燔祭和贖罪祭非你所要。
【詩40:7】那時我說：看哪，我來了！我的事在經卷上已經記載了。
【詩40:8】我的　神啊，我樂意照你的旨意行；你的律法在我心裏。

默想經文：
【賽53:4】他誠然擔當我們的憂患，背負我們的痛苦。
【賽53:5】哪知他為我們的過犯受害，為我們的罪孽壓傷。
【賽53:7】他被欺壓，在受苦的時候卻不開口。
【來10:11】凡祭司天天站著事奉　神，屢次獻上一樣的祭物。
【來10:14】因為他一次獻祭，便叫那得以成聖的人永遠完全。

為7月26號中文主日崇拜預備詩歌兩首：
1）寶貴禱告良辰（敬拜詩歌）
2）願主旨意成全（回應詩歌）`;

test("parses the July 26 fixture and strips every verse body", () => {
  const fields = parseRawText(july26Input);
  assert.equal(fields.date, "7月26日");
  assert.equal(fields.sermonTitle, "新約聖經中的禱告 - 3 主耶穌在客西馬尼園的禱告");
  assert.equal(fields.themeScripture, "馬太福音26:39–44（及平行經文）");
  assert.equal(fields.callScripture, "詩篇40:6-8");
  assert.equal(fields.meditationScripture, "以賽亞書53:4-5、7、希伯來書10:11、14");
  assert.equal(fields.worshipSong, "寶貴禱告良辰");
  assert.equal(fields.responseSong, "願主旨意成全");
  const output = buildOutput(fields);
  assert.match(output, /宣召經文：詩篇40:6-8/);
  assert.doesNotMatch(output, /祭物和禮物|他誠然擔當/);
});

test("parses the simple data-flow diagnostic fixture", () => {
  const fields = parseRawText(`8月2日講道題目：
測試講道

主題經文：
約翰福音3:16

宣召經文：
【詩100:1】你們當向耶和華歡呼
【詩100:2】你們當樂意事奉耶和華

默想經文：
【詩23:1】耶和華是我的牧者
【詩23:2】他使我躺臥在青草地上

為8月2號中文主日崇拜預備詩歌兩首：
1）測試敬拜詩歌（敬拜詩歌）
2）測試回應詩歌（回應詩歌）`);
  assert.deepEqual(
    { date: fields.date, sermonTitle: fields.sermonTitle, themeScripture: fields.themeScripture, callScripture: fields.callScripture, meditationScripture: fields.meditationScripture, worshipSong: fields.worshipSong, responseSong: fields.responseSong },
    { date: "8月2日", sermonTitle: "測試講道", themeScripture: "約翰福音3:16", callScripture: "詩篇100:1-2", meditationScripture: "詩篇23:1-2", worshipSong: "測試敬拜詩歌", responseSong: "測試回應詩歌" }
  );
});

test("parses compact single-line pastoral source", () => {
  const fields = parseRawText("西溫浸信會中文崇拜2026/06/07 11:45am 證道:曾昶牧師主題:因著得到神憐憫而禱告-尼希米 (尼9:32-38) 宣召經文： 【詩106:47】耶和華－我們的　神啊，求你拯救我們。 【詩106:48】耶和華－以色列的　神是應當稱頌的。 默想經文： 【詩78:5】因為，他在雅各中立法度。 【詩78:6】使將要生的後代子孫可以曉得。 【詩78:7】好叫他們仰望　神。 【詩78:8】不要像他們的祖宗。 【書24:15】至於我和我家，我們必定事奉耶和華。 敬拜诗歌：愿你崇高 回应诗歌：数算主恩");
  assert.deepEqual(
    { date: fields.date, sermonTitle: fields.sermonTitle, themeScripture: fields.themeScripture, callScripture: fields.callScripture, meditationScripture: fields.meditationScripture, worshipSong: fields.worshipSong, responseSong: fields.responseSong },
    { date: "6月7日", sermonTitle: "因著得到神憐憫而禱告-尼希米", themeScripture: "尼希米記9:32-38", callScripture: "詩篇106:47-48", meditationScripture: "詩篇78:5-8、約書亞記24:15", worshipSong: "願你崇高", responseSong: "數算主恩" }
  );
});

test("extracts two numbered WeChat songs and removes references and chatter", () => {
  const fields = parseRawText("大家早上好！為7月26號中文主日崇拜預備詩歌兩首：                                       1）       寶貴祷告良辰 /詩：5～8、63:1～3 ·羅8:26～27·                                   2）       願主旨意成全  / 太 26:29 【回應詩歌】");
  assert.equal(fields.worshipSong, "寶貴禱告良辰");
  assert.equal(fields.responseSong, "願主旨意成全");
});

for (const [name, source] of [
  ["same line with 1. and half-width slash", "為主日預備詩歌兩首： 1. 宝贵祷告良辰 / 詩5:8 2. 愿祢旨意成全 / 太26:29【回應詩歌】 謝謝大家"],
  ["separate lines with ideographic commas and full-width slash", "為主日預備詩歌兩首：\n1、寶貴祷告良辰／詩5:8\n2、願祢旨意成全／太26:29【回應詩歌】\n謝謝大家"],
  ["full-width numbering", "為主日預備詩歌兩首： １） 寶貴祷告良辰 ／ 詩5:8 ２） 願儞旨意成全 ／ 太26:29【回應詩歌】"]
]) {
  test(`handles song layout: ${name}`, () => {
    const fields = parseRawText(source);
    assert.equal(fields.worshipSong, "寶貴禱告良辰");
    assert.equal(fields.responseSong, "願祢旨意成全");
  });
}

test("extracts only labeled sermon fields and drops surrounding noise", () => {
  const fields = parseRawText(`曾牧師您好，以下是本週講道資料，謝謝！
講道題目：主耶穌在客西馬尼園的禱告
主題經文：馬太福音26:39–44
麻煩同工安排一下，辛苦了。`);
  assert.equal(fields.sermonTitle, "主耶穌在客西馬尼園的禱告");
  assert.equal(fields.themeScripture, "馬太福音26:39–44");
  assert.doesNotMatch(buildOutput(fields), /您好|謝謝|麻煩|辛苦/);
});

test("keeps a valid field when chatter follows on the same line", () => {
  const fields = parseRawText("講道題目：主耶稣在客西马尼园的祷告，謝謝！");
  assert.equal(fields.sermonTitle, "主耶穌在客西馬尼園的禱告");
  assert.doesNotMatch(buildOutput(fields), /謝謝/);
});

test("extracts a multi-line sermon title after a date and joins its lines", () => {
  const fields = parseRawText(`6月21日講道題目：
新約聖經中的禱告 - 1
馬利亞的尊主頌
主題經文：路加福音1:46–55`);
  assert.equal(fields.date, "6月21日");
  assert.equal(fields.sermonTitle, "新約聖經中的禱告 - 1 馬利亞的尊主頌");
  assert.equal(fields.themeScripture, "路加福音1:46–55");
});

test("extracts a sermon title placed on the label line", () => {
  const fields = parseRawText(`講道題目：因著得到神憐憫而禱告——尼希米
主題經文：尼希米記9:32–38`);
  assert.equal(fields.sermonTitle, "因著得到神憐憫而禱告——尼希米");
  assert.equal(fields.themeScripture, "尼希米記9:32–38");
});

test("extracts a single-line sermon title from the line after its label", () => {
  const fields = parseRawText(`講道題目：
主耶穌在客西馬尼園的禱告
主題經文：馬太福音26:39–44`);
  assert.equal(fields.sermonTitle, "主耶穌在客西馬尼園的禱告");
  assert.equal(fields.themeScripture, "馬太福音26:39–44");
});

test("normalizes required traditional forms and divine pronoun glyph", () => {
  assert.equal(toTraditional("宝贵祷告良辰"), "寶貴禱告良辰");
  assert.equal(toTraditional("愿祢旨意成全"), "願祢旨意成全");
  assert.equal(toTraditional("願祢旨意成全"), "願祢旨意成全");
  assert.equal(toTraditional("願儞旨意成全"), "願祢旨意成全");
  assert.doesNotMatch(buildOutput({ responseSong: "願儞旨意成全" }), /儞/);
});

test("keeps the fixed song and never carries unlabeled chatter into output", () => {
  const output = buildOutput(parseRawText("弟兄姊妹平安，以下資料請查收，謝謝！"));
  assert.match(output, /《要等候主》/);
  assert.match(output, /主講：曾昶牧師/);
  assert.doesNotMatch(output, /弟兄姊妹|請查收|謝謝/);
});

test("always uses the fixed preacher regardless of source content", () => {
  assert.match(buildOutput(parseRawText("講員：其他講員")), /主講：曾昶牧師/);
  assert.match(buildOutput(parseRawText("講道題目：在主裏合一")), /主講：曾昶牧師/);
  assert.doesNotMatch(buildOutput(parseRawText("講員：其他講員")), /其他講員/);
});

for (const fixture of [
  {
    name: "prayer songs with Psalms, Romans and Matthew attachments",
    input: "默想經文：【詩111:9】正文 【申10:21】正文 【賽41:10】正文 為7月26號中文主日崇拜預備詩歌兩首： 1）寶貴禱告良辰／詩5:8、詩63:1-3、羅8:26-27 2）願主旨意成全／太26:29【回應詩歌】",
    expected: "詩篇111:9、申命記10:21、以賽亞書41:10",
    excluded: /詩篇5:8|63:1-3|羅馬書8:26-27|馬太福音26:29/
  },
  {
    name: "praise songs with John and Hebrews attachments",
    input: "默想經文：【腓4:6】正文 為主日預備詩歌兩首： 1. 讚美真神／約3:16 2. 信靠順服／來11:1【回應詩歌】",
    expected: "腓立比書4:6",
    excluded: /約翰福音3:16|希伯來書11:1/
  },
  {
    name: "hymns with Genesis and Revelation attachments before scripture field",
    input: "為主日預備詩歌兩首：\n1、奇異恩典 / 創1:1【敬拜詩歌】\n2、榮耀歸主 ／ 啟21:4【回應詩歌】\n默想經文：【詩23:1】正文 【詩23:3】正文",
    expected: "詩篇23:1、3",
    excluded: /創世記1:1|啟示錄21:4/
  }
]) {
  test(`excludes generic song attachments from scripture fields: ${fixture.name}`, () => {
    const fields = parseRawText(fixture.input);
    assert.equal(fields.meditationScripture, fixture.expected);
    assert.doesNotMatch(fields.meditationScripture, fixture.excluded);
    assert.match(buildOutput(fields), /主講：曾昶牧師/);
  });
}

test("uses only whitelisted scripture fields and ignores unrelated references", () => {
  const fields = parseRawText(`Jun 轉發影片：https://example.test 羅馬書8:28
主題經文：約翰福音3:16
Joy 補充：創世記1:1
宣召經文：【詩100:1】正文
默想經文：【腓4:6】正文
影片說明：馬太福音5:1`);
  assert.equal(fields.themeScripture, "約翰福音3:16");
  assert.equal(fields.callScripture, "詩篇100:1");
  assert.equal(fields.meditationScripture, "腓立比書4:6");
  assert.doesNotMatch(buildOutput(fields), /羅馬書8:28|創世記1:1|馬太福音5:1|Jun|Joy|影片/);
});

for (const fixture of [
  ["敬拜及回應詩歌如下： 1）「願你崇高/美哉主耶穌」 2）《數算主恩》", "願你崇高/美哉主耶穌", "數算主恩"],
  ["敬拜和回應詩歌如下：\n1. 『聖哉三一』／賽6:3\n2. “奇異恩典”／弗2:8", "聖哉三一", "奇異恩典"],
  ["本週選詩如下：\n《祢真偉大》\n\"我知誰掌管明天\"\n其他資料一律不採用", "祢真偉大", "我知誰掌管明天"]
]) {
  test(`recognizes a whitelisted semantic song section: ${fixture[0].split("：")[0]}`, () => {
    const fields = parseRawText(fixture[0]);
    assert.equal(fields.worshipSong, fixture[1]);
    assert.equal(fields.responseSong, fixture[2]);
  });
}

test("ignores numbered and quoted song-like text without a recognized song section", () => {
  const fields = parseRawText("聊天記錄：1）《不是通知歌曲》 2）『也不是通知歌曲』 約翰福音3:16");
  assert.equal(fields.worshipSong, "");
  assert.equal(fields.responseSong, "");
  assert.equal(fields.themeScripture, "");
  assert.equal(fields.callScripture, "");
  assert.equal(fields.meditationScripture, "");
});

test("ordinary blank lines do not end a labeled sermon title before the next field", () => {
  const fields = parseRawText(`講道題目：
新約聖經中的禱告

馬利亞的尊主頌
主題經文：路加福音1:46-55`);
  assert.equal(fields.sermonTitle, "新約聖經中的禱告 馬利亞的尊主頌");
});

for (const [source, expected] of [
  ["一月一日", "1月1日"],
  ["四月十二日", "4月12日"],
  ["五月十七日", "5月17日"],
  ["七月二十六日", "7月26日"],
  ["十月十日", "10月10日"],
  ["十一月二十一日", "11月21日"],
  ["十二月三十一日", "12月31日"],
  ["五月17日", "5月17日"],
  ["5月十七日", "5月17日"],
  ["五月十七號", "5月17日"],
  ["5月17號", "5月17日"],
  ["主日日期：五月十七日", "5月17日"],
  ["五月十七日講道題目：盼望", "5月17日"]
]) {
  test(`normalizes service date: ${source}`, () => {
    assert.equal(parseRawText(source).date, expected);
  });
}

test("converts Chinese numbers by tens place instead of date-specific mappings", () => {
  assert.equal(chineseNumberToInteger("一"), 1);
  assert.equal(chineseNumberToInteger("十"), 10);
  assert.equal(chineseNumberToInteger("十一"), 11);
  assert.equal(chineseNumberToInteger("二十"), 20);
  assert.equal(chineseNumberToInteger("二十一"), 21);
  assert.equal(chineseNumberToInteger("三十一"), 31);
});

test("rejects unreliable or out-of-range dates without changing other fields", () => {
  const fields = parseRawText("十三月三十二日講道題目：三十日的禱告");
  assert.equal(fields.date, "");
  assert.equal(fields.sermonTitle, "三十日的禱告");
});

const may17SermonData = `五月十七日講道題目：
聖經中的禱告 - 6
因著過犯得饒恕而禱告
主題經文：拉9:13-15
宣召經文：
【詩130:2】主啊，求你聽我的聲音！願你側耳聽我懇求的聲音！
【詩130:3】主－耶和華啊，你若究察罪孽，誰能站得住呢？
【詩130:4】但在你有赦免之恩，要叫人敬畏你。
默想經文：
【羅11:5】如今也是這樣，照著揀選的恩典，還有所留的餘數。
【羅11:6】既是出於恩典，就不在乎行為；不然，恩典就不是恩典了。
【羅11:7】這是怎麼樣呢？以色列人所求的，他們沒有得著。`;
const labeledSongs = `回應詩歌:請改變我
敬拜詩歌：你信實何廣大`;

function comparableFields(fields) {
  return {
    date: fields.date,
    sermonTitle: fields.sermonTitle,
    themeScripture: fields.themeScripture,
    callScripture: fields.callScripture,
    meditationScripture: fields.meditationScripture,
    worshipSong: fields.worshipSong,
    responseSong: fields.responseSong
  };
}

test("extracts same-line labeled songs before sermon fields without consuming following lines", () => {
  const fields = parseRawText(`${labeledSongs}\n\n${may17SermonData}`);
  assert.deepEqual(comparableFields(fields), {
    date: "5月17日",
    sermonTitle: "聖經中的禱告 - 6 因著過犯得饒恕而禱告",
    themeScripture: "以斯拉記9:13-15",
    callScripture: "詩篇130:2-4",
    meditationScripture: "羅馬書11:5-7",
    worshipSong: "你信實何廣大",
    responseSong: "請改變我"
  });
});

test("field extraction is independent of whether labeled songs come first or last", () => {
  const songsFirst = comparableFields(parseRawText(`${labeledSongs}\n\n${may17SermonData}`));
  const songsLast = comparableFields(parseRawText(`${may17SermonData}\n\n${labeledSongs}`));
  assert.deepEqual(songsFirst, songsLast);
});

test("same-line labeled songs remain bounded after changing date and song names", () => {
  const fields = parseRawText(`敬拜詩歌：奇異恩典
回應詩歌：信靠順服
十一月二十一日講道題目：
在恩典中成長
主題經文：弗2:8-9`);
  assert.equal(fields.date, "11月21日");
  assert.equal(fields.worshipSong, "奇異恩典");
  assert.equal(fields.responseSong, "信靠順服");
  assert.equal(fields.sermonTitle, "在恩典中成長");
  assert.equal(fields.themeScripture, "以弗所書2:8-9");
});

test("extracts short worship and response aliases only inside an explicit song context", () => {
  const fields = parseRawText(`詩歌建議如下，請看看合適否？
敬拜：教會唯一的根基
回應：不是我 是基督住
             我心`);
  assert.equal(fields.worshipSong, "教會唯一的根基");
  assert.equal(fields.responseSong, "不是我 是基督住我心");
  const output = buildOutput(fields);
  assert.match(output, /\[敬拜詩歌\]：《教會唯一的根基》/);
  assert.match(output, /\[回應詩歌\]：《不是我 是基督住我心》/);
  assert.doesNotMatch(output, /詩歌建議|合適否/);
});

test("supports simplified short song aliases in an explicit song context", () => {
  const fields = parseRawText(`诗歌如下：
敬拜：教会唯一的根基
回应：不是我 是基督住
       我心`);
  assert.equal(fields.worshipSong, "教會唯一的根基");
  assert.equal(fields.responseSong, "不是我 是基督住我心");
});

test("does not interpret short worship and response labels outside song context", () => {
  const fields = parseRawText("普通討論：敬拜：這不是詩歌欄位\n回應：這也不是詩歌欄位");
  assert.equal(fields.worshipSong, "");
  assert.equal(fields.responseSong, "");
});

test("supports continuation lines with full song labels", () => {
  const fields = parseRawText(`敬拜詩歌：主愛何等深廣
回應詩歌：基督是我滿足
            直到永遠`);
  assert.equal(fields.worshipSong, "主愛何等深廣");
  assert.equal(fields.responseSong, "基督是我滿足直到永遠");
});

test("short-alias songs and sermon fields are order independent", () => {
  const songBlock = `選詩如下：
敬拜：萬福泉源
回應：一生
      跟隨祢`;
  const sermonBlock = `六月二十一日講道題目：
在基督裏的新生命
主題經文：林後5:17`;
  const songsFirst = comparableFields(parseRawText(`${songBlock}\n${sermonBlock}`));
  const songsLast = comparableFields(parseRawText(`${sermonBlock}\n${songBlock}`));
  assert.deepEqual(songsFirst, songsLast);
  assert.equal(songsFirst.worshipSong, "萬福泉源");
  assert.equal(songsFirst.responseSong, "一生跟隨祢");
  assert.equal(songsFirst.date, "6月21日");
  assert.equal(songsFirst.sermonTitle, "在基督裏的新生命");
});
