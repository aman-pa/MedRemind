import { CheckCircle2, XCircle, MinusCircle } from "lucide-react";
import Card from "../common/Card";

const STATUS_MAP = {
  taken: { icon: CheckCircle2, className: "text-[var(--success)]" },
  missed: { icon: XCircle, className: "text-[var(--danger)]" },
  skipped: { icon: MinusCircle, className: "text-[var(--warning)]" },
};

function formatTime(iso) {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

// Shared "Recent Activity" / "Recent Activities" feed.
// items: [{ id, medicineName, status: 'taken'|'missed'|'skipped', time, patientName? }]
export default function RecentActivityList({ items = [], className = "" }) {
  return (
    <Card className={className}>
      <Card.Header>
        <h2 className="text-sm font-semibold text-[var(--text)]">Recent Activity</h2>
      </Card.Header>
      <Card.Body className="divide-y divide-[var(--border)] p-0">
        {items.map((item) => {
          const { icon: Icon, className: iconClass } = STATUS_MAP[item.status] || STATUS_MAP.taken;
          return (
            <div key={item.id} className="flex items-center gap-3 px-5 py-3">
              <Icon className={`h-4 w-4 shrink-0 ${iconClass}`} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-[var(--text)]">
                  {item.medicineName}
                  {item.patientName && (
                    <span className="text-[var(--text-muted)]"> · {item.patientName}</span>
                  )}
                </p>
                <p className="text-xs capitalize text-[var(--text-muted)]">{item.status}</p>
              </div>
              <span className="shrink-0 text-xs text-[var(--text-muted)]">{formatTime(item.time)}</span>
            </div>
          );
        })}
      </Card.Body>
    </Card>
  );
}
