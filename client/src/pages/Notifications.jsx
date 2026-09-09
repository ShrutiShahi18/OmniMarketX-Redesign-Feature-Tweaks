import { useState } from "react";
import "../styles/notifications.css";

const TABS = [
  "All",
  "Trades",
  "Social",
  "Rewards",
  "Announcements",
  "System",
];

function BellIcon() {
  return (
    <svg
      className="notifications-bell"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function SettingsIcon() {
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
      <circle cx="12" cy="12" r="3" />

      <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.7 1.7-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V20h-2.4v-.2a1.7 1.7 0 0 0-1.03-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06-1.7-1.7.06-.06A1.7 1.7 0 0 0 8.4 15a1.7 1.7 0 0 0-1.56-1.03H6v-2.4h.84A1.7 1.7 0 0 0 8.4 10a1.7 1.7 0 0 0-.34-1.88L8 8.06l1.7-1.7.06.06a1.7 1.7 0 0 0 1.88.34A1.7 1.7 0 0 0 12.67 5.2V5h2.4v.2a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.88-.34l.06-.06 1.7 1.7-.06.06a1.7 1.7 0 0 0-.34 1.88A1.7 1.7 0 0 0 20.9 11H21v2.4h-.1A1.7 1.7 0 0 0 19.4 15Z" />
    </svg>
  );
}

export default function Notifications({
  navigate,
}) {
  const [activeTab, setActiveTab] =
    useState("All");

  function goToSettings() {
    navigate("/settings");
  }

  return (
    <div className="notifications-page">
      <div className="notifications-heading">
        <h1 className="page-title">
          Notifications
        </h1>

        <p className="page-sub">
          Stay on top of your trades, rewards,
          and social activity.
        </p>
      </div>

      <div
        className="notifications-tabs"
        role="tablist"
        aria-label="Notification categories"
      >
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            className={
              "notifications-tab" +
              (activeTab === tab
                ? " active"
                : "")
            }
            onClick={() =>
              setActiveTab(tab)
            }
            role="tab"
            aria-selected={
              activeTab === tab
            }
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="notifications-layout">
        <main className="notifications-main">
          <section className="notifications-empty-card">
            <div className="notifications-empty-icon">
              <BellIcon />
            </div>

            <h2>
              No notifications here
            </h2>

            <p>
              Check back later for updates.
            </p>
          </section>
        </main>

        <aside className="notifications-sidebar">
          <section className="notifications-card">
            <h2>
              Notification Summary
            </h2>

            <div className="notifications-summary-list">
              <div className="notifications-summary-row">
                <span>
                  Unread
                </span>

                <strong>
                  0
                </strong>
              </div>

              <div className="notifications-summary-row">
                <span>
                  Trades
                </span>

                <strong>
                  0
                </strong>
              </div>

              <div className="notifications-summary-row">
                <span>
                  Social
                </span>

                <strong>
                  0
                </strong>
              </div>

              <div className="notifications-summary-row">
                <span>
                  System
                </span>

                <strong>
                  0
                </strong>
              </div>
            </div>
          </section>

          <section className="notifications-card notifications-manage-card">
            <h2>
              Manage
              <br />
              Notifications
            </h2>

            <p>
              Choose which alerts you receive
              by push, email, or SMS in
              Settings.
            </p>

            <button
              type="button"
              className="notifications-settings-button"
              onClick={
                goToSettings
              }
            >
              <SettingsIcon />

              <span>
                Settings
              </span>
            </button>
          </section>
        </aside>
      </div>
    </div>
  );
}