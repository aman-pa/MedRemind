import Card from "../common/Card";
import Avatar from "../common/Avatar";
import Button from "../common/Button";
import ConnectionStatusBadge from "./ConnectionStatusBadge";
import { MessageSquare, Trash2 } from "lucide-react";

export default function DoctorCard({ doctor, onDisconnect, status = "accepted" }) {
  return (
    <Card className="flex flex-col justify-between h-full hoverable">
      <Card.Body className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar name={doctor.name} size="md" />
            <div>
              <h4 className="font-semibold text-sm text-[var(--text)]">{doctor.name}</h4>
              <p className="text-xs text-[var(--primary)] font-medium">{doctor.specialization}</p>
            </div>
          </div>
          <ConnectionStatusBadge status={status} />
        </div>

        <div className="space-y-1.5 text-xs border-t border-[var(--border)] pt-3 text-[var(--text-muted)]">
          <div>
            <span className="font-medium text-[var(--text)]">Hospital:</span> {doctor.hospital || "N/A"}
          </div>
          {doctor.department && (
            <div>
              <span className="font-medium text-[var(--text)]">Department:</span> {doctor.department}
            </div>
          )}
        </div>
      </Card.Body>

      <Card.Footer className="flex justify-between items-center gap-2 pt-2">
        <Button
          variant="secondary"
          className="py-1 px-3 text-xs w-auto flex-1 flex items-center justify-center gap-1"
          onClick={() => alert(`Contacting ${doctor.name} is coming soon in Phase 3!`)}
        >
          <MessageSquare className="h-3.5 w-3.5" /> Message
        </Button>
        {status === "accepted" && onDisconnect && (
          <button
            onClick={() => onDisconnect(doctor)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10 text-[var(--danger)] hover:bg-red-500/20 transition-all cursor-pointer"
            title="Disconnect Doctor"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </Card.Footer>
    </Card>
  );
}
