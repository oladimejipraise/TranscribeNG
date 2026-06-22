export default function Logo({ size = "md", showTagline = false, theme = "dark" }) {
  const sizes = {
    xs: { icon: 24, w: 14, h: 10, font: "text-base",    rx: 6  },
    sm: { icon: 32, w: 18, h: 14, font: "text-xl",      rx: 8  },
    md: { icon: 44, w: 26, h: 20, font: "text-[26px]",  rx: 10 },
    lg: { icon: 64, w: 36, h: 28, font: "text-[36px]",  rx: 16 },
  };

  const s = sizes[size] || sizes.md;
  const wordmarkColor = theme === "light" ? "text-dark" : "text-cream";
  const taglineColor  = theme === "light" ? "text-dark/40" : "text-cream/35";

  const bars = [
    { xFrac: 0,    yFrac: 0.35, hFrac: 0.30, op: 1   },
    { xFrac: 0.17, yFrac: 0.20, hFrac: 0.60, op: 1   },
    { xFrac: 0.34, yFrac: 0,    hFrac: 1.00, op: 1   },
    { xFrac: 0.51, yFrac: 0.15, hFrac: 0.70, op: 1   },
    { xFrac: 0.68, yFrac: 0.30, hFrac: 0.40, op: 1   },
    { xFrac: 0.83, yFrac: 0.40, hFrac: 0.20, op: 0.4 },
  ];
  const bw = Math.max(2, s.w * 0.1);

  return (
    <div className={`flex items-center ${size === "xs" ? "gap-1.5" : "gap-2.5"}`}>
      <div
        className="bg-forest flex items-center justify-center flex-shrink-0"
        style={{ width: s.icon, height: s.icon, borderRadius: s.rx }}
      >
        <svg width={s.w} height={s.h} viewBox={`0 0 ${s.w} ${s.h}`} fill="none" aria-hidden="true">
          {bars.map((b, i) => (
            <rect
              key={i}
              x={b.xFrac * s.w}
              y={b.yFrac * s.h}
              width={bw}
              height={b.hFrac * s.h}
              rx={bw / 2}
              fill={`rgba(232,237,230,${b.op})`}
            />
          ))}
        </svg>
      </div>

      <div>
        <div className={`font-syne font-extrabold tracking-tight leading-none ${s.font} ${wordmarkColor}`}>
          Transcribe<span className="text-accent">NG</span>
        </div>
        {showTagline && (
          <div className={`text-2xs tracking-wide mt-1 ${taglineColor}`}>
            Real-time transcription for Nigerian languages
          </div>
        )}
      </div>
    </div>
  );
}