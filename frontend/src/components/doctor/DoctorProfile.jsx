import { Building2, Stethoscope, MapPin, Award, DollarSign } from "lucide-react";

export default function DoctorProfile({ profile, onEdit }) {
  if (!profile) return null;

  const formatAddress = (addr) => {
    if (!addr || typeof addr !== "object") return "Not provided";
    const parts = [addr.street, addr.city, addr.state, addr.country, addr.pincode]
      .map((p) => p?.trim())
      .filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "Not provided";
  };

  const details = [
    { icon: Building2, label: "Hospital", value: profile.hospital || "Not provided" },
    { icon: Stethoscope, label: "Department", value: profile.department || "Not provided" },
    { icon: DollarSign, label: "Consultation Fee", value: profile.consultationFee ? `$${profile.consultationFee}` : "Not provided" },
    { icon: Award, label: "License", value: profile.licenseNumber || "Not provided" },
    { icon: MapPin, label: "Address", value: formatAddress(profile.address) },
  ];

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between border-b border-[var(--border)] pb-4">
        <div>
          <h2 className="text-2xl font-bold text-[var(--text)]">Professional Information</h2>
          <p className="text-sm text-[var(--text-muted)]">Manage your professional details</p>
        </div>
        <button
          onClick={onEdit}
          className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--primary-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 focus:ring-offset-[var(--bg)]"
        >
          Edit Profile
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {details.map((detail, index) => (
          <div key={index} className="flex flex-col gap-1">
            <span className="flex items-center gap-1.5 text-sm font-medium text-[var(--text-muted)]">
              <detail.icon size={16} />
              {detail.label}
            </span>
            <span className="text-lg font-semibold text-[var(--text)]">{detail.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
