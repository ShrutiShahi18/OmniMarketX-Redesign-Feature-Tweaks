import express from "express";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

function makeUsername(firebaseUser) {
  const base =
    (
      firebaseUser.email?.split("@")[0] ||
      firebaseUser.name ||
      "user"
    )
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, "")
      .slice(0, 20) || "user";

  return `${base}_${firebaseUser.uid.slice(0, 6).toLowerCase()}`;
}

async function makeUniqueUsername(firebaseUser) {
  const preferred = makeUsername(firebaseUser);

  const existing = await User.findOne({
    username: preferred,
  });

  if (!existing || existing.firebaseUid === firebaseUser.uid) {
    return preferred;
  }

  return `${preferred}_${Date.now().toString().slice(-6)}`;
}

router.get("/me", requireAuth, async (req, res) => {
  try {
    const firebaseUser = req.firebaseUser;

    let user = await User.findOne({
      firebaseUid: firebaseUser.uid,
    });

    // Safely attach an old demo account to the Firebase account.
    if (!user && firebaseUser.email) {
      user = await User.findOne({
        email: firebaseUser.email.toLowerCase(),
        $or: [
          { firebaseUid: { $exists: false } },
          { firebaseUid: null },
          { firebaseUid: "" },
        ],
      });

      if (user) {
        user.firebaseUid = firebaseUser.uid;

        if (firebaseUser.name) {
          user.displayName = firebaseUser.name;
        }

        if (firebaseUser.picture) {
          user.photoURL = firebaseUser.picture;
        }

        await user.save();
      }
    }

    if (!user) {
      const displayName =
        firebaseUser.name ||
        firebaseUser.email?.split("@")[0] ||
        "OmniMarketX User";

      user = await User.create({
        firebaseUid: firebaseUser.uid,
        email: firebaseUser.email || "",
        displayName,
        username: await makeUniqueUsername(firebaseUser),
        photoURL: firebaseUser.picture || "",
        demoBalance: 10000,
      });
    } else {
      let changed = false;

      const nextEmail =
        firebaseUser.email?.toLowerCase() || user.email;

      const nextPhotoURL =
        firebaseUser.picture || user.photoURL;

      const nextDisplayName =
        firebaseUser.name || user.displayName;

      if (nextEmail && nextEmail !== user.email) {
        user.email = nextEmail;
        changed = true;
      }

      if (nextPhotoURL !== user.photoURL) {
        user.photoURL = nextPhotoURL;
        changed = true;
      }

      if (
        nextDisplayName &&
        nextDisplayName !== user.displayName
      ) {
        user.displayName = nextDisplayName;
        changed = true;
      }

      if (changed) {
        await user.save();
      }
    }

    res.json(user);
  } catch (error) {
    console.error("Get current user error:", error);

    res.status(500).json({
      error: "Failed to load user",
    });
  }
});

router.patch("/me", requireAuth, async (req, res) => {
  try {
    const firebaseUser = req.firebaseUser;

    const user = await User.findOne({
      firebaseUid: firebaseUser.uid,
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    const { displayName, username, photoURL } = req.body;

    if (displayName !== undefined) {
      const cleanName = String(displayName).trim();

      if (!cleanName) {
        return res.status(400).json({
          error: "Display name cannot be empty",
        });
      }

      if (cleanName.length > 60) {
        return res.status(400).json({
          error: "Display name must be 60 characters or less",
        });
      }

      user.displayName = cleanName;
    }

    if (username !== undefined) {
      const cleanUsername = String(username)
        .trim()
        .toLowerCase()
        .replace(/^@/, "");

      if (!/^[a-z0-9_]{3,30}$/.test(cleanUsername)) {
        return res.status(400).json({
          error:
            "Username must be 3–30 characters and use only letters, numbers, and underscores",
        });
      }

      const existing = await User.findOne({
        username: cleanUsername,
        _id: { $ne: user._id },
      });

      if (existing) {
        return res.status(409).json({
          error: "That username is already taken",
        });
      }

      user.username = cleanUsername;
    }

    if (photoURL !== undefined) {
      user.photoURL = String(photoURL || "").trim();
    }

    await user.save();

    res.json(user);
  } catch (error) {
    console.error("Update user error:", error);

    res.status(500).json({
      error: "Failed to update profile",
    });
  }
});

router.post("/reset", requireAuth, async (req, res) => {
  try {
    const firebaseUser = req.firebaseUser;

    const user = await User.findOne({
      firebaseUid: firebaseUser.uid,
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    user.demoBalance = 10000;
    await user.save();

    const Trade = (await import("../models/Trade.js")).default;

    await Trade.deleteMany({
      user: user._id,
    });

    res.json(user);
  } catch (error) {
    console.error("Reset wallet error:", error);

    res.status(500).json({
      error: "Failed to reset wallet",
    });
  }
});

export default router;