import express from "express";
import mongoose from "mongoose";
import Trade from "../models/Trade.js";
import Market from "../models/Market.js";
import User from "../models/User.js";

const router = express.Router();

// POST /api/trades  { userId, marketId, side, mode, amount }
// Server computes shares/fee/total and is the single source of truth for balance changes.
router.post("/", async (req, res) => {
  try {
    const { userId, marketId, side, mode, amount } = req.body;
    if (!userId || !marketId || !side || !mode || !amount) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const market = await Market.findById(marketId);
    const user = await User.findById(userId);
    if (!market || !user) return res.status(404).json({ error: "Market or user not found" });

    const price = side === "yes" ? market.yesPrice : market.noPrice;
    const fee = +(amount * 0.002).toFixed(2);
    const shares = +(amount / price).toFixed(2);
    const total = mode === "buy" ? +(amount + fee).toFixed(2) : +(amount - fee).toFixed(2);

    if (mode === "buy" && user.demoBalance < total) {
      return res.status(400).json({ error: "Insufficient demo balance" });
    }

    user.demoBalance = mode === "buy" ? +(user.demoBalance - total).toFixed(2) : +(user.demoBalance + total).toFixed(2);
    await user.save();

    const txId = new mongoose.Types.ObjectId().toString().slice(-12);
    const trade = await Trade.create({ user: userId, market: marketId, side, mode, amount, price, shares, fee, total, txId });

    res.json({ trade, newBalance: user.demoBalance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/trades/history/:userId  -> wallet trade history
router.get("/history/:userId", async (req, res) => {
  try {
    const trades = await Trade.find({ user: req.params.userId }).sort({ createdAt: -1 }).populate("market", "question category");
    res.json(trades);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/trades/positions/:userId -> portfolio, grouped by market+side
router.get("/positions/:userId", async (req, res) => {
  try {
    const trades = await Trade.find({ user: req.params.userId }).populate("market", "question category icon yesPrice noPrice");
    const grouped = {};
    for (const t of trades) {
      const key = t.market._id + "-" + t.side;
      if (!grouped[key]) grouped[key] = { market: t.market, side: t.side, shares: 0, costBasis: 0 };
      const sign = t.mode === "buy" ? 1 : -1;
      grouped[key].shares += sign * t.shares;
      grouped[key].costBasis += sign * t.amount;
    }
    const positions = Object.values(grouped).filter((p) => p.shares > 0.01);
    res.json(positions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
