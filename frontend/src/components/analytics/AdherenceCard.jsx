import Card from "../common/Card";
import ProgressRing from "./ProgressRing";

// Patient-specific card: adherence % ring + taken/missed/skipped counts.
export default function AdherenceCard({
  adherencePercentage = 0,
  taken = 0,
  missed = 0,
  skipped = 0,
  className = "",
}) {
  const rows = [
    { label: "Taken", value: taken, dot: "bg-[var(--success)]" },
    { label: "Missed", value: missed, dot: "bg-[var(--danger)]" },
    { label: "Skipped", value: skipped, dot: "bg-[var(--warning)]" },
  ];

  return (
    <Card className={className}>
      <Card.Body className="flex items-center gap-6">
        <ProgressRing value={adherencePercentage} label="Adherence" />
        <div className="flex flex-1 flex-col gap-2">
          {rows.map((row) => (
            <div key={row.label} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-[var(--text-muted)]">
                <span className={`h-2 w-2 rounded-full ${row.dot}`} />
                {row.label}
              </span>
              <span className="font-semibold text-[var(--text)]">{row.value}</span>
            </div>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
}
