import { useState } from "react";
import Logo from "./Logo.jsx";

const FEATURES = [
  [
    "🎯",
    "Trade What Matters",
    "Turn your read on real-world events into real demo winnings — no vague odds, no guesswork.",
  ],
  [
    "🧠",
    "Learn As You Go",
    "A built-in glossary and inline tooltips mean you never need to leave the app to understand a trade.",
  ],
  [
    "💬",
    "Debate & Share",
    "Post your thesis, react to others', and build a track record the whole community can see.",
  ],
  [
    "🏆",
    "Compete & Earn",
    "Climb the leaderboard, join category groups, and unlock Pro perks as you go.",
  ],
];

const FOOTER_COLUMNS = [
  [
    "Markets",
    [
      ["Trending", "/trending"],
      ["New Markets", "/markets"],
      ["Gaming", "/markets?category=Gaming"],
      ["Crypto", "/markets?category=Crypto"],
      ["Politics", "/markets?category=Politics"],
      ["Sports", "/markets?category=Sports"],
      ["Economy", "/markets?category=Economy"],
    ],
  ],
  [
    "Product",
    [
      ["How It Works", "/learn"],
      ["Create Market", "/markets"],
      ["Portfolio", "/portfolio"],
      ["OmniMarket Pro", "/subscription"],
      ["Learn", "/learn"],
    ],
  ],
  [
    "Company",
    [
      ["About Us", "/about"],
      ["Careers", "/careers"],
      ["Blog", "/blog"],
      ["Contact Us", "/contact"],
    ],
  ],
  [
    "Support",
    [
      ["Help Center", "/help"],
      ["FAQ", "/faq"],
      ["Trading Rules", "/trading-rules"],
      ["Report an Issue", "/report-issue"],
    ],
  ],
  [
    "Legal",
    [
      ["Terms of Service", "/terms"],
      ["Privacy Policy", "/privacy"],
      ["Risk Disclosure", "/risk-disclosure"],
      ["Cookie Policy", "/cookies"],
    ],
  ],
];

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function Footer({ navigate }) {
  const [email, setEmail] = useState("");
  const [subscribeState, setSubscribeState] = useState("idle");
  const [subscribeMessage, setSubscribeMessage] = useState("");

  function handleSubscribe() {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setSubscribeState("error");
      setSubscribeMessage("Please enter your email address.");
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setSubscribeState("error");
      setSubscribeMessage("Please enter a valid email address.");
      return;
    }

    try {
      const existing =
        JSON.parse(
          localStorage.getItem("omnimarketx_newsletter_subscribers") ||
            "[]"
        ) || [];

      const alreadySubscribed = existing.some(
        (item) =>
          item.toLowerCase() === trimmedEmail.toLowerCase()
      );

      if (!alreadySubscribed) {
        existing.push(trimmedEmail);

        localStorage.setItem(
          "omnimarketx_newsletter_subscribers",
          JSON.stringify(existing)
        );
      }

      setSubscribeState("success");
      setSubscribeMessage(
        alreadySubscribed
          ? "You're already subscribed to the OmniMarketX newsletter."
          : "You're subscribed! Watch your inbox for the next market brief."
      );

      setEmail("");
    } catch (error) {
      console.error("Newsletter subscription error:", error);

      setSubscribeState("error");
      setSubscribeMessage(
        "Something went wrong. Please try again."
      );
    }
  }

  function handleEmailKeyDown(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubscribe();
    }
  }

  function handleFooterLink(path) {
    if (navigate) {
      navigate(path);
    } else {
      window.location.href = path;
    }
  }

  return (
    <div className="site-footer">
      <div className="feature-strip">
        {FEATURES.map(([icon, title, sub]) => (
          <div key={title} className="feature-card">
            <div className="feature-icon">{icon}</div>

            <div className="feature-title">
              {title}
            </div>

            <div className="feature-sub">
              {sub}
            </div>
          </div>
        ))}
      </div>

      <div
        className="newsletter-band"
        style={{
          position: "relative",
        }}
      >
        <div className="newsletter-icon">
          📩
        </div>

        <div
          style={{
            flex: 1,
            minWidth: 0,
          }}
        >
          <div className="newsletter-title">
            Stay ahead of the market
          </div>

          <div className="newsletter-sub">
            One email a week: the sharpest price moves and
            new markets worth watching. No spam, ever.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flexShrink: 0,
          }}
        >
          <input
            className="newsletter-input"
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);

              if (subscribeState !== "idle") {
                setSubscribeState("idle");
                setSubscribeMessage("");
              }
            }}
            onKeyDown={handleEmailKeyDown}
            placeholder="Enter your email address"
            aria-label="Email address"
            disabled={subscribeState === "success"}
          />

          <button
            type="button"
            className="cta"
            style={{
              marginTop: 0,
              width: "auto",
              flexShrink: 0,
              padding: "13px 24px",
              whiteSpace: "nowrap",
            }}
            onClick={handleSubscribe}
            disabled={subscribeState === "success"}
          >
            {subscribeState === "success"
              ? "Subscribed ✓"
              : "Subscribe"}
          </button>
        </div>

        {subscribeMessage && (
          <div
            style={{
              position: "absolute",
              left: "0",
              right: "0",
              bottom: "-34px",
              textAlign: "center",
              fontSize: "12px",
              fontWeight: 600,
              color:
                subscribeState === "success"
                  ? "var(--positive)"
                  : "var(--negative)",
            }}
          >
            {subscribeMessage}
          </div>
        )}
      </div>

      <div className="footer-columns">
        <div className="footer-brand">
          <div
            className="brand"
            style={{
              padding: 0,
              marginBottom: 10,
            }}
          >
            <div className="brand-mark">
              <Logo />
            </div>

            <div className="brand-word">
              OmniMarketX
            </div>
          </div>

          <div
            style={{
              fontSize: 12,
              color: "var(--text-secondary)",
              lineHeight: 1.5,
            }}
          >
            The World's Leading Social Prediction Market.™
            <br />
            Trade What Matters.
          </div>
        </div>

        {FOOTER_COLUMNS.map(([column, links]) => (
          <div key={column}>
            <div className="footer-col-title">
              {column}
            </div>

            {links.map(([label, path]) => (
              <div
                key={label}
                className="footer-link"
                role="button"
                tabIndex={0}
                onClick={() => handleFooterLink(path)}
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" ||
                    event.key === " "
                  ) {
                    event.preventDefault();
                    handleFooterLink(path);
                  }
                }}
              >
                {label}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="footer-bottom">
        <span>
          © 2026 OmniMarketX. All rights reserved.
        </span>

        <span className="footer-bottom-links">
          <span
            role="button"
            tabIndex={0}
            onClick={() => handleFooterLink("/privacy")}
          >
            Privacy
          </span>

          {" · "}

          <span
            role="button"
            tabIndex={0}
            onClick={() => handleFooterLink("/terms")}
          >
            Terms of Service
          </span>

          {" · "}

          <span
            role="button"
            tabIndex={0}
            onClick={() => handleFooterLink("/cookies")}
          >
            Cookies
          </span>

          {" · "}

          <span
            role="button"
            tabIndex={0}
            onClick={() => handleFooterLink("/sitemap")}
          >
            Sitemap
          </span>
        </span>
      </div>
    </div>
  );
}