import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import ForgotPassword from "./pages/auth/ForgotPassword.jsx";
import ResetPassword from "./pages/auth/ResetPassword.jsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";

// Patient Module
import PatientLayout from "./components/patient/PatientLayout.jsx";
import PatientHome from "./pages/patient/PatientHome.jsx";
import PatientPillBox from "./pages/patient/PatientPillBox.jsx";
import PatientProfilePage from "./pages/patient/PatientProfilePage.jsx";
import PatientAnalytics from "./pages/patient/PatientAnalytics.jsx";

// Doctor Module
import DoctorLayout from "./components/doctor/DoctorLayout.jsx";
import DoctorDashboard from "./pages/doctor/DoctorDashboard.jsx";
import DoctorPatients from "./pages/doctor/DoctorPatients.jsx";
import DoctorProfilePage from "./pages/doctor/DoctorProfilePage.jsx";
import DoctorAnalytics from "./pages/doctor/DoctorAnalytics.jsx";

// Connection Pages
import Doctors from "./pages/patient/Doctors.jsx";
import Requests from "./pages/patient/Requests.jsx";
import NotificationPage from "./pages/notification/NotificationPage.jsx";

export default function App() {
  return (
    <Routes>
      {/* Unauthenticated Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Patient Module Routes */}
      <Route
        path="/patient"
        element={
          <ProtectedRoute allowedRoles={["patient"]}>
            <PatientLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<PatientHome />} />
        <Route path="pillbox" element={<PatientPillBox />} />
        <Route path="profile" element={<PatientProfilePage />} />
        <Route path="doctors" element={<Doctors />} />
        <Route path="requests" element={<Requests />} />
        <Route path="analytics" element={<PatientAnalytics />} />
        <Route path="notifications" element={<NotificationPage />} />
      </Route>

      {/* Doctor Module Routes */}
      <Route
        path="/doctor"
        element={
          <ProtectedRoute allowedRoles={["doctor"]}>
            <DoctorLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DoctorDashboard />} />
        <Route path="patients" element={<DoctorPatients />} />
        <Route path="profile" element={<DoctorProfilePage />} />
        <Route path="analytics" element={<DoctorAnalytics />} />
        <Route path="notifications" element={<NotificationPage />} />
      </Route>

      {/* Wildcard redirects */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}