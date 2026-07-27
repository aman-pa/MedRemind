import { FileSignature, Calendar } from "lucide-react";

export default function PrescriptionCard({ prescription }) {
  const date = prescription?.date || "Oct 24, 2026";
  const medicinesCount = prescription?.medicinesCount || 3;

  return (
    <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--primary-light)] text-[var(--primary)]">
          <FileSignature size={20} />
        </div>
        <div>
          <h4 className="font-medium text-[var(--text)]">Prescription</h4>
          <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
            <span className="flex items-center gap-1"><Calendar size={12} /> {date}</span>
            <span>•</span>
            <span>{medicinesCount} Medicines</span>
          </div>
        </div>
      </div>
      <button className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm font-medium text-[var(--text)] transition-colors hover:bg-[var(--surface-strong)] focus:outline-none">
        View
      </button>
    </div>
  );
}
