// Lightweight bar chart, plain SVG/flexbox - no charting library dependency.
// data: [{ label: string, value: number }], value expected 0-100.
export default function BarChart({ data = [], height = 140, className = "" }) {
  if (data.length === 0) return null;

  return (
    <div className={`flex items-end gap-2 ${className}`} style={{ height }}>
      {data.map((point, i) => (
        <div key={i} className="flex flex-1 flex-col items-center gap-1">
          <div className="flex w-full flex-1 items-end">
            <div
              className="w-full rounded-t-md bg-[var(--primary)]/80 transition-all duration-500"
              style={{ height: `${Math.max(2, Math.min(100, point.value))}%` }}
              title={`${point.label}: ${point.value}%`}
            />
          </div>
          <span className="text-[10px] text-[var(--text-muted)]">{point.label}</span>
        </div>
      ))}
    </div>
  );
}
