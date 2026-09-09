import { useState } from "react";

export default function Settings({ user }) {
  const [saved, setSaved] = useState(false);
  function save() {
    setSaved(true);
    setTimeout(() => setSaved(false), 1400);
  }
  return (
    <div>
      <h1 className="page-title">Settings</h1>
      <p className="page-sub">Manage your basic profile and identity verification.</p>
      <div className="layout-grid">
        <div className="side-card">
          <div className="side-title">Profile Information</div>
          <div className="filter-label" style={{ marginTop: 10 }}>Display Name</div>
          <div className="amt-input" style={{ fontFamily: "var(--font-body)", fontSize: 14 }}>{user.displayName}</div>
          <div className="filter-label">Username</div>
          <div className="amt-input" style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--text-tertiary)" }}>@{user.username}</div>
          <button className="cta" onClick={save}>{saved ? "✓ Saved" : "Save Changes"}</button>
        </div>
        <div>
          <div className="side-card">
            <div className="side-title">Account Overview</div>
            <div className="b-row"><span>Member Since</span><b>{new Date(user.createdAt).toLocaleDateString()}</b></div>
            <div className="b-row"><span>User ID</span><b>{user._id.slice(-8).toUpperCase()}</b></div>
            <div className="b-row"><span>Role</span><b>User</b></div>
          </div>
        </div>
      </div>
    </div>
  );
}
