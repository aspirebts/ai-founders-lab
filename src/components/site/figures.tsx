import { journey } from "@/lib/content/site";

/**
 * Fig. 1: The company of one.
 * One founder at the centre; the functions a team used to cover sit around
 * them, each carried by AI. Drawn as a technical diagram, not an illustration.
 */
export function CompanyOfOneFigure() {
  const cx = 260;
  const cy = 250;
  const r = 168;
  const functions = ["Research", "Design", "Build", "Marketing", "Sales", "Support", "Finance"];
  const nodes = functions.map((name, i) => {
    const a = (-90 + (360 / functions.length) * i) * (Math.PI / 180);
    return { name, x: cx + r * Math.cos(a), y: cy + r * Math.sin(a), a };
  });

  return (
    <figure className="ticks text-paper">
      <svg viewBox="0 0 520 500" role="img" aria-labelledby="fig1-title fig1-desc" className="h-auto w-full">
        <title id="fig1-title">The company of one</title>
        <desc id="fig1-desc">
          A diagram with one founder at the centre, connected to seven business functions that AI helps
          them carry: research, design, build, marketing, sales, support and finance.
        </desc>

        <circle cx={cx} cy={cy} r={r} fill="none" stroke="currentColor" strokeOpacity="0.22" strokeDasharray="2 6" />
        <circle cx={cx} cy={cy} r={r * 0.52} fill="none" stroke="currentColor" strokeOpacity="0.14" />

        {nodes.map((n, i) => (
          <line
            key={n.name}
            x1={cx}
            y1={cy}
            x2={n.x}
            y2={n.y}
            stroke="currentColor"
            strokeOpacity="0.5"
            strokeWidth="1"
            className="draw-line"
            style={{ "--len": 180, animationDelay: `${0.25 + i * 0.09}s` } as React.CSSProperties}
          />
        ))}

        {nodes.map((n) => {
          const lx = cx + (r + 22) * Math.cos(n.a);
          const ly = cy + (r + 22) * Math.sin(n.a);
          const anchor = Math.abs(Math.cos(n.a)) < 0.25 ? "middle" : Math.cos(n.a) > 0 ? "start" : "end";
          return (
            <g key={n.name}>
              <rect x={n.x - 4.5} y={n.y - 4.5} width="9" height="9" fill="#11110f" stroke="currentColor" />
              <text
                x={lx}
                y={ly + 4}
                textAnchor={anchor}
                fill="currentColor"
                fontSize="11"
                letterSpacing="1"
                style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase" }}
              >
                {n.name}
              </text>
            </g>
          );
        })}

        <circle cx={cx} cy={cy} r="15" fill="#e8421a" className="pulse-dot" />
        <circle cx={cx} cy={cy} r="15" fill="#e8421a" />
        <text
          x={cx}
          y={cy + 40}
          textAnchor="middle"
          fill="currentColor"
          fontSize="11"
          letterSpacing="1"
          style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase" }}
        >
          You
        </text>
      </svg>
      <figcaption className="label flex justify-between border-t border-line-dark px-1 pt-3 text-muted-dark">
        <span>Fig. 1</span>
        <span>The company of one</span>
      </figcaption>
    </figure>
  );
}

/** Fig. 2: The founder journey as a rising five-step plot. */
export function JourneyPlot({ className = "" }: { className?: string }) {
  const w = 1000;
  const h = 220;
  const pts = journey.map((_, i) => ({
    x: 60 + ((w - 120) / (journey.length - 1)) * i,
    y: h - 40 - Math.pow(i / (journey.length - 1), 1.5) * (h - 80),
  }));
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} aria-hidden="true" className={`h-auto w-full ${className}`}>
      {pts.map((p) => (
        <line key={p.x} x1={p.x} y1={h - 20} x2={p.x} y2={p.y} stroke="currentColor" strokeOpacity="0.25" strokeDasharray="2 5" />
      ))}
      <line x1="20" y1={h - 20} x2={w - 20} y2={h - 20} stroke="currentColor" strokeOpacity="0.4" />
      <path d={d} fill="none" stroke="#e8421a" strokeWidth="2" className="draw-line" style={{ "--len": 1100 } as React.CSSProperties} />
      {pts.map((p, i) => (
        <g key={i}>
          <rect x={p.x - 5} y={p.y - 5} width="10" height="10" fill="var(--color-paper)" stroke="currentColor" strokeWidth="1.5" />
          {i === pts.length - 1 && <circle cx={p.x} cy={p.y} r="4" fill="#e8421a" />}
        </g>
      ))}
    </svg>
  );
}
