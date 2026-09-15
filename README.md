# WVBC 國語崇拜主日崇拜通知生成器

## MVP 技术方案

- 前端：React + Vite 单页应用，方便教会同工在浏览器内直接使用。
- 数据：浏览器 `localStorage`。不需要服务器；历史记录保存在当前浏览器与设备。
- 解析：前端规则式解析自然语言标题、经文段落和诗歌列表；保留原始资料，生成结果可手动编辑。
- 输出：固定的 WVBC 国语崇拜模板；经文正文会被剔除，只保留规范化的书卷、章节与节数。

## 数据结构

每一笔历史记录为：

```ts
{
  id: string,
  savedAt: string,
  rawInput: string,       // 牧师原始资料
  fields: {               // 自动提取字段
    date, sermonTitle, themeScripture, callToWorship,
    meditationScripture, worshipSong, responseSong
  },
  output: string          // 可被同工编辑后的最终通知
}
```

## 页面结构

1. 页面标题与简要提示。
2. 左侧：原始资料输入框与「生成主日崇拜通知」。
3. 右侧：可编辑的生成结果、复制、保存、清空按钮。
4. 底部：本机历史记录，可点击载入。

## 本地运行

## Poster 节期配色

根据当前通知首行的聚会日期自动配色。没有年份时使用 Poster 区域的聚会年份（默认今年）；制作跨年或历史海报时请调整年份，或在通知首行写完整日期。

- 预苦期：复活节前 46 天至前一天，紫色。
- 复活期：西方公历复活节至圣灵降临节前一天，金色。
- 圣灵降临节：复活节后 49 天，红色。
- 将临期：11 月 27 日起第一个星期日至 12 月 24 日，紫色。
- 圣诞期：12 月 25 日至次年 1 月 5 日，红金色。
- 感恩节主题：10 月 1 日至 31 日，枫叶红，搭配暖金色边框与象牙白背景；这是教会自定的整月海报主题。
- 其他日期：教会原有深蓝色主题，搭配金色边框与米白背景。

这是本 App 的简化节期设计配色，圣诞红金色为海报设计选择，不代表 WVBC 正式礼仪规范。节期参考：[Church of England 日历](https://www.churchofengland.org/prayer-and-worship/worship-texts-and-resources/common-worship/churchs-year/calendar)。颜色定义位于 `src/posterTheme.js`。

### 启动

```bash
npm run dev
```
