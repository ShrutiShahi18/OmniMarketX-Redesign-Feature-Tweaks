import express from "express";
import Market from "../models/Market.js";

const router = express.Router();

// GET /api/markets?category=Sports&sort=volume
router.get("/", async (req, res) => {
  try {
    const { category, sort } = req.query;
    const filter = category && category !== "All" ? { category } : {};
    let query = Market.find(filter);
    if (sort === "newest") query = query.sort({ createdAt: -1 });
    else if (sort === "probability") query = query.sort({ yesPrice: -1 });
    else query = query.sort({ volume: -1 }); // default: Volume
    const markets = await query.exec();
    res.json(markets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const market = await Market.findById(req.params.id);
    if (!market) return res.status(404).json({ error: "Market not found" });
    res.json(market);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
