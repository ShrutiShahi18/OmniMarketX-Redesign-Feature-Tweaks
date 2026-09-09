import { useEffect, useState } from "react";
import { api } from "./api.js";
import Sidebar from "./components/Sidebar.jsx";
import Topbar from "./components/Topbar.jsx";
import Ticker from "./components/Ticker.jsx";
import Home from "./pages/Home.jsx";
import Learn from "./pages/Learn.jsx";
import Markets from "./pages/Markets.jsx";
import Trending from "./pages/Trending.jsx";
import Social from "./pages/Social.jsx";
import Portfolio from "./pages/Portfolio.jsx";
import Wallet from "./pages/Wallet.jsx";
import Leaderboard from "./pages/Leaderboard.jsx";
import Activity from "./pages/Activity.jsx";
import Groups from "./pages/Groups.jsx";
import Settings from "./pages/Settings.jsx";
import Subscription from "./pages/Subscription.jsx";
import Checkout from "./pages/Checkout.jsx";
import Logo from "./components/Logo.jsx";
import MarketDetail from "./pages/MarketDetail.jsx";

const SCREEN_PATHS = {
  home: "/",
  learn: "/learn",
  markets: "/markets",
  trending: "/trending",
  social: "/social",
  portfolio: "/portfolio",
  wallet: "/wallet",
  leaderboard: "/leaderboard",
  activity: "/activity",
  groups: "/groups",
  settings: "/settings",
  subscription: "/subscription",
  checkout: "/checkout",
};

function getRouteFromPath() {
  const path = window.location.pathname;

  if (path === "/" || path === "") {
    return { screen: "home" };
  }

  if (path.startsWith("/market/")) {
    const id = path.split("/market/")[1];

    return {
      screen: "detail",
      marketId: id,
    };
  }

  const entry = Object.entries(SCREEN_PATHS).find(
    ([, route]) => route === path
  );

  if (entry) {
    return { screen: entry[0] };
  }

  return { screen: "home" };
}

