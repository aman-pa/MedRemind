import Card from "../common/Card";

// Generic "number + label" card. Every simple stat in Analytics
// (Medicines Taken, Active Prescriptions, Connected Patients, etc.)
// renders through this so the look stays consistent everywhere.
export default function StatisticsCard({
  label,
  value,
  icon: Icon,
  tone = "default", // "default" | "success" | "warning" | "danger"
  className = "",
}) {
  const toneClasses = {
    default: "text-[var(--text)] bg-[var(--primary-light)] text-[var(--primary)]",
    success: "bg-emerald-500/10 text-[var(--success)]",
    warning: "bg-amber-500/10 text-[var(--warning)]",
    danger: "bg-red-500/10 text-[var(--danger)]",
  };

  return (
    <Card className={className}>
      <Card.Body className="flex items-center gap-3">
        {Icon && (
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${toneClasses[tone]}`}>
            <Icon className="h-5 w-5" />
          </div>
        )}
        <div className="min-w-0">
          <p className="text-xl font-bold leading-tight text-[var(--text)]">{value}</p>
          <p className="truncate text-xs text-[var(--text-muted)]">{label}</p>
        </div>
      </Card.Body>
    </Card>
  );
}
