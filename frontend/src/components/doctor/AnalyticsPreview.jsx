import { useEffect, useState } from "react";
import { getDashboardOverviewRequest } from "../../services/analytics.service";
import AnalyticsCard from "../analytics/AnalyticsCard";
import AnalyticsOverview from "../analytics/AnalyticsOverview";
import { Users, TrendingUp, ClipboardList, AlertTriangle } from "lucide-react";
import Skeleton from "../common/Skeleton";

// Per Analytics_Frontend_Context.md Doctor Dashboard spec:
// Connected Patients, Average Adherence, Active Prescriptions,
// Patients Requiring Attention -> View Analytics
export default function AnalyticsPreview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getDashboardOverviewRequest("doctor")
      .then((result) => !cancelled && setData(result))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <Skeleton className="h-32 w-full rounded-xl" />;
  if (!data) return null;

  return (
    <AnalyticsCard title="Practice Analytics" viewAllHref="/doctor/analytics">
      <AnalyticsOverview
        stats={[
          { label: "Connected Patients", value: data.connectedPatients, icon: Users },
          { label: "Avg Adherence", value: `${data.averageAdherence}%`, icon: TrendingUp },
          { label: "Active Prescriptions", value: data.activePrescriptions, icon: ClipboardList },
          {
            label: "Needs Attention",
            value: data.patientsRequiringAttention,
            icon: AlertTriangle,
            tone: data.patientsRequiringAttention > 0 ? "warning" : "success",
          },
        ]}
      />
    </AnalyticsCard>
  );
}
