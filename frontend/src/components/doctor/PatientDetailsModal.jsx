import { useEffect, useState } from "react";
import { getMedicines } from "../../services/medicine.service";
import Button from "../common/Button";
import Skeleton from "../common/Skeleton";
import { X, Pill, ShieldAlert } from "lucide-react";

export default function PatientDetailsModal({ isOpen, onClose, patient }) {
  const [activeMedicines, setActiveMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen || !patient?.patientId) return;

    let cancelled = false;
    async function fetchMedicines() {
      setLoading(true);
      setError("");
      try {
        const response = await getMedicines(patient.patientId, true);
        if (cancelled) return;
        setActiveMedicines(response.data || []);
      } catch {
        setError("Failed to load patient's prescriptions.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchMedicines();
    return () => {
      cancelled = true;
    };
  }, [isOpen, patient]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative z-10 w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl space-y-6 text-sm text-[var(--text)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
          <div>
            <h2 className="text-lg font-bold text-[var(--text)]">{patient.name}</h2>
            <p className="text-xs text-[var(--text-muted)]">{patient.email}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-[var(--text-muted)] hover:bg-[var(--surface-strong)] transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Demographics */}
        <div className="grid grid-cols-2 gap-4 rounded-xl bg-[var(--surface-strong)]/40 p-4">
          <div>
            <span className="font-semibold text-xs uppercase tracking-wider text-[var(--text-muted)]">Age</span>
            <p className="mt-0.5 text-base font-semibold">{patient.age}</p>
          </div>
          <div>
            <span className="font-semibold text-xs uppercase tracking-wider text-[var(--text-muted)]">Gender</span>
            <p className="mt-0.5 text-base font-semibold capitalize">{patient.gender}</p>
          </div>
        </div>

        {/* Prescribed Medicines */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Active Prescriptions
          </h3>

          {error && (
            <div className="rounded-lg bg-red-500/10 p-3 text-xs text-[var(--danger)] border border-red-500/20">
              {error}
            </div>
          )}

          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-16 w-full rounded-xl" />
              <Skeleton className="h-16 w-full rounded-xl" />
            </div>
          ) : activeMedicines.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-6 border border-dashed border-[var(--border)] rounded-xl text-center text-[var(--text-muted)]">
              <ShieldAlert className="h-8 w-8 mb-2 opacity-50" />
              <p className="text-xs">No active medicines prescribed to this patient.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeMedicines.map((med) => (
                <div
                  key={med._id}
                  className="flex items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-strong)]/20 p-4"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--primary-light)] text-[var(--primary)]">
                    <Pill size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-sm text-[var(--text)]">{med.name}</p>
                      <span className="text-xs text-[var(--text-muted)]">Freq: {med.frequencyPerDay}x/day</span>
                    </div>
                    <p className="text-xs text-[var(--text-muted)]">Dosage: {med.dosage} ({med.form})</p>
                    {med.instructions && (
                      <p className="mt-1.5 text-xs text-[var(--text-muted)] italic">
                        "{med.instructions}"
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4 border-t border-[var(--border)]">
          <Button variant="secondary" onClick={onClose}>
            Close Details
          </Button>
        </div>
      </div>
    </div>
  );
}
