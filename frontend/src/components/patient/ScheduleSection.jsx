import { CalendarClock } from "lucide-react";
import EmptyState from "./EmptyState";
import MedicineCard from "./MedicineCard";

const TIME_SLOTS = [
  { key: "morning", label: "Morning" },
  { key: "afternoon", label: "Afternoon" },
  { key: "evening", label: "Evening" },
  { key: "night", label: "Night" },
];

// schedule looks like: { morning: [], afternoon: [], evening: [], night: [] }
// Today there is no Reminder module yet, so every slot is always empty.
// Once the Reminder module exists, just fill these arrays with medicines
// and this component will render them automatically - no redesign needed.
export default function ScheduleSection({ schedule = {}, onLogDose }) {
  const hasAnyMedicine = TIME_SLOTS.some(
    (slot) => (schedule[slot.key] || []).length > 0
  );

  return (
    <section>
      <h2 className="mb-3 text-base font-semibold text-[var(--text)]">
        Today's Schedule
      </h2>

      {!hasAnyMedicine ? (
        <EmptyState
          icon={CalendarClock}
          title="No medicines scheduled for today."
          description="Once your doctor adds a prescription with timings, they will show up here."
        />
      ) : (
        <div className="flex flex-col gap-4">
          {TIME_SLOTS.map((slot) => {
            const medicines = schedule[slot.key] || [];
            if (medicines.length === 0) return null;

            return (
              <div key={slot.key}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)] border-b border-[var(--border)] pb-1">
                  {slot.label}
                </p>
                <div className="flex flex-col gap-2">
                  {medicines.map((medicine) => (
                    <MedicineCard
                      key={medicine.id}
                      medicine={medicine}
                      isTaken={medicine.isTaken}
                      onLog={onLogDose ? () => onLogDose(medicine.medicineId, medicine.reminderId, medicine.time) : undefined}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
