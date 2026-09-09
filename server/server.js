import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import marketRoutes from "./routes/markets.js";
import tradeRoutes from "./routes/trades.js";
import postRoutes from "./routes/posts.js";
import userRoutes from "./routes/users.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "OmniMarketX API is running",
  });
});

app.use("/api/markets", marketRoutes);
app.use("/api/trades", tradeRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb://127.0.0.1:27017/omnimarketx";

async function startServer() {
  try {
    await mongoose.connect(MONGO_URI);

    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
}

startServer();