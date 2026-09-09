import { useState } from "react";
import CategoryChips from "../components/CategoryChips.jsx";
import MarketCard from "../components/MarketCard.jsx";

const QUICK_FILTERS = ["High Volume", "Rising", "Falling", "New", "Closing Soon", "Favorites"];
const SORTS = ["Volume", "Newest", "Probability"];

export default function Markets({ markets, category, setCategory, sort, setSort, openMarket }) {
  const [quickFilter, setQuickFilter] = useState(null);

  let shown = markets;
  if (quickFilter === "High Volume") shown = [...markets].sort((a, b) => b.volume - a.volume);
  if (quickFilter === "Closing Soon") shown = [...markets].sort((a, b) => new Date(a.closesAt) - new Date(b.closesAt));

  return (
    <div>
      <h1 className="page-title">Markets</h1>
      <p className="page-sub">Explore all {markets.length} prediction markets. Trade on what you know.</p>
      <CategoryChips active={category} onSelect={setCategory} />
      <div className="layout-grid">
        <div>
          <div className="grid2">
            {shown.map((m) => <MarketCard key={m._id} market={m} small onClick={openMarket} />)}
            {shown.length === 0 && <div className="side-card">No markets match this filter yet.</div>}
          </div>
        </div>
        <div>
          <div className="side-card">
            <div className="filter-group">
              <div className="filter-label">Quick Filters</div>
              <div className="filter-list">
                {QUICK_FILTERS.map((f) => (
                  <div key={f} className={"filter-chip" + (quickFilter === f ? " active" : "")} onClick={() => setQuickFilter(quickFilter === f ? null : f)}>{f}</div>
                ))}
              </div>
            </div>
            <div className="filter-group" style={{ marginBottom: 0 }}>
              <div className="filter-label">Sort</div>
              <div className="filter-list">
                {SORTS.map((s) => (
                  <div key={s} className={"filter-chip" + (sort === s.toLowerCase() ? " active" : "")} onClick={() => setSort(s.toLowerCase())}>{s}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
