export default function MarketCard({ market, featured, onClick, small }) {
  const pct = Math.round(market.yesPrice * 100);
  return (
    <div className={"card" + (featured ? " card-feat" : "")} onClick={() => onClick(market)}>
      <div className="card-cat">{market.icon} {market.category}{market.closesAt ? " · Closes " + new Date(market.closesAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : ""}</div>
      <div className="card-q" style={small ? { fontSize: "13.5px" } : undefined}>{market.question}</div>
      <div className="prob-row"><span className="prob-num" style={small ? { fontSize: "23px" } : undefined}>{pct}%</span></div>
      <div className="yn-row">
        <div className="yn yes"><span className="lbl">{market.yesLabel}</span><span className="price">{(market.yesPrice * 100).toFixed(1)}¢</span></div>
        <div className="yn no"><span className="lbl">{market.noLabel}</span><span className="price">{(market.noPrice * 100).toFixed(1)}¢</span></div>
      </div>
      <div className="card-meta"><span>VOL ${market.volume}</span><span>{market.traders} TRADERS</span></div>
    </div>
  );
}
