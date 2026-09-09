import { useEffect, useState } from "react";
import { api } from "../api";

export default function Activity({ navigate }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadActivity() {
    try {
      setLoading(true);
      setError("");

      const data = await api.getHistory();
      setHistory(data);
    } catch (err) {
      console.error("Failed to load activity:", err);
      setError(err.message || "Failed to load activity");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadActivity();
  }, []);

  return (
    <section className="page-section">
      <div className="page-header">
        <div>
          <h1>Activity</h1>
          <p>Keep track of your recent trading activity.</p>
        </div>

        <button
          type="button"
          className="btn-primary"
          onClick={() => navigate("/markets")}
        >
          Explore Markets
        </button>
      </div>

      {loading ? (
        <div className="card">
          <div className="empty-state">
            Loading activity...
          </div>
        </div>
      ) : error ? (
        <div className="card">
          <div className="empty-state">
            <strong>Couldn't load activity</strong>
            <p>{error}</p>

            <button
              type="button"
              className="btn-secondary"
              onClick={loadActivity}
            >
              Try Again
            </button>
          </div>
        </div>
      ) : history.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <strong>No activity yet</strong>
            <p>
              Your trades and other market activity will appear
              here.
            </p>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="card-header">
            <div>
              <h2>Recent Activity</h2>
              <p>Your latest trades.</p>
            </div>
          </div>

          <div className="activity-list">
            {history.map((trade) => (
              <div
                className="activity-item"
                key={trade._id}
              >
                <div className="activity-icon">
                  {trade.mode === "buy" ? "↗" : "↘"}
                </div>

                <div className="activity-content">
                  <strong>
                    {trade.mode === "buy"
                      ? "Bought"
                      : "Sold"}{" "}
                    {trade.side?.toUpperCase()} shares
                  </strong>

                  <span>
                    {trade.market?.question ||
                      "Unknown market"}
                  </span>

                  <small>
                    {trade.createdAt
                      ? new Date(
                          trade.createdAt
                        ).toLocaleString()
                      : ""}
                  </small>
                </div>

                <div className="activity-value">
                  <strong>
                    {Number(trade.total || 0).toFixed(2)}
                  </strong>

                  <span>USDC</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}