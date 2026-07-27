import { useState } from "react";
import Card from "../common/Card";
import Avatar from "../common/Avatar";
import ConnectionStatusBadge from "./ConnectionStatusBadge";
import Button from "../common/Button";
import { User, Trash2 } from "lucide-react";
import PatientDetailsModal from "../../components/doctor/PatientDetailsModal";

export default function PatientCard({ patient, onDisconnect, status = "accepted" }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Card className="flex flex-col justify-between h-full hoverable">
        <Card.Body className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar name={patient.name} size="md" />
              <div>
                <h4 className="font-semibold text-sm text-[var(--text)]">{patient.name}</h4>
                <p className="text-xs text-[var(--text-muted)]">{patient.email}</p>
              </div>
            </div>
            <ConnectionStatusBadge status={status} />
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs border-t border-[var(--border)] pt-3 text-[var(--text-muted)]">
            <div>
              <span className="font-medium text-[var(--text)]">Age:</span> {patient.age || "N/A"}
            </div>
            <div>
              <span className="font-medium text-[var(--text)]">Gender:</span> {patient.gender || "N/A"}
            </div>
          </div>
        </Card.Body>

        <Card.Footer className="flex justify-between items-center gap-2 pt-2">
          <Button
            variant="secondary"
            className="py-1 px-3 text-xs w-auto flex-1 flex items-center justify-center gap-1"
            onClick={() => setIsModalOpen(true)}
          >
            <User className="h-3 w-3" /> View Profile
          </Button>
          {status === "accepted" && onDisconnect && (
            <button
              onClick={() => onDisconnect(patient)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10 text-[var(--danger)] hover:bg-red-500/20 transition-all cursor-pointer"
              title="Disconnect Patient"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </Card.Footer>
      </Card>

      <PatientDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        patient={patient}
      />
    </>
  );
}
