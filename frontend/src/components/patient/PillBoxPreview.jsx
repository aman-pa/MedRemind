import { Link } from "react-router-dom";
import { PackageOpen } from "lucide-react";
import EmptyState from "./EmptyState";
import MedicineCard from "./MedicineCard";

// medicines = list of ACTIVE medicines only. Dosage timings are not shown here.
export default function PillBoxPreview({ medicines = [] }) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold text-[var(--text)]">
          Virtual Pill Box
        </h2>
        <Link
          to="/patient/pillbox"
          className="text-xs font-medium text-[var(--primary)] hover:underline"
        >
          View all
        </Link>
      </div>

      {medicines.length === 0 ? (
        <EmptyState
          icon={PackageOpen}
          title="No active medicines."
          description="Medicines your doctor prescribes will appear here."
        />
      ) : (
        <div className="flex flex-col gap-2">
          {medicines.map((medicine) => (
            <MedicineCard key={medicine.id} medicine={medicine} />
          ))}
        </div>
      )}
    </section>
  );
}
