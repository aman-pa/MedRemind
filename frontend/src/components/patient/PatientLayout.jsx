import { Outlet } from "react-router-dom";
import PatientHeader from "./PatientHeader";
import PatientNavbar from "./PatientNavbar";

// Every patient page (Home, Pill Box, Profile) is rendered inside this layout,
// so the header and bottom navigation never have to be duplicated.
export default function PatientLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg)]">
      <PatientHeader />

      <main className="flex-1 px-4 py-5">
        <Outlet />
      </main>

      <PatientNavbar />
    </div>
  );
}
