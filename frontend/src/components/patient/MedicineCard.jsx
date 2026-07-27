import { Pill, CheckCircle2, Circle } from "lucide-react";

// Shows one medicine: name, type, purpose and status.
// If onLog is passed, it renders as a checklist item for Today's Schedule.
export default function MedicineCard({ medicine, onLog, isTaken }) {
  const { name, form, dosage, instructions, status, time } = medicine;

  return (
    <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 hoverable">
      {onLog ? (
        <button
          type="button"
          onClick={onLog}
          disabled={isTaken}
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all cursor-pointer ${
            isTaken
              ? "bg-[var(--success)]/10 text-[var(--success)]"
              : "text-[var(--text-muted)] hover:bg-[var(--surface-strong)] hover:text-[var(--text)]"
          }`}
          aria-label={isTaken ? "Dose taken" : "Mark dose as taken"}
        >
          {isTaken ? <CheckCircle2 size={20} /> : <Circle size={20} />}
        </button>
      ) : (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--primary-light)] text-[var(--primary)]">
          <Pill size={18} />
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <p className="truncate text-sm font-semibold text-[var(--text)]">{name}</p>
          {time && <span className="text-xs font-semibold text-[var(--primary)]">{time}</span>}
        </div>
        <div className="flex gap-2 text-xs text-[var(--text-muted)]">
          <span>{dosage}</span>
          {form && <span>• {form}</span>}
        </div>
        {instructions && (
          <p className="mt-1 text-xs text-[var(--text-muted)]">Instructions: {instructions}</p>
        )}
      </div>

      {status && !onLog && (
        <span className="shrink-0 rounded-full bg-[var(--success)]/10 px-2.5 py-1 text-[11px] font-medium text-[var(--success)]">
          {status}
        </span>
      )}
    </div>
  );
}