import { useState, useEffect, useContext } from "react";
import { getDoctorProfileRequest } from "../../services/doctor.service";
import { AuthContext } from "../../contexts/AuthContext";
import DoctorProfile from "../../components/doctor/DoctorProfile";
import EditDoctorProfile from "../../components/doctor/EditDoctorProfile";
import { Loader2, Mail, User } from "lucide-react";

export default function DoctorProfilePage() {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDoctorProfileRequest();
      setProfile(data.doctor || data);
    } catch {
      setError("Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleProfileUpdate = (updatedProfile) => {
    setProfile(updatedProfile);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" />
        <p className="text-sm font-medium text-[var(--text-muted)]">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <div className="rounded-full bg-[var(--danger)]/10 p-3 text-[var(--danger)]">
          <User size={32} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-[var(--text)]">{error}</h3>
          <p className="text-sm text-[var(--text-muted)]">There was an error fetching your profile details.</p>
        </div>
        <button
          onClick={fetchProfile}
          className="mt-2 rounded-lg border border-[var(--border)] px-4 py-2 font-medium text-[var(--text)] hover:bg-[var(--surface-strong)]"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--text)]">Profile</h1>
        <p className="mt-2 text-[var(--text-muted)]">
          Manage your personal and professional information.
        </p>
      </div>

      <div className="flex flex-col gap-6 md:flex-row">
        {/* Left Column - User Info (Basic info from Auth context) */}
        <div className="w-full md:w-1/3">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-[var(--primary-light)] text-3xl font-bold text-[var(--primary)]">
                {user?.name?.charAt(0) || "D"}
              </div>
              <h2 className="text-xl font-bold text-[var(--text)]">Dr. {user?.name || "Doctor"}</h2>
              
              <div className="mt-4 flex w-full flex-col gap-3 border-t border-[var(--border)] pt-4 text-sm text-[var(--text-muted)]">
                <div className="flex items-center gap-2">
                  <Mail size={16} />
                  <span>{user?.email || "No email provided"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Doctor Profile Info */}
        <div className="w-full md:w-2/3">
          {isEditing ? (
            <EditDoctorProfile
              profile={profile}
              onCancel={() => setIsEditing(false)}
              onSuccess={handleProfileUpdate}
            />
          ) : (
            <DoctorProfile
              profile={profile}
              onEdit={() => setIsEditing(true)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
