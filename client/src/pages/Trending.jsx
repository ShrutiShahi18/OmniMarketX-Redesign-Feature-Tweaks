import CategoryChips from "../components/CategoryChips.jsx";

export default function Trending({ markets, category, setCategory, openMarket }) {
  const ranked = [...markets].sort((a, b) => b.volume - a.volume || b.yesPrice - a.yesPrice);
  const movers = [...markets].sort((a, b) => b.volume - a.volume).slice(0, 2);

  return (
    <div>
      <h1 className="page-title">Trending</h1>
      <p className="page-sub">Real-time ranking of the most active markets.</p>
      <CategoryChips active={category} onSelect={setCategory} />
      <div className="layout-grid">
        <div>
          <div className="side-card" style={{ paddingTop: 8 }}>
            {ranked.map((m, i) => (
              <div key={m._id} className="trend-list-row" onClick={() => openMarket(m)}>
                <span className="rk">{i + 1}</span>
                <div><div className="q">{m.question}</div><div className="cat">{m.category.toUpperCase()} · ${m.volume} vol · {m.traders} traders</div></div>
                <span className="pct">{Math.round(m.yesPrice * 100)}%</span>
                <div className="mini-yn"><span className="y">{(m.yesPrice * 100).toFixed(0)}¢</span><span className="n">{(m.noPrice * 100).toFixed(0)}¢</span></div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="side-card" style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div className="gauge-mini">
              <svg width="70" height="70" viewBox="0 0 70 70">
                <circle cx="35" cy="35" r="29" fill="none" stroke="var(--surface-3)" strokeWidth="7" />
                <circle cx="35" cy="35" r="29" fill="none" stroke="var(--positive)" strokeWidth="7" strokeDasharray="182.2" strokeDashoffset="164" strokeLinecap="round" />
              </svg>
              <div className="gc" style={{ color: "var(--positive)" }}>10</div>
            </div>
            <div><div className="side-title" style={{ marginBottom: 2 }}>Low Volatility</div><div style={{ fontSize: "11.5px", color: "var(--text-tertiary)" }}>Markets are calm — no unusual activity.</div></div>
          </div>
          <div className="side-card">
            <div className="side-title">📊 Top Volume Movers</div>
            {movers.map((m) => (
              <div key={m._id} className="trend-row" onClick={() => openMarket(m)}>
                <span className="trend-q">{m.question.length > 40 ? m.question.slice(0, 40) + "…" : m.question}</span>
                <span className="trend-p">${m.volume}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
