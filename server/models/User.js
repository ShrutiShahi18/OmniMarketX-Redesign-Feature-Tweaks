import mongoose from "mongoose";

// One demo user per install for now — no auth system yet.
// Swap to a real users collection + JWT once real accounts are needed.
const userSchema = new mongoose.Schema(
  {
    displayName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    demoBalance: { type: Number, default: 10000 },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
