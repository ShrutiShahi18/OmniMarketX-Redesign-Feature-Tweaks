const FREE_FEATURES = ["Browse & Trade Markets", "Create Markets", "Join Groups", "Pulse (Social Feed)"];
const PRO_FEATURES = [
  ["Everything in Free", true], ["Smarter Insights (AI market summaries)", false],
  ["Whale Alerts — track large trades", false], ["Advanced Charts & liquidity depth", false],
  ["Pro Badge (verified checkmark)", true], ["Invite & Earn — up to 10% commission", true],
];
const TIERS = [["🥉 Bronze", "2%"], ["🥈 Silver", "4%"], ["🥇 Gold", "6%"], ["🏆 Platinum", "8%"], ["💎 Diamond", "10%"]];

export default function Subscription({ isPro, setIsPro, setScreen }) {
  return (
    <div>
      <h1 className="page-title">Choose Your <span style={{ color: "var(--accent)" }}>Plan</span></h1>
      <p className="page-sub">Unlock the full power of OmniMarketX — sharper signals, deeper liquidity views, and real rewards for bringing traders in.</p>

      <div className="layout-grid">
        <div>
          <div className="grid2" style={{ alignItems: "start" }}>
            <div className="card" style={{ cursor: "default" }}>
              <div className="card-cat">FREE</div>
              <div className="card-q" style={{ fontFamily: "var(--font-display)", fontSize: 26 }}>$0<span style={{ fontSize: 13, color: "var(--text-tertiary)" }}>/month</span></div>
              <div style={{ marginBottom: 16 }}>
                {FREE_FEATURES.map((f) => <div key={f} className="b-row"><span>✓ {f}</span></div>)}
              </div>
              <button className="ghost-btn" style={{ width: "100%" }} disabled>Current Plan</button>
            </div>

            <div className="card card-feat" style={{ cursor: "default" }}>
              <div className="card-cat">👑 MOST POPULAR</div>
              <div className="card-q" style={{ fontFamily: "var(--font-display)" }}>OmniMarketX Pro</div>
              <div className="prob-num" style={{ fontSize: 34 }}>$14.99<span style={{ fontSize: 13, color: "var(--text-tertiary)" }}>/mo</span></div>
              <div style={{ margin: "12px 0" }}>
                {PRO_FEATURES.map(([f, live]) => (
                  <div key={f} className="b-row"><span>{live ? "✓" : "⏳"} {f}</span>{!live && <b style={{ color: "var(--text-tertiary)", fontSize: 10 }}>SOON</b>}</div>
                ))}
              </div>
              <button className="cta" style={{ marginTop: 0 }} onClick={() => isPro ? setIsPro(false) : setScreen("checkout")}>
                {isPro ? "✓ You're Pro — Manage" : "Upgrade to Pro · $14.99/mo"}
              </button>
            </div>
          </div>
        </div>
        <div>
          <div className="side-card">
            <div className="side-title">🎁 Invite &amp; Earn (Pro Feature)</div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 10 }}>Earn recurring commission from eligible trading activity by your referrals.</div>
            {TIERS.map(([label, pct]) => (
              <div key={label} className="b-row"><span>{label}</span><b>{pct}</b></div>
            ))}
          </div>
          <div className="side-card">
            <div className="side-title">🛡️ 14-Day Money Back Guarantee</div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>Not satisfied? Request a full refund within 14 days of purchase — demo billing only, no real card is ever charged here.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
