import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import SearchPatient from "../../components/connection/SearchPatient";
import PatientCard from "../../components/connection/PatientCard";
import PendingRequestCard from "../../components/connection/PendingRequestCard";
import EmptyConnection from "../../components/connection/EmptyConnection";
import Skeleton from "../../components/common/Skeleton";
import {
  getConnections,
  getPendingRequests,
  acceptRequest,
  rejectRequest,
  sendConnectionRequest,
  disconnectConnection,
} from "../../services/connection.service";

export default function DoctorPatients() {
  const [searchParams] = useSearchParams();
  const [connections, setConnections] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSearch, setShowSearch] = useState(searchParams.get("connect") === "true");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const loadData = useCallback(async () => {
    try {
      setError("");
      const [connRes, pendingRes] = await Promise.all([
        getConnections(),
        getPendingRequests(),
      ]);
      setConnections(connRes.data || []);
      setPendingRequests(pendingRes.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to load connections data."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      loadData();
    }, 0);
    return () => clearTimeout(t);
  }, [loadData]);

  const handleSendRequest = async (email) => {
    // Call service to send connection request
    const response = await sendConnectionRequest(email);
    // Refresh data after successful request
    loadData();
    return response;
  };

  const handleAccept = async (id) => {
    try {
      setError("");
      setSuccessMsg("");
      const response = await acceptRequest(id);
      setSuccessMsg(response.message || "Request accepted successfully.");
      loadData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to accept request."
      );
    }
  };

  const handleReject = async (id) => {
    try {
      setError("");
      setSuccessMsg("");
      const response = await rejectRequest(id);
      setSuccessMsg(response.message || "Request declined successfully.");
      loadData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to decline request."
      );
    }
  };

  const handleDisconnect = async (targetPatient) => {
    const confirmed = window.confirm(
      `Are you sure you want to disconnect from ${targetPatient.name}?`
    );
    if (!confirmed) return;

    try {
      setError("");
      setSuccessMsg("");
      const response = await disconnectConnection(targetPatient.id);
      setSuccessMsg(response.message || "Disconnected successfully.");
      loadData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to disconnect connection."
      );
    }
  };

  // Map backend accepted connection objects to UI PatientCard format
  const mappedPatients = connections.map((conn) => {
    const patientObj = conn.patientId || {};
    const age = patientObj.dateOfBirth
      ? new Date().getFullYear() - new Date(patientObj.dateOfBirth).getFullYear()
      : "N/A";

    return {
      id: conn._id, // connection ID
      patientId: patientObj._id, // patient ID
      name: patientObj.userId?.name || "Unknown Patient",
      email: patientObj.userId?.email || "",
      age,
      gender: patientObj.gender || "N/A",
    };
  });

  // Map backend pending connection objects to UI PendingRequestCard format
  const mappedPending = pendingRequests.map((conn) => {
    const patientObj = conn.patientId || {};
    const age = patientObj.dateOfBirth
      ? new Date().getFullYear() - new Date(patientObj.dateOfBirth).getFullYear()
      : "N/A";

    return {
      id: conn._id,
      patient: {
        name: patientObj.userId?.name || "Unknown Patient",
        age,
        gender: patientObj.gender || "N/A",
      },
    };
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--text)]">Patients</h1>
          <p className="mt-1 text-[var(--text-muted)] text-sm">
            Manage your connected patients and view their details.
          </p>
        </div>
        <button
          onClick={() => setShowSearch(!showSearch)}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2 font-medium text-white transition-colors hover:bg-[var(--primary-hover)] sm:w-auto cursor-pointer"
        >
          {showSearch ? "Hide Search" : "Connect New Patient"}
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
          <h2 className="text-lg font-semibold text-[var(--text)] mb-2">Connect New Patient</h2>
          <p className="text-xs text-[var(--text-muted)] mb-5">
            Enter your patient's exact email address to send them a connection request. Once they accept, they will appear in your connected patients list.
          </p>
          <SearchPatient onSendRequest={handleSendRequest} />
        </section>
      )}

      {/* Pending Requests Received Section */}
      {mappedPending.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-base font-semibold text-[var(--text)]">
            Pending Connection Requests ({mappedPending.length})
          </h2>
          <div className="space-y-3">
            {mappedPending.map((request) => (
              <PendingRequestCard
                key={request.id}
                request={request}
                onAccept={handleAccept}
                onReject={handleReject}
              />
            ))}
          </div>
        </section>
      )}

      {/* Connected Patients Section */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold text-[var(--text)]">
          My Patients ({mappedPatients.length})
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Skeleton.Card />
            <Skeleton.Card />
          </div>
        ) : mappedPatients.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mappedPatients.map((patient) => (
              <PatientCard
                key={patient.id}
                patient={patient}
                onDisconnect={handleDisconnect}
                status="accepted"
              />
            ))}
          </div>
        ) : (
          <EmptyConnection type="patients" onAction={() => setShowSearch(true)} />
        )}
      </section>
    </div>
  );
}
