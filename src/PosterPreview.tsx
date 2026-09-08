import { useEffect, useRef, useState } from "react";
import { createPoster } from "./poster.js";

export default function PosterPreview({ output }: { output: string }) {
  const [poster, setPoster] = useState<{ url: string; filename: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const version = useRef(0);
  const preview = useRef<HTMLDivElement>(null);
  useEffect(() => {
    version.current += 1;
    setPoster(null); setError(""); setBusy(false);
    return () => { version.current += 1; };
  }, [output]);
  useEffect(() => () => { if (poster) URL.revokeObjectURL(poster.url); }, [poster]);
  async function generate() {
    const current = ++version.current;
    setBusy(true); setError("");
    try {
      const result = await createPoster(output);
      if (current !== version.current) return;
      setPoster({ url: URL.createObjectURL(result.blob), filename: result.filename });
      requestAnimationFrame(() => preview.current?.focus());
    } catch (error) {
      if (current === version.current) setError(error instanceof Error ? error.message : "Poster 生成失败，请重试。");
    } finally {
      if (current === version.current) setBusy(false);
    }
  }
  return <section className="poster-section" aria-label="主日崇拜 Poster">
    <div className="action-row"><button type="button" className="poster-button" disabled={!output.trim() || busy} onClick={generate}>{busy ? "正在生成…" : "生成 Poster"}</button></div>
    <p className="hint">使用上方当前通知内容生成；修改通知后请重新生成。</p>
    {error && <p className="poster-error" role="alert">{error}</p>}
    {poster && <div ref={preview} tabIndex={-1} className="poster-preview">
      <div className="section-title"><h3>Poster 预览</h3><a className="poster-download" href={poster.url} download={poster.filename}>下载 PNG</a></div>
      <img src={poster.url} alt="本周 WVBC 國語崇拜通知海报，内容来自上方通知" />
    </div>}
  </section>;
}
