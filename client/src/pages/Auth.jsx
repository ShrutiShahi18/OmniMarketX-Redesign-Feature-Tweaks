import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase";
import Logo from "../components/Logo.jsx";
import "../styles/auth.css";

const googleProvider = new GoogleAuthProvider();

export default function Auth() {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function friendlyError(code) {
    const errors = {
      "auth/email-already-in-use":
        "An account already exists with this email.",
      "auth/invalid-email":
        "Please enter a valid email address.",
      "auth/weak-password":
        "Password must be at least 6 characters.",
      "auth/invalid-credential":
        "Incorrect email or password.",
      "auth/user-not-found":
        "No account exists with this email.",
      "auth/wrong-password":
        "Incorrect email or password.",
      "auth/popup-closed-by-user":
        "Google sign-in was cancelled.",
      "auth/popup-blocked":
        "Your browser blocked the Google sign-in window.",
      "auth/network-request-failed":
        "Network error. Please check your connection.",
    };

    return errors[code] || "Something went wrong. Please try again.";
  }

  function switchMode(nextMode) {
    setMode(nextMode);
    setError("");
    setResetSent(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setResetSent(false);
    setLoading(true);

    try {
      if (mode === "signup") {
        if (!name.trim()) {
          throw new Error("Please enter your name.");
        }

        const result = await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );

        await updateProfile(result.user, {
          displayName: name.trim(),
        });
      } else {
        await signInWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );
      }
    } catch (err) {
      if (err.code) {
        setError(friendlyError(err.code));
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError("");
    setResetSent(false);
    setLoading(true);

    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      setError(friendlyError(err.code));
    } finally {
      setLoading(false);
    }
  }

  async function handleReset() {
    if (!email.trim()) {
      setError("Enter your email address first.");
      return;
    }

    setError("");
    setResetSent(false);
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email.trim());
      setResetSent(true);
    } catch (err) {
      setError(friendlyError(err.code));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <Logo size={42} />

          <div>
            <strong>OmniMarketX</strong>
            <small>Prediction markets</small>
          </div>
        </div>

        <div className="auth-heading">
          <h1>
            {mode === "login"
              ? "Welcome back"
              : "Create your account"}
          </h1>

          <p>
            {mode === "login"
              ? "Trade what matters. Sign in to continue."
              : "Join OmniMarketX and start trading what matters."}
          </p>
        </div>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        {resetSent && (
          <div className="auth-success">
            Password reset instructions have been sent to your email.
          </div>
        )}

        <button
          type="button"
          className="google-btn"
          onClick={handleGoogle}
          disabled={loading}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M21.35 12.23c0-.71-.06-1.39-.18-2.05H12v3.88h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.22Z"
            />
            <path
              fill="#34A853"
              d="M12 21.75c2.63 0 4.84-.87 6.45-2.35l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.74 9.74 0 0 0 12 21.75Z"
            />
            <path
              fill="#FBBC05"
              d="M6.54 13.84A5.85 5.85 0 0 1 6.23 12c0-.64.11-1.26.31-1.84V7.63H3.3A9.76 9.76 0 0 0 2.25 12c0 1.57.38 3.05 1.05 4.37l3.24-2.53Z"
            />
            <path
              fill="#EA4335"
              d="M12 6.13c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.23 14.63 2.25 12 2.25a9.74 9.74 0 0 0-8.7 5.38l3.24 2.53C7.31 7.85 9.46 6.13 12 6.13Z"
            />
          </svg>

          Continue with Google
        </button>

        <div className="auth-divider">
          <span>or continue with email</span>
        </div>

        <form onSubmit={handleSubmit}>
          {mode === "signup" && (
            <label>
              <span>Full name</span>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                autoComplete="name"
                disabled={loading}
                required
              />
            </label>
          )}

          <label>
            <span>Email</span>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              disabled={loading}
              required
            />
          </label>

          <label>
            <span>Password</span>

            <div className="password-wrap">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete={
                  mode === "signup"
                    ? "new-password"
                    : "current-password"
                }
                disabled={loading}
                required
                minLength={6}
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword((value) => !value)
                }
                tabIndex={-1}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </label>

          {mode === "login" && (
            <button
              type="button"
              className="forgot-btn"
              onClick={handleReset}
              disabled={loading}
            >
              Forgot password?
            </button>
          )}

          <button
            className="auth-submit"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : mode === "login"
                ? "Sign In"
                : "Create Account"}
          </button>
        </form>

        <div className="auth-switch">
          {mode === "login" ? (
            <>
              Don't have an account?
              <button
                type="button"
                onClick={() => switchMode("signup")}
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?
              <button
                type="button"
                onClick={() => switchMode("login")}
              >
                Sign in
              </button>
            </>
          )}
        </div>

        <p className="auth-terms">
          By continuing, you agree to the OmniMarketX terms and
          acknowledge the platform's demo trading environment.
        </p>
      </div>
    </div>
  );
}