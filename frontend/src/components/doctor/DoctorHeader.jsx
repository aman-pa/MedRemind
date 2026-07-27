import { Link, NavLink } from "react-router-dom";
import NotificationButton from "./NotificationButton";
import ProfileAvatar from "./ProfileAvatar";
import { Pill, LogOut } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export default function DoctorHeader() {
  const { logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface)]/80 px-4 py-3 backdrop-blur-md">
      <div className="flex items-center gap-6">
        <Link to="/doctor" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary)] text-white">
            <Pill size={20} />
          </div>
          <span className="text-xl font-bold tracking-tight text-[var(--text)]">
            Med<span className="text-[var(--primary)]">Remind</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-4">
          <NavLink
            to="/doctor"
            end
            className={({ isActive }) =>
              `text-sm font-medium transition-colors ${
                isActive
                  ? "text-[var(--primary)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text)]"
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/doctor/patients"
            className={({ isActive }) =>
              `text-sm font-medium transition-colors ${
                isActive
                  ? "text-[var(--primary)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text)]"
              }`
            }
          >
            Patients
          </NavLink>
          <NavLink
            to="/doctor/profile"
            className={({ isActive }) =>
              `text-sm font-medium transition-colors ${
                isActive
                  ? "text-[var(--primary)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text)]"
              }`
            }
          >
            Profile
          </NavLink>
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <NotificationButton />
        <ProfileAvatar />
        <button
          onClick={logout}
          className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-red-500/10 transition-colors cursor-pointer"
          aria-label="Logout"
          title="Logout"
        >
          <LogOut size={17} />
        </button>
      </div>
    </header>
  );
}
