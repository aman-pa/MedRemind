import StatisticsCard from "./StatisticsCard";

// Generic responsive grid of StatisticsCard, driven by a list of stat
// definitions. Both PatientAnalytics and DoctorAnalytics build their
// top summary row through this, so the grid/responsive behavior only
// lives in one place.
//
// stats: [{ label, value, icon, tone }]
export default function AnalyticsOverview({ stats = [], className = "" }) {
  return (
    <div className={`grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 ${className}`}>
      {stats.map((stat) => (
        <StatisticsCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
