import { useState } from "react";
import { api } from "../api";

export default function Wallet({ user, navigate }) {
  const [resetting, setResetting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleReset() {
    const confirmed = window.confirm(
      "Reset your demo wallet to 10,000 USDC and clear your trade history?"
    );

    if (!confirmed) return;

    setResetting(true);
    setMessage("");
    setError("");

    try {
      const updatedUser = await api.resetWallet();

      // Keep the parent user state in sync through a custom event.
      window.dispatchEvent(
        new CustomEvent("omx:user-updated", {
          detail: updatedUser,
        })
      );

      setMessage("Your demo wallet has been reset to 10,000 USDC.");
    } catch (err) {
      console.error("Failed to reset wallet:", err);
      setError(err.message || "Failed to reset wallet");
    } finally {
      setResetting(false);
    }
  }

  const balance = Number(user?.demoBalance || 0);

  return (
    <section className="page-section">
      <div className="page-header">
        <div>
          <h1>Wallet</h1>
          <p>Manage your OmniMarketX demo trading balance.</p>
        </div>
      </div>

      {message && (
        <div className="card">
          <div className="wallet-message success">
            {message}
          </div>
        </div>
      )}

      {error && (
        <div className="card">
          <div className="wallet-message error">
            {error}
          </div>
        </div>
      )}

      <div className="wallet-grid">
        <div className="card wallet-balance-card">
          <div className="wallet-card-label">
            Available Balance
          </div>

          <div className="wallet-balance">
            {balance.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>

          <div className="wallet-currency">USDC demo balance</div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <h2>Demo Funding</h2>
              <p>
                This environment uses simulated funds for
                prediction-market trading.
              </p>
            </div>
          </div>

          <div className="wallet-actions">
            <button
              type="button"
              className="btn-primary"
              onClick={() => navigate("/markets")}
            >
              Trade Markets
            </button>

            <button
              type="button"
              className="btn-secondary"
              onClick={handleReset}
              disabled={resetting}
            >
              {resetting
                ? "Resetting..."
                : "Reset Demo Balance"}
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <h2>Funding Rules</h2>
            <p>How your demo wallet works.</p>
          </div>
        </div>

        <div className="wallet-rules">
          <div className="wallet-rule">
            <span className="wallet-rule-icon">◆</span>
            <div>
              <strong>Starting balance</strong>
              <p>
                New accounts receive 10,000 USDC in simulated
                funds.
              </p>
            </div>
          </div>

          <div className="wallet-rule">
            <span className="wallet-rule-icon">↗</span>
            <div>
              <strong>Trading only</strong>
              <p>
                Your demo balance is used for simulated market
                trades.
              </p>
            </div>
          </div>

          <div className="wallet-rule">
            <span className="wallet-rule-icon">↻</span>
            <div>
              <strong>Reset anytime</strong>
              <p>
                Resetting restores 10,000 USDC and removes your
                demo trade history.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}