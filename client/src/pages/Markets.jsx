import { useMemo, useState } from "react";
import CategoryChips from "../components/CategoryChips.jsx";
import MarketCard from "../components/MarketCard.jsx";

const QUICK_FILTERS = [
  "High Volume",
  "Rising",
  "Falling",
  "New",
  "Closing Soon",
  "Favorites",
];

const SORTS = [
  "Volume",
  "Newest",
  "Probability",
];

function getTimestamp(value) {
  const time = new Date(value || 0).getTime();
  return Number.isFinite(time) ? time : 0;
}

function getVolume(market) {
  return Number(market?.volume || 0);
}

function getProbability(market) {
  return Number(market?.yesPrice || 0);
}

function getFavoriteIds() {
  try {
    const saved = localStorage.getItem(
      "omx_favorite_markets"
    );

    if (!saved) return [];

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function Markets({
  markets = [],
  navigate,
}) {
  const [category, setCategory] = useState("All");
  const [quickFilter, setQuickFilter] = useState(null);
  const [sort, setSort] = useState("volume");

  const filteredMarkets = useMemo(() => {
    let result = [...markets];

    /* -------------------------
       CATEGORY
       ------------------------- */

    if (category !== "All") {
      result = result.filter(
        (market) =>
          String(market.category || "").toLowerCase() ===
          category.toLowerCase()
      );
    }

    /* -------------------------
       QUICK FILTERS
       ------------------------- */

    if (quickFilter === "High Volume") {
      result.sort(
        (a, b) => getVolume(b) - getVolume(a)
      );
    }

    if (quickFilter === "Rising") {
      result = result
        .filter(
          (market) =>
            getProbability(market) >= 0.5
        )
        .sort(
          (a, b) =>
            getProbability(b) -
            getProbability(a)
        );
    }

    if (quickFilter === "Falling") {
      result = result
        .filter(
          (market) =>
            getProbability(market) < 0.5
        )
        .sort(
          (a, b) =>
            getProbability(a) -
            getProbability(b)
        );
    }

    if (quickFilter === "New") {
      result.sort(
        (a, b) =>
          getTimestamp(b.createdAt) -
          getTimestamp(a.createdAt)
      );
    }

    if (quickFilter === "Closing Soon") {
      result = result
        .filter((market) => market.closesAt)
        .sort(
          (a, b) =>
            getTimestamp(a.closesAt) -
            getTimestamp(b.closesAt)
        );
    }

    if (quickFilter === "Favorites") {
      const favoriteIds = getFavoriteIds();

      result = result.filter((market) =>
        favoriteIds.includes(String(market._id))
      );
    }

    /* -------------------------
       SORT
       ------------------------- */

    if (!quickFilter) {
      if (sort === "volume") {
        result.sort(
          (a, b) =>
            getVolume(b) - getVolume(a)
        );
      }

      if (sort === "newest") {
        result.sort(
          (a, b) =>
            getTimestamp(b.createdAt) -
            getTimestamp(a.createdAt)
        );
      }

      if (sort === "probability") {
        result.sort(
          (a, b) =>
            getProbability(b) -
            getProbability(a)
        );
      }
    }

    return result;
  }, [
    markets,
    category,
    quickFilter,
    sort,
  ]);

  function handleQuickFilter(filter) {
    setQuickFilter((current) =>
      current === filter ? null : filter
    );
  }

  function handleSort(value) {
    setSort(value);
    setQuickFilter(null);
  }

  function openMarket(market) {
    if (!market?._id) return;

    navigate(`/market/${market._id}`);
  }

  const filterDescription = quickFilter
    ? `${quickFilter} · ${filteredMarkets.length} results`
    : `${filteredMarkets.length} markets`;

  return (
    <section className="page-section">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            Markets
          </h1>

          <p className="page-sub">
            Explore all {markets.length} prediction
            markets. Trade on what you know.
          </p>
        </div>
      </div>

      <CategoryChips
        active={category}
        onSelect={(value) => {
          setCategory(value);
          setQuickFilter(null);
        }}
      />

      <div className="layout-grid">
        <div>
          <div
            className="section-head"
            style={{ marginBottom: 14 }}
          >
            <h2>
              {quickFilter || "All Markets"}
            </h2>

            <span
              style={{
                color: "var(--text-tertiary)",
                fontSize: 11,
              }}
            >
              {filterDescription}
            </span>
          </div>

          {filteredMarkets.length === 0 ? (
            <div className="side-card">
              <div
                style={{
                  padding: "22px 4px",
                  textAlign: "center",
                }}
              >
                <strong
                  style={{
                    display: "block",
                    marginBottom: 6,
                    color: "var(--text-primary)",
                  }}
                >
                  No markets match this filter
                </strong>

                <span
                  style={{
                    color: "var(--text-tertiary)",
                    fontSize: 12,
                  }}
                >
                  Try another category or filter.
                </span>
              </div>
            </div>
          ) : (
            <div className="grid2">
              {filteredMarkets.map((market) => (
                <MarketCard
                  key={market._id}
                  market={market}
                  small
                  onClick={openMarket}
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="side-card">
            <div className="filter-group">
              <div className="filter-label">
                Quick Filters
              </div>

              <div className="filter-list">
                {QUICK_FILTERS.map((filter) => (
                  <div
                    key={filter}
                    className={
                      "filter-chip" +
                      (quickFilter === filter
                        ? " active"
                        : "")
                    }
                    onClick={() =>
                      handleQuickFilter(filter)
                    }
                  >
                    {filter}
                  </div>
                ))}
              </div>
            </div>

            <div
              className="filter-group"
              style={{ marginBottom: 0 }}
            >
              <div className="filter-label">
                Sort
              </div>

              <div className="filter-list">
                {SORTS.map((value) => {
                  const key =
                    value.toLowerCase();

                  return (
                    <div
                      key={value}
                      className={
                        "filter-chip" +
                        (!quickFilter &&
                        sort === key
                          ? " active"
                          : "")
                      }
                      onClick={() =>
                        handleSort(key)
                      }
                    >
                      {value}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div
            className="side-card"
            style={{ marginTop: 14 }}
          >
            <div className="side-title">
              Filter Guide
            </div>

            <div
              style={{
                color: "var(--text-secondary)",
                fontSize: 11,
                lineHeight: 1.7,
              }}
            >
              <div>
                <b>High Volume</b> — busiest markets
              </div>

              <div>
                <b>Rising</b> — 50%+ YES probability
              </div>

              <div>
                <b>Falling</b> — below 50% YES probability
              </div>

              <div>
                <b>New</b> — recently created markets
              </div>

              <div>
                <b>Closing Soon</b> — nearest deadlines
              </div>

              <div>
                <b>Favorites</b> — markets saved as favorites
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}