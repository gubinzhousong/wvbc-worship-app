import { useEffect, useRef, useState } from "react";
import { createPoster } from "./poster.js";

export default function PosterPreview({ output }: { output: string }) {
  const [poster, setPoster] = useState<{ url: string; filename: string; themeLabel: string } | null>(null);
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const version = useRef(0);
  const preview = useRef<HTMLDivElement>(null);
  useEffect(() => {
    version.current += 1;
    setPoster(null); setError(""); setBusy(false);
    return () => { version.current += 1; };
  }, [output, year]);
  useEffect(() => () => { if (poster) URL.revokeObjectURL(poster.url); }, [poster]);
  async function generate() {
    const current = ++version.current;
    setBusy(true); setError("");
    try {
      const result = await createPoster(output, Number(year));
      if (current !== version.current) return;
      setPoster({ url: URL.createObjectURL(result.blob), filename: result.filename, themeLabel: `${result.theme.year}年 · ${result.theme.label}` });
      requestAnimationFrame(() => preview.current?.focus());
    } catch (error) {
      if (current === version.current) setError(error instanceof Error ? error.message : "Poster 生成失败，请重试。");
    } finally {
      if (current === version.current) setBusy(false);
    }
  }
  return <section className="poster-section" aria-label="主日崇拜 Poster">
    <div className="action-row"><button type="button" className="poster-button" disabled={!output.trim() || busy} onClick={generate}>{busy ? "正在生成…" : "生成 Poster"}</button></div>
    <label>聚会年份（通知未注明年份时使用）：<input type="number" min="1583" max="9999" value={year} onChange={(event) => setYear(event.target.value)} /></label>
    <p className="hint">按聚会日期自动匹配教会节期配色；年份默认今年。使用上方当前通知内容，修改后请重新生成。</p>
    {error && <p className="poster-error" role="alert">{error}</p>}
    {poster && <div ref={preview} tabIndex={-1} className="poster-preview">
      <div className="section-title"><h3>Poster 预览</h3><a className="poster-download" href={poster.url} download={poster.filename}>下载 PNG</a></div>
      <p className="hint">{poster.themeLabel}</p>
      <img src={poster.url} alt="本周 WVBC 國語崇拜通知海报，内容来自上方通知" />
    </div>}
  </section>;
}
