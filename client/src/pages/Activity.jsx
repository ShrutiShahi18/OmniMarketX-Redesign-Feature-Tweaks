import { useState } from "react";

const TABS = ["All", "Trades", "Markets", "Social", "Alerts", "Achievements"];

export default function Activity({ history }) {
  const [tab, setTab] = useState("All");
  return (
    <div>
      <h1 className="page-title">Activity</h1>
      <p className="page-sub">Everything happening across OmniMarketX.</p>
      <div className="chips">
        {TABS.map((t) => <div key={t} className={"chip" + (tab === t ? " active" : "")} onClick={() => setTab(t)}>{t}</div>)}
      </div>
      <div className="stat-strip" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
        <div className="stat-card"><div className="l">Live Trades</div><div className="v">{history.length}</div></div>
        <div className="stat-card"><div className="l">Volume Moved</div><div className="v">${history.reduce((s, t) => s + t.amount, 0).toFixed(0)}</div></div>
        <div className="stat-card"><div className="l">Markets Moved</div><div className="v">{new Set(history.map((t) => t.market?._id)).size}</div></div>
        <div className="stat-card"><div className="l">Active Traders</div><div className="v">{history.length > 0 ? 1 : 0}</div></div>
      </div>
      {history.length === 0 ? (
        <div className="side-card" style={{ textAlign: "center", padding: "40px 20px", color: "var(--text-tertiary)", fontSize: 13 }}>No activity yet — trades and social actions will show up here in real time.</div>
      ) : (
        <div className="side-card" style={{ padding: "6px 8px" }}>
          <table className="ptable">
            <tbody>
              <tr><th>Side</th><th>Market</th><th>Amount</th><th>Date</th></tr>
              {history.map((t) => (
                <tr key={t._id}><td><span className="pos-tag">{t.mode.toUpperCase()}</span></td><td>{t.market?.question?.slice(0, 40)}…</td><td className="num">{t.amount.toFixed(2)} USDC</td><td className="num" style={{ color: "var(--text-tertiary)" }}>{new Date(t.createdAt).toLocaleDateString()}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
