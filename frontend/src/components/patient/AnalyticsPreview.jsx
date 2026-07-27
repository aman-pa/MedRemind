import { useEffect, useState } from "react";
import { getDashboardOverviewRequest } from "../../services/analytics.service";
import AnalyticsCard from "../analytics/AnalyticsCard";
import ProgressCard from "../analytics/ProgressCard";
import Skeleton from "../common/Skeleton";

// Per Analytics_Frontend_Context.md Patient Dashboard spec:
// Today's Progress -> Weekly Progress -> Current Streak -> View Analytics
export default function AnalyticsPreview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getDashboardOverviewRequest("patient")
      .then((result) => !cancelled && setData(result))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <Skeleton className="h-40 w-full rounded-xl" />;
  if (!data) return null;

  const weeklyAvg = Math.round(
    data.weeklyProgress.reduce((sum, d) => sum + d.adherence, 0) / data.weeklyProgress.length
  );

  return (
    <AnalyticsCard title="Your Progress" viewAllHref="/patient/analytics">
      <div className="flex flex-col gap-3">
        <ProgressCard
          label="Today's Progress"
          current={data.todayProgress.taken}
          total={data.todayProgress.total}
        />
        <ProgressCard label="Weekly Progress" percentage={weeklyAvg} />
        <p className="text-xs text-[var(--text-muted)]">
          🔥 {data.currentStreak}-day current streak
        </p>
      </div>
    </AnalyticsCard>
  );
}
