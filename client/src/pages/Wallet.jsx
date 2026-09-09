import { api } from "../api.js";

export default function Wallet({ user, setUser, history, setHistory }) {
  async function reset() {
    const updated = await api.resetWallet(user._id);
    setUser(updated);
    setHistory([]);
  }

  return (
    <div>
      <h1 className="page-title">Wallet</h1>
      <p className="page-sub">Funding dashboard — demo wallet.</p>
      <div className="balance-hero">
        <div className="l">DEMO BALANCE</div>
        <div className="v">{user.demoBalance.toFixed(2)} <span style={{ fontSize: 20, color: "var(--text-secondary)" }}>USDC</span></div>
        <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 6 }}>Not real money — demo trading on a shared simulated market, zero risk.</div>
        <button className="ghost-btn" onClick={reset}>Reset Demo Account</button>
      </div>
      <div className="side-card" style={{ padding: "6px 8px" }}>
        <table className="ptable">
          <tbody>
            <tr><th>Side</th><th>Shares</th><th>Price</th><th>Cost</th><th>Date</th></tr>
            {history.length === 0 && <tr><td colSpan="5" style={{ textAlign: "center", color: "var(--text-tertiary)", padding: "24px 0" }}>No demo trades yet — your history will show up here.</td></tr>}
            {history.map((t) => (
              <tr key={t._id}>
                <td><span className="pos-tag" style={t.mode === "sell" ? { background: "var(--negative-glow)", color: "var(--negative)" } : undefined}>{t.mode.toUpperCase()}</span></td>
                <td className="num">{t.shares.toFixed(2)}</td>
                <td className="num">{t.price.toFixed(2)}</td>
                <td className="num">{t.amount.toFixed(2)} USDC</td>
                <td className="num" style={{ color: "var(--text-tertiary)" }}>{new Date(t.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
