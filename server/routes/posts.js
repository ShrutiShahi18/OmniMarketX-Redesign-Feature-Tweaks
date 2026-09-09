import express from "express";
import mongoose from "mongoose";

import Post from "../models/Post.js";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

function formatPost(post, currentUserId) {
  const object = post.toObject
    ? post.toObject()
    : post;

  const currentUserIdString =
    currentUserId?.toString();

  object.liked = Array.isArray(object.likedBy)
    ? object.likedBy.some(
        (id) =>
          id.toString() ===
          currentUserIdString
      )
    : false;

  delete object.likedBy;

  object.comments = (
    object.comments || []
  ).map((comment) => ({
    ...comment,
    liked: Array.isArray(comment.likes)
      ? comment.likes.some(
          (id) =>
            id.toString() ===
            currentUserIdString
        )
      : false,
    likeCount: Array.isArray(comment.likes)
      ? comment.likes.length
      : 0,
    likes: undefined,
  }));

  return object;
}

/* -----------------------------------------
   GET ALL POSTS
----------------------------------------- */

router.get("/", requireAuth, async (req, res) => {
  try {
    const user = await User.findOne({
      firebaseUid: req.firebaseUser.uid,
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate(
        "user",
        "displayName username photoURL"
      )
      .populate(
        "comments.user",
        "displayName username photoURL"
      )
      .lean();

    const formattedPosts = posts.map(
      (post) =>
        formatPost(post, user._id)
    );

    res.json(formattedPosts);
  } catch (error) {
    console.error(
      "Get posts error:",
      error
    );

    res.status(500).json({
      error: "Failed to load posts",
    });
  }
});

/* -----------------------------------------
   CREATE POST
----------------------------------------- */

router.post("/", requireAuth, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        error: "Post content is required",
      });
    }

    if (content.trim().length > 2000) {
      return res.status(400).json({
        error: "Post is too long",
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

    const post = await Post.create({
      user: user._id,
      authorName: user.displayName,
      authorHandle: `@${user.username}`,
      text: content.trim(),
      likes: 0,
      likedBy: [],
      comments: [],
    });

    const populatedPost =
      await Post.findById(post._id)
        .populate(
          "user",
          "displayName username photoURL"
        )
        .populate(
          "comments.user",
          "displayName username photoURL"
        );

    res.status(201).json(
      formatPost(
        populatedPost,
        user._id
      )
    );
  } catch (error) {
    console.error(
      "Create post error:",
      error
    );

    res.status(500).json({
      error: "Failed to create post",
    });
  }
});

/* -----------------------------------------
   LIKE / UNLIKE POST
----------------------------------------- */

router.post(
  "/:id/like",
  requireAuth,
  async (req, res) => {
    try {
      const user = await User.findOne({
        firebaseUid: req.firebaseUser.uid,
      });

      if (!user) {
        return res.status(404).json({
          error: "User not found",
        });
      }

      const post = await Post.findById(
        req.params.id
      );

      if (!post) {
        return res.status(404).json({
          error: "Post not found",
        });
      }

      const userId =
        user._id.toString();

      const alreadyLiked =
        post.likedBy.some(
          (id) =>
            id.toString() === userId
        );

      if (alreadyLiked) {
        post.likedBy =
          post.likedBy.filter(
            (id) =>
              id.toString() !== userId
          );

        post.likes = Math.max(
          0,
          post.likes - 1
        );
      } else {
        post.likedBy.push(user._id);
        post.likes += 1;
      }

      await post.save();

      const updatedPost =
        await Post.findById(post._id)
          .populate(
            "user",
            "displayName username photoURL"
          )
          .populate(
            "comments.user",
            "displayName username photoURL"
          );

      res.json(
        formatPost(
          updatedPost,
          user._id
        )
      );
    } catch (error) {
      console.error(
        "Like post error:",
        error
      );

      res.status(500).json({
        error: "Failed to update like",
      });
    }
  }
);

/* -----------------------------------------
   ADD COMMENT / REPLY
----------------------------------------- */

