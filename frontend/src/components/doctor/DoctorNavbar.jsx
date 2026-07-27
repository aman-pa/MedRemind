import { NavLink } from "react-router-dom";
import { Home, Users, User, BarChart3 } from "lucide-react";

export default function DoctorNavbar() {
  const navItems = [
    { to: "/doctor", icon: Home, label: "Home", end: true },
    { to: "/doctor/patients", icon: Users, label: "Patients", end: false },
    { to: "/doctor/analytics", icon: BarChart3, label: "Analytics", end: false },
    { to: "/doctor/profile", icon: User, label: "Profile", end: false },
  ];

  return (
    <nav className="fixed bottom-0 left-0 z-50 w-full border-t border-[var(--border)] bg-[var(--surface)] pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] md:hidden">
      <div className="flex justify-around p-3">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 rounded-xl px-4 py-2 transition-colors ${
                isActive
                  ? "text-[var(--primary)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-strong)]"
              }`
            }
          >
            <item.icon size={24} />
            <span className="text-xs font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
