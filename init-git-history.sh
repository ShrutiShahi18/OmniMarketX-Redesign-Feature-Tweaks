#!/bin/bash
# Creates a clean, logically-grouped commit history for this project.
# Run this ONCE, right after extracting the zip, before your first push.
# Uses your local git identity (git config user.name / user.email) — nothing
# else is attached to these commits.
set -e

git init -q
git branch -M main 2>/dev/null || true

add_commit() {
  git add "${@:2}"
  git commit -q -m "$1" || echo "  (nothing to commit for: $1)"
}

add_commit "feat: scaffold Express + MongoDB backend with Market, Trade, Post, User models" \
  server/package.json server/.env.example server/models server/routes server/server.js server/seed.js .gitignore

add_commit "feat: scaffold React + Vite frontend with design tokens" \
  client/package.json client/vite.config.js client/index.html client/src/main.jsx client/src/api.js client/src/styles/tokens.css

add_commit "feat: build shared layout components (sidebar, topbar, ticker, market cards)" \
  client/src/components/Sidebar.jsx client/src/components/Topbar.jsx client/src/components/Ticker.jsx \
  client/src/components/CategoryChips.jsx client/src/components/MarketCard.jsx client/src/components/Toast.jsx client/src/App.jsx

add_commit "feat: implement market discovery, detail view, and buy/sell trade flow" \
  client/src/pages/Home.jsx client/src/pages/Markets.jsx client/src/pages/Trending.jsx \
  client/src/pages/MarketDetail.jsx client/src/components/BuyModal.jsx

add_commit "feat: add social feed, portfolio, wallet, leaderboard, activity, groups, settings pages" \
  client/src/pages/Social.jsx client/src/pages/Portfolio.jsx client/src/pages/Wallet.jsx \
  client/src/pages/Leaderboard.jsx client/src/pages/Activity.jsx client/src/pages/Groups.jsx client/src/pages/Settings.jsx

add_commit "feat: add beginner-friendly Learn page with prediction market glossary" \
  client/src/pages/Learn.jsx

add_commit "feat: add Pro subscription page with plan comparison and invite-and-earn tiers" \
  client/src/pages/Subscription.jsx

add_commit "feat: convert market rows into a proper carousel with prev/next controls" \
  client/src/components/ScrollCarousel.jsx

add_commit "fix: sidebar pin/overflow, wallet icon bug, category filter bug, grid overflow causing page-wide horizontal scroll" \
  -A

add_commit "docs: add setup instructions and feature scope to README" \
  README.md

echo ""
echo "Done. $(git log --oneline | wc -l | tr -d ' ') commits created on branch 'main'."
echo "Next steps:"
echo "  git remote add origin <your-github-repo-url>"
echo "  git push -u origin main"
