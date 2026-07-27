import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, MinusCircle, Flame, Trophy, Clock } from "lucide-react";
import { getPatientAnalyticsRequest } from "../../services/analytics.service";
import AnalyticsOverview from "../../components/analytics/AnalyticsOverview";
import AdherenceCard from "../../components/analytics/AdherenceCard";
import ProgressCard from "../../components/analytics/ProgressCard";
import LineChart from "../../components/analytics/LineChart";
import BarChart from "../../components/analytics/BarChart";
import RecentActivityList from "../../components/analytics/RecentActivityList";
import EmptyAnalytics, { ErrorAnalytics } from "../../components/analytics/EmptyAnalytics";
import Card from "../../components/common/Card";
import Skeleton from "../../components/common/Skeleton";

export default function PatientAnalytics() {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | error | empty | ready

  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setStatus("loading");
      try {
        const result = await getPatientAnalyticsRequest();
        if (cancelled) return;
        if (!result || result.medicinesTaken + result.medicinesMissed + result.medicinesSkipped === 0) {
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

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">Your Analytics</h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          A summary of your medication adherence and progress.
        </p>
      </div>

      <AnalyticsOverview
        stats={[
          { label: "Taken", value: data.medicinesTaken, icon: CheckCircle2, tone: "success" },
          { label: "Missed", value: data.medicinesMissed, icon: XCircle, tone: "danger" },
          { label: "Skipped", value: data.medicinesSkipped, icon: MinusCircle, tone: "warning" },
          { label: "Longest Streak", value: `${data.longestStreak}d`, icon: Trophy },
        ]}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <AdherenceCard
          adherencePercentage={data.adherencePercentage}
          taken={data.medicinesTaken}
          missed={data.medicinesMissed}
          skipped={data.medicinesSkipped}
        />
        <div className="flex flex-col gap-4">
          <ProgressCard
            label="Today's Progress"
            current={data.todayProgress.taken}
            total={data.todayProgress.total}
          />
          <Card>
            <Card.Body className="flex items-center gap-3">
              <Flame className="h-5 w-5 text-[var(--warning)]" />
              <div>
                <p className="text-sm font-medium text-[var(--text)]">
                  {data.currentStreak}-day current streak
                </p>
                <p className="text-xs text-[var(--text-muted)]">Keep it going!</p>
              </div>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-[var(--primary)]" />
              <div>
                <p className="text-sm font-medium text-[var(--text)]">Last dose</p>
                <p className="text-xs text-[var(--text-muted)]">{data.lastDose.medicineName}</p>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>

      <Card>
        <Card.Header>
          <h2 className="text-sm font-semibold text-[var(--text)]">Weekly Progress</h2>
        </Card.Header>
        <Card.Body>
          <LineChart data={data.weeklyProgress.map((d) => ({ label: d.label, value: d.adherence }))} />
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>
          <h2 className="text-sm font-semibold text-[var(--text)]">Monthly Progress</h2>
        </Card.Header>
        <Card.Body>
          <BarChart data={data.monthlyProgress.map((d) => ({ label: d.label, value: d.adherence }))} />
        </Card.Body>
      </Card>

      <RecentActivityList items={data.recentActivity} />
    </div>
  );
}
