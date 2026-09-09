import express from "express";
import Market from "../models/Market.js";

const router = express.Router();

// GET /api/markets
router.get("/", async (req, res) => {
  try {
    const { category, sort } = req.query;

    const filter = {};

    if (category && category !== "all") {
      filter.category = category;
    }

    let query = Market.find(filter);

    if (sort === "volume") {
      query = query.sort({ volume: -1 });
    } else if (sort === "newest") {
      query = query.sort({ createdAt: -1 });
    } else if (sort === "ending") {
      query = query.sort({ endDate: 1 });
    } else {
      query = query.sort({ createdAt: -1 });
    }

    const markets = await query;

    res.json(markets);
  } catch (error) {
    console.error("Get markets error:", error);

    res.status(500).json({
      error: "Failed to load markets",
    });
  }
});

// GET /api/markets/:id
router.get("/:id", async (req, res) => {
  try {
    const market = await Market.findById(req.params.id);

    if (!market) {
      return res.status(404).json({
        error: "Market not found",
      });
    }

    res.json(market);
  } catch (error) {
    console.error("Get market error:", error);

    res.status(500).json({
      error: "Failed to load market",
    });
  }
});

export default router;