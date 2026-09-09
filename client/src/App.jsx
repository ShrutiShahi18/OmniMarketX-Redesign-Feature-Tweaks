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

export default function App() {
  const [theme, setTheme] = useState("dark");
  const [screen, setScreen] = useState("home");
  const [mode, setMode] = useState("demo");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("volume");
  const [isPro, setIsProState] = useState(() => localStorage.getItem("omx_pro") === "1");
  function setIsPro(val) { localStorage.setItem("omx_pro", val ? "1" : "0"); setIsProState(val); }

  const [user, setUser] = useState(null);
  const [markets, setMarkets] = useState([]);
  const [allMarkets, setAllMarkets] = useState([]);
  const [posts, setPosts] = useState([]);
  const [history, setHistory] = useState([]);
  const [positions, setPositions] = useState([]);
  const [activeMarket, setActiveMarket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [me, allM, ps] = await Promise.all([api.getMe(), api.getMarkets(), api.getPosts()]);
      setUser(me);
      setAllMarkets(allM);
      setPosts(ps);
      setLoading(false);
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

  function openMarket(m) {
    setActiveMarket(m);
    setScreen("detail");
  }

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.body.setAttribute("data-theme", next);
  }

  if (loading || !user) {
    return (
      <div className="omx-loading">
        <div className="brand-mark"><Logo size={26} /></div>
        <div className="lbl">Loading OmniMarketX…</div>
      </div>
    );
  }

  const displayMarkets = markets.length ? markets : allMarkets;

  if (screen === "checkout") {
    return <Checkout user={user} setIsPro={setIsPro} goBack={() => setScreen("subscription")} />;
  }

  return (
    <>
      <Ticker markets={allMarkets} />
      <div className="shell">
        <Sidebar screen={screen} setScreen={setScreen} theme={theme} toggleTheme={toggleTheme} isPro={isPro} />
        <div className="main">
          <Topbar user={user} mode={mode} setMode={setMode} setScreen={setScreen} />

          {screen === "home" && <Home markets={allMarkets} category={category} setCategory={setCategory} openMarket={openMarket} setScreen={setScreen} posts={posts} />}
          {screen === "learn" && <Learn setScreen={setScreen} />}
          {screen === "markets" && <Markets markets={displayMarkets} category={category} setCategory={setCategory} sort={sort} setSort={setSort} openMarket={openMarket} />}
          {screen === "trending" && <Trending markets={allMarkets} category={category} setCategory={setCategory} openMarket={openMarket} />}
          {screen === "social" && <Social posts={posts} setPosts={setPosts} user={user} />}
          {screen === "portfolio" && <Portfolio positions={positions} user={user} openMarket={openMarket} />}
          {screen === "wallet" && <Wallet user={user} setUser={setUser} history={history} setHistory={setHistory} />}
          {screen === "leaderboard" && <Leaderboard />}
          {screen === "activity" && <Activity history={history} />}
          {screen === "groups" && <Groups />}
          {screen === "settings" && <Settings user={user} />}
          {screen === "subscription" && <Subscription isPro={isPro} setIsPro={setIsPro} setScreen={setScreen} />}
          {screen === "detail" && activeMarket && (
            <MarketDetail market={activeMarket} user={user} setUser={setUser} setScreen={setScreen} onTradeExecuted={() => refreshWalletData(user._id)} />
          )}
        </div>
      </div>
      <div className="assist-fab" title="Ask the market assistant">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
      </div>
    </>
  );
}
