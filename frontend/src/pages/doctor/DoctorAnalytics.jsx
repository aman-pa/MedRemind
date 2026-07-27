import { useEffect, useState } from "react";
import { Users, Pill, ClipboardList, AlertTriangle } from "lucide-react";
import { getDoctorAnalyticsRequest } from "../../services/analytics.service";
import AnalyticsOverview from "../../components/analytics/AnalyticsOverview";
import ProgressCard from "../../components/analytics/ProgressCard";
import RecentActivityList from "../../components/analytics/RecentActivityList";
import EmptyAnalytics, { ErrorAnalytics } from "../../components/analytics/EmptyAnalytics";
import Card from "../../components/common/Card";
import Skeleton from "../../components/common/Skeleton";

export default function DoctorAnalytics() {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | error | empty | ready
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setStatus("loading");
      try {
        const result = await getDoctorAnalyticsRequest();
        if (cancelled) return;
        if (!result || result.connectedPatients === 0) {
          setStatus("empty");
        } else {
          setData(result);
          setStatus("ready");
        }
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [reloadToken]);

  if (status === "loading") {
    return <Skeleton.List count={4} />;
  }

  if (status === "error") {
    return <ErrorAnalytics onRetry={() => setReloadToken((n) => n + 1)} />;
  }

  if (status === "empty") {
    return <EmptyAnalytics />;
  }

  const missedActivity = data.recentlyMissedMedicines.map((m, i) => ({
    id: `missed-${i}`,
    medicineName: m.medicineName,
    patientName: m.patientName,
    status: "missed",
    time: m.missedAt,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">Practice Analytics</h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Adherence and prescription insights across your connected patients.
        </p>
      </div>

      <AnalyticsOverview
        stats={[
          { label: "Connected Patients", value: data.connectedPatients, icon: Users },
          { label: "Active Prescriptions", value: data.activePrescriptions, icon: ClipboardList },
          { label: "Active Medicines", value: data.activeMedicines, icon: Pill },
          {
            label: "Needs Attention",
            value: data.patientsRequiringAttention,
            icon: AlertTriangle,
            tone: data.patientsRequiringAttention > 0 ? "warning" : "success",
          },
        ]}
      />

      <Card>
        <Card.Header>
          <h2 className="text-sm font-semibold text-[var(--text)]">Adherence Summary</h2>
        </Card.Header>
        <Card.Body className="flex flex-col gap-3">
          <ProgressCard label="Average Patient Adherence" percentage={data.averageAdherence} />
          <ProgressCard label="Compliance Rate" percentage={data.complianceRate} />
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>
          <h2 className="text-sm font-semibold text-[var(--text)]">Patient Overview</h2>
        </Card.Header>
        <Card.Body className="divide-y divide-[var(--border)] p-0">
          {data.patientOverview.map((patient) => (
            <div key={patient.id} className="flex items-center justify-between px-5 py-3">
              <div>
                <p className="text-sm font-medium text-[var(--text)]">{patient.name}</p>
                <p className="text-xs text-[var(--text-muted)]">{patient.activeMedicines} active medicines</p>
              </div>
              <span
                className={`text-sm font-semibold ${
                  patient.adherence < 60 ? "text-[var(--danger)]" : "text-[var(--text)]"
                }`}
              >
                {patient.adherence}%
              </span>
            </div>
          ))}
        </Card.Body>
      </Card>

      <RecentActivityList items={missedActivity} />
    </div>
  );
}
