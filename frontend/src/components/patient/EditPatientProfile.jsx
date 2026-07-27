import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import Input from "../common/Input";
import Button from "../common/Button";

const GENDER_OPTIONS = ["male", "female"];
const BLOOD_GROUP_OPTIONS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

function toDateInputValue(dateString) {
  if (!dateString) return "";
  return new Date(dateString).toISOString().split("T")[0];
}

// Builds the initial form state from the patient object returned by the API.
function buildInitialForm(patient) {
  return {
    dateOfBirth: toDateInputValue(patient.dateOfBirth),
    gender: patient.gender || "",
    bloodGroup: patient.bloodGroup || "",
    height: patient.height || "",
    weight: patient.weight || "",
    allergies: (patient.allergies || []).join(", "),
    chronicDiseases: (patient.chronicDiseases || []).join(", "),
    emergencyContacts:
     patient.emergencyContacts && patient.emergencyContacts.length > 0
        ? patient.emergencyContacts.map((c) => ({ ...c, id: crypto.randomUUID() }))
        : [{ id: crypto.randomUUID(), name: "", relationship: "", phone: "" }],
    address: {
      street: patient.address?.street || "",
      city: patient.address?.city || "",
      state: patient.address?.state || "",
      country: patient.address?.country || "",
      pincode: patient.address?.pincode || "",
    },
  };
}

// Turns the comma separated text back into a clean array.
function toArray(text) {
  return text
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function EditPatientProfile({ patient, onCancel, onSave, isSaving }) {
  const [form, setForm] = useState(() => buildInitialForm(patient));

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateAddress = (field, value) => {
    setForm((prev) => ({ ...prev, address: { ...prev.address, [field]: value } }));
  };

  const updateContact = (index, field, value) => {
    setForm((prev) => {
      const emergencyContacts = [...prev.emergencyContacts];
      emergencyContacts[index] = { ...emergencyContacts[index], [field]: value };
      return { ...prev, emergencyContacts };
    });
  };
  
  const addContact = () => {
    setForm((prev) => ({
      ...prev,
      emergencyContacts: [
        ...prev.emergencyContacts,
        { id: crypto.randomUUID(), name: "", relationship: "", phone: "" },
      ],
    }));
  };

  const removeContact = (index) => {
    setForm((prev) => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    onSave({
      dateOfBirth: form.dateOfBirth || undefined,
      gender: form.gender || undefined,
      bloodGroup: form.bloodGroup || undefined,
      height: form.height ? Number(form.height) : undefined,
      weight: form.weight ? Number(form.weight) : undefined,
      allergies: toArray(form.allergies),
      chronicDiseases: toArray(form.chronicDiseases),
      emergencyContacts: form.emergencyContacts.filter(
        (c) => c.name && c.relationship && c.phone
      ),
      address: form.address,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <h1 className="text-lg font-semibold text-[var(--text)]">Edit Profile</h1>

      {/* Personal Information */}
      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <h2 className="mb-3 text-sm font-semibold text-[var(--text)]">
          Personal Information
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <Input
            id="dateOfBirth"
            label="Date of Birth"
            type="date"
            value={form.dateOfBirth}
            onChange={(e) => updateField("dateOfBirth", e.target.value)}
          />
          <SelectField
            id="gender"
            label="Gender"
            value={form.gender}
            options={GENDER_OPTIONS}
            onChange={(value) => updateField("gender", value)}
          />
        </div>
      </section>

      {/* Medical Information */}
      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <h2 className="mb-3 text-sm font-semibold text-[var(--text)]">
          Medical Information
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <SelectField
            id="bloodGroup"
            label="Blood Group"
            value={form.bloodGroup}
            options={BLOOD_GROUP_OPTIONS}
            onChange={(value) => updateField("bloodGroup", value)}
          />
          <Input
            id="height"
            label="Height (cm)"
            type="number"
            value={form.height}
            onChange={(e) => updateField("height", e.target.value)}
          />
          <Input
            id="weight"
            label="Weight (kg)"
            type="number"
            value={form.weight}
            onChange={(e) => updateField("weight", e.target.value)}
          />
        </div>
        <div className="mt-3 flex flex-col gap-3">
          <Input
            id="allergies"
            label="Allergies (comma separated)"
            value={form.allergies}
            onChange={(e) => updateField("allergies", e.target.value)}
            placeholder="e.g. Peanuts, Penicillin"
          />
          <Input
            id="chronicDiseases"
            label="Chronic Diseases (comma separated)"
            value={form.chronicDiseases}
            onChange={(e) => updateField("chronicDiseases", e.target.value)}
            placeholder="e.g. Asthma, Diabetes"
          />
        </div>
      </section>

      {/* Emergency Contacts */}
      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[var(--text)]">
            Emergency Contacts
          </h2>
          <button
            type="button"
            onClick={addContact}
            className="flex items-center gap-1 text-xs font-medium text-[var(--primary)] hover:underline"
          >
            <Plus size={14} /> Add contact
          </button>
        </div>

        <div className="flex flex-col gap-3">
        
        {form.emergencyContacts.map((contact, index) => (
            <div
              key={contact.id}
              className="rounded-lg border border-[var(--border)] p-3"
            >
              <div className="grid grid-cols-2 gap-3">
                <Input
                  id={`contact-name-${index}`}
                  label="Name"
                  value={contact.name}
                  onChange={(e) => updateContact(index, "name", e.target.value)}
                />
                <Input
                  id={`contact-relationship-${index}`}
                  label="Relationship"
                  value={contact.relationship}
                  onChange={(e) =>
                    updateContact(index, "relationship", e.target.value)
                  }
                />
              </div>
              <div className="mt-3 flex items-end gap-3">
                <div className="flex-1">
                  <Input
                    id={`contact-phone-${index}`}
                    label="Phone"
                    value={contact.phone}
                    onChange={(e) => updateContact(index, "phone", e.target.value)}
                  />
                </div>
                {form.emergencyContacts.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeContact(index)}
                    aria-label="Remove contact"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--danger)] hover:bg-[var(--surface-strong)]"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Address */}
      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <h2 className="mb-3 text-sm font-semibold text-[var(--text)]">Address</h2>
        <div className="grid grid-cols-2 gap-3">
          <Input
            id="street"
            label="Street"
            value={form.address.street}
            onChange={(e) => updateAddress("street", e.target.value)}
          />
          <Input
            id="city"
            label="City"
            value={form.address.city}
            onChange={(e) => updateAddress("city", e.target.value)}
          />
          <Input
            id="state"
            label="State"
            value={form.address.state}
            onChange={(e) => updateAddress("state", e.target.value)}
          />
          <Input
            id="country"
            label="Country"
            value={form.address.country}
            onChange={(e) => updateAddress("country", e.target.value)}
          />
          <Input
            id="pincode"
            label="Pincode"
            value={form.address.pincode}
            onChange={(e) => updateAddress("pincode", e.target.value)}
          />
        </div>
      </section>

      <div className="flex gap-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSaving}>
          Save Changes
        </Button>
      </div>
    </form>
  );
}

function SelectField({ id, label, value, options, onChange }) {
  return (
    <div className="w-full">
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-[var(--text)]">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
      >
        <option value="">Select</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
