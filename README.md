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

```bash
npm run dev
```
