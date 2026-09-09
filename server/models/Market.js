import mongoose from "mongoose";

const marketSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    category: { type: String, required: true }, // Gaming, Crypto, Politics, Sports, Economy, Entertainment, Tech
    icon: { type: String, default: "📊" },
    yesLabel: { type: String, default: "YES" },
    noLabel: { type: String, default: "NO" },
    yesPrice: { type: Number, required: true }, // cents as decimal, e.g. 0.869
    noPrice: { type: Number, required: true },
    volume: { type: Number, default: 0 },
    traders: { type: Number, default: 0 },
    closesAt: { type: Date },
    resolutionCriteria: { type: String, default: "" },
    resolutionSource: { type: String, default: "" },
    sparkline: { type: [Number], default: [] },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Market", marketSchema);
