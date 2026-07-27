import { Calendar, Activity, FileText } from "lucide-react";

export default function PatientCard({ patient }) {
  // Using generic props if patient is passed, otherwise placeholders
  const name = patient?.name || "John Doe";
  const age = patient?.age || "45";
  const gender = patient?.gender || "Male";
  const status = patient?.status || "Stable";

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "critical": return "bg-[var(--danger)]/10 text-[var(--danger)]";
      case "stable": return "bg-[var(--success)]/10 text-[var(--success)]";
      case "needs attention": return "bg-[var(--warning)]/10 text-[var(--warning)]";
      default: return "bg-[var(--surface-strong)] text-[var(--text-muted)]";
    }
  };

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-sm transition-shadow hover:shadow-md">
      <div className="p-5">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--primary-light)] text-lg font-bold text-[var(--primary)]">
              {name.charAt(0)}
            </div>
            <div>
              <h3 className="font-semibold text-[var(--text)]">{name}</h3>
              <p className="text-sm text-[var(--text-muted)]">
                {age} yrs • {gender}
              </p>
            </div>
          </div>
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(status)}`}>
            {status}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-y-2 text-sm text-[var(--text-muted)]">
          <div className="flex items-center gap-1.5">
            <Calendar size={14} />
            <span>Last visit: 2 days ago</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Activity size={14} />
            <span>BP: 120/80</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FileText size={14} />
            <span>3 active prescriptions</span>
          </div>
        </div>
      </div>
      
      <div className="border-t border-[var(--border)] bg-[var(--surface-strong)]/30 px-5 py-3">
        <button className="w-full rounded-lg bg-transparent px-4 py-2 text-sm font-medium text-[var(--primary)] transition-colors hover:bg-[var(--primary-light)] focus:outline-none">
          View Details
        </button>
      </div>
    </div>
  );
}
