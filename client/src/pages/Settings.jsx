import { useEffect, useState } from "react";
import { updateProfile } from "firebase/auth";
import { auth } from "../firebase";
import { api } from "../api";

export default function Settings({ user, onUserUpdated }) {
    const [displayName, setDisplayName] = useState(user?.displayName || "");

    const [username, setUsername] = useState(user?.username || "");

    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        setDisplayName(user?.displayName || "");
        setUsername(user?.username || "");
    }, [user]);

    async function handleSave(e) {
        e.preventDefault();

        setMessage("");
        setError("");

        const cleanName = displayName.trim();
        const cleanUsername = username.trim().toLowerCase().replace(/^@/, "");

        if (!cleanName) {
            setError("Display name cannot be empty.");
            return;
        }

        if (!/^[a-z0-9_]{3,30}$/.test(cleanUsername)) {
            setError(
                "Username must be 3–30 characters and use only letters, numbers, and underscores.",
            );
            return;
        }

        setSaving(true);

        try {
            const updatedUser = await api.updateMe({
                displayName: cleanName,
                username: cleanUsername,
            });

            if (auth.currentUser) {
                await updateProfile(auth.currentUser, {
                    displayName: cleanName,
                });
            }

            if (onUserUpdated) {
                onUserUpdated(updatedUser);
            }

            setDisplayName(updatedUser.displayName);
            setUsername(updatedUser.username);

            setMessage("Profile updated successfully.");

            setTimeout(() => {
                setMessage("");
            }, 2000);
        } catch (err) {
            console.error("Failed to update profile:", err);
            setError(err.message || "Failed to update profile.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <section className="page-section">
            <div className="page-header">
                <div>
                    <h1>Settings</h1>
                    <p>Manage your OmniMarketX profile and account.</p>
                </div>
            </div>

            {message && (
                <div className="card">
                    <div className="wallet-message success">{message}</div>
                </div>
            )}

            {error && (
                <div className="card">
                    <div className="wallet-message error">{error}</div>
                </div>
            )}

            <form onSubmit={handleSave}>
                <div className="card">
                    <div className="card-header">
                        <div>
                            <h2>Profile Information</h2>
                            <p>
                                Update the information shown on your OmniMarketX
                                profile.
                            </p>
                        </div>
                    </div>

                    <div className="settings-profile-preview">
                        {user?.photoURL ? (
                            <img
                                src={user.photoURL}
                                alt=""
                                className="settings-avatar"
                            />
                        ) : (
                            <div className="settings-avatar">
                                {(displayName || "OM")
                                    .split(" ")
                                    .filter(Boolean)
                                    .slice(0, 2)
                                    .map((part) => part[0])
                                    .join("")
                                    .toUpperCase()}
                            </div>
                        )}

                        <div>
                            <strong>{displayName || "OmniMarketX User"}</strong>
                            <span>@{username || "user"}</span>
                        </div>
                    </div>

                    <div className="settings-fields">
                        <label className="settings-field">
                            <span>Display Name</span>

                            <input
                                type="text"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                placeholder="Your name"
                                maxLength={60}
                                disabled={saving}
                            />
                        </label>

                        <label className="settings-field">
                            <span>Username</span>

                            <div className="settings-username-input">
                                <span>@</span>

                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) =>
                                        setUsername(
                                            e.target.value
                                                .toLowerCase()
                                                .replace(/[^a-z0-9_]/g, ""),
                                        )
                                    }
                                    placeholder="username"
                                    maxLength={30}
                                    disabled={saving}
                                />
                            </div>
                        </label>

                        <label className="settings-field">
                            <span>Email</span>

                            <input
                                type="email"
                                value={user?.email || ""}
                                disabled
                                readOnly
                            />

                            <small>
                                Your email is managed by Firebase
                                Authentication.
                            </small>
                        </label>
                    </div>

                    <div className="settings-actions">
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={saving}
                        >
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </div>
            </form>

            <div className="card">
                <div className="card-header">
                    <div>
                        <h2>Account Overview</h2>
                        <p>Your OmniMarketX account details.</p>
                    </div>
                </div>

                <div className="profile-account-list">
                    <div className="profile-account-row">
                        <span>Email</span>
                        <strong>{user?.email || "—"}</strong>
                    </div>

                    <div className="profile-account-row">
                        <span>Username</span>
                        <strong>@{user?.username || "—"}</strong>
                    </div>

                    <div className="profile-account-row">
                        <span>Member Since</span>
                        <strong>
                            {user?.createdAt
                                ? new Date(user.createdAt).toLocaleDateString(
                                      undefined,
                                      {
                                          month: "short",
                                          year: "numeric",
                                      },
                                  )
                                : "—"}
                        </strong>
                    </div>

                    <div className="profile-account-row">
                        <span>Account ID</span>
                        <strong>{user?._id ? user._id.slice(-8) : "—"}</strong>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <div>
                        <h2>Authentication</h2>
                        <p>
                            Your sign-in credentials are securely handled by
                            Firebase.
                        </p>
                    </div>
                </div>

                <div className="settings-info-row">
                    <span>Sign-in email</span>
                    <strong>{user?.email || "—"}</strong>
                </div>

                <div className="settings-info-row">
                    <span>Authentication provider</span>
                    <strong>Firebase Authentication</strong>
                </div>
            </div>
        </section>
    );
}