router.post(
  "/:id/comments",
  requireAuth,
  async (req, res) => {
    try {
      const { text, parentComment } =
        req.body;

      if (!text || !text.trim()) {
        return res.status(400).json({
          error:
            "Comment cannot be empty",
        });
      }

      if (text.trim().length > 1000) {
        return res.status(400).json({
          error:
            "Comment must be 1000 characters or less",
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

      const post = await Post.findById(
        req.params.id
      );

      if (!post) {
        return res.status(404).json({
          error: "Post not found",
        });
      }

      if (parentComment) {
        const parentExists =
          post.comments.some(
            (comment) =>
              comment._id.toString() ===
              parentComment
          );

        if (!parentExists) {
          return res.status(404).json({
            error:
              "Parent comment not found",
          });
        }
      }

      post.comments.push({
        user: user._id,
        text: text.trim(),
        likes: [],
        parentComment:
          parentComment || null,
      });

      await post.save();

      const updatedPost =
        await Post.findById(post._id)
          .populate(
            "user",
            "displayName username photoURL"
          )
          .populate(
            "comments.user",
            "displayName username photoURL"
          );

      res.status(201).json(
        formatPost(
          updatedPost,
          user._id
        )
      );
    } catch (error) {
      console.error(
        "Create comment error:",
        error
      );

      res.status(500).json({
        error:
          "Failed to create comment",
      });
    }
  }
);

/* -----------------------------------------
   LIKE / UNLIKE COMMENT
----------------------------------------- */

router.post(
  "/:id/comments/:commentId/like",
  requireAuth,
  async (req, res) => {
    try {
      const user = await User.findOne({
        firebaseUid: req.firebaseUser.uid,
      });

      if (!user) {
        return res.status(404).json({
          error: "User not found",
        });
      }

      const post = await Post.findById(
        req.params.id
      );

      if (!post) {
        return res.status(404).json({
          error: "Post not found",
        });
      }

      const comment =
        post.comments.id(
          req.params.commentId
        );

      if (!comment) {
        return res.status(404).json({
          error: "Comment not found",
        });
      }

      const userId =
        user._id.toString();

      const alreadyLiked =
        comment.likes.some(
          (id) =>
            id.toString() === userId
        );

      if (alreadyLiked) {
        comment.likes =
          comment.likes.filter(
            (id) =>
              id.toString() !== userId
          );
      } else {
        comment.likes.push(
          user._id
        );
      }

      await post.save();

      const updatedPost =
        await Post.findById(post._id)
          .populate(
            "user",
            "displayName username photoURL"
          )
          .populate(
            "comments.user",
            "displayName username photoURL"
          );

      res.json(
        formatPost(
          updatedPost,
          user._id
        )
      );
    } catch (error) {
      console.error(
        "Like comment error:",
        error
      );

      res.status(500).json({
        error:
          "Failed to update comment like",
      });
    }
  }
);

/* -----------------------------------------
   DELETE OWN COMMENT
----------------------------------------- */

router.delete(
  "/:id/comments/:commentId",
  requireAuth,
  async (req, res) => {
    try {
      const user = await User.findOne({
        firebaseUid: req.firebaseUser.uid,
      });

      if (!user) {
        return res.status(404).json({
          error: "User not found",
        });
      }

      const post = await Post.findById(
        req.params.id
      );

      if (!post) {
        return res.status(404).json({
          error: "Post not found",
        });
      }

      const comment =
        post.comments.id(
          req.params.commentId
        );

      if (!comment) {
        return res.status(404).json({
          error: "Comment not found",
        });
      }

      if (
        comment.user.toString() !==
        user._id.toString()
      ) {
        return res.status(403).json({
          error:
            "You can only delete your own comments",
        });
      }

      post.comments.pull(
        req.params.commentId
      );

      await post.save();

      const updatedPost =
        await Post.findById(post._id)
          .populate(
            "user",
            "displayName username photoURL"
          )
          .populate(
            "comments.user",
            "displayName username photoURL"
          );

      res.json(
        formatPost(
          updatedPost,
          user._id
        )
      );
    } catch (error) {
      console.error(
        "Delete comment error:",
        error
      );

      res.status(500).json({
        error:
          "Failed to delete comment",
      });
    }
  }
);

export default router;