import { CheckCircle2, XCircle, AlertCircle, BellOff, Check } from "lucide-react";
import { Link } from "react-router-dom";
import Card from "../common/Card";

const ICON_MAP = {
  dose_missed: { icon: XCircle, className: "text-[var(--danger)] bg-red-500/10" },
  dose_reminder: { icon: CheckCircle2, className: "text-[var(--success)] bg-emerald-500/10" },
  connection_request: { icon: AlertCircle, className: "text-[var(--warning)] bg-amber-500/10" },
  general: { icon: CheckCircle2, className: "text-[var(--primary)] bg-[var(--primary-light)]" },
};

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function NotificationPanel({
  notifications = [],
  onMarkRead,
  onMarkAllRead,
  onClose,
  viewAllPath,
}) {
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <Card className="absolute right-0 mt-2 z-50 w-80 shadow-2xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] transition-all animate-in fade-in slide-in-from-top-2 duration-200">
      <Card.Header className="flex items-center justify-between px-4 py-3">
        <div>
          <h4 className="font-bold text-sm">Notifications</h4>
          {unreadCount > 0 && (
            <p className="text-[10px] font-semibold text-[var(--primary)] mt-0.5">
              {unreadCount} unread alert{unreadCount > 1 ? "s" : ""}
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={onMarkAllRead}
            className="flex items-center gap-1 text-[11px] font-semibold text-[var(--primary)] hover:underline cursor-pointer"
          >
            <Check className="h-3 w-3" /> Mark all read
          </button>
        )}
      </Card.Header>

      <Card.Body className="max-h-72 overflow-y-auto divide-y divide-[var(--border)] p-0">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center text-[var(--text-muted)]">
            <BellOff className="h-8 w-8 mb-2 opacity-40" />
            <p className="text-xs font-medium">All caught up!</p>
            <p className="text-[10px] mt-1">No notifications available yet.</p>
          </div>
        ) : (
          notifications.map((item) => {
            const config = ICON_MAP[item.type] || ICON_MAP.general;
            const Icon = config.icon;
            return (
              <div
                key={item._id}
                onClick={!item.isRead && onMarkRead ? () => onMarkRead(item._id) : undefined}
                className={`flex gap-3 px-4 py-3 text-xs transition-colors cursor-pointer ${
                  !item.isRead
                    ? "bg-[var(--primary-light)]/20 hover:bg-[var(--primary-light)]/30 font-medium"
                    : "hover:bg-[var(--surface-strong)]/40 text-[var(--text-muted)]"
                }`}
              >
                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${config.className}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1 space-y-0.5">
                  <p className="truncate font-semibold text-[var(--text)]">{item.title}</p>
                  <p className="line-clamp-2 leading-snug">{item.message}</p>
                  <span className="text-[10px] opacity-75">{formatTime(item.createdAt)}</span>
                </div>
                {!item.isRead && (
                  <div className="h-2 w-2 rounded-full bg-[var(--primary)] shrink-0 self-center" />
                )}
              </div>
            );
          })
        )}
      </Card.Body>

      {viewAllPath && (
        <div className="border-t border-[var(--border)] p-2.5 text-center">
          <Link
            to={viewAllPath}
            onClick={onClose}
            className="inline-block text-xs font-semibold text-[var(--primary)] hover:underline cursor-pointer"
          >
            View all notifications
          </Link>
        </div>
      )}
    </Card>
  );
}
