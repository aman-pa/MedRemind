import { NavLink } from "react-router-dom";
import { Home, Pill, User, Stethoscope, Inbox, BarChart3 } from "lucide-react";

const TABS = [
  { to: "/patient", label: "Home", icon: Home, end: true },
  { to: "/patient/pillbox", label: "Pill Box", icon: Pill, end: false },
  { to: "/patient/analytics", label: "Analytics", icon: BarChart3, end: false },
  { to: "/patient/doctors", label: "Doctors", icon: Stethoscope, end: false },
  { to: "/patient/requests", label: "Requests", icon: Inbox, end: false },
  { to: "/patient/profile", label: "Profile", icon: User, end: false },
];

// Bottom navigation shared by every patient page.
export default function PatientNavbar() {
  return (
    <nav className="sticky bottom-0 z-10 flex border-t border-[var(--border)] bg-[var(--surface)]">
      {TABS.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center gap-1 py-2.5 text-xs font-medium ${
              isActive ? "text-[var(--primary)]" : "text-[var(--text-muted)]"
            }`
          }
        >
          <Icon size={20} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}