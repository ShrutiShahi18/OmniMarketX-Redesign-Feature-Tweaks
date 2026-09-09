import { useState } from "react";
import Logo from "../components/Logo.jsx";

export default function Checkout({ user, setIsPro, goBack }) {
  const [processing, setProcessing] = useState(false);
  const [card, setCard] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [name, setName] = useState("");

  function subscribe(e) {
    e.preventDefault();
    setProcessing(true);
    setTimeout(() => {
      setIsPro(true);
      setProcessing(false);
      goBack();
    }, 900);
  }

  return (
    <div className="checkout-shell">
      <div className="checkout-brand-panel">
        <div className="checkout-back" onClick={goBack}>← Back</div>
        <div className="checkout-brand-row">
          <div className="brand-mark"><Logo mono /></div>
          <span>OmniMarketX</span>
        </div>
        <div className="checkout-plan-label">👑 Subscribe to OmniMarketX Pro</div>
        <div className="checkout-price"><span className="amt">$14.99</span><span className="per">per<br />month</span></div>
        <div className="checkout-perks">
          <div><span className="pk-ic">✓</span>Smarter Insights &amp; Advanced Charts</div>
          <div><span className="pk-ic">✓</span>Whale Alerts</div>
          <div><span className="pk-ic">✓</span>Pro Badge + Invite &amp; Earn up to 10%</div>
        </div>
        <div className="checkout-demo-badge"><span className="live-dot"></span>DEMO CHECKOUT — no real payment is processed</div>
      </div>

      <form className="checkout-form-panel" onSubmit={subscribe}>
        <div className="checkout-order-summary">
          <div className="b-row"><span>OmniMarketX Pro (monthly)</span><b>$14.99</b></div>
          <div className="b-row"><span>Demo tax</span><b>$0.00</b></div>
          <div className="b-row profit"><span>Due today</span><b>$14.99</b></div>
        </div>

        <div className="checkout-section-title">Contact information</div>
        <div className="checkout-field readonly">
          <label>Email</label>
          <div>{user.username}@omnimarketx.demo</div>
        </div>

        <div className="checkout-section-title" style={{ marginTop: 22 }}>Payment method</div>
        <div className="checkout-card-box">
          <div className="checkout-card-header"><span>💳 Card</span><span className="checkout-card-brands">💳 🅜 🅥</span></div>
          <input className="checkout-input" placeholder="1234 1234 1234 1234" value={card} onChange={(e) => setCard(e.target.value)} maxLength={19} />
          <div className="checkout-row2">
            <input className="checkout-input" placeholder="MM / YY" value={expiry} onChange={(e) => setExpiry(e.target.value)} maxLength={5} />
            <input className="checkout-input" placeholder="CVC" value={cvc} onChange={(e) => setCvc(e.target.value)} maxLength={4} />
          </div>
          <label className="checkout-label">Cardholder name</label>
          <input className="checkout-input" style={{ fontFamily: "var(--font-body)" }} placeholder="Full name on card" value={name} onChange={(e) => setName(e.target.value)} />
          <label className="checkout-label">Country or region</label>
          <select className="checkout-input" style={{ fontFamily: "var(--font-body)" }}><option>India</option><option>United States</option><option>United Kingdom</option><option>Malaysia</option></select>
        </div>

        <button className="cta checkout-submit" type="submit" disabled={processing}>
          {processing ? "Processing…" : "Subscribe · $14.99/mo"}
        </button>
        <div className="checkout-trust-row">🔒 Secured demo checkout — nothing you enter is transmitted or stored</div>
        <div className="checkout-fineprint">This is a demo checkout for evaluation purposes. Clicking Subscribe simply marks your demo account as Pro.</div>
      </form>
    </div>
  );
}
