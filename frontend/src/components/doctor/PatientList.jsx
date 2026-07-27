import { useMemo } from "react";
import EmptyState from "./EmptyState";
import PatientCard from "./PatientCard";
import { Users } from "lucide-react";

export default function PatientList({ patients = [] }) {
  // Build a stable key for each patient: prefer existing id fields
  const patientsWithKeys = useMemo(
    () =>
      (patients || []).map((p, idx) => ({
        __uid: p.id || p._id || p.userId || p.email || `idx-${idx}`,
        patient: p,
      })),
    [patients]
  );

  if (!patients || patients.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No patients connected"
        description="When you connect with patients, they will appear here. Currently, the backend does not support patient connections."
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {patientsWithKeys.map(({ __uid, patient }) => (
        <PatientCard key={__uid} patient={patient} />
      ))}
    </div>
  );
}
