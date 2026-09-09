import { useState } from "react";
import { api } from "../api.js";

export default function BuyModal({
  market,
  user,
  onBalanceUpdate,
  onPosted,
  onClose,
  trade,
}) {
  const [stage, setStage] = useState("confirm"); // confirm | success | compose
  const [result, setResult] = useState(null);
  const [postText, setPostText] = useState("");
  const [busy, setBusy] = useState(false);

  async function confirm() {
    setBusy(true);

    try {
      const res = await api.postTrade({
        userId: user._id,
        marketId: market._id,
        side: trade.side,
        mode: trade.mode,
        amount: trade.amount,
      });

      onBalanceUpdate(res.newBalance);
      setResult(res.trade);
      setStage("success");
    } catch (e) {
      alert(e.message);
    } finally {
      setBusy(false);
    }
  }

  function openPostComposer() {
    if (!result) {
      return;
    }

    const defaultText = `🎯 Demo Prediction — I ${
      trade.mode === "buy" ? "predicted" : "closed"
    } ${trade.side.toUpperCase()} on "${
      market.question
    }" ~${result.shares} shares @ $${result.price.toFixed(2)}`;

    setPostText(defaultText);
    setStage("compose");
  }

  async function postToFeed() {
    const cleanText = postText.trim();

    if (!cleanText || busy) {
      return;
    }

    setBusy(true);

    try {
      const post = await api.createPost({
        content: cleanText,
      });

      if (onPosted) {
        await onPosted(post, cleanText);
      }

      onClose();
    } catch (e) {
      console.error("Post to feed error:", e);

      alert(
        e?.message ||
          "Couldn't post this to your feed."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="modal-overlay">
      {stage === "confirm" && (
        <div className="modal-box">
          <h3>
            {trade.mode === "buy"
              ? "Confirm Demo Buy"
              : "Confirm Demo Sell"}
          </h3>

          <div className="modal-sub">
            Review the details below. This uses virtual funds and won't
            affect your real balance.
          </div>

          <div className="modal-row">
            <span>Side</span>
            <b>
              {trade.side === "yes" ? "Yes" : "No"}
            </b>
          </div>

          <div className="modal-row">
            <span>Amount</span>
            <b>
              {trade.amount.toFixed(2)} USDC
            </b>
          </div>

          <div className="modal-row">
            <span>Shares (approx.)</span>
            <b>~{trade.shares}</b>
          </div>

          <div className="modal-row">
            <span>Fees</span>
            <b>
              {trade.fee.toFixed(2)} USDC
            </b>
          </div>

          <div className="modal-row">
            <span>Total</span>
            <b>
              {trade.total.toFixed(2)} USDC
            </b>
          </div>

          <div className="modal-btns">
            <button
              className="modal-cancel"
              onClick={onClose}
              disabled={busy}
            >
              Cancel
            </button>

            <button
              className="cta"
              disabled={busy}
              onClick={confirm}
            >
              {busy ? "Processing…" : "Confirm"}
            </button>
          </div>
        </div>
      )}

      {stage === "success" && result && (
        <div className="modal-box">
          <div className="modal-success-badge">
            <div
              style={{
                fontSize: "12px",
                opacity: 0.85,
              }}
            >
              🎉 Demo trade executed
            </div>

            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "15px",
                marginTop: "6px",
              }}
            >
              {result.side === "yes"
                ? "Yes"
                : "No"}{" "}
              on{" "}
              {market.question.length > 40
                ? market.question.slice(0, 40) + "…"
                : market.question}
            </div>

            <div className="tx">
              Tx ID: {result.txId}
            </div>
          </div>

          <div className="modal-row">
            <span>Option</span>
            <b>
              {result.side.toUpperCase()}
            </b>
          </div>

          <div className="modal-row">
            <span>Shares</span>
            <b>~{result.shares}</b>
          </div>

          <div className="modal-row">
            <span>New Balance</span>
            <b
              style={{
                color: "var(--positive)",
              }}
            >
              ${user.demoBalance.toFixed(2)}
            </b>
          </div>

          <div className="modal-btns">
            <button
              className="modal-cancel"
              onClick={onClose}
              disabled={busy}
            >
              Close
            </button>

            <button
              className="cta"
              onClick={openPostComposer}
              disabled={busy}
            >
              Post to Feed
            </button>
          </div>
        </div>
      )}

      {stage === "compose" && result && (
        <div className="modal-box">
          <h3>Post to Feed</h3>

          <div className="modal-sub">
            Share your prediction with the community. Edit the suggested
            post or write something completely your own.
          </div>

          <textarea
            value={postText}
            onChange={(event) =>
              setPostText(event.target.value)
            }
            placeholder="What's on your mind?"
            maxLength={2000}
            autoFocus
            style={{
              width: "100%",
              minHeight: "130px",
              resize: "vertical",
              boxSizing: "border-box",
              marginTop: "12px",
              padding: "13px 14px",
              borderRadius: "10px",
              border: "1px solid var(--border)",
              background: "var(--surface-1)",
              color: "var(--text-primary)",
              fontFamily: "var(--font-body)",
              fontSize: "13px",
              lineHeight: 1.5,
              outline: "none",
            }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "6px",
              color: "var(--text-tertiary)",
              fontSize: "11px",
            }}
          >
            {postText.length}/2000
          </div>

          <div className="modal-btns">
            <button
              className="modal-cancel"
              onClick={() => setStage("success")}
              disabled={busy}
            >
              Back
            </button>

            <button
              className="cta"
              onClick={postToFeed}
              disabled={busy || !postText.trim()}
            >
              {busy ? "Posting…" : "Post"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}