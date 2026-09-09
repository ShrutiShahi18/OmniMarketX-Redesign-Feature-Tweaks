import { useState } from "react";
import { api } from "../api.js";

export default function BuyModal({ market, user, onBalanceUpdate, onPosted, onClose, trade }) {
  const [stage, setStage] = useState("confirm"); // confirm | success
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);

  async function confirm() {
    setBusy(true);
    try {
      const res = await api.postTrade({ userId: user._id, marketId: market._id, side: trade.side, mode: trade.mode, amount: trade.amount });
      onBalanceUpdate(res.newBalance);
      setResult(res.trade);
      setStage("success");
    } catch (e) {
      alert(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function postToFeed() {
    const text = `🎯 Demo Prediction — I ${trade.mode === "buy" ? "predicted" : "closed"} ${trade.side.toUpperCase()} on "${market.question}" ~${result.shares} shares @ $${result.price.toFixed(2)}`;
    const post = await api.createPost({ userId: user._id, authorName: user.displayName, authorHandle: "@" + user.username, text, tradeId: result._id });
    onPosted(post, text);
  }

  return (
    <div className="modal-overlay">
      {stage === "confirm" && (
        <div className="modal-box">
          <h3>{trade.mode === "buy" ? "Confirm Demo Buy" : "Confirm Demo Sell"}</h3>
          <div className="modal-sub">Review the details below. This uses virtual funds and won't affect your real balance.</div>
          <div className="modal-row"><span>Side</span><b>{trade.side === "yes" ? "Yes" : "No"}</b></div>
          <div className="modal-row"><span>Amount</span><b>{trade.amount.toFixed(2)} USDC</b></div>
          <div className="modal-row"><span>Shares (approx.)</span><b>~{trade.shares}</b></div>
          <div className="modal-row"><span>Fees</span><b>{trade.fee.toFixed(2)} USDC</b></div>
          <div className="modal-row"><span>Total</span><b>{trade.total.toFixed(2)} USDC</b></div>
          <div className="modal-btns">
            <button className="modal-cancel" onClick={onClose}>Cancel</button>
            <button className="cta" disabled={busy} onClick={confirm}>{busy ? "Processing…" : "Confirm"}</button>
          </div>
        </div>
      )}
      {stage === "success" && result && (
        <div className="modal-box">
          <div className="modal-success-badge">
            <div style={{ fontSize: "12px", opacity: 0.85 }}>🎉 Demo trade executed</div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "15px", marginTop: "6px" }}>
              {result.side === "yes" ? "Yes" : "No"} on {market.question.length > 40 ? market.question.slice(0, 40) + "…" : market.question}
            </div>
            <div className="tx">Tx ID: {result.txId}</div>
          </div>
          <div className="modal-row"><span>Option</span><b>{result.side.toUpperCase()}</b></div>
          <div className="modal-row"><span>Shares</span><b>~{result.shares}</b></div>
          <div className="modal-row"><span>New Balance</span><b style={{ color: "var(--positive)" }}>${user.demoBalance.toFixed(2)}</b></div>
          <div className="modal-btns">
            <button className="modal-cancel" onClick={onClose}>Close</button>
            <button className="cta" onClick={() => { postToFeed(); onClose(); }}>Post to Feed</button>
          </div>
        </div>
      )}
    </div>
  );
}
