// Soft watercolour-style flowers drawn in SVG (no image files needed).

type BloomProps = {
  cx: number; cy: number; r: number; petals?: number; rot?: number;
  outer: string; inner: string; center?: string;
};

function Bloom({ cx, cy, r, petals = 8, rot = 0, outer, inner, center = "#e9c46a" }: BloomProps) {
  const step = 360 / petals;
  return (
    <g transform={`translate(${cx} ${cy}) rotate(${rot})`}>
      {Array.from({ length: petals }, (_, i) => (
        <ellipse key={`o${i}`} cx={0} cy={-r * 0.58} rx={r * 0.4} ry={r * 0.6} fill={outer} opacity={0.82} transform={`rotate(${i * step})`} />
      ))}
      {Array.from({ length: petals }, (_, i) => (
        <ellipse key={`i${i}`} cx={0} cy={-r * 0.36} rx={r * 0.27} ry={r * 0.38} fill={inner} opacity={0.88} transform={`rotate(${i * step + step / 2})`} />
      ))}
      <circle r={r * 0.14} fill={center} />
      <circle r={r * 0.07} fill="#b7791f" opacity={0.55} />
    </g>
  );
}

function Leaf({ x, y, len, rot, fill = "#9db08f" }: { x: number; y: number; len: number; rot: number; fill?: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <path d={`M0 0 C ${len * 0.25} ${-len * 0.28}, ${len * 0.75} ${-len * 0.28}, ${len} 0 C ${len * 0.75} ${len * 0.28}, ${len * 0.25} ${len * 0.28}, 0 0 Z`} fill={fill} opacity={0.78} />
      <path d={`M0 0 L ${len * 0.92} 0`} stroke="#6f8268" strokeWidth={0.8} opacity={0.5} />
    </g>
  );
}

/** One corner cluster (drawn for the top-left; mirrored by CSS for the other corners). */
export function CornerCluster({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 260 260" className={className} aria-hidden>
      <g filter="url(#gz-soft)">
        <Leaf x={4} y={4} len={150} rot={38} />
        <Leaf x={4} y={4} len={120} rot={62} fill="#b3c4a6" />
        <Leaf x={4} y={4} len={165} rot={18} fill="#8ea282" />
        <Leaf x={4} y={4} len={110} rot={80} />
        <Leaf x={70} y={80} len={70} rot={-20} fill="#b3c4a6" />
        <Leaf x={80} y={70} len={64} rot={105} fill="#9db08f" />
        <Bloom cx={78} cy={70} r={50} petals={9} rot={10} outer="#f3c5c8" inner="#f8dcdc" />
        <Bloom cx={150} cy={34} r={30} petals={7} rot={-12} outer="#e9a8b3" inner="#f4c8cf" />
        <Bloom cx={34} cy={150} r={30} petals={7} rot={20} outer="#f6d4c8" inner="#fbe6dd" />
        <Bloom cx={122} cy={112} r={20} petals={6} rot={0} outer="#f9e2e0" inner="#fff2ef" center="#d9a05b" />
        <circle cx={196} cy={20} r={6} fill="#e9a8b3" opacity={0.75} />
        <circle cx={210} cy={34} r={4} fill="#f3c5c8" opacity={0.8} />
        <circle cx={20} cy={200} r={6} fill="#f6d4c8" opacity={0.85} />
        <circle cx={34} cy={216} r={4} fill="#e9a8b3" opacity={0.7} />
      </g>
    </svg>
  );
}

/** Shared blur filter (rendered once). */
export function FloralDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden>
      <defs>
        <filter id="gz-soft" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="0.7" />
        </filter>
      </defs>
    </svg>
  );
}

// Position/delay/size for each falling petal. Fixed numbers (not random) so the
// server and browser render exactly the same thing.
const PETALS = [
  { left: 6, delay: 0, dur: 14, size: 14 }, { left: 17, delay: 4, dur: 17, size: 10 },
  { left: 29, delay: 9, dur: 15, size: 16 }, { left: 41, delay: 2, dur: 19, size: 11 },
  { left: 52, delay: 11, dur: 16, size: 13 }, { left: 63, delay: 6, dur: 18, size: 9 },
  { left: 74, delay: 1, dur: 15, size: 15 }, { left: 83, delay: 8, dur: 20, size: 12 },
  { left: 92, delay: 13, dur: 16, size: 10 }, { left: 47, delay: 15, dur: 21, size: 14 },
];

export function FallingPetals() {
  return (
    <div className="gz-petals" aria-hidden>
      {PETALS.map((p, i) => (
        <span key={i} style={{ left: `${p.left}%`, width: p.size, height: p.size, animationDelay: `-${p.delay}s`, animationDuration: `${p.dur}s` }} />
      ))}
    </div>
  );
}
