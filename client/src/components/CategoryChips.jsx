const CATEGORIES = ["All", "Gaming", "Crypto", "Politics", "Sports", "Economy", "Entertainment", "Tech"];
const ICONS = { All: "", Gaming: "🎮", Crypto: "₿", Politics: "🏛️", Sports: "🌍", Economy: "💰", Entertainment: "🎬", Tech: "🤖" };

export default function CategoryChips({ active, onSelect }) {
  return (
    <div className="chips">
      {CATEGORIES.map((c) => (
        <div key={c} className={"chip" + (active === c ? " active" : "")} onClick={() => onSelect(c)}>
          {ICONS[c] ? ICONS[c] + " " : ""}{c}
        </div>
      ))}
    </div>
  );
}
