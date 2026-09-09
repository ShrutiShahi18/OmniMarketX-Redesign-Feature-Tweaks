const TERMS = [
  { t: "Prediction Market", d: "A market where people trade on the outcome of a real-world event (\"Will X happen?\") instead of buying a company's stock. The price reflects what traders collectively think the odds are." },
  { t: "YES / NO Shares", d: "Each market has two sides. Buying a YES share pays out $1 if the event happens, and $0 if it doesn't (and the reverse for NO). You're never forced to hold until the end — you can sell anytime before the market closes." },
  { t: "Price = Probability", d: "A YES price of 87¢ roughly means the market thinks there's an 87% chance the event happens. If you think the real odds are higher, buying YES is a bet that the price will rise." },
  { t: "Shares", d: "How many YES or NO units your money buys at the current price. More shares at a lower price means more profit if you're right — but the same loss risk if you're wrong." },
  { t: "Volume & Traders", d: "Volume is the total amount traded in a market so far. More volume and traders usually means a more reliable price, because more people have put money behind their opinion." },
  { t: "Liquidity", d: "How easily you can trade without moving the price much. \"Thin liquidity\" means a large trade could shift the price a lot — worth sizing trades smaller in those markets." },
  { t: "Fees", d: "OmniMarketX charges a small fee (0.2% in this demo) on every trade, shown before you confirm — never a surprise after the fact." },
  { t: "Resolution", d: "Every market states exactly how and when it will be decided (e.g. \"Box Office Mojo, cross-checked against The Numbers\"). Always read this before trading — it's the rulebook for who gets paid." },
];

export default function Learn({ setScreen }) {
  return (
    <div>
      <h1 className="page-title">📘 Learn: New to Prediction Markets?</h1>
      <p className="page-sub">A 2-minute primer before you place your first trade. Everything on OmniMarketX right now uses demo USDC — zero real risk while you learn.</p>

      <div className="side-card" style={{ marginBottom: 22 }}>
        <div className="side-title">🎯 The core idea in one sentence</div>
        <div style={{ fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.6 }}>
          If you think a market's price is wrong — too high or too low compared to what you believe will actually happen — you buy the side you think is underpriced, and profit if the market moves your way.
        </div>
      </div>

      <div className="layout-grid">
        <div>
          <div className="section-head"><h2>Glossary</h2></div>
          {TERMS.map((term) => (
            <div key={term.t} className="details-card" style={{ marginBottom: 12 }}>
              <div className="detail-row" style={{ gridTemplateColumns: "160px 1fr" }}>
                <span className="k">{term.t.toUpperCase()}</span>
                <span className="v">{term.d}</span>
              </div>
            </div>
          ))}
        </div>
        <div>
          <div className="side-card">
            <div className="side-title">✅ Before you trade</div>
            <div className="trend-row"><span className="trend-q">Read the resolution criteria — know exactly what makes YES or NO win.</span></div>
            <div className="trend-row"><span className="trend-q">Start with the $5 or $10 amount chip while you're learning.</span></div>
            <div className="trend-row"><span className="trend-q">Check the liquidity indicator before a large trade.</span></div>
            <div className="trend-row"><span className="trend-q">Everything here is demo money — practice as much as you want.</span></div>
          </div>
          <div className="side-card">
            <div className="side-title">🚀 Ready to try it</div>
            <div style={{ fontSize: 12.5, color: "var(--text-secondary)", marginBottom: 12 }}>Head to a real market and place your first demo trade.</div>
            <button className="cta" style={{ marginTop: 0 }} onClick={() => setScreen("markets")}>Browse Markets</button>
          </div>
        </div>
      </div>
    </div>
  );
}
