export default function Ticker({ markets }) {
  const data = (markets || []).slice(0, 8).map((m) => [m.question.length > 34 ? m.question.slice(0, 34) + "…" : m.question, Math.round(m.yesPrice * 100) + "%", m.yesPrice >= 0.5 ? "up" : "down"]);
  const looped = [...data, ...data];
  return (
    <div className="ticker-wrap">
      <div className="ticker-track">
        {looped.map(([label, pct, dir], i) => (
          <span key={i} className={"tick " + dir}>{dir === "up" ? "▲" : "▼"} <b>{label}</b> {pct}</span>
        ))}
      </div>
    </div>
  );
}
