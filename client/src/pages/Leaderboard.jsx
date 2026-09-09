import { useState } from "react";

export default function Leaderboard() {
  const [period, setPeriod] = useState("Monthly");
  return (
    <div>
      <h1 className="page-title">🏆 Leaderboard</h1>
      <p className="page-sub">Compete with the best predictors on OmniMarketX.</p>
      <div className="stat-strip" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <div className="stat-card"><div className="l">Monthly Rewards</div><div className="v">$250,000</div></div>
        <div className="stat-card"><div className="l">Your Rank</div><div className="v">Unranked</div></div>
      </div>
      <div className="chips">
        {["Daily", "Weekly", "Monthly", "All Time"].map((p) => (
          <div key={p} className={"chip" + (period === p ? " active" : "")} onClick={() => setPeriod(p)}>{p}</div>
        ))}
      </div>
      <div className="side-card" style={{ padding: "6px 8px" }}>
        <table className="ptable">
          <tbody>
            <tr><th>Rank</th><th>Trader</th><th>ROI</th></tr>
            {["🥇", "🥈", "🥉"].map((medal, i) => (
              <tr key={i}><td className="num">{i + 1}</td><td><div className="m">{medal} Awaiting first ranked trader</div></td><td className="num" style={{ color: "var(--text-tertiary)" }}>—</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
