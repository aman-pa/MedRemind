import { useEffect, useState, useCallback } from "react";
import {
  getMyNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} from "../../services/notification.service";
import Skeleton from "../../components/common/Skeleton";
import Button from "../../components/common/Button";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Check,
  Trash2,
  Bell,
} from "lucide-react";

const ICON_MAP = {
  dose_missed: { icon: XCircle, className: "text-[var(--danger)] bg-red-500/10" },
  dose_reminder: { icon: CheckCircle2, className: "text-[var(--success)] bg-emerald-500/10" },
  connection_request: { icon: AlertCircle, className: "text-[var(--warning)] bg-amber-500/10" },
  general: { icon: CheckCircle2, className: "text-[var(--primary)] bg-[var(--primary-light)]" },
};

function formatFullTime(iso) {
  const date = new Date(iso);
  return `${date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  })} at ${date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

export default function NotificationPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadNotifications = useCallback(async () => {
    try {
      const response = await getMyNotifications(false);
      setNotifications(response.data || []);
    } catch {
      setError("Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const t = setTimeout(() => {
      if (!cancelled) loadNotifications();
    }, 0);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [loadNotifications]);

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch {
      // ignore
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch {
      // ignore
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch {
      // ignore
    }
  };

  // Group notifications by Today, Yesterday, and Earlier
  const todayList = [];
  const yesterdayList = [];
  const earlierList = [];

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);

  notifications.forEach((item) => {
    const date = new Date(item.createdAt);
    if (date >= startOfToday) {
      todayList.push(item);
    } else if (date >= startOfYesterday) {
      yesterdayList.push(item);
    } else {
      earlierList.push(item);
    }
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const renderSection = (title, items) => {
    if (items.length === 0) return null;
    return (
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border)] pb-1">
          {title}
        </h3>
        <div className="space-y-3">
          {items.map((item) => {
            const config = ICON_MAP[item.type] || ICON_MAP.general;
            const Icon = config.icon;
            return (
              <div
                key={item._id}
                className={`flex gap-4 p-4 rounded-xl border border-[var(--border)] transition-all hover:shadow-md ${
                  !item.isRead
                    ? "bg-[var(--primary-light)]/10 border-[var(--primary)]/30 font-medium"
                    : "bg-[var(--surface)] text-[var(--text-muted)]"
                }`}
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${config.className}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`font-semibold text-sm ${!item.isRead ? "text-[var(--text)]" : ""}`}>
                      {item.title}
                    </p>
                    <span className="text-[10px] whitespace-nowrap opacity-75">
                      {formatFullTime(item.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-[var(--text)] opacity-90">
                    {item.message}
                  </p>
                  <div className="flex items-center gap-4 pt-2">
                    {!item.isRead && (
                      <button
                        onClick={() => handleMarkRead(item._id)}
                        className="flex items-center gap-1 text-[11px] font-semibold text-[var(--primary)] hover:underline cursor-pointer"
                      >
                        <Check className="h-3 w-3" /> Mark as Read
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="flex items-center gap-1 text-[11px] font-semibold text-[var(--danger)] hover:underline cursor-pointer"
                    >
                      <Trash2 className="h-3 w-3" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--text)]">Notifications</h1>
          <p className="mt-2 text-[var(--text-muted)]">
            Stay updated with your daily prescription schedules and connection alerts.
          </p>
        </div>
        {unreadCount > 0 && (
          <Button onClick={handleMarkAllRead} className="flex items-center gap-2 self-start">
            <Check className="h-4 w-4" /> Mark all read
          </Button>
        )}
      </div>

      {error && (
        <div className="rounded-lg bg-red-500/10 p-4 text-sm text-[var(--danger)] border border-red-500/20">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-6">
          <div className="space-y-3">
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 border border-dashed border-[var(--border)] rounded-2xl text-center bg-[var(--surface)] shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--surface-strong)] text-[var(--text-muted)] mb-4">
            <Bell className="h-8 w-8 opacity-60" />
          </div>
          <h3 className="text-lg font-bold text-[var(--text)]">No notifications available</h3>
          <p className="text-xs text-[var(--text-muted)] mt-1.5 max-w-xs leading-normal">
            You're all caught up! When you receive alerts or prescription reminders, they will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {renderSection("Today", todayList)}
          {renderSection("Yesterday", yesterdayList)}
          {renderSection("Earlier", earlierList)}
        </div>
      )}
    </div>
  );
}
