import express from "express";
import User from "../models/User.js";

const router = express.Router();

// Returns the single demo user, creating one if none exists yet.
router.get("/me", async (req, res) => {
  try {
    let user = await User.findOne();
    if (!user) {
      user = await User.create({
        displayName: "Shruti Shahi",
        username: "yoshruti18",
        demoBalance: 10000,
      });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reset demo balance + wipe trades (called by Wallet > Reset Demo Account)
router.post("/:id/reset", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { demoBalance: 10000 },
      { new: true }
    );
    const Trade = (await import("../models/Trade.js")).default;
    await Trade.deleteMany({ user: req.params.id });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
