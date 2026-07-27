import { useState } from "react";
import { updateDoctorProfileRequest } from "../../services/doctor.service";
import { Loader2 } from "lucide-react";

export default function EditDoctorProfile({ profile, onCancel, onSuccess }) {
  const [formData, setFormData] = useState({
    hospital: profile?.hospital || "",
    department: profile?.department || "",
    consultationFee: profile?.consultationFee || "",
    license: profile?.licenseNumber || "",
    address: profile?.address?.street || "",
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        hospital: formData.hospital.trim() || null,
        department: formData.department.trim() || null,
        consultationFee: formData.consultationFee ? Number(formData.consultationFee) : null,
        licenseNumber: formData.license.trim() || null,
        address: {
          street: formData.address.trim() || null,
        }
      };
      
      const updatedProfile = await updateDoctorProfileRequest(payload);
      onSuccess(updatedProfile.doctor || updatedProfile.data || updatedProfile);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
      <div className="mb-6 border-b border-[var(--border)] pb-4">
        <h2 className="text-2xl font-bold text-[var(--text)]">Edit Profile</h2>
        <p className="text-sm text-[var(--text-muted)]">Update your professional information</p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-[var(--danger)]/10 p-4 text-sm text-[var(--danger)]">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="hospital" className="text-sm font-medium text-[var(--text)]">Hospital</label>
            <input
              type="text"
              id="hospital"
              name="hospital"
              value={formData.hospital}
              onChange={handleChange}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
              placeholder="e.g. City General Hospital"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="department" className="text-sm font-medium text-[var(--text)]">Department</label>
            <input
              type="text"
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
              placeholder="e.g. Cardiology"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="consultationFee" className="text-sm font-medium text-[var(--text)]">Consultation Fee ($)</label>
            <input
              type="number"
              id="consultationFee"
              name="consultationFee"
              value={formData.consultationFee}
              onChange={handleChange}
              min="0"
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
              placeholder="e.g. 150"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="license" className="text-sm font-medium text-[var(--text)]">License Number</label>
            <input
              type="text"
              id="license"
              name="license"
              value={formData.license}
              onChange={handleChange}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
              placeholder="e.g. MED-123456"
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <label htmlFor="address" className="text-sm font-medium text-[var(--text)]">Clinic / Office Address</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
              placeholder="e.g. 123 Health Ave, Medical District"
            ></textarea>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3 border-t border-[var(--border)] pt-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text)] transition-colors hover:bg-[var(--surface-strong)] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--primary-hover)] focus:outline-none disabled:opacity-50"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
