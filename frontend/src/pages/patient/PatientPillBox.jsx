import { useState, useEffect } from "react";
import { PackageOpen } from "lucide-react";
import EmptyState from "../../components/patient/EmptyState";
import MedicineCard from "../../components/patient/MedicineCard";
import Skeleton from "../../components/common/Skeleton";
import { getMedicines } from "../../services/medicine.service";

export default function PatientPillBox() {
  const [activeMedicines, setActiveMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const response = await getMedicines(null, true);
        if (cancelled) return;
        setActiveMedicines(response.data || []);
      } catch {
        // ignore errors
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <Skeleton.List count={3} />;
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold text-[var(--text)]">Pill Box</h1>

      {activeMedicines.length === 0 ? (
        <EmptyState
          icon={PackageOpen}
          title="No active medicines."
          description="Medicines your doctor prescribes will appear here."
        />
      ) : (
        <div className="flex flex-col gap-2">
          {activeMedicines.map((medicine) => (
            <MedicineCard key={medicine._id} medicine={medicine} />
          ))}
        </div>
      )}
    </div>
  );
}
