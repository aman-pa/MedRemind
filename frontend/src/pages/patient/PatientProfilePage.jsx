import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import { getMyProfileRequest, updateMyProfileRequest } from "../../services/patient.service";
import PatientProfile from "../../components/patient/PatientProfile";
import EditPatientProfile from "../../components/patient/EditPatientProfile";
import Loader from "../../components/common/Loader";

export default function PatientProfilePage() {
  const [patient, setPatient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  async function loadProfile() {
    setIsLoading(true);
    setError("");
    try {
      const data = await getMyProfileRequest();
      setPatient(data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Could not load your profile. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  async function handleSave(updatedFields) {
    setIsSaving(true);
    setError("");
    try {
      const data = await updateMyProfileRequest(updatedFields);
      setPatient(data);
      setIsEditing(false);
    } catch (err) {
      setError(
        err.response?.data?.message || "Could not save your changes. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (error && !patient) {
    return (
      <div className="flex flex-col items-center gap-2 py-16 text-center">
        <AlertCircle className="text-[var(--danger)]" size={28} />
        <p className="text-sm text-[var(--text)]">{error}</p>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <p className="mb-4 rounded-lg bg-[var(--danger)]/10 px-3 py-2 text-sm text-[var(--danger)]">
          {error}
        </p>
      )}

      {isEditing ? (
        <EditPatientProfile
          patient={patient}
          isSaving={isSaving}
          onCancel={() => setIsEditing(false)}
          onSave={handleSave}
        />
      ) : (
        <PatientProfile patient={patient} onEdit={() => setIsEditing(true)} />
      )}
    </div>
  );
}
