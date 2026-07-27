import { useEffect, useState, useRef, useContext } from "react";
import { Bell } from "lucide-react";
import { AuthContext } from "../../contexts/AuthContext";
import {
  getMyNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../../services/notification.service";
import NotificationPanel from "./NotificationPanel";

export default function NotificationButton() {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const loadNotifications = async () => {
    try {
      const response = await getMyNotifications(false); // fetch all (limit 50)
      setNotifications(response.data || []);
    } catch {
      // ignore silently
    }
  };

  useEffect(() => {
    // Initial load
    const t = setTimeout(() => {
      loadNotifications();
    }, 0);

    // Poll for notifications every 30 seconds for live updates
    const interval = setInterval(loadNotifications, 30000);
    return () => {
      clearTimeout(t);
      clearInterval(interval);
    };
  }, []);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      loadNotifications(); // reload on open
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id);
      loadNotifications();
    } catch {
      // ignore
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      loadNotifications();
    } catch {
      // ignore
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const viewAllPath = user?.role === "doctor" ? "/doctor/notifications" : "/patient/notifications";

  return (
    <div className="relative inline-block" ref={containerRef}>
      <button
        type="button"
        onClick={handleToggle}
        aria-label="Notifications"
        className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:bg-[var(--surface-strong)] transition-all cursor-pointer"
      >
        <Bell size={17} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--danger)] text-[9px] font-bold text-white ring-2 ring-[var(--surface)] animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <NotificationPanel
          notifications={notifications}
          onMarkRead={handleMarkRead}
          onMarkAllRead={handleMarkAllRead}
          onClose={() => setIsOpen(false)}
          viewAllPath={viewAllPath}
        />
      )}
    </div>
  );
}
