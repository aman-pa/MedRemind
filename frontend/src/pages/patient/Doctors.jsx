import { useState, useEffect, useCallback } from "react";
import DoctorCard from "../../components/connection/DoctorCard";
import SearchPatient from "../../components/connection/SearchPatient";
import EmptyConnection from "../../components/connection/EmptyConnection";
import Skeleton from "../../components/common/Skeleton";
import {
  getConnections,
  disconnectConnection,
  sendConnectionRequest,
} from "../../services/connection.service";

export default function Doctors() {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const loadDoctors = useCallback(async () => {
    try {
      setError("");
      const response = await getConnections();
      setConnections(response.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to load connected doctors."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      loadDoctors();
    }, 0);
    return () => clearTimeout(t);
  }, [loadDoctors]);

  const handleSendRequest = async (email) => {
    const response = await sendConnectionRequest(email);
    // Refresh list (though the request is pending, it validates state refresh flow)
    loadDoctors();
    return response;
  };

  const handleDisconnect = async (targetDoctor) => {
    const confirmed = window.confirm(
      `Are you sure you want to disconnect from ${targetDoctor.name}? This will revoke their access to your schedule.`
    );
    if (!confirmed) return;

    try {
      setError("");
      setSuccessMsg("");
      const response = await disconnectConnection(targetDoctor.id);
      setSuccessMsg(response.message || "Disconnected successfully.");
      loadDoctors();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to disconnect doctor."
      );
    }
  };

  // Map backend accepted connection objects to UI DoctorCard format
  const mappedDoctors = connections.map((conn) => {
    const doctorObj = conn.doctorId || {};
    return {
      id: conn._id, // connection ID
      name: doctorObj.userId?.name || "Unknown Doctor",
      specialization: doctorObj.specialization || "General Medicine",
      hospital: doctorObj.hospital || "N/A",
      department: doctorObj.department || "",
    };
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--text)]">Doctors</h1>
          <p className="mt-1 text-[var(--text-muted)] text-sm">
            Manage your connected doctors and view their details.
          </p>
        </div>
        <button
          onClick={() => setShowSearch(!showSearch)}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2 font-medium text-white transition-colors hover:bg-[var(--primary-hover)] sm:w-auto cursor-pointer"
        >
          {showSearch ? "Hide Search" : "Connect New Doctor"}
        </button>
      </div>

      {/* Global Success / Error Feedbacks */}
      {error && (
        <div className="rounded-lg bg-red-500/10 p-3.5 text-sm text-[var(--danger)] border border-red-500/20">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="rounded-lg bg-emerald-500/10 p-3.5 text-sm text-[var(--success)] border border-emerald-500/20">
          {successMsg}
        </div>
      )}

      {/* Search Section */}
      {showSearch && (
        <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 md:p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[var(--text)] mb-2">Connect New Doctor</h2>
          <p className="text-xs text-[var(--text-muted)] mb-5">
            Enter your doctor's exact email address to send them a connection request. Once they accept, they will appear in your connected doctors list.
          </p>
          <SearchPatient
            label="Search Doctor by Email"
            placeholder="doctor@example.com"
            onSendRequest={handleSendRequest}
          />
        </section>
      )}

      {/* Connected Doctors Grid */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold text-[var(--text)]">
          My Doctors ({mappedDoctors.length})
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Skeleton.Card />
          </div>
        ) : mappedDoctors.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mappedDoctors.map((doctor) => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                onDisconnect={handleDisconnect}
                status="accepted"
              />
            ))}
          </div>
        ) : (
          <EmptyConnection type="doctors" onAction={() => setShowSearch(true)} />
        )}
      </section>
    </div>
  );
}
