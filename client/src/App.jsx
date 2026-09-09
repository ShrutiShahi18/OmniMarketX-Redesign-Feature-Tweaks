import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { api } from "./api";

import Auth from "./pages/Auth.jsx";
import Home from "./pages/Home.jsx";
import Learn from "./pages/Learn.jsx";
import Markets from "./pages/Markets.jsx";
import MarketDetail from "./pages/MarketDetail.jsx";
import Social from "./pages/Social.jsx";
import Portfolio from "./pages/Portfolio.jsx";
import Profile from "./pages/Profile.jsx";
import Wallet from "./pages/Wallet.jsx";
import Leaderboard from "./pages/Leaderboard.jsx";
import Activity from "./pages/Activity.jsx";
import Groups from "./pages/Groups.jsx";
import Settings from "./pages/Settings.jsx";
import Subscription from "./pages/Subscription.jsx";
import Checkout from "./pages/Checkout.jsx";
import Notifications from "./pages/Notifications.jsx";
import Messages from "./pages/Messages.jsx";

import Sidebar from "./components/Sidebar.jsx";
import Topbar from "./components/Topbar.jsx";
import Ticker from "./components/Ticker.jsx";
import Logo from "./components/Logo.jsx";

import "./styles/app.css";

const ROUTES = {
  "/": "home",
  "/home": "home",
  "/learn": "learn",
  "/markets": "markets",
  "/trending": "trending",
  "/social": "social",
  "/portfolio": "portfolio",
  "/profile": "profile",
  "/wallet": "wallet",
  "/leaderboard": "leaderboard",
  "/activity": "activity",
  "/groups": "groups",
  "/settings": "settings",
  "/subscription": "subscription",
  "/checkout": "checkout",
  "/notifications": "notifications",
  "/messages": "messages",
};

function getRoute() {
  const path = window.location.pathname;

  if (path.startsWith("/market/")) {
    return {
      screen: "market",
      marketId: path.split("/")[2],
    };
  }

  return {
    screen: ROUTES[path] || "home",
    marketId: null,
  };
}

function LoadingScreen({ text }) {
  return (
    <div className="omx-loading">
      <div className="omx-loading-logo">
        <Logo />
      </div>

      <div className="omx-loading-name">
        OmniMarketX
      </div>

      <div className="omx-loading-spinner" />

      <div className="omx-loading-text">
        {text}
      </div>
    </div>
  );
}

