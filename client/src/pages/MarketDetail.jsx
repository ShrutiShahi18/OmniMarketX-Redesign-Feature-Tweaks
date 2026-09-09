import { useState } from "react";
import BuyModal from "../components/BuyModal.jsx";

export default function MarketDetail({ market, user, setUser, setScreen, onTradeExecuted }) {
  const [side, setSide] = useState("yes");
  const [mode, setMode] = useState("buy");
  const [amount, setAmount] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [chartRange, setChartRange] = useState("1W");
  const [toastMsg, setToastMsg] = useState(null);

  if (!market) return null;

  const price = side === "yes" ? market.yesPrice : market.noPrice;
  const fee = +(amount * 0.002).toFixed(2);
  const shares = +(amount / price).toFixed(2);
  const total = mode === "buy" ? +(amount + fee).toFixed(2) : +(amount - fee).toFixed(2);
  const profit = +(shares * (1 - price) - fee).toFixed(2);
  const pct = Math.round(market.yesPrice * 100);
  const circumference = 339.3;
  const offset = circumference * (1 - market.yesPrice);

  const spark = market.sparkline && market.sparkline.length > 1 ? market.sparkline : [50, 55, 60, 58, 62, 65, pct];
  const w = 600, h = 160;
  const step = w / (spark.length - 1);
  const points = spark.map((v, i) => `${i * step},${h - (v / 100) * h}`).join(" ");
  const noPoints = spark.map((v, i) => `${i * step},${h - ((100 - v) / 100) * h}`).join(" ");

  function trade() {
    return { side, mode, amount, price, shares, fee, total };
  }

  function handleBalanceUpdate(newBalance) {
    setUser({ ...user, demoBalance: newBalance });
    onTradeExecuted();
  }

  function handlePosted(post, text) {
    setToastMsg(text.replace("🎯 Demo Prediction — ", ""));
    setTimeout(() => setToastMsg(null), 3200);
  }

  return (
    <div>
      <div className="breadcrumb"><b onClick={() => setScreen("home")}>Home</b> &nbsp;›&nbsp; <b onClick={() => setScreen("markets")}>Markets</b> &nbsp;›&nbsp; <b>{market.category}</b> &nbsp;›&nbsp; {market.question.slice(0, 24)}...</div>
      <div className="detail-head">
        <div className="detail-icon">{market.icon}</div>
        <div className="detail-title">{market.question}</div>
      </div>
      <div className="detail-grid">
        <div>
          <div className="stat-row">
            <div className="stat-box"><div className="stat-label" title="Total amount traded in this market so far">Volume</div><div className="stat-value">${market.volume}</div></div>
            <div className="stat-box"><div className="stat-label" title="How many unique people have traded this market">Traders</div><div className="stat-value">{market.traders}</div></div>
            <div className="stat-box"><div className="stat-label" title="The date this market stops trading and resolves">Closes</div><div className="stat-value">{market.closesAt ? new Date(market.closesAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}</div></div>
          </div>
          <div className="prob-panel">
            <div className="gauge-wrap">
              <svg width="128" height="128" viewBox="0 0 128 128">
                <circle cx="64" cy="64" r="54" fill="none" stroke="var(--surface-3)" strokeWidth="10" />
                <circle cx="64" cy="64" r="54" fill="none" stroke="var(--positive)" strokeWidth="10" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
              </svg>
              <div className="gauge-center"><span className="n">{pct}%</span><span className="l">YES</span></div>
            </div>
            <div className="prob-legend-v">
              <span><span className="legend-dot" style={{ background: "var(--positive)" }}></span>YES — {(market.yesPrice * 100).toFixed(1)}¢</span>
              <span><span className="legend-dot" style={{ background: "var(--negative)" }}></span>NO — {(market.noPrice * 100).toFixed(1)}¢</span>
              <span style={{ color: "var(--text-tertiary)", fontSize: "11.5px" }}>Market implies {pct}% probability</span>
            </div>
          </div>
          <div className="chart-card">
            <div className="chart-head">
              <div className="side-title" style={{ margin: 0 }}>Price History</div>
              <div className="chart-tabs">{["1D", "1W", "1M", "ALL"].map((r) => <span key={r} className={chartRange === r ? "on" : ""} onClick={() => setChartRange(r)}>{r}</span>)}</div>
            </div>
            <svg width="100%" height="160" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
              <defs><linearGradient id="gy" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--positive)" stopOpacity="0.3" /><stop offset="100%" stopColor="var(--positive)" stopOpacity="0" /></linearGradient></defs>
              <polygon points={`0,${h} ${points} ${w},${h}`} fill="url(#gy)" />
              <polyline points={points} fill="none" stroke="var(--positive)" strokeWidth="2.5" />
              <polyline points={noPoints} fill="none" stroke="var(--negative)" strokeWidth="2" strokeOpacity="0.6" />
            </svg>
          </div>
          <div className="details-card">
            <div className="detail-row"><span className="k">RESOLUTION</span><span className="v">{market.resolutionCriteria}</span></div>
            <div className="detail-row"><span className="k">SOURCE</span><span className="v">{market.resolutionSource}</span></div>
            <div className="detail-row"><span className="k">CATEGORY</span><span className="v">{market.icon} {market.category}</span></div>
            <div className="detail-row"><span className="k">CREATED</span><span className="v">{new Date(market.createdAt).toLocaleDateString()}</span></div>
          </div>
        </div>

        <div className="buy-panel">
          <div className="buy-toggle">
            <span className={mode === "buy" ? "on" : ""} onClick={() => setMode("buy")}>Buy</span>
            <span className={mode === "sell" ? "on" : ""} onClick={() => setMode("sell")}>Sell</span>
          </div>
          <div className="side-toggle">
            <div className={"side-btn" + (side === "yes" ? " selected" : "")} data-side="yes" onClick={() => setSide("yes")}><div className="lbl">YES</div><div className="price">{(market.yesPrice * 100).toFixed(1)}¢</div></div>
            <div className={"side-btn" + (side === "no" ? " selected" : "")} data-side="no" onClick={() => setSide("no")}><div className="lbl">NO</div><div className="price">{(market.noPrice * 100).toFixed(1)}¢</div></div>
          </div>
          <div className="balance-line">Your Balance <b>{user.demoBalance.toFixed(2)} USDC</b></div>
          <div className="amt-chips">
            {[5, 10, 20, 40].map((a) => <div key={a} className={"amt-chip" + (amount === a ? " on" : "")} onClick={() => setAmount(a)}>{a}</div>)}
          </div>
          <div className="amt-input">{amount} <span style={{ color: "var(--text-tertiary)", fontSize: 12 }}>USDC</span></div>
          <div className="liq-line">
            <div className="liq-dots">{[1, 1, 1, 0, 0].map((f, i) => <span key={i} className={f ? "fill" : ""}></span>)}</div>
            <span title="Liquidity means how easily you can trade without moving the price much">Thin liquidity — larger trades may move price</span>
          </div>
          <div className="breakdown">
            <div className="b-row"><span title="How many YES/NO units your amount buys at the current price">Shares (approx.)</span><b>~{shares}</b></div>
            <div className="b-row"><span title="A small 0.2% fee charged on every trade">Fees</span><b>{fee.toFixed(2)} USDC</b></div>
            <div className="b-row"><span>{mode === "buy" ? "Est. total" : "You receive"}</span><b>{total.toFixed(2)} USDC</b></div>
            <div className="b-row profit"><span>{mode === "buy" ? "Potential profit" : "Net after fees"}</span><b>{mode === "buy" ? (profit >= 0 ? "+" : "") + profit.toFixed(2) : total.toFixed(2)} USDC</b></div>
          </div>
          <button className="cta" onClick={() => setShowModal(true)}>{mode === "buy" ? "Buy" : "Sell"} {side === "yes" ? "Yes" : "No"} · {(price * 100).toFixed(1)}¢</button>
        </div>
      </div>

      {showModal && (
        <BuyModal market={market} user={user} trade={trade()} onBalanceUpdate={handleBalanceUpdate} onPosted={handlePosted} onClose={() => setShowModal(false)} />
      )}
      {toastMsg && (
        <div className="toast-wrap show"><div className="toast"><div className="toast-icon">✓</div><div><div className="toast-title">Posted to feed</div><div className="toast-preview">{toastMsg.length > 60 ? toastMsg.slice(0, 60) + "…" : toastMsg}</div></div></div></div>
      )}
    </div>
  );
}
