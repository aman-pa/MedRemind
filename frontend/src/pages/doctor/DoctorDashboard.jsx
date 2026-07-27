import { useContext } from "react";
import OverviewCards from "../../components/doctor/OverviewCards";
import QuickActions from "../../components/doctor/QuickActions";
import AnalyticsPreview from "../../components/doctor/AnalyticsPreview";
import { AuthContext } from "../../contexts/AuthContext";

export default function DoctorDashboard() {
  const { user } = useContext(AuthContext);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--text)]">
          {getGreeting()}, Dr. {user?.name?.split(" ")[0] || "Doctor"}
        </h1>
        <p className="mt-2 text-[var(--text-muted)]">
          Here is your overview for today.
        </p>
      </div>

      <section>
        <h2 className="mb-4 text-xl font-semibold text-[var(--text)]">Today's Overview</h2>
        <OverviewCards />
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-xl font-semibold text-[var(--text)]">Quick Actions</h2>
        <QuickActions />
      </section>

      <section className="mt-10">
        <AnalyticsPreview />
      </section>
    </div>
  );
}
