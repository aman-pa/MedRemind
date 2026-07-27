import { Clock, Calendar, CheckCircle } from "lucide-react";

export default function MedicineCard({ medicine }) {
  const name = medicine?.name || "Amoxicillin";
  const type = medicine?.type || "Tablet";
  const dosage = medicine?.dosage || "500mg";
  const frequency = medicine?.frequency || "Twice daily";
  const duration = medicine?.duration || "7 days";
  const status = medicine?.status || "Active";

  return (
    <div className="flex flex-col rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm transition-all hover:shadow-md">
      <div className="mb-3 flex items-start justify-between">
        <div>
          <h4 className="font-semibold text-[var(--text)]">{name}</h4>
          <p className="text-sm text-[var(--text-muted)]">{type} • {dosage}</p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-[var(--success)]/10 px-2 py-1 text-xs font-medium text-[var(--success)]">
          <CheckCircle size={12} />
          {status}
        </span>
      </div>
      
      <div className="mt-auto grid grid-cols-2 gap-2 text-sm text-[var(--text-muted)]">
        <div className="flex items-center gap-1.5 rounded-md bg-[var(--surface-strong)] px-2 py-1.5">
          <Clock size={14} className="text-[var(--primary)]" />
          <span>{frequency}</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-md bg-[var(--surface-strong)] px-2 py-1.5">
          <Calendar size={14} className="text-[var(--primary)]" />
          <span>{duration}</span>
        </div>
      </div>
    </div>
  );
}
