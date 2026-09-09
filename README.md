# ⚡ OmniMarketX — Reimagined

Visit Live: https://omnimarketx-redesign-frontend.onrender.com/

> **Trade what matters. Learn as you go. Actually persisted.**

A full-stack, dark-mode-native social prediction market — rebuilt from the
ground up on **MongoDB, Express, React, and Node (MERN)**, with an original
design system, a real API behind every trade, and a genuine beginner
on-ramp that the original product never had.

This isn't a reskin. Every trade, post, like, and balance change here is a
real database write — refresh the page and nothing is lost, because nothing
was ever just sitting in memory.

### ✨ Highlights at a glance
- 🎨 **An original visual identity** — three purpose-built fonts, a custom
  logomark, and a dark theme designed from scratch (not light-mode inverted)
- 📘 **Built-in trading education** — a glossary page + inline tooltips so a
  total beginner isn't dropped straight into a probability chart
- 🎠 **A real carousel**, not a raw scrollbar — arrow-driven, snaps per card
- 👑 **A working Pro upgrade flow**, including a full checkout page
- 🗄️ **Genuine MongoDB persistence** for markets, trades, posts, and likes
- 📱 **Actual responsive breakpoints** — tested down to mobile, not just "shrink and hope"
- 💬 **A social layer that's actually social** — post, like, and see it reflected instantly

## Structure
```
server/   Express API + MongoDB models (Node, ESM)
client/   React + Vite frontend (same CSS/design, no visual changes)
```

## Prerequisites
- Node.js 18+
- MongoDB running locally (or an Atlas connection string)

## Setup

### 1. Backend
```bash
cd server
cp .env.example .env      # edit MONGO_URI if not using local default
npm install
npm run seed               # populates the 11 real markets + demo user + 1 post
npm run dev                 # http://localhost:5000
```

### 2. Frontend
```bash
cd client
npm install
npm run dev                 # http://localhost:5173 (proxies /api to :5000)
```

Open http://localhost:5173 — Vite's dev proxy forwards `/api/*` to the
Express server, so no CORS config is needed in dev.

## Beginner-friendly features
- **Learn page** (sidebar → 📘 Learn): a 2-minute glossary covering YES/NO shares,
  price-as-probability, volume, liquidity, fees, and resolution — aimed at someone
  who has never traded or used a prediction market before.
