import assert from "node:assert/strict";
import test from "node:test";
import { buildOutput, parseRawText } from "../src/serviceParser.js";

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
    { date: "6月7日", sermonTitle: "因著得到神憐憫而禱告-尼希米", themeScripture: "尼希米記9:32-38", callScripture: "詩篇106:47-48", meditationScripture: "詩篇78:5-8、約書亞記24:15", worshipSong: "愿你崇高", responseSong: "数算主恩" }
  );
});
