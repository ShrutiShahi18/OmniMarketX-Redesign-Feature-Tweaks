import mongoose from "mongoose";

const tradeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    market: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Market",
      required: true,
    },

    side: {
      type: String,
      enum: ["yes", "no"],
      required: true,
    },

    mode: {
      type: String,
      enum: ["buy", "sell"],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    shares: {
      type: Number,
      required: true,
      min: 0,
    },

    fee: {
      type: Number,
      default: 0,
      min: 0,
    },

    total: {
      type: Number,
      required: true,
    },

    txId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Trade", tradeSchema);