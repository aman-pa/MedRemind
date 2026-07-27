import { Pencil } from "lucide-react";
import Button from "../common/Button";

function formatDate(dateString) {
  if (!dateString) return "Not added yet";
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatList(list) {
  if (!list || list.length === 0) return "Not added yet";
  return list.join(", ");
}

function formatValue(value) {
  return value ? value : "Not added yet";
}

// Read-only display of the logged-in patient's profile.
export default function PatientProfile({ patient, onEdit }) {
  const { userId: user, address = {}, emergencyContacts = [] } = patient;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-[var(--text)]">Profile</h1>
        <Button variant="secondary" className="!w-auto shrink-0 px-3" onClick={onEdit}>
          <Pencil size={15} />
          Edit
        </Button>
      </div>

      {/* Personal Information */}
      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <h2 className="mb-3 text-sm font-semibold text-[var(--text)]">
          Personal Information
        </h2>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <Field label="Name" value={user?.name} />
          <Field label="Email" value={user?.email} />
          <Field label="Date of Birth" value={formatDate(patient.dateOfBirth)} />
          <Field label="Gender" value={formatValue(patient.gender)} />
        </div>
      </section>

      {/* Medical Information */}
      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <h2 className="mb-3 text-sm font-semibold text-[var(--text)]">
          Medical Information
        </h2>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <Field label="Blood Group" value={formatValue(patient.bloodGroup)} />
          <Field
            label="Height"
            value={patient.height ? `${patient.height} cm` : "Not added yet"}
          />
          <Field
            label="Weight"
            value={patient.weight ? `${patient.weight} kg` : "Not added yet"}
          />
          <Field label="Allergies" value={formatList(patient.allergies)} />
          <Field
            label="Chronic Diseases"
            value={formatList(patient.chronicDiseases)}
          />
        </div>
      </section>

      {/* Emergency Contacts */}
      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <h2 className="mb-3 text-sm font-semibold text-[var(--text)]">
          Emergency Contacts
        </h2>
        {emergencyContacts.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)]">Not added yet</p>
        ) : (
          <div className="flex flex-col gap-2">
            {emergencyContacts.map((contact, index) => (
              <div
                key={index}
                className="rounded-lg border border-[var(--border)] p-3 text-sm"
              >
                <p className="font-medium text-[var(--text)]">{contact.name}</p>
                <p className="text-[var(--text-muted)]">
                  {contact.relationship} &middot; {contact.phone}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Address */}
      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <h2 className="mb-3 text-sm font-semibold text-[var(--text)]">Address</h2>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <Field label="Street" value={formatValue(address.street)} />
          <Field label="City" value={formatValue(address.city)} />
          <Field label="State" value={formatValue(address.state)} />
          <Field label="Country" value={formatValue(address.country)} />
          <Field label="Pincode" value={formatValue(address.pincode)} />
        </div>
      </section>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <p className="text-xs text-[var(--text-muted)]">{label}</p>
      <p className="text-[var(--text)]">{value}</p>
    </div>
  );
}