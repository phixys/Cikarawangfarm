'use client';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'];
const values = [180, 220, 195, 260, 240, 284]; // in juta

const maxVal = Math.max(...values);
const minVal = Math.min(...values);
const range = maxVal - minVal;

const WIDTH = 500;
const HEIGHT = 160;
const PADDING_X = 30;
const PADDING_Y = 20;

function getPoint(index: number, value: number) {
  const x = PADDING_X + (index / (values.length - 1)) * (WIDTH - PADDING_X * 2);
  const y = PADDING_Y + ((maxVal - value) / (range || 1)) * (HEIGHT - PADDING_Y * 2);
  return { x, y };
}

const points = values.map((v, i) => getPoint(i, v));

const linePath = points
  .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
  .join(' ');

// Smooth curve using cubic bezier
function smoothPath(pts: { x: number; y: number }[]) {
  if (pts.length < 2) return '';
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1];
    const curr = pts[i];
    const cpx = (prev.x + curr.x) / 2;
    d += ` C ${cpx} ${prev.y}, ${cpx} ${curr.y}, ${curr.x} ${curr.y}`;
  }
  return d;
}

const smoothLine = smoothPath(points);

// Area fill path
const areaPath =
  smoothLine +
  ` L ${points[points.length - 1].x} ${HEIGHT - PADDING_Y}` +
  ` L ${points[0].x} ${HEIGHT - PADDING_Y} Z`;

export default function RevenueChart() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[14px] font-semibold text-gray-900">Pendapatan 6 Bulan Terakhir</h3>
          <p className="text-gray-400 text-[12px]">Dalam jutaan rupiah</p>
        </div>
        <span className="text-[12px] text-primary-dark bg-primary-tint px-3 py-1 rounded-full font-medium">
          2024
        </span>
      </div>

      {/* Y-axis labels + SVG */}
      <div className="flex gap-2">
        {/* Y labels */}
        <div className="flex flex-col justify-between text-[10px] text-gray-400 pb-5" style={{ height: HEIGHT }}>
          {[maxVal, Math.round((maxVal + minVal) / 2), minVal].map((v) => (
            <span key={v}>{v}jt</span>
          ))}
        </div>

        {/* Chart */}
        <div className="flex-1">
          <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            className="w-full"
            style={{ height: HEIGHT }}
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#40916C" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#40916C" stopOpacity="0.01" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((t) => {
              const y = PADDING_Y + t * (HEIGHT - PADDING_Y * 2);
              return (
                <line
                  key={t}
                  x1={PADDING_X}
                  y1={y}
                  x2={WIDTH - PADDING_X}
                  y2={y}
                  stroke="#f0f0f0"
                  strokeWidth="1"
                />
              );
            })}

            {/* Area fill */}
            <path d={areaPath} fill="url(#areaGrad)" />

            {/* Line */}
            <path
              d={smoothLine}
              fill="none"
              stroke="#40916C"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Dots */}
            {points.map((p, i) => (
              <g key={i}>
                <circle cx={p.x} cy={p.y} r="4" fill="#40916C" />
                <circle cx={p.x} cy={p.y} r="2" fill="white" />
              </g>
            ))}
          </svg>

          {/* X labels */}
          <div className="flex justify-between mt-1 px-1">
            {months.map((m) => (
              <span key={m} className="text-[11px] text-gray-400 text-center">
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
