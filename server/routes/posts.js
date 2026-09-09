import express from "express";
import Post from "../models/Post.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/posts { userId, authorName, authorHandle, text, tradeId }
router.post("/", async (req, res) => {
  try {
    const { userId, authorName, authorHandle, text, tradeId } = req.body;
    if (!text || !text.trim()) return res.status(400).json({ error: "Post text required" });
    const post = await Post.create({
      user: userId,
      authorName: authorName || "Shruti Shahi",
      authorHandle: authorHandle || "@yoshruti18",
      text,
      trade: tradeId || null,
    });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    post.liked = !post.liked;
    post.likes += post.liked ? 1 : -1;
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
