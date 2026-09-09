import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import marketsRouter from "./routes/markets.js";
import tradesRouter from "./routes/trades.js";
import postsRouter from "./routes/posts.js";
import usersRouter from "./routes/users.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/markets", marketsRouter);
app.use("/api/trades", tradesRouter);
app.use("/api/posts", postsRouter);
app.use("/api/users", usersRouter);

app.get("/api/health", (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/omnimarketx";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err.message));
