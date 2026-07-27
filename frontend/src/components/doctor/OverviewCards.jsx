import { useEffect, useState } from "react";
import { Users, FileText, Pill, Bell } from "lucide-react";
import { getDoctorAnalyticsRequest } from "../../services/analytics.service";
import { getMyNotifications } from "../../services/notification.service";
import Skeleton from "../common/Skeleton";

export default function OverviewCards() {
  const [data, setData] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [analytics, notifs] = await Promise.all([
          getDoctorAnalyticsRequest(),
          getMyNotifications(true), // unread only
        ]);
        if (cancelled) return;
        setData(analytics);
        setUnreadCount(notifs.data?.length || 0);
      } catch {
        // ignore errors, show zero fallback
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    const t = setTimeout(() => {
      load();
    }, 0);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, []);

  const cards = [
    { title: "Connected Patients", value: loading ? null : data?.connectedPatients ?? 0, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Active Prescriptions", value: loading ? null : data?.activePrescriptions ?? 0, icon: FileText, color: "text-green-500", bg: "bg-green-500/10" },
    { title: "Active Medicines", value: loading ? null : data?.activeMedicines ?? 0, icon: Pill, color: "text-purple-500", bg: "bg-purple-500/10" },
    { title: "Pending Notifications", value: loading ? null : unreadCount, icon: Bell, color: "text-orange-500", bg: "bg-orange-500/10" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className="flex flex-col items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm transition-shadow hover:shadow-md md:p-6"
        >
          <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-full ${card.bg} ${card.color}`}>
            <card.icon size={24} />
          </div>
          <p className="text-center text-xs font-medium text-[var(--text-muted)] md:text-sm">
            {card.title}
          </p>
          {loading ? (
            <Skeleton className="mt-2 h-8 w-12" />
          ) : (
            <h4 className="mt-1 text-2xl font-bold text-[var(--text)] md:text-3xl">
              {card.value}
            </h4>
          )}
        </div>
      ))}
    </div>
  );
}
