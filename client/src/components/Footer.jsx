import Logo from "./Logo.jsx";

const FEATURES = [
  ["🎯", "Trade What Matters", "Turn your read on real-world events into real demo winnings — no vague odds, no guesswork."],
  ["🧠", "Learn As You Go", "A built-in glossary and inline tooltips mean you never need to leave the app to understand a trade."],
  ["💬", "Debate & Share", "Post your thesis, react to others', and build a track record the whole community can see."],
  ["🏆", "Compete & Earn", "Climb the leaderboard, join category groups, and unlock Pro perks as you go."],
];

const FOOTER_COLUMNS = [
  ["Markets", ["Trending", "New Markets", "Gaming", "Crypto", "Politics", "Sports", "Economy"]],
  ["Product", ["How It Works", "Create Market", "Portfolio", "OmniMarket Pro", "Learn"]],
  ["Company", ["About Us", "Careers", "Blog", "Contact Us"]],
  ["Support", ["Help Center", "FAQ", "Trading Rules", "Report an Issue"]],
  ["Legal", ["Terms of Service", "Privacy Policy", "Risk Disclosure", "Cookie Policy"]],
];

export default function Footer({ setScreen }) {
  return (
    <div className="site-footer">
      <div className="feature-strip">
        {FEATURES.map(([icon, title, sub]) => (
          <div key={title} className="feature-card">
            <div className="feature-icon">{icon}</div>
            <div className="feature-title">{title}</div>
            <div className="feature-sub">{sub}</div>
          </div>
        ))}
      </div>

      <div className="newsletter-band">
        <div className="newsletter-icon">📩</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="newsletter-title">Stay ahead of the market</div>
          <div className="newsletter-sub">One email a week: the sharpest price moves and new markets worth watching. No spam, ever.</div>
        </div>
        <input className="newsletter-input" placeholder="Enter your email address" />
        <button className="cta" style={{ marginTop: 0, width: "auto", flexShrink: 0, padding: "13px 24px" }}>Subscribe</button>
      </div>

      <div className="footer-columns">
        <div className="footer-brand">
          <div className="brand" style={{ padding: 0, marginBottom: 10 }}>
            <div className="brand-mark"><Logo /></div><div className="brand-word">OmniMarketX</div>
          </div>
          <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>The World's Leading Social Prediction Market.™<br />Trade What Matters.</div>
        </div>
        {FOOTER_COLUMNS.map(([col, links]) => (
          <div key={col}>
            <div className="footer-col-title">{col}</div>
            {links.map((l) => <div key={l} className="footer-link">{l}</div>)}
          </div>
        ))}
      </div>

      <div className="footer-bottom">
        <span>© 2026 OmniMarketX. All rights reserved.</span>
        <span className="footer-bottom-links">Privacy · Terms of Service · Cookies · Sitemap</span>
      </div>
    </div>
  );
}
