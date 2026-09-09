import express from "express";
import mongoose from "mongoose";
import Trade from "../models/Trade.js";
import Market from "../models/Market.js";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// POST /api/trades
// The authenticated Firebase user determines which MongoDB user owns the trade.
router.post("/", requireAuth, async (req, res) => {
  try {
    const { marketId, side, mode, amount } = req.body;

    if (!marketId || !side || !mode || !amount) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({
        error: "Amount must be greater than zero",
      });
    }

    if (!["yes", "no"].includes(side)) {
      return res.status(400).json({
        error: "Invalid trade side",
      });
    }

    if (!["buy", "sell"].includes(mode)) {
      return res.status(400).json({
        error: "Invalid trade mode",
      });
    }

    const market = await Market.findById(marketId);

    if (!market) {
      return res.status(404).json({
        error: "Market not found",
      });
    }

    const user = await User.findOne({
      firebaseUid: req.firebaseUser.uid,
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    const price = side === "yes" ? market.yesPrice : market.noPrice;

    if (!price || price <= 0) {
      return res.status(400).json({
        error: "Market price is unavailable",
      });
    }

    const fee = +(numericAmount * 0.002).toFixed(2);
    const shares = +(numericAmount / price).toFixed(2);

    const total =
      mode === "buy"
        ? +(numericAmount + fee).toFixed(2)
        : +(numericAmount - fee).toFixed(2);

    if (mode === "buy" && user.demoBalance < total) {
      return res.status(400).json({
        error: "Insufficient demo balance",
      });
    }

    if (mode === "sell" && user.demoBalance + total < 0) {
      return res.status(400).json({
        error: "Invalid sell amount",
      });
    }

    user.demoBalance =
      mode === "buy"
        ? +(user.demoBalance - total).toFixed(2)
        : +(user.demoBalance + total).toFixed(2);

    await user.save();

    const txId = new mongoose.Types.ObjectId()
      .toString()
      .slice(-12);

    const trade = await Trade.create({
      user: user._id,
      market: market._id,
      side,
      mode,
      amount: numericAmount,
      price,
      shares,
      fee,
      total,
      txId,
    });

    res.json({
      trade,
      newBalance: user.demoBalance,
    });
  } catch (err) {
    console.error("Trade error:", err);

    res.status(500).json({
      error: err.message,
    });
  }
});

// GET /api/trades/history
router.get("/history", requireAuth, async (req, res) => {
  try {
    const user = await User.findOne({
      firebaseUid: req.firebaseUser.uid,
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    const trades = await Trade.find({
      user: user._id,
    })
      .sort({ createdAt: -1 })
      .populate("market", "question category");

    res.json(trades);
  } catch (err) {
    console.error("Trade history error:", err);

    res.status(500).json({
      error: err.message,
    });
  }
});

// GET /api/trades/positions
router.get("/positions", requireAuth, async (req, res) => {
  try {
    const user = await User.findOne({
      firebaseUid: req.firebaseUser.uid,
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    const trades = await Trade.find({
      user: user._id,
    }).populate(
      "market",
      "question category icon yesPrice noPrice"
    );

    const grouped = {};

    for (const trade of trades) {
      const key = `${trade.market._id}-${trade.side}`;

      if (!grouped[key]) {
        grouped[key] = {
          market: trade.market,
          side: trade.side,
          shares: 0,
          costBasis: 0,
        };
      }

      const sign = trade.mode === "buy" ? 1 : -1;

      grouped[key].shares += sign * trade.shares;
      grouped[key].costBasis += sign * trade.amount;
    }

    const positions = Object.values(grouped).filter(
      (position) => position.shares > 0.01
    );

    res.json(positions);
  } catch (err) {
    console.error("Positions error:", err);

    res.status(500).json({
      error: err.message,
    });
  }
});

export default router;