export default function App() {
  const initialRoute = getRouteFromPath();

  const [theme, setTheme] = useState("dark");
  const [screen, setScreen] = useState(initialRoute.screen);
  const [mode, setMode] = useState("demo");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("volume");
  const [isPro, setIsProState] = useState(
    () => localStorage.getItem("omx_pro") === "1"
  );

  function setIsPro(val) {
    localStorage.setItem("omx_pro", val ? "1" : "0");
    setIsProState(val);
  }

  const [user, setUser] = useState(null);
  const [markets, setMarkets] = useState([]);
  const [allMarkets, setAllMarkets] = useState([]);
  const [posts, setPosts] = useState([]);
  const [history, setHistory] = useState([]);
  const [positions, setPositions] = useState([]);
  const [activeMarket, setActiveMarket] = useState(null);
  const [loading, setLoading] = useState(true);

  /*
   * Handle browser Back / Forward buttons
   * and mobile browser swipe navigation.
   */
  useEffect(() => {
    function handlePopState() {
      const route = getRouteFromPath();

      setScreen(route.screen);

      if (route.screen === "detail" && route.marketId) {
        const existingMarket = allMarkets.find(
          (market) => String(market._id) === String(route.marketId)
        );

        if (existingMarket) {
          setActiveMarket(existingMarket);
        } else {
          api
            .getMarket(route.marketId)
            .then(setActiveMarket)
            .catch(() => {
              window.history.replaceState({}, "", "/");
              setScreen("home");
              setActiveMarket(null);
            });
        }
      } else {
        setActiveMarket(null);
      }
    }

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [allMarkets]);

  /*
   * Load initial application data.
   */
  useEffect(() => {
    (async () => {
      try {
        const [me, allM, ps] = await Promise.all([
          api.getMe(),
          api.getMarkets(),
          api.getPosts(),
        ]);

        setUser(me);
        setAllMarkets(allM);
        setPosts(ps);

        /*
         * If the user opened a market URL directly,
         * restore that market after the initial data loads.
         */
        const route = getRouteFromPath();

        if (route.screen === "detail" && route.marketId) {
          const market = allM.find(
            (item) => String(item._id) === String(route.marketId)
          );

          if (market) {
            setActiveMarket(market);
          } else {
            try {
              const fetchedMarket = await api.getMarket(route.marketId);
              setActiveMarket(fetchedMarket);
            } catch {
              window.history.replaceState({}, "", "/");
              setScreen("home");
            }
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Failed to load OmniMarketX:", error);
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    api.getMarkets(category, sort).then(setMarkets);
  }, [category, sort]);

  useEffect(() => {
    if (!user) return;
    refreshWalletData(user._id);
  }, [user?._id]);

  function refreshWalletData(userId) {
    api.getHistory(userId).then(setHistory);
    api.getPositions(userId).then(setPositions);
  }

  /*
   * Central navigation function.
   *
   * Every normal in-app navigation creates a browser
   * history entry, so Back / Forward work naturally.
   */
  function navigate(nextScreen, market = null) {
    let path = SCREEN_PATHS[nextScreen] || "/";

    if (nextScreen === "detail") {
      if (!market?._id) return;

      path = `/market/${market._id}`;
      setActiveMarket(market);
    } else {
      setActiveMarket(null);
    }

    window.history.pushState({}, "", path);
    setScreen(nextScreen);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function openMarket(m) {
    navigate("detail", m);
  }

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";

    setTheme(next);
    document.body.setAttribute("data-theme", next);
  }

  if (loading || !user) {
    return (
      <div className="omx-loading">
        <div className="brand-mark">
          <Logo size={26} />
        </div>

        <div className="lbl">Loading OmniMarketX…</div>
      </div>
    );
  }

  const displayMarkets = markets.length ? markets : allMarkets;

  /*
   * Checkout is rendered separately, just like before,
   * but now its Back action also participates in browser history.
   */
  if (screen === "checkout") {
    return (
      <Checkout
        user={user}
        setIsPro={setIsPro}
        goBack={() => navigate("subscription")}
      />
    );
  }

  return (
    <>
      <Ticker markets={allMarkets} />

      <div className="shell">
        <Sidebar
          screen={screen}
          setScreen={navigate}
          theme={theme}
          toggleTheme={toggleTheme}
          isPro={isPro}
        />

        <div className="main">
          <Topbar
            user={user}
            mode={mode}
            setMode={setMode}
            setScreen={navigate}
          />

          {screen === "home" && (
            <Home
              markets={allMarkets}
              category={category}
              setCategory={setCategory}
              openMarket={openMarket}
              setScreen={navigate}
              posts={posts}
            />
          )}

          {screen === "learn" && (
            <Learn setScreen={navigate} />
          )}

          {screen === "markets" && (
            <Markets
              markets={displayMarkets}
              category={category}
              setCategory={setCategory}
              sort={sort}
              setSort={setSort}
              openMarket={openMarket}
            />
          )}

          {screen === "trending" && (
            <Trending
              markets={allMarkets}
              category={category}
              setCategory={setCategory}
              openMarket={openMarket}
            />
          )}

          {screen === "social" && (
            <Social
              posts={posts}
              setPosts={setPosts}
              user={user}
            />
          )}

          {screen === "portfolio" && (
            <Portfolio
              positions={positions}
              user={user}
              openMarket={openMarket}
            />
          )}

          {screen === "wallet" && (
            <Wallet
              user={user}
              setUser={setUser}
              history={history}
              setHistory={setHistory}
            />
          )}

          {screen === "leaderboard" && <Leaderboard />}

          {screen === "activity" && (
            <Activity history={history} />
          )}

          {screen === "groups" && <Groups />}

          {screen === "settings" && (
            <Settings user={user} />
          )}

          {screen === "subscription" && (
            <Subscription
              isPro={isPro}
              setIsPro={setIsPro}
              setScreen={navigate}
            />
          )}

          {screen === "detail" && activeMarket && (
            <MarketDetail
              market={activeMarket}
              user={user}
              setUser={setUser}
              setScreen={navigate}
              onTradeExecuted={() =>
                refreshWalletData(user._id)
              }
            />
          )}
        </div>
      </div>

      <div
        className="assist-fab"
        title="Ask the market assistant"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
      </div>
    </>
  );
}