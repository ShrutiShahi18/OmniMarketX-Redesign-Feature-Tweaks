import { useRef } from "react";

export default function ScrollCarousel({ children }) {
  const trackRef = useRef(null);

  function slide(dir) {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector(".scroll-item");
    const step = card ? card.getBoundingClientRect().width + 14 : 300; // card width + gap
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  }

  return (
    <div className="carousel-wrap">
      <div className="scroll-row" ref={trackRef}>{children}</div>
      <button className="carousel-arrow left" onClick={() => slide(-1)} aria-label="Previous">‹</button>
      <button className="carousel-arrow right" onClick={() => slide(1)} aria-label="Next">›</button>
    </div>
  );
}
