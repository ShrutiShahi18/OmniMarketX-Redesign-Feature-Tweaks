import { useEffect, useState } from "react";
import CategoryChips from "../components/CategoryChips.jsx";
import MarketCard from "../components/MarketCard.jsx";
import ScrollCarousel from "../components/ScrollCarousel.jsx";
import Footer from "../components/Footer.jsx";

const HASHTAGS = [
  ["#omnimarketx", 9],
  ["#predictionmarket", 5],
  ["#fintech", 3],
  ["#startuplife", 1],
];

export default function Home({
  markets = [],
  navigate,
  posts = [],
}) {
  const [showHero, setShowHero] = useState(true);
  const [showTip, setShowTip] = useState(true);
  const [category, setCategory] = useState("All");

  useEffect(() => {
    localStorage.removeItem("omx_hide_hero");
    localStorage.removeItem("omx_hide_tip");
  }, []);

  const filtered =
    category === "All"
      ? markets
      : markets.filter(
          (market) => market.category === category
        );

  const ordered = [...filtered].sort(
    (a, b) =>
      (Number(b.featured) || 0) -
        (Number(a.featured) || 0) ||
      (Number(b.volume) || 0) -
        (Number(a.volume) || 0)
  );

  function dismiss(setter) {
    setter(false);
  }

  function go(path) {
    navigate(path);
  }

  function openMarket(market) {
    navigate(`/market/${market._id}`);
  }

  return (
    <div>
      {showHero && (
        <div className="hero-banner">
          <div className="hero-copy">
            <div className="hero-kicker">
              ⚡ THE WORLD'S LEADING SOCIAL PREDICTION MARKET™
            </div>

            <div className="hero-title">
              Your read on the world is worth something. Prove it.
            </div>

            <div className="hero-sub">
              Trade real questions — box office, elections,
              crypto, sports — and turn being right into real
              winnings.
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <button
              className="cta"
              style={{ marginTop: 0 }}
              onClick={() => go("/markets")}
            >
              Start Trading
            </button>

            <span
              style={{
                cursor: "pointer",
                color: "var(--text-tertiary)",
                fontSize: 18,
              }}
              onClick={() => dismiss(setShowHero)}
            >
              ✕
            </span>
          </div>
        </div>
      )}

      {showTip && (
        <div
          className="pulse"
          style={{
            marginBottom: 14,
            background:
              "linear-gradient(90deg, var(--accent-glow), var(--surface-2))",
          }}
        >
          <span>
            📘 New here?{" "}
            <b
              style={{
                cursor: "pointer",
                textDecoration: "underline",
              }}
              onClick={() => go("/learn")}
            >
              Learn how prediction markets work
            </b>{" "}
            before your first trade — 2 minute read.
          </span>

          <span
            style={{
              marginLeft: "auto",
              cursor: "pointer",
              color: "var(--text-tertiary)",
            }}
            onClick={() => dismiss(setShowTip)}
          >
            ✕ Dismiss
          </span>
        </div>
      )}

      <div className="pulse">
        <div className="live-dot" />

        <span>
          Live Market Pulse —{" "}
          <b style={{ color: "var(--positive)" }}>
            Low Volatility
          </b>
        </span>

        <div className="divider" />

        <span>
          <b>{markets.length}</b> active markets
        </span>

        <div className="divider" />

        <span>
          <b style={{ color: "var(--positive)" }}>
            +0.14
          </b>{" "}
          USDC demo P&amp;L today
        </span>
      </div>

      <h1 className="page-title">Home</h1>

      <p className="page-sub">
        Trade what's actually moving. Real questions, real
        deadlines.
      </p>

      <CategoryChips
        active={category}
        onSelect={setCategory}
      />

      <div className="layout-grid">
        <div>
          <div className="section-head">
            <h2>🔥 Top Markets</h2>

            <a
              onClick={() => go("/markets")}
              style={{ cursor: "pointer" }}
            >
              View all →
            </a>
          </div>

          {ordered.length === 0 ? (
            <div className="side-card">
              No {category} markets yet — check back soon
              or browse another category.
            </div>
          ) : (
            <ScrollCarousel>
              {ordered.map((market, index) => (
                <div
                  className={
                    "scroll-item" +
                    (index === 0 ? " wide" : "")
                  }
                  key={market._id}
                >
                  <MarketCard
                    market={market}
                    featured={index === 0}
                    small={index !== 0}
                    onClick={openMarket}
                  />
                </div>
              ))}
            </ScrollCarousel>
          )}

          {posts.length > 0 && (
            <>
              <div
                className="section-head"
                style={{ marginTop: 30 }}
              >
                <h2>💬 What People Are Predicting</h2>

                <a
                  onClick={() => go("/social")}
                  style={{ cursor: "pointer" }}
                >
                  View all →
                </a>
              </div>

              {posts.slice(0, 2).map((post) => {
                const postUser = post.user || {};

                const authorName =
                  postUser.displayName ||
                  post.authorName ||
                  "OmniMarketX User";

                const authorHandle =
                  postUser.username
                    ? `@${postUser.username}`
                    : post.authorHandle || "@user";

                const content =
                  post.content ||
                  post.text ||
                  "";

                const likes = Array.isArray(post.likes)
                  ? post.likes.length
                  : Number(post.likes || 0);

                const initials =
                  authorName
                    .split(" ")
                    .filter(Boolean)
                    .map((word) => word[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase() || "OM";

                return (
                  <div
                    className="post-card"
                    key={post._id}
                  >
                    <div className="post-head">
                      {postUser.photoURL ? (
                        <img
                          className="avatar"
                          src={postUser.photoURL}
                          alt=""
                          style={{
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <div className="avatar">
                          {initials}
                        </div>
                      )}

                      <div>
                        <div className="name">
                          {authorName}
                        </div>

                        <div className="handle">
                          {authorHandle}
                          {post.createdAt
                            ? ` · ${new Date(
                                post.createdAt
                              ).toLocaleDateString()}`
                            : ""}
                        </div>
                      </div>
                    </div>

                    <div className="post-body">
                      {content}
                    </div>

                    <div className="post-actions">
                      <span>
                        🤍 {likes}
                      </span>

                      <span>💬 0</span>

                      <span>🔁</span>

                      <span>🔖</span>

                      <span>↗</span>
                    </div>
                  </div>
                );
              })}
            </>
          )}

          <Footer navigate={navigate} />
        </div>

        <div>
          <div className="side-card">
            <div className="side-title">
              🔥 Trending Now
            </div>

            {markets.slice(0, 4).map((market, index) => (
              <div
                key={market._id}
                className="trend-row"
                onClick={() =>
                  go(`/market/${market._id}`)
                }
              >
                <span className="trend-rank">
                  {index + 1}
                </span>

                <span className="trend-q">
                  {market.question?.length > 46
                    ? `${market.question.slice(0, 46)}…`
                    : market.question}
                </span>

                <span className="trend-p">
                  {Math.round(
                    Number(market.yesPrice || 0) * 100
                  )}
                  %
                </span>
              </div>
            ))}
          </div>

          <div className="side-card">
            <div className="side-title">
              🔥 Trending Hashtags
            </div>

            {HASHTAGS.map(([hashtag, count]) => (
              <div
                key={hashtag}
                className="hashtag-row"
              >
                <span className="h">
                  {hashtag}
                </span>

                <span className="n">
                  {count} posts
                </span>
              </div>
            ))}
          </div>

          <div className="side-card">
            <div className="side-title">
              👥 From people you follow
            </div>

            <div
              className="trend-row"
              onClick={() => go("/social")}
            >
              <span
                className="trend-q"
                style={{ fontWeight: 600 }}
              >
                Santosh K. is active in Social
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}