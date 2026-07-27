import { useEffect, useState } from "react";
import { getConnections } from "../../services/connection.service";
import { createMedicine } from "../../services/medicine.service";
import { createReminder } from "../../services/reminder.service";
import Button from "../common/Button";
import { X } from "lucide-react";

export default function AddMedicineModal({ isOpen, onClose, onSuccess }) {
  const [patients, setPatients] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Form Fields
  const [patientId, setPatientId] = useState("");
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [form, setForm] = useState("tablet");
  const [frequencyPerDay, setFrequencyPerDay] = useState(1);
  const [instructions, setInstructions] = useState("");
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState("");

  // Timings: array of "HH:mm" strings
  const [times, setTimes] = useState(["08:00"]);
  // Days of Week: empty array = every day. 0 = Sunday, 1 = Monday, etc.
  const [daysOfWeek, setDaysOfWeek] = useState([]);

  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;
    async function fetchPatients() {
      setLoadingPatients(true);
      try {
        const response = await getConnections();
        if (cancelled) return;
        const list = response.data || [];
        setPatients(list);
        if (list.length > 0) {
          setPatientId(list[0].patientId?._id || "");
        }
      } catch {
        setError("Failed to load connected patients.");
      } finally {
        if (!cancelled) setLoadingPatients(false);
      }
    }

    fetchPatients();
    return () => {
      cancelled = true;
    };
  }, [isOpen]);



  if (!isOpen) return null;

  const handleTimeChange = (index, value) => {
    setTimes((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const toggleDay = (day) => {
    setDaysOfWeek((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort()
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!patientId || !name || !dosage) {
      setError("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      // 1. Create the Medicine
      const medicineRes = await createMedicine({
        patientId,
        name: name.trim(),
        dosage: dosage.trim(),
        form,
        frequencyPerDay: Number(frequencyPerDay),
        instructions: instructions.trim(),
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
      });

      const createdMedicine = medicineRes.data;

      // 2. Create the Reminder
      await createReminder({
        medicineId: createdMedicine._id,
        times,
        daysOfWeek,
      });

      // 3. Success callback
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to create prescription."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const weekdays = [
    { label: "S", value: 0 },
    { label: "M", value: 1 },
    { label: "T", value: 2 },
    { label: "W", value: 3 },
    { label: "T", value: 4 },
    { label: "F", value: 5 },
    { label: "S", value: 6 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative z-10 w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
          <h2 className="text-xl font-bold text-[var(--text)]">Create Prescription</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-[var(--text-muted)] hover:bg-[var(--surface-strong)] transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="rounded-lg bg-red-500/10 p-3 text-sm text-[var(--danger)] border border-red-500/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-sm text-[var(--text)]">
          {/* Patient Selection */}
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-xs uppercase tracking-wider text-[var(--text-muted)]">
              Select Patient *
            </label>
            {loadingPatients ? (
              <div className="h-10 animate-pulse rounded-lg bg-[var(--surface-strong)]/40" />
            ) : patients.length === 0 ? (
              <p className="text-sm text-[var(--danger)]">
                No patients connected. Please connect with a patient first.
              </p>
            ) : (
              <select
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface-strong)] p-2.5 outline-none focus:border-[var(--primary)]"
              >
                {patients.map((conn) => (
                  <option key={conn._id} value={conn.patientId?._id}>
                    {conn.patientId?.userId?.name || "Unknown Patient"} ({conn.patientId?.userId?.email})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Medicine Name */}
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-xs uppercase tracking-wider text-[var(--text-muted)]">
                Medicine Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Metformin"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface-strong)] p-2.5 outline-none focus:border-[var(--primary)]"
              />
            </div>

            {/* Dosage */}
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-xs uppercase tracking-wider text-[var(--text-muted)]">
                Dosage *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 500mg or 1 tablet"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface-strong)] p-2.5 outline-none focus:border-[var(--primary)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Form */}
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-xs uppercase tracking-wider text-[var(--text-muted)]">
                Form
              </label>
              <select
                value={form}
                onChange={(e) => setForm(e.target.value)}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface-strong)] p-2.5 outline-none focus:border-[var(--primary)]"
              >
                <option value="tablet">Tablet</option>
                <option value="capsule">Capsule</option>
                <option value="syrup">Syrup</option>
                <option value="injection">Injection</option>
                <option value="drops">Drops</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Frequency */}
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-xs uppercase tracking-wider text-[var(--text-muted)]">
                Frequency (Times Per Day)
              </label>
              <input
                type="number"
                min="1"
                max="6"
                value={frequencyPerDay}
                onChange={(e) => {
                  const val = Math.max(1, Math.min(6, Number(e.target.value)));
                  setFrequencyPerDay(val);

                  const defaultTimes = ["08:00", "14:00", "20:00", "12:00", "18:00", "22:00"];
                  setTimes((prev) => {
                    const next = [...prev];
                    if (next.length < val) {
                      for (let i = next.length; i < val; i++) {
                        next.push(defaultTimes[i] || "08:00");
                      }
                    } else if (next.length > val) {
                      next.splice(val);
                    }
                    return next;
                  });
                }}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface-strong)] p-2.5 outline-none focus:border-[var(--primary)]"
              />
            </div>
          </div>

          {/* Timings */}
          <div className="flex flex-col gap-1.5 border-t border-[var(--border)] pt-3">
            <label className="font-semibold text-xs uppercase tracking-wider text-[var(--text-muted)]">
              Scheduled Reminder Timings
            </label>
            <div className="grid grid-cols-3 gap-2">
              {times.map((time, idx) => (
                <div key={idx} className="flex flex-col gap-1">
                  <span className="text-[10px] text-[var(--text-muted)]">Dose {idx + 1}</span>
                  <input
                    type="time"
                    required
                    value={time}
                    onChange={(e) => handleTimeChange(idx, e.target.value)}
                    className="rounded-lg border border-[var(--border)] bg-[var(--surface-strong)] p-2 outline-none focus:border-[var(--primary)]"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Days of Week */}
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-xs uppercase tracking-wider text-[var(--text-muted)]">
              Days of Week (Empty = Every Day)
            </label>
            <div className="flex gap-2">
              {weekdays.map((day) => {
                const isSelected = daysOfWeek.includes(day.value);
                return (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => toggleDay(day.value)}
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                        : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:bg-[var(--surface-strong)]"
                    }`}
                  >
                    {day.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Instructions */}
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-xs uppercase tracking-wider text-[var(--text-muted)]">
              Instructions
            </label>
            <textarea
              placeholder="e.g. Take after breakfast with water"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full h-16 rounded-lg border border-[var(--border)] bg-[var(--surface-strong)] p-2 outline-none focus:border-[var(--primary)] resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-[var(--border)] pt-4">
            {/* Start Date */}
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-xs uppercase tracking-wider text-[var(--text-muted)]">
                Start Date
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface-strong)] p-2 outline-none focus:border-[var(--primary)]"
              />
            </div>

            {/* End Date */}
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-xs uppercase tracking-wider text-[var(--text-muted)]">
                End Date (Optional)
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface-strong)] p-2 outline-none focus:border-[var(--primary)]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)]">
            <Button variant="secondary" onClick={onClose} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" isLoading={submitting} disabled={patients.length === 0}>
              Create Prescription
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
