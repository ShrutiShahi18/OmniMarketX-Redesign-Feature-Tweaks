import { useState } from "react";

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function NotificationIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

export default function Topbar({
  user,
  navigate,
}) {
  const [open, setOpen] = useState(null);
  const [currentMode, setCurrentMode] = useState("real");

  function handleNavigate(path) {
    setOpen(null);

    if (navigate) {
      navigate(path);
    }
  }

  function handleModeChange(mode) {
    setCurrentMode(mode);
  }

  const initials =
    user?.displayName
      ?.split(" ")
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "SS";

  return (
    <div
      className="topbar"
      onClick={() => setOpen(null)}
    >
      <div className="search">
        <SearchIcon />
        <span>Search markets, events, users</span>
      </div>

      <div className="topbar-right">
        <div className="mode-pill">
          <span
            className={currentMode === "real" ? "on" : ""}
            onClick={(event) => {
              event.stopPropagation();
              handleModeChange("real");
            }}
          >
            Real
          </span>

          <span
            className={currentMode === "demo" ? "on" : ""}
            onClick={(event) => {
              event.stopPropagation();
              handleModeChange("demo");
            }}
          >
            Demo
          </span>
        </div>

        <button
          type="button"
          className="icon-btn"
          aria-label="Messages"
          onClick={(event) => {
            event.stopPropagation();
            handleNavigate("/messages");
          }}
        >
          <MessageIcon />
        </button>

        <button
          type="button"
          className="icon-btn"
          aria-label="Notifications"
          onClick={(event) => {
            event.stopPropagation();
            handleNavigate("/notifications");
          }}
        >
          <NotificationIcon />
        </button>

        <div className="dd-wrap">
          <button
            type="button"
            className="avatar"
            aria-label="Account menu"
            onClick={(event) => {
              event.stopPropagation();

              setOpen(
                open === "avatar"
                  ? null
                  : "avatar"
              );
            }}
          >
            {initials}
          </button>

          <div
            className={
              "dd-panel wide" +
              (open === "avatar" ? "" : " hidden")
            }
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="dd-header">
              <div className="avatar">
                {initials}
              </div>

              <div>
                <div className="name">
                  {user?.displayName ||
                    "OmniMarketX User"}
                </div>

                <div className="handle">
                  omnimarketx.com/u/
                  {user?.username || "user"}
                </div>
              </div>
            </div>

            <div className="dd-body">
              <div
                className="dd-item"
                onClick={() =>
                  handleNavigate("/profile")
                }
              >
                <span className="ic">👤</span>
                View Profile
              </div>

              <div
                className="dd-item"
                onClick={() =>
                  handleNavigate("/wallet")
                }
              >
                <span className="ic">💳</span>
                Deposit
              </div>

              <div
                className="dd-item"
                onClick={() =>
                  handleNavigate("/settings")
                }
              >
                <span className="ic">⚙️</span>
                Settings
              </div>

              <div className="dd-divider" />

              <div
                className="dd-item danger"
                style={{
                  color: "var(--negative)",
                }}
              >
                <span className="ic">✕</span>
                Log Out
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}