export default function App() {
  const { user: firebaseUser, authLoading } = useAuth();

  const [route, setRoute] = useState(getRoute);
  const [user, setUser] = useState(null);
  const [markets, setMarkets] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("omx_theme");

    return savedTheme === "light"
      ? "light"
      : "dark";
  });

  const screen = route.screen;

  useEffect(() => {
    localStorage.setItem("omx_theme", theme);

    document.documentElement.dataset.theme =
      theme;

    document.body.dataset.theme = theme;
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((currentTheme) =>
      currentTheme === "dark"
        ? "light"
        : "dark"
    );
  }, []);

  const navigate = useCallback((path) => {
    window.history.pushState({}, "", path);
    setRoute(getRoute());
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setRoute(getRoute());
      window.scrollTo(0, 0);
    };

    window.addEventListener(
      "popstate",
      handlePopState
    );

    return () => {
      window.removeEventListener(
        "popstate",
        handlePopState
      );
    };
  }, []);

  useEffect(() => {
    if (authLoading) return;

    if (!firebaseUser) {
      setUser(null);
      setMarkets([]);
      setPosts([]);
      setLoading(false);
      setLoadError("");
      return;
    }

    let cancelled = false;

    async function loadAppData() {
      setLoading(true);
      setLoadError("");

      try {
        const timeoutPromise =
          new Promise((_, reject) => {
            setTimeout(() => {
              reject(
                new Error(
                  "The backend did not respond within 15 seconds."
                )
              );
            }, 15000);
          });

        const dataPromise = Promise.all([
          api.getMe(),
          api.getMarkets(),
          api.getPosts(),
        ]);

        const [me, marketData, postData] =
          await Promise.race([
            dataPromise,
            timeoutPromise,
          ]);

        if (cancelled) return;

        setUser(me);
        setMarkets(marketData);
        setPosts(postData);
      } catch (error) {
        if (cancelled) return;

        console.error(
          "Failed to load OmniMarketX:",
          error
        );

        setLoadError(
          error?.message ||
            "Failed to connect to the OmniMarketX backend."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadAppData();

    return () => {
      cancelled = true;
    };
  }, [authLoading, firebaseUser]);

  const refreshMarkets = useCallback(
    async () => {
      try {
        const data = await api.getMarkets();
        setMarkets(data);
      } catch (error) {
        console.error(
          "Failed to refresh markets:",
          error
        );
      }
    },
    []
  );

  const refreshPosts = useCallback(
    async () => {
      try {
        const data = await api.getPosts();
        setPosts(data);
      } catch (error) {
        console.error(
          "Failed to refresh posts:",
          error
        );
      }
    },
    []
  );

  const handleUserUpdated = useCallback(
    (updatedUser) => {
      setUser(updatedUser);
    },
    []
  );

  const handleTrade = useCallback(
    async (tradeData) => {
      const result =
        await api.postTrade(tradeData);

      setUser((current) =>
        current
          ? {
              ...current,
              demoBalance:
                result.newBalance,
            }
          : current
      );

      await refreshMarkets();

      return result;
    },
    [refreshMarkets]
  );

  const handleCreatePost = useCallback(
    async (content) => {
      await api.createPost({ content });
      await refreshPosts();
    },
    [refreshPosts]
  );

  const handleLikePost = useCallback(
    async (postId) => {
      await api.likePost(postId);
      await refreshPosts();
    },
    [refreshPosts]
  );

  if (authLoading) {
    return (
      <LoadingScreen text="Checking authentication…" />
    );
  }

  if (!firebaseUser) {
    return <Auth />;
  }

  if (loading) {
    return (
      <LoadingScreen text="Loading OmniMarketX…" />
    );
  }

  if (loadError || !user) {
    return (
      <div className="omx-loading">
        <div className="omx-loading-logo">
          <Logo />
        </div>

        <div className="omx-loading-name">
          OmniMarketX
        </div>

        <div className="card omx-error-card">
          <h2>
            Couldn't connect to OmniMarketX
          </h2>

          <p>
            {loadError ||
              "Your account was authenticated, but the application data could not be loaded."}
          </p>

          <button
            type="button"
            className="cta"
            onClick={() =>
              window.location.reload()
            }
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const commonProps = {
    user,
    markets,
    posts,
    navigate,
    refreshMarkets,
    refreshPosts,
    onTrade: handleTrade,
    onCreatePost: handleCreatePost,
    onLikePost: handleLikePost,
    onUserUpdated: handleUserUpdated,
  };

  let page;

  switch (screen) {
    case "learn":
      page = <Learn {...commonProps} />;
      break;

    case "markets":
      page = <Markets {...commonProps} />;
      break;

    case "market":
      page = (
        <MarketDetail
          {...commonProps}
          marketId={route.marketId}
        />
      );
      break;

    case "social":
      page = <Social {...commonProps} />;
      break;

    case "portfolio":
      page = <Portfolio {...commonProps} />;
      break;

    case "profile":
      page = <Profile {...commonProps} />;
      break;

    case "wallet":
      page = <Wallet {...commonProps} />;
      break;

    case "leaderboard":
      page = <Leaderboard {...commonProps} />;
      break;

    case "activity":
      page = <Activity {...commonProps} />;
      break;

    case "groups":
      page = <Groups {...commonProps} />;
      break;

    case "settings":
      page = <Settings {...commonProps} />;
      break;

    case "subscription":
      page = <Subscription {...commonProps} />;
      break;

    case "checkout":
      page = <Checkout {...commonProps} />;
      break;

    case "notifications":
      page = (
        <Notifications
          {...commonProps}
        />
      );
      break;

    case "messages":
      page = <Messages {...commonProps} />;
      break;

    case "home":
    default:
      page = <Home {...commonProps} />;
      break;
  }

  return (
    <>
      <Ticker markets={markets} />

      <div
        className={`shell theme-${theme}`}
      >
        <Sidebar
          screen={screen}
          navigate={navigate}
          theme={theme}
          toggleTheme={toggleTheme}
          isPro={false}
        />

        <main className="main">
          <Topbar
            user={user}
            screen={screen}
            navigate={navigate}
          />

          {page}
        </main>
      </div>
    </>
  );
}