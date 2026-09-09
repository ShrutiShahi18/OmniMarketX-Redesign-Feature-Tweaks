import { useState } from "react";
import CategoryChips from "../components/CategoryChips.jsx";
import MarketCard from "../components/MarketCard.jsx";
import ScrollCarousel from "../components/ScrollCarousel.jsx";
import Footer from "../components/Footer.jsx";

const HASHTAGS = [["#omnimarketx", 9], ["#predictionmarket", 5], ["#fintech", 3], ["#startuplife", 1]];

export default function Home({ markets, category, setCategory, openMarket, setScreen, posts = [] }) {
  const [showTip, setShowTip] = useState(() => localStorage.getItem("omx_hide_tip") !== "1");
  const [showHero, setShowHero] = useState(() => localStorage.getItem("omx_hide_hero") !== "1");

  const filtered = category === "All" ? markets : markets.filter((m) => m.category === category);
  // Featured markets lead the queue, rest follow by volume — one single row, not two.
  const ordered = [...filtered].sort((a, b) => (b.featured - a.featured) || b.volume - a.volume);

  function dismiss(key, setter) {
    localStorage.setItem(key, "1");
    setter(false);
  }

  return (
    <div>
      {showHero && (
        <div className="hero-banner">
          <div className="hero-copy">
            <div className="hero-kicker">⚡ THE WORLD'S LEADING SOCIAL PREDICTION MARKET™</div>
            <div className="hero-title">Your read on the world is worth something. Prove it.</div>
            <div className="hero-sub">Trade real questions — box office, elections, crypto, sports — and turn being right into real winnings.</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button className="cta" style={{ marginTop: 0 }} onClick={() => setScreen("markets")}>Start Trading</button>
            <span style={{ cursor: "pointer", color: "var(--text-tertiary)", fontSize: 18 }} onClick={() => dismiss("omx_hide_hero", setShowHero)}>✕</span>
          </div>
        </div>
      )}
      {showTip && (
        <div className="pulse" style={{ marginBottom: 14, background: "linear-gradient(90deg, var(--accent-glow), var(--surface-2))" }}>
          <span>📘 New here? <b style={{ cursor: "pointer", textDecoration: "underline" }} onClick={() => setScreen("learn")}>Learn how prediction markets work</b> before your first trade — 2 minute read.</span>
          <span style={{ marginLeft: "auto", cursor: "pointer", color: "var(--text-tertiary)" }} onClick={() => dismiss("omx_hide_tip", setShowTip)}>✕ Dismiss</span>
        </div>
      )}
      <div className="pulse">
        <div className="live-dot"></div><span>Live Market Pulse — <b style={{ color: "var(--positive)" }}>Low Volatility</b></span>
        <div className="divider"></div><span><b>{markets.length}</b> active markets</span>
        <div className="divider"></div><span><b style={{ color: "var(--positive)" }}>+0.14</b> USDC demo P&amp;L today</span>
      </div>
      <h1 className="page-title">Home</h1>
      <p className="page-sub">Trade what's actually moving. Real questions, real deadlines.</p>
      <CategoryChips active={category} onSelect={setCategory} />
      <div className="layout-grid">
        <div>
          <div className="section-head"><h2>🔥 Top Markets</h2><a onClick={() => setScreen("markets")}>View all →</a></div>
          {ordered.length === 0 ? (
            <div className="side-card">No {category} markets yet — check back soon or browse another category.</div>
          ) : (
            <ScrollCarousel>
              {ordered.map((m, i) => (
                <div className={"scroll-item" + (i === 0 ? " wide" : "")} key={m._id}>
                  <MarketCard market={m} featured={i === 0} small={i !== 0} onClick={openMarket} />
                </div>
              ))}
            </ScrollCarousel>
          )}
          {posts.length > 0 && (
            <>
              <div className="section-head" style={{ marginTop: 30 }}><h2>💬 What People Are Predicting</h2><a onClick={() => setScreen("social")}>View all →</a></div>
              {posts.slice(0, 2).map((p) => (
                <div className="post-card" key={p._id}>
                  <div className="post-head"><div className="avatar">{p.authorName.split(" ").map((w) => w[0]).join("").slice(0, 2)}</div><div><div className="name">{p.authorName}</div><div className="handle">{p.authorHandle} · {new Date(p.createdAt).toLocaleDateString()}</div></div></div>
                  <div className="post-body">{p.text}</div>
                  <div className="post-actions"><span>{p.liked ? "❤️" : "🤍"} {p.likes}</span><span>💬 0</span><span>🔁</span><span>🔖</span><span>↗</span></div>
                </div>
              ))}
            </>
          )}
          <Footer setScreen={setScreen} />
        </div>
        <div>
          <div className="side-card">
            <div className="side-title">🔥 Trending Now</div>
            {markets.slice(0, 4).map((m, i) => (
              <div key={m._id} className="trend-row" onClick={() => setScreen("trending")}>
                <span className="trend-rank">{i + 1}</span>
                <span className="trend-q">{m.question.length > 46 ? m.question.slice(0, 46) + "…" : m.question}</span>
                <span className="trend-p">{Math.round(m.yesPrice * 100)}%</span>
              </div>
            ))}
          </div>
          <div className="side-card">
            <div className="side-title">🔥 Trending Hashtags</div>
            {HASHTAGS.map(([h, n]) => (
              <div key={h} className="hashtag-row"><span className="h">{h}</span><span className="n">{n} posts</span></div>
            ))}
          </div>
          <div className="side-card">
            <div className="side-title">👥 From people you follow</div>
            <div className="trend-row" onClick={() => setScreen("social")}><span className="trend-q" style={{ fontWeight: 600 }}>Santosh K. is active in Social</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
