// Original mark. Concept: two trend-lines crossing at the point of maximum
// uncertainty (the ~50% line every prediction market question lives near),
// framed by a partial probability ring — the same ring motif used on the
// Market Detail gauge — so the logo is drawn from the product itself,
// not a generic monogram.
export default function Logo({ size = 30, mono = false }) {
  const uid = "omxLogo" + (mono ? "Mono" : "") + size;
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" style={{ flexShrink: 0 }}>
      <defs>
        <linearGradient id={uid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={mono ? "#ffffff" : "var(--accent)"} stopOpacity={mono ? 0.95 : 1} />
          <stop offset="100%" stopColor={mono ? "#ffffff" : "var(--accent-2)"} stopOpacity={mono ? 0.7 : 1} />
        </linearGradient>
      </defs>

      <rect width="32" height="32" rx="10" fill={mono ? "rgba(255,255,255,0.18)" : `url(#${uid})`} />

      {/* probability ring — partial, like a gauge that hasn't resolved yet */}
      <circle
        cx="16" cy="16" r="12.5"
        fill="none"
        stroke="white"
        strokeOpacity="0.4"
        strokeWidth="1.4"
        strokeDasharray="58 20"
        strokeLinecap="round"
        transform="rotate(-95 16 16)"
      />

      {/* two trend-lines crossing */}
      <path d="M9 12 C 12 14, 14 15.5, 16 16 C 18 16.5, 20.5 17.5, 23 20" fill="none" stroke="white" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M23 12 C 20 14, 18 15.5, 16 16 C 14 16.5, 11.5 17.5, 9 20" fill="none" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeOpacity="0.75" />

      {/* signal point */}
      <circle cx="16" cy="16" r="1.9" fill="white" />
    </svg>
  );
}
