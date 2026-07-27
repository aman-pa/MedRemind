import { Outlet } from "react-router-dom";
import DoctorNavbar from "./DoctorNavbar";
import DoctorHeader from "./DoctorHeader";

export default function DoctorLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg)] text-[var(--text)]">
      <DoctorHeader />
      
      {/* Main content area */}
      <main className="flex-1 pb-20 md:pb-0">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>

      <DoctorNavbar />
    </div>
  );
}
