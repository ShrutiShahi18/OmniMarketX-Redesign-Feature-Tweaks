import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    authorName: { type: String, required: true },
    authorHandle: { type: String, required: true },
    text: { type: String, required: true },
    likes: { type: Number, default: 0 },
    liked: { type: Boolean, default: false }, // demo single-user "liked by me" flag
    trade: { type: mongoose.Schema.Types.ObjectId, ref: "Trade", default: null },
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);
