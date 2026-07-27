import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import Loader from "../common/Loader.jsx";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[var(--background)]">
        <Loader size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles && user?.role && !allowedRoles.some(r => r.toLowerCase() === user.role.toLowerCase())) {
    const fallback = user.role.toLowerCase() === "doctor" ? "/doctor" : "/patient";
    return <Navigate to={fallback} replace />;
  }

  return children;
}