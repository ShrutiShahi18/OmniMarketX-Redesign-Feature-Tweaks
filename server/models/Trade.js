import mongoose from "mongoose";

const tradeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    market: { type: mongoose.Schema.Types.ObjectId, ref: "Market", required: true },
    side: { type: String, enum: ["yes", "no"], required: true },
    mode: { type: String, enum: ["buy", "sell"], required: true },
    amount: { type: Number, required: true },
    price: { type: Number, required: true },
    shares: { type: Number, required: true },
    fee: { type: Number, required: true },
    total: { type: Number, required: true },
    txId: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Trade", tradeSchema);
