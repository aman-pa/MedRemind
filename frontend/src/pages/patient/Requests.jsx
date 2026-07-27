import { useState, useEffect, useCallback } from "react";
import PendingRequestCard from "../../components/connection/PendingRequestCard";
import EmptyConnection from "../../components/connection/EmptyConnection";
import Skeleton from "../../components/common/Skeleton";
import {
  getPendingRequests,
  acceptRequest,
  rejectRequest,
} from "../../services/connection.service";

export default function Requests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const loadRequests = useCallback(async () => {
    try {
      setError("");
      const response = await getPendingRequests();
      setRequests(response.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to load pending requests."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      loadRequests();
    }, 0);
    return () => clearTimeout(t);
  }, [loadRequests]);

  const handleAccept = async (requestId) => {
    try {
      setError("");
      setSuccessMsg("");
      const response = await acceptRequest(requestId);
      setSuccessMsg(response.message || "Connection request accepted!");
      // Filter out of current state and reload
      setRequests((prev) => prev.filter((r) => r._id !== requestId));
      loadRequests();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to accept request."
      );
    }
  };

  const handleReject = async (requestId) => {
    try {
      setError("");
      setSuccessMsg("");
      const response = await rejectRequest(requestId);
      setSuccessMsg(response.message || "Connection request declined.");
      // Filter out of current state and reload
      setRequests((prev) => prev.filter((r) => r._id !== requestId));
      loadRequests();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to decline request."
      );
    }
  };

  // Map backend pending connection objects to UI format for PendingRequestCard
  const mappedRequests = requests.map((conn) => {
    const doctorObj = conn.doctorId || {};
    return {
      id: conn._id,
      doctor: {
        name: doctorObj.userId?.name || "Unknown Doctor",
        specialization: doctorObj.specialization || "General Medicine",
        hospital: doctorObj.hospital || "N/A",
      },
    };
  });

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 md:p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[var(--text)] mb-1.5">Pending Connection Requests</h2>
        <p className="text-xs text-[var(--text-muted)]">
          Doctors who connect with you can prescribe medicines, set intake reminders, and view your adherence details.
        </p>
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

      {loading ? (
        <Skeleton.List count={2} />
      ) : mappedRequests.length > 0 ? (
        <div className="space-y-4">
          {mappedRequests.map((request) => (
            <PendingRequestCard
              key={request.id}
              request={request}
              onAccept={handleAccept}
              onReject={handleReject}
            />
          ))}
        </div>
      ) : (
        <EmptyConnection type="requests" />
      )}
    </div>
  );
}
