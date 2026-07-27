// Lightweight line chart, plain SVG - no charting library dependency.
// data: [{ label: string, value: number }], value expected 0-100.
export default function LineChart({ data = [], height = 140, className = "" }) {
  if (data.length === 0) return null;

  const width = 100; // percentage-based viewBox, scales with container
  const max = 100;
  const stepX = width / Math.max(data.length - 1, 1);

  const points = data.map((point, i) => {
    const x = i * stepX;
    const y = height - (point.value / max) * height;
    return { x, y, ...point };
  });

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  return (
    <div className={className}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="h-[140px] w-full overflow-visible"
      >
        {/* baseline grid */}
        <line x1="0" y1={height} x2={width} y2={height} stroke="var(--border)" strokeWidth="0.5" />
        <path d={pathD} fill="none" stroke="var(--primary)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="2" fill="var(--primary)" />
        ))}
      </svg>
      <div className="mt-2 flex justify-between text-[10px] text-[var(--text-muted)]">
        {data.map((d, i) => (
          <span key={i}>{d.label}</span>
        ))}
      </div>
    </div>
  );
}
