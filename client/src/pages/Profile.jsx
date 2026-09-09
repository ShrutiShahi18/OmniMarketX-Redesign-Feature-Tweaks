import { useEffect, useState } from "react";
import { api } from "../api";

export default function Profile({ user, navigate }) {
  const [positions, setPositions] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadProfileData() {
      try {
        const [positionsData, historyData] = await Promise.all([
          api.getPositions(),
          api.getHistory(),
        ]);

        if (!cancelled) {
          setPositions(positionsData);
          setHistory(historyData);
        }
      } catch (error) {
        console.error("Failed to load profile data:", error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProfileData();

    return () => {
      cancelled = true;
    };
  }, []);

  const displayName = user?.displayName || "OmniMarketX User";
  const username = user?.username || "user";

  const initials =
    displayName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "OM";

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        month: "short",
        year: "numeric",
      })
    : "Sep 2026";

  const totalTrades = history.length;
  const balance = Number(user?.demoBalance || 0);

  return (
    <section className="page-section profile-page">
      <div className="profile-header card">
        <div className="profile-identity">
          {user?.photoURL ? (
            <img
              className="profile-avatar"
              src={user.photoURL}
              alt=""
            />
          ) : (
            <div className="profile-avatar">
              {initials}
            </div>
          )}

          <div className="profile-details">
            <h1>{displayName}</h1>
            <p>@{username}</p>
            <span>Joined {memberSince}</span>
          </div>
        </div>

        <div className="profile-actions">
          <button
            type="button"
            className="btn-primary"
            onClick={() => navigate("/settings")}
          >
            Edit Profile
          </button>

          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: `${displayName} · OmniMarketX`,
                  text: `View ${displayName}'s OmniMarketX profile.`,
                  url: window.location.href,
                });
              } else {
                navigator.clipboard?.writeText(
                  window.location.href
                );
              }
            }}
          >
            Share
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Portfolio Value</span>
          <strong className="stat-value">
            {balance.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </strong>
          <span className="stat-meta">USDC</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Unrealized P&amp;L</span>
          <strong className="stat-value">+0.00</strong>
          <span className="stat-meta">USDC</span>
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
            {totalTrades}
          </strong>
          <span className="stat-meta">Total trades</span>
        </div>
      </div>

      <div className="profile-tabs">
        <button
          type="button"
          className="profile-tab active"
        >
          Overview
        </button>

        <button
          type="button"
          className="profile-tab"
          onClick={() => navigate("/portfolio")}
        >
          Positions
        </button>

        <button
          type="button"
          className="profile-tab"
          onClick={() => navigate("/activity")}
        >
          Trade History
        </button>

        <button
          type="button"
          className="profile-tab"
          onClick={() => navigate("/wallet")}
        >
          Transactions
        </button>

        <button
          type="button"
          className="profile-tab"
          onClick={() => navigate("/social")}
        >
          Posts
        </button>
      </div>

      <div className="profile-grid">
        <div className="card">
          <div className="card-header">
            <div>
              <h2>Portfolio Overview</h2>
              <p>Your current trading activity.</p>
            </div>
          </div>

          {loading ? (
            <div className="empty-state">
              Loading portfolio...
            </div>
          ) : positions.length === 0 ? (
            <div className="empty-state">
              <strong>No open positions</strong>
              <p>
                Start trading markets to build your portfolio.
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
                      {position.side?.toUpperCase()} ·{" "}
                      {Number(position.shares || 0).toFixed(2)}{" "}
                      shares
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
              <h2>Account</h2>
              <p>Your OmniMarketX account information.</p>
            </div>
          </div>

          <div className="profile-account-list">
            <div className="profile-account-row">
              <span>Email</span>
              <strong>{user?.email || "—"}</strong>
            </div>

            <div className="profile-account-row">
              <span>Username</span>
              <strong>@{username}</strong>
            </div>

            <div className="profile-account-row">
              <span>Member since</span>
              <strong>{memberSince}</strong>
            </div>

            <div className="profile-account-row">
              <span>Followers</span>
              <strong>0</strong>
            </div>

            <div className="profile-account-row">
              <span>Following</span>
              <strong>0</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}