import { useState } from "react";

export default function Topbar({ user, mode, setMode, setScreen }) {
  const [open, setOpen] = useState(null); // 'msg' | 'notif' | 'avatar' | null

  return (
    <div className="topbar" onClick={() => setOpen(null)}>
      <div className="search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
        Search markets, events, users
      </div>
      <div className="topbar-right">
        <div className="mode-pill" onClick={(e) => { e.stopPropagation(); setMode(mode === "demo" ? "real" : "demo"); }}>
          <span className={mode === "real" ? "on" : ""}>Real</span>
          <span className={mode === "demo" ? "on" : ""}>Demo</span>
        </div>

        <div className="dd-wrap">
          <div className="icon-btn" onClick={(e) => { e.stopPropagation(); setOpen(open === "msg" ? null : "msg"); }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
          </div>
          <div className={"dd-panel" + (open === "msg" ? "" : " hidden")} onClick={(e) => e.stopPropagation()}>
            <div className="dd-title">Messages</div><div className="dd-empty">No messages yet</div>
          </div>
        </div>

        <div className="dd-wrap">
          <div className="icon-btn" onClick={(e) => { e.stopPropagation(); setOpen(open === "notif" ? null : "notif"); }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 01-3.4 0"/></svg>
          </div>
          <div className={"dd-panel" + (open === "notif" ? "" : " hidden")} onClick={(e) => e.stopPropagation()}>
            <div className="dd-title">Notifications</div><div className="dd-empty">No notifications here</div>
          </div>
        </div>

        <div className="dd-wrap">
          <div className="avatar" onClick={(e) => { e.stopPropagation(); setOpen(open === "avatar" ? null : "avatar"); }}>SS</div>
          <div className={"dd-panel wide" + (open === "avatar" ? "" : " hidden")} onClick={(e) => e.stopPropagation()}>
            <div className="dd-header">
              <div className="avatar">SS</div>
              <div><div className="name">{user?.displayName || "Shruti Shahi"}</div><div className="handle">omnimarketx.com/u/{user?.username || "yoshruti18"}</div></div>
            </div>
            <div className="dd-body">
              <div className="dd-item"><span className="ic">👤</span>View Profile</div>
              <div className="dd-item"><span className="ic">💳</span>Deposit</div>
              <div className="dd-item" onClick={() => { setScreen("settings"); setOpen(null); }}><span className="ic">⚙️</span>Settings</div>
              <div className="dd-divider"></div>
              <div className="dd-item danger" style={{ color: "var(--negative)" }}><span className="ic">✕</span>Log Out</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
