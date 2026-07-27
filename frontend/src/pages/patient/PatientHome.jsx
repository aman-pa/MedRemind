import { useState, useEffect, useCallback } from "react";
import { Stethoscope } from "lucide-react";
import EmptyState from "../../components/patient/EmptyState";
import ScheduleSection from "../../components/patient/ScheduleSection";
import PillBoxPreview from "../../components/patient/PillBoxPreview";
import AnalyticsPreview from "../../components/patient/AnalyticsPreview";
import Skeleton from "../../components/common/Skeleton";

import { getConnections } from "../../services/connection.service";
import { getMedicines } from "../../services/medicine.service";
import { getRemindersForMedicine } from "../../services/reminder.service";
import { getMedicationLogs, createMedicationLog } from "../../services/medicationLog.service";

export default function PatientHome() {
  const [connections, setConnections] = useState([]);
  const [activeMeds, setActiveMeds] = useState([]);
  const [schedule, setSchedule] = useState({ morning: [], afternoon: [], evening: [], night: [] });
  const [loading, setLoading] = useState(true);

  const loadAllData = useCallback(async () => {
    try {
      // 1. Fetch connection status
      const connRes = await getConnections();
      const connList = connRes.data || [];
      setConnections(connList);

      if (connList.length === 0) {
        setLoading(false);
        return;
      }

      // 2. Fetch active medicines
      const medRes = await getMedicines(null, true);
      const meds = medRes.data || [];
      setActiveMeds(meds);

      if (meds.length === 0) {
        setSchedule({ morning: [], afternoon: [], evening: [], night: [] });
        setLoading(false);
        return;
      }

      // 3. Fetch reminders for all active medicines
      const remindersPromises = meds.map((med) => getRemindersForMedicine(med._id));
      const remindersResults = await Promise.all(remindersPromises);

      // 4. Fetch today's medication logs
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      const logsRes = await getMedicationLogs(start.toISOString(), end.toISOString());
      const logs = logsRes.data || [];

      // Map today's logged doses
      const loggedTimes = new Set();
      logs.forEach((log) => {
        const dateObj = new Date(log.scheduledFor);
        const hh = String(dateObj.getHours()).padStart(2, "0");
        const mm = String(dateObj.getMinutes()).padStart(2, "0");
        const keyId = log.medicineId?._id || log.medicineId;
        loggedTimes.add(`${keyId}-${hh}:${mm}`);
      });

      // 5. Group reminders into time slots
      const newSchedule = { morning: [], afternoon: [], evening: [], night: [] };
      meds.forEach((medicine, idx) => {
        const medReminders = remindersResults[idx]?.data || [];
        medReminders.forEach((reminder) => {
          reminder.times.forEach((time) => {
            const todayDay = new Date().getDay();
            if (reminder.daysOfWeek.length > 0 && !reminder.daysOfWeek.includes(todayDay)) {
              return; // doesn't apply today
            }

            const isTaken = loggedTimes.has(`${medicine._id}-${time}`);
            const [hours] = time.split(":").map(Number);

            let key = "morning";
            if (hours >= 12 && hours < 17) key = "afternoon";
            else if (hours >= 17 && hours < 21) key = "evening";
            else if (hours >= 21 || hours < 6) key = "night";

            newSchedule[key].push({
              id: `${medicine._id}-${time}`,
              medicineId: medicine._id,
              reminderId: reminder._id,
              name: medicine.name,
              dosage: medicine.dosage,
              form: medicine.form,
              instructions: medicine.instructions,
              time,
              isTaken,
            });
          });
        });
      });

      setSchedule(newSchedule);
    } catch {
      // fail silently or set fallback empty states
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      loadAllData();
    }, 0);
    return () => clearTimeout(t);
  }, [loadAllData]);

  const handleLogDose = async (medicineId, reminderId, time) => {
    try {
      const [hours, minutes] = time.split(":").map(Number);
      const scheduledFor = new Date();
      scheduledFor.setHours(hours, minutes, 0, 0);

      await createMedicationLog({
        medicineId,
        reminderId,
        scheduledFor: scheduledFor.toISOString(),
        status: "taken",
      });

      // Reload all data to refresh charts + streaks + checkboxes instantly
      loadAllData();
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Failed to log dose.");
    }
  };

  if (loading) {
    return <Skeleton.List count={3} />;
  }

  const isDoctorConnected = connections.length > 0;

  return (
    <div className="flex flex-col gap-6">
      {!isDoctorConnected && (
        <EmptyState
          icon={Stethoscope}
          title="No doctor is connected to your account."
          description="Once you connect with a doctor, your prescriptions will show up here."
        />
      )}

      {isDoctorConnected && (
        <>
          <ScheduleSection schedule={schedule} onLogDose={handleLogDose} />
          <AnalyticsPreview />
          <PillBoxPreview medicines={activeMeds.slice(0, 3)} />
        </>
      )}
    </div>
  );
}