// Seeds the exact markets shown in the OmniMarketX UI screenshots so the
// frontend renders real, recognizable data instead of placeholders.
import mongoose from "mongoose";
import dotenv from "dotenv";
import Market from "./models/Market.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import Trade from "./models/Trade.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/omnimarketx";

const markets = [
  {
    question: "Will Avengers: Doomsday earn at least $1 billion worldwide during its opening weekend?",
    category: "Entertainment", icon: "🎬", yesPrice: 0.869, noPrice: 0.131,
    volume: 0, traders: 0, closesAt: new Date("2026-12-17"),
    resolutionCriteria: "YES if the finalized worldwide opening-weekend gross is $1,000,000,000 or more. Only theatrical box-office revenue counts. The opening weekend is the officially reported worldwide opening-weekend period used by the resolution source.",
    resolutionSource: "Box Office Mojo, cross-checked against The Numbers",
    sparkline: [90,60,55,30,32,60,55,30,25,45,25], featured: true,
  },
  {
    question: "Will Avengers: Doomsday gross at least $2 billion worldwide?",
    category: "Entertainment", icon: "🎬", yesPrice: 0.767, noPrice: 0.233,
    volume: 0, traders: 0, closesAt: new Date("2027-02-01"),
    resolutionCriteria: "YES if total worldwide lifetime gross reaches $2,000,000,000 or more.",
    resolutionSource: "Box Office Mojo", sparkline: [70,72,74,73,76,77],
  },
  {
    question: "Will Ramayana: Part One gross at least ₹1,500 crore worldwide?",
    category: "Entertainment", icon: "🎬", yesPrice: 0.67, noPrice: 0.33,
    volume: 0, traders: 0, closesAt: new Date("2027-01-15"),
    resolutionCriteria: "YES if the finalized worldwide gross reaches ₹1,500 crore or more.",
    resolutionSource: "Sacnilk, cross-checked with trade reports", sparkline: [55,58,60,62,64,67], featured: true,
  },
  {
    question: "Who wins: Ang Woei Shang vs. Hew Kuan Yau?",
    category: "Sports", icon: "🌍", yesPrice: 0.71, noPrice: 0.29,
    volume: 3, traders: 1, closesAt: new Date("2026-10-01"),
    resolutionCriteria: "Resolves based on the official match result.",
    resolutionSource: "Official tournament results", sparkline: [65,68,70,69,71],
  },
  {
    question: "Will Grand Theft Auto VI launch before 31 May 2027?",
    category: "Gaming", icon: "🎮", yesPrice: 0.935, noPrice: 0.065,
    volume: 1, traders: 1, closesAt: new Date("2027-05-31"),
    resolutionCriteria: "YES if GTA VI has an official retail or digital release before 31 May 2027.",
    resolutionSource: "Rockstar Games official announcements", sparkline: [90,91,92,93,93.5],
  },
  {
    question: "Will Andy Burnham remain Prime Minister?",
    category: "Politics", icon: "🏛️", yesPrice: 0.664, noPrice: 0.336,
    volume: 1, traders: 0, closesAt: new Date("2026-12-31"),
    resolutionCriteria: "YES if Andy Burnham remains in office through the resolution date.",
    resolutionSource: "Official UK government records", sparkline: [60,62,64,65,66.4],
  },
  {
    question: "Will BNB close above US$3,000 by 31 December 2026?",
    category: "Crypto", icon: "₿", yesPrice: 0.632, noPrice: 0.368,
    volume: 0, traders: 0, closesAt: new Date("2026-12-31"),
    resolutionCriteria: "YES if BNB/USD closing price on 31 Dec 2026 is above $3,000.",
    resolutionSource: "Binance spot price", sparkline: [58,60,61,62,63.2],
  },
  {
    question: "Will the PSA 10 Pikachu Illustrator sell for more than $X?",
    category: "Gaming", icon: "🎮", yesPrice: 0.73, noPrice: 0.27,
    volume: 1, traders: 1, closesAt: new Date("2026-11-30"),
    resolutionCriteria: "YES if a verified PSA 10 Pikachu Illustrator card sale exceeds the threshold price.",
    resolutionSource: "PWCC / Goldin auction records", sparkline: [68,70,71,72,73],
  },
  {
    question: "Will former MACC Chief Commissioner Azam Baki's lawsuit conclude by 31 December 2026?",
    category: "Politics", icon: "🏛️", yesPrice: 0.64, noPrice: 0.36,
    volume: 1, traders: 1, closesAt: new Date("2026-12-31"),
    resolutionCriteria: "YES if the lawsuit reaches a final court disposition before 31 Dec 2026.",
    resolutionSource: "Malaysian court records", sparkline: [58,60,62,63,64],
  },
  {
    question: "Will Anthony Loke win his defamation lawsuit against Ang Woei Shang?",
    category: "Politics", icon: "🏛️", yesPrice: 0.61, noPrice: 0.39,
    volume: 1, traders: 1, closesAt: new Date("2027-01-01"),
    resolutionCriteria: "YES if the court rules in favor of the plaintiff.",
    resolutionSource: "Malaysian court records", sparkline: [55,57,59,60,61],
  },
  {
    question: "India vs Brazil — who wins?",
    category: "Sports", icon: "🌍", yesPrice: 0.58, noPrice: 0.31,
    volume: 0, traders: 0, closesAt: new Date("2026-10-10"),
    resolutionCriteria: "Resolves based on the official match result. Draw is a separate outcome.",
    resolutionSource: "Official match records", sparkline: [50,52,55,57,58],
  },
  {
    question: "Will the US Federal Reserve cut interest rates before 31 December 2026?",
    category: "Economy", icon: "💰", yesPrice: 0.58, noPrice: 0.42,
    volume: 2, traders: 1, closesAt: new Date("2026-12-31"),
    resolutionCriteria: "YES if the Fed announces a rate cut at any scheduled FOMC meeting before 31 Dec 2026.",
    resolutionSource: "Federal Reserve official statements", sparkline: [50,52,55,56,58], featured: true,
  },
  {
    question: "Will India's GDP growth exceed 7% for FY2026-27?",
    category: "Economy", icon: "💰", yesPrice: 0.44, noPrice: 0.56,
    volume: 1, traders: 1, closesAt: new Date("2027-03-31"),
    resolutionCriteria: "YES if official annual GDP growth for FY2026-27 is reported above 7%.",
    resolutionSource: "Ministry of Statistics, Government of India", sparkline: [40,41,43,44,44],
  },
  {
    question: "Will OpenAI release a publicly available AGI-labeled model before 2027?",
    category: "Tech", icon: "🤖", yesPrice: 0.21, noPrice: 0.79,
    volume: 3, traders: 2, closesAt: new Date("2026-12-31"),
    resolutionCriteria: "YES if OpenAI officially markets a released model as AGI before 1 Jan 2027.",
    resolutionSource: "OpenAI official announcements", sparkline: [15,17,18,20,21], featured: true,
  },
  {
    question: "Will Apple ship a foldable iPhone before 31 December 2026?",
    category: "Tech", icon: "🤖", yesPrice: 0.37, noPrice: 0.63,
    volume: 2, traders: 1, closesAt: new Date("2026-12-31"),
    resolutionCriteria: "YES if Apple officially releases a foldable iPhone model before the resolution date.",
    resolutionSource: "Apple official announcements", sparkline: [30,32,34,36,37],
  },
];

async function run() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected. Seeding...");

  await Promise.all([Market.deleteMany({}), Post.deleteMany({}), Trade.deleteMany({})]);

  await Market.insertMany(markets);

  let user = await User.findOne();
  if (!user) {
    user = await User.create({ displayName: "Shruti Shahi", username: "yoshruti18", demoBalance: 10000 });
  } else {
    user.demoBalance = 10000;
    await user.save();
  }

  await Post.create({
    user: user._id,
    authorName: "Santosh Kumar",
    authorHandle: "@kumarsurya9771",
    text: "Explored the demo trading experience and checked out the social features. A useful reminder that building a product isn't just about features — the overall user experience matters just as much.",
    likes: 1,
  });

  console.log(`Seeded ${markets.length} markets, 1 user (${user.username}), 1 post.`);
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => { console.error(err); process.exit(1); });
