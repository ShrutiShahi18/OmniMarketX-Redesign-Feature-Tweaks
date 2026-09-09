import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
      default: "",
    },

    displayName: {
      type: String,
      required: true,
      trim: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    photoURL: {
      type: String,
      default: "",
    },

    demoBalance: {
      type: Number,
      default: 10000,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);