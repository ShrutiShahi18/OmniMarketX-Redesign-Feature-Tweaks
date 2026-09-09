import { useEffect, useState } from "react";
import { api } from "../api";

export default function Portfolio({ user, navigate }) {
  const [positions, setPositions] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadPortfolio() {
    try {
      setLoading(true);
      setError("");

      const [positionsData, historyData] = await Promise.all([
        api.getPositions(),
        api.getHistory(),
      ]);

      setPositions(positionsData);
      setHistory(historyData);
    } catch (err) {
      console.error("Failed to load portfolio:", err);
      setError(err.message || "Failed to load portfolio");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPortfolio();
  }, []);

  if (loading) {
    return (
      <section className="page-section">
        <div className="page-header">
          <div>
            <h1>Portfolio</h1>
            <p>Track your open positions and trading history.</p>
          </div>
        </div>

        <div className="card">
          <div className="empty-state">
            Loading portfolio...
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="page-section">
      <div className="page-header">
        <div>
          <h1>Portfolio</h1>
          <p>
            {user?.displayName
              ? `${user.displayName}'s portfolio`
              : "Track your positions and trading activity."}
          </p>
        </div>

        <button
          type="button"
          className="btn-primary"
          onClick={() => navigate("/markets")}
        >
          Explore Markets
        </button>
      </div>

      {error && (
        <div className="card">
          <div className="empty-state">
            <strong>Couldn't load portfolio</strong>
            <p>{error}</p>

            <button
              type="button"
              className="btn-secondary"
              onClick={loadPortfolio}
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {!error && (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-label">Balance</span>
              <strong className="stat-value">
                {Number(user?.demoBalance || 0).toFixed(2)}
              </strong>
              <span className="stat-meta">Demo USDC</span>
            </div>

            <div className="stat-card">
              <span className="stat-label">Open Positions</span>
              <strong className="stat-value">
                {positions.length}
              </strong>
              <span className="stat-meta">Active positions</span>
            </div>

            <div className="stat-card">
              <span className="stat-label">Trades</span>
              <strong className="stat-value">
                {history.length}
              </strong>
              <span className="stat-meta">Total trades</span>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div>
                <h2>Open Positions</h2>
                <p>Your current market positions.</p>
              </div>
            </div>

            {positions.length === 0 ? (
              <div className="empty-state">
                <strong>No open positions</strong>
                <p>
                  You don't have any active positions yet.
                </p>

                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => navigate("/markets")}
                >
                  Browse Markets
                </button>
              </div>
            ) : (
              <div className="portfolio-list">
                {positions.map((position) => (
                  <div
                    className="portfolio-row"
                    key={`${position.market?._id}-${position.side}`}
                  >
                    <div className="portfolio-main">
                      <strong>
                        {position.market?.question ||
                          "Unknown market"}
                      </strong>

                      <span>
                        {position.side.toUpperCase()} ·{" "}
                        {Number(position.shares || 0).toFixed(2)} shares
                      </span>
                    </div>

                    <div className="portfolio-value">
                      <strong>
                        {Number(
                          position.costBasis || 0
                        ).toFixed(2)}
                      </strong>

                      <span>Cost basis</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card">
            <div className="card-header">
              <div>
                <h2>Trade History</h2>
                <p>Your most recent trades.</p>
              </div>
            </div>

            {history.length === 0 ? (
              <div className="empty-state">
                <strong>No trades yet</strong>
                <p>
                  Your completed trades will appear here.
                </p>
              </div>
            ) : (
              <div className="portfolio-list">
                {history.map((trade) => (
                  <div
                    className="portfolio-row"
                    key={trade._id}
                  >
                    <div className="portfolio-main">
                      <strong>
                        {trade.market?.question ||
                          "Unknown market"}
                      </strong>

                      <span>
                        {trade.mode?.toUpperCase()}{" "}
                        {trade.side?.toUpperCase()} ·{" "}
                        {Number(trade.shares || 0).toFixed(2)} shares
                      </span>
                    </div>

                    <div className="portfolio-value">
                      <strong>
                        {Number(trade.total || 0).toFixed(2)}
                      </strong>

                      <span>
                        {trade.createdAt
                          ? new Date(
                              trade.createdAt
                            ).toLocaleDateString()
                          : ""}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}