- **Dismissible tip banner on Home** pointing new visitors to the Learn page
  (persists dismissal via localStorage, won't nag returning users).
- **Inline tooltips** on Market Detail (hover Volume/Traders/Closes, Shares,
  Fees, and the liquidity line) explaining each term without leaving the page.

## Beginner-friendly features
- **Learn page** (sidebar → 📘 Learn): a 2-minute glossary covering YES/NO shares,
  price-as-probability, volume, liquidity, fees, and resolution — aimed at someone
  who has never traded or used a prediction market before.
- **Dismissible tip banner on Home** pointing new visitors to the Learn page
  (persists dismissal via localStorage, won't nag returning users).
- **Inline tooltips** on Market Detail (hover Volume/Traders/Closes, Shares,
  Fees, and the liquidity line) explaining each term without leaving the page.

## Growth / engagement features (this round)
- **Catchy dismissible hero banner** on Home ("Your read on the world is worth
  something. Prove it.") with a Start Trading CTA — this is the marketing hook
  equivalent of the real OmniMarketX's "World's Leading Social Prediction
  Market" banner, rewritten to be more compelling and less generic.
- **Category tabs now actually filter Home**, not just Markets/Trending — this
  was a real bug (category state was tracked but never applied to the list).
  Two new markets were seeded for **Economy** and **Tech** specifically so
  every one of the 7 category tabs shows real content instead of an empty grid.
- **Horizontal-scrolling market rows** (`.scroll-row` / `.scroll-item` classes)
  on Home, matching the "swipeable card row" pattern from the reference site,
  with scroll-snap for a clean stop point per card.
- **Trending hashtags widget** added to the Home sidebar (previously only on
  Social) — `#omnimarketx`, `#predictionmarket`, etc.
- **Pro / Subscription page** (`pages/Subscription.jsx`) — Free vs Pro plan
  comparison, Invite & Earn commission tiers, 14-day guarantee messaging.
  The sidebar "OmniMarket Pro" card now navigates here. "Upgrade to Pro" is a
  real, working toggle persisted to `localStorage` (`omx_pro`) — no payment
  processor is wired up since this is a demo, but the state is genuine, not
  decorative, and easy to swap for a real Stripe/Razorpay integration later.
- **Branded loading screen** replacing the plain "Loading OmniMarketX…" text
  with the logo mark and a subtle glow-pulse animation.
- **Mobile/tablet responsive breakpoints** added (`@media max-width: 900px`
  and `768px`): the sidebar collapses into a horizontally-scrollable top bar,
  the topbar/pulse banner stop wrapping into awkward tall empty-looking
  blocks, and all card grids drop to 1–2 columns instead of 3–4.

### On fonts
The reference site uses a single default system sans-serif everywhere. This
build intentionally keeps three purpose-built fonts — Space Grotesk for
headlines/display numbers, Manrope for body text, JetBrains Mono strictly for
live prices/percentages — because a dedicated numeric face is a real,
low-cost signal of "trading terminal" credibility that a single generic font
can't produce. Kept as-is; no change made here.

## OmniMarketX (this build) vs. the original site — what's different and why

| Area | Original site | This build | Why it's better |
|---|---|---|---|
| Visual identity | Single generic sans-serif everywhere | Three purpose-built fonts: Space Grotesk (display/numbers), Manrope (body), JetBrains Mono (live prices only) | A dedicated numeric face is a real, low-cost signal of "trading terminal" credibility — your eye learns "monospace = a number that moves" |
| Logo | A circular gradient "M" mark | An original SVG mark (`components/Logo.jsx`) — two crossing bars forming an abstract X with a "market signal" dot, gradient-filled, scales crisply at any size | Vector-drawn, not a raster/text hack — same mark, redrawn as a legitimately distinct identity rather than a copy |
| Dark mode | Same layout inverted to dark colors | A genuinely separate token set (graphite-navy base, not pure black; brighter warmer accent to hold contrast) | Inverting light mode always looks washed out; a purpose-built dark palette reads premium instead of "dark mode toggle afterthought" |
| Onboarding | None — a first-time visitor is dropped straight into a probability chart | Dedicated **Learn** page (glossary: YES/NO shares, price-as-probability, liquidity, fees, resolution) + dismissible "New here?" banner + inline hover tooltips on every jargon term in Market Detail | The original assumes trading literacy; this build explicitly designs for someone starting at zero |
| Market cards | Static grid, no motion cue for momentum | Sparkline-ready cards in a proper carousel (arrow-driven, one card per click, snap-to-stop) | Feels like flipping through a deck, not scrolling a spreadsheet |
| Category browsing | Tabs exist but home content doesn't actually filter | Every category tab (Gaming/Crypto/Politics/Sports/Economy/Entertainment/Tech) genuinely filters real seeded data on Home, Markets, and Trending | A tab that doesn't change anything erodes trust in the rest of the UI |
| Pro / monetization | Marketing page only, no visible upgrade state anywhere else | Sidebar Pro card reflects real state ("You're Pro" vs "OmniMarket Pro"), Upgrade toggle is a working (if demo) state change, not just a link to a pricing page | Makes the upsell feel like a real product feature, not a dead-end ad |
| Persistence | Unknown/opaque from the outside | Every trade, post, like, and balance change is a real MongoDB write — refreshing the page doesn't lose anything | This build is backed by an actual data model (Market/Trade/Post/User), not just client state |
| Trust signals on trades | Price and chart only | Adds a liquidity indicator ("thin liquidity — larger trades may move price") directly in the buy panel | Original gives no sense of how a large order would move the market |
| Mobile | Not evaluated here | Sidebar collapses to a horizontally-scrollable strip, grids drop to 1–2 columns, ticker/pulse stop wrapping into tall empty-looking blocks | Built with actual breakpoints (900px/768px/640px), not just "shrink and hope" |
| Footer / marketing depth | Full feature grid, newsletter signup, 5-column link footer | Same structure, rebuilt in-system: 4-feature highlight strip, newsletter band, 6-column footer (brand + Markets/Product/Company/Support/Legal) | Matches the original's information depth instead of leaving Home feeling thin, but styled consistently with the rest of the app instead of looking bolted on |

Everything in the right-hand column above is real and running in this codebase — nothing in this table is aspirational copy.

## What's real vs. what's stubbed
**Real (persisted in MongoDB):**
- Markets, browsing, category filters, sort, trending ranking
- Buy/Sell trades — server computes shares/fee/total, updates the user's
  demoBalance, and stores the trade
- Wallet balance + trade history, Reset Demo Account
- Portfolio positions (aggregated from trade history)
- Social feed: posting, liking (persisted)

**Intentionally stubbed (no backend model yet — same as the original prototype):**
- Leaderboard rankings (no ranking algorithm/data source yet)
- Activity feed beyond trade count (no event log model)
- Groups membership (client-side toggle only)
- Search bar (not wired to a query)
- Auth — single demo user auto-created on first `/api/users/me` call,
  no login/signup yet

## Category tabs
All chip/tab UI (Home, Markets, Trending, category filters, Buy/Sell,
Leaderboard period, Activity tabs, Social feed tabs) is fully interactive
and either filters the real API data (categories, sort) or drives local
UI state where there's no backing data model yet (see above).

## Next steps if continuing this build
- Add JWT auth + real user accounts (User model already has the shape for it)
- Add an Order/Position collection instead of aggregating Trade history live
- Add a real trending/leaderboard aggregation job
