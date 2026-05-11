'use client';

interface Segment {
  label: string;
  count: number;
  color: string;
}

const segments: Segment[] = [
  { label: 'Jantan Tersedia', count: 101, color: '#2D6A4F' },
  { label: 'Betina Tersedia', count: 95,  color: '#74C69D' },
  { label: 'Sedang Dipesan', count: 40,  color: '#40916C' },
  { label: 'Terjual Bulan Ini', count: 11, color: '#D8F3DC' },
];

const total = segments.reduce((s, seg) => s + seg.count, 0);

function buildDonut(segs: Segment[], cx: number, cy: number, r: number, innerR: number) {
  let currentAngle = -Math.PI / 2; // start top
  return segs.map((seg) => {
    const slice = (seg.count / total) * 2 * Math.PI;
    const startAngle = currentAngle;
    const endAngle = currentAngle + slice;
    currentAngle = endAngle;

    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);

    const ix1 = cx + innerR * Math.cos(startAngle);
    const iy1 = cy + innerR * Math.sin(startAngle);
    const ix2 = cx + innerR * Math.cos(endAngle);
    const iy2 = cy + innerR * Math.sin(endAngle);

    const largeArc = slice > Math.PI ? 1 : 0;

    const d = [
      `M ${x1} ${y1}`,
      `A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`,
      `L ${ix2} ${iy2}`,
      `A ${innerR} ${innerR} 0 ${largeArc} 0 ${ix1} ${iy1}`,
      'Z',
    ].join(' ');

    return { d, color: seg.color };
  });
}

export default function StockDonut() {
  const CX = 90, CY = 90, R = 75, IR = 48;
  const paths = buildDonut(segments, CX, CY, R, IR);

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <h3 className="text-[14px] font-semibold text-gray-900 mb-4">Distribusi Stok Ternak</h3>

      <div className="flex items-center gap-4">
        {/* Donut SVG */}
        <div className="shrink-0 relative">
          <svg width="180" height="180" viewBox="0 0 180 180">
            {paths.map((p, i) => (
              <path
                key={i}
                d={p.d}
                fill={p.color}
                stroke="white"
                strokeWidth="1.5"
              />
            ))}
            {/* Center label */}
            <text
              x={CX}
              y={CY - 6}
              textAnchor="middle"
              fontSize="22"
              fontWeight="700"
              fill="#1a2e1f"
              fontFamily="Poppins, sans-serif"
            >
              {total}
            </text>
            <text
              x={CX}
              y={CY + 12}
              textAnchor="middle"
              fontSize="10"
              fill="#9ca3af"
              fontFamily="Poppins, sans-serif"
            >
              Total Ternak
            </text>
          </svg>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-2.5">
          {segments.map((seg) => (
            <div key={seg.label} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: seg.color }}
              />
              <div>
                <span className="text-[12px] text-gray-600">{seg.label}</span>
                <span className="text-[12px] font-semibold text-gray-900 ml-1.5">({seg.count})</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
