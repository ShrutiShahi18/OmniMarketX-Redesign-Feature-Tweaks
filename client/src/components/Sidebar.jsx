import Logo from "./Logo.jsx";

const NAV = [
  {
    id: "home",
    label: "Home",
    icon: "M3 10l9-7 9 7v10a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1z",
  },
  { id: "learn", label: "Learn", icon: "book" },
  { id: "wallet", label: "Wallet", icon: "rect" },
  {
    id: "markets",
    label: "Markets",
    icon: "M3 17l6-6 4 4 8-8|M14 7h7v7",
  },
  {
    id: "trending",
    label: "Trending",
    icon: "M13 2L3 14h7l-1 8 10-12h-7l1-8z",
  },
  {
    id: "activity",
    label: "Activity",
    icon: "M3 12h4l3 8 4-16 3 8h4",
  },
  { id: "leaderboard", label: "Leaderboard", icon: "trophy" },
  { id: "social", label: "Social", icon: "circle" },
  { id: "groups", label: "Groups", icon: "groups" },
  {
    id: "portfolio",
    label: "Portfolio",
    icon: "M4 20V10M12 20V4M20 20v-7",
  },
];

function Icon({ id }) {
  if (id === "rect") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
      </svg>
    );
  }

  if (id === "trophy") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M6 9H4v10a1 1 0 001 1h14a1 1 0 001-1V9h-2" />
        <path d="M6 9V4h12v5" />
        <path d="M9 22V12h6v10" />
      </svg>
    );
  }

  if (id === "circle") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M8 12h8M12 8v8" />
      </svg>
    );
  }

  if (id === "groups") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="9" cy="8" r="3" />
        <circle cx="17" cy="9" r="2.5" />
        <path d="M3 20v-1a5 5 0 015-5h2a5 5 0 015 5v1" />
        <path d="M16 14a4 4 0 014 4v2" />
      </svg>
    );
  }

  if (id === "book") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
      </svg>
    );
  }

  const paths = id.split("|");

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      {paths.map((path, index) => (
        <path key={index} d={path} />
      ))}
    </svg>
  );
}

export default function Sidebar({
  screen,
  navigate,
  theme = "dark",
  toggleTheme,
  isPro = false,
}) {
  function goTo(id) {
    navigate(`/${id === "home" ? "" : id}`);
  }

  return (
    <div className="rail">
      <div className="brand">
        <div className="brand-mark">
          <Logo />
        </div>

        <div className="brand-word">
          OmniMarketX
        </div>
      </div>

      <div className="rail-nav">
        {NAV.map((item) => (
          <div
            key={item.id}
            className={
              "nav-item" +
              (screen === item.id ? " active" : "")
            }
            onClick={() => goTo(item.id)}
          >
            <Icon id={item.icon} />
            {item.label}
          </div>
        ))}
      </div>

      <div className="rail-bottom">
        <div
          className="pro-card"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/subscription")}
        >
          <div className="t">
            {isPro
              ? "👑 You're Pro"
              : "⚡ OmniMarket Pro"}
          </div>

          <div className="s">
            {isPro
              ? "Manage your plan & rewards."
              : "Advanced signals, deeper liquidity views & partner rewards."}
          </div>
        </div>

        <div
          className="theme-toggle"
          onClick={toggleTheme}
        >
          <span>
            {theme === "dark"
              ? "Light mode"
              : "Dark mode"}
          </span>

          <span className="dot" />
        </div>
      </div>
    </div>
  );
}