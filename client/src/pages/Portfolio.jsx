export default function Portfolio({ positions, user, openMarket }) {
  const totalValue = positions.reduce((s, p) => s + p.shares * (p.side === "yes" ? p.market.yesPrice : p.market.noPrice), user.demoBalance);
  const totalPL = +(totalValue - 10000).toFixed(2);

  return (
    <div>
      <h1 className="page-title">Portfolio</h1>
      <p className="page-sub">Demo positions — shared demo-market prices, virtual funds.</p>
      <div className="stat-strip">
        <div className="stat-card"><div className="l">Total Value</div><div className="v">{totalValue.toFixed(2)} USDC</div></div>
        <div className="stat-card"><div className="l">Total P&amp;L</div><div className={"v" + (totalPL >= 0 ? " pos" : "")}>{totalPL >= 0 ? "+" : ""}{totalPL} USDC</div></div>
        <div className="stat-card"><div className="l">Open Positions</div><div className="v">{positions.length}</div></div>
      </div>
      <div className="side-card" style={{ padding: "6px 8px" }}>
        <table className="ptable">
          <tbody>
            <tr><th>Market</th><th>Position</th><th>Shares</th></tr>
            {positions.length === 0 && <tr><td colSpan="3" style={{ textAlign: "center", color: "var(--text-tertiary)", padding: "24px 0" }}>No open positions yet — buy into a market to see it here.</td></tr>}
            {positions.map((p) => (
              <tr key={p.market._id + p.side} onClick={() => openMarket(p.market)} style={{ cursor: "pointer" }}>
                <td><div className="m">{p.market.question}</div><div className="c">{p.market.icon} {p.market.category.toUpperCase()}</div></td>
                <td><span className="pos-tag" style={p.side === "no" ? { background: "var(--negative-glow)", color: "var(--negative)" } : undefined}>{p.side.toUpperCase()}</span></td>
                <td className="num">{p.shares.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
