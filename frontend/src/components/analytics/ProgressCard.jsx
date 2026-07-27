import Card from "../common/Card";

// Labeled progress bar for a bounded period, e.g.
// <ProgressCard label="Today's Progress" current={2} total={3} />
// <ProgressCard label="Weekly Progress" percentage={82} />
export default function ProgressCard({
  label,
  current,
  total,
  percentage,
  className = "",
}) {
  const pct =
    percentage != null
      ? percentage
      : total > 0
      ? Math.round((current / total) * 100)
      : 0;

  return (
    <Card className={className}>
      <Card.Body>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-[var(--text)]">{label}</span>
          <span className="text-sm font-semibold text-[var(--primary)]">
            {current != null && total != null ? `${current}/${total}` : `${pct}%`}
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--surface-strong)]">
          <div
            className="h-full rounded-full bg-[var(--primary)] transition-all duration-500"
            style={{ width: `${Math.max(0, Math.min(100, pct))}%` }}
          />
        </div>
      </Card.Body>
    </Card>
  );
}
