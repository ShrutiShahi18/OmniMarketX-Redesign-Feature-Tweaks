import { useState } from "react";

export default function Groups() {
  const [joined, setJoined] = useState(false);
  return (
    <div>
      <h1 className="page-title">Groups</h1>
      <p className="page-sub">Join communities, share insights, and grow together.</p>
      <div className="chips">
        <div className="chip active">Discover</div><div className="chip">My Groups</div><div className="chip">Popular</div>
      </div>
      <div className="layout-grid">
        <div>
          <div className="card" style={{ cursor: "default" }}>
            <div className="card-cat">🎬 Entertainment</div>
            <div className="card-q">Entertainment predictions insights</div>
            <div style={{ fontSize: "12.5px", color: "var(--text-secondary)", marginBottom: 14 }}>Talking about entertainment markets · 38 members</div>
            <button className="cta" style={{ marginTop: 0, opacity: joined ? 0.6 : 1 }} onClick={() => setJoined(!joined)}>{joined ? "Joined ✓" : "Join"}</button>
          </div>
        </div>
        <div>
          <div className="side-card">
            <div className="side-title">👥 My Groups</div>
            <div style={{ fontSize: 12, color: "var(--text-tertiary)" }}>{joined ? "1 group joined." : "You haven't joined any groups yet."}</div>
          </div>
          <div className="side-card">
            <div className="side-title">🔥 Top Groups This Week</div>
            <div className="trend-row"><span className="trend-q">Entertainment predictions insights</span><span className="trend-p">38</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
