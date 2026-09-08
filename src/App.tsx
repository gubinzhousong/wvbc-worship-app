import { useEffect, useMemo, useState } from "react";
import { buildOutput, parseRawText } from "./serviceParser.js";
import PosterPreview from "./PosterPreview";

type ServiceFields = { date: string; sermonTitle: string; themeScripture: string; callToWorship: string; meditationScripture: string; worshipSong: string; responseSong: string };
type HistoryItem = { id: string; savedAt: string; rawInput: string; fields: ServiceFields; output: string };
const STORAGE_KEY = "wvbc-sunday-service-history";
const blankFields: ServiceFields = { date: "", sermonTitle: "", themeScripture: "", callToWorship: "", meditationScripture: "", worshipSong: "", responseSong: "" };

export default function App() {
  const [rawInput, setRawInput] = useState(""); const [fields, setFields] = useState<ServiceFields>(blankFields); const [output, setOutput] = useState(""); const [history, setHistory] = useState<HistoryItem[]>([]); const [notice, setNotice] = useState("");
  useEffect(() => { try { setHistory(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")); } catch { setHistory([]); } }, []);
  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(history)); }, [history]);
  const hasContent = useMemo(() => Boolean(rawInput.trim() || output.trim()), [rawInput, output]);
  function generate() { const parsed = parseRawText(rawInput) as ServiceFields; const announcement = buildOutput(parsed); setFields(parsed); setOutput(announcement); setNotice("已依模板生成；可直接在右侧修改。"); }
  async function copyAll() { if (!output) return; await navigator.clipboard.writeText(output); setNotice("已复制全文到剪贴板。"); }
  function save() { if (!output) return; setHistory((items) => [{ id: crypto.randomUUID(), savedAt: new Date().toISOString(), rawInput, fields, output }, ...items]); setNotice("已保存到本机历史记录。"); }
  function clear() { setRawInput(""); setFields(blankFields); setOutput(""); setNotice(""); }
  function load(item: HistoryItem) { setRawInput(item.rawInput); setFields(item.fields); setOutput(item.output); setNotice("已载入历史记录。"); }
  return <main className="app-shell"><section className="workspace"><header className="heading"><div><p className="eyebrow">INTERNAL MINISTRY TOOL</p><h1>WVBC 主日崇拜通知生成器</h1><p>粘贴牧师原始资料，自动提取并生成微信群主日崇拜通知。</p></div></header><div className="tool-grid"><section className="panel input-panel"><div className="section-title"><h2>原始资料</h2><span>自然文本输入</span></div><textarea className="raw-editor" value={rawInput} onChange={(event) => setRawInput(event.target.value)} placeholder="请粘贴牧师提供的讲道资料…" /><button className="primary-button" type="button" onClick={generate} disabled={!rawInput.trim()}>生成主日崇拜通知</button><p className="hint">系统只提取日期、题目、经文与两首诗歌；经文正文不会出现在通知中。</p></section><section className="panel output-panel"><div className="section-title"><h2>生成结果预览</h2><span>{output ? "可编辑" : "等待生成"}</span></div><textarea className="output-editor" value={output} onChange={(event) => setOutput(event.target.value)} placeholder="生成后的主日崇拜通知将显示在这里。" /><div className="action-row"><button type="button" onClick={copyAll} disabled={!output}>复制全文</button><button type="button" className="save-button" onClick={save} disabled={!output}>保存</button><button type="button" className="clear-button" onClick={clear} disabled={!hasContent}>清空</button></div>{notice && <p className="notice" role="status">{notice}</p>}<PosterPreview output={output} /></section></div><section className="history-panel"><div className="section-title"><div><h2>历史记录</h2><p>保存于此浏览器，仅供本机管理使用。</p></div><span>{history.length} 条</span></div>{history.length ? <div className="history-list">{history.map((item) => <button className="history-item" type="button" onClick={() => load(item)} key={item.id}><strong>{item.fields.date || "未标注日期"}</strong><span>{item.fields.sermonTitle || "未标注讲道题目"}</span><small>{new Date(item.savedAt).toLocaleDateString("zh-CN")}</small></button>)}</div> : <p className="empty-history">尚无已保存的主日崇拜通知。</p>}</section></section></main>;
}
