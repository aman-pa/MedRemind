import Card from "../common/Card";
import Avatar from "../common/Avatar";
import Button from "../common/Button";
import { Check, X } from "lucide-react";

export default function PendingRequestCard({ request, onAccept, onReject }) {
  const isDoctor = !!request.doctor;
  const entity = isDoctor ? request.doctor : request.patient;

  return (
    <Card className="hoverable overflow-hidden">
      <div className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Avatar name={entity.name} size="md" />
          <div>
            <h4 className="font-semibold text-sm text-[var(--text)]">{entity.name}</h4>
            {isDoctor ? (
              <>
                <p className="text-xs text-[var(--primary)] font-medium">{entity.specialization}</p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">{entity.hospital}</p>
              </>
            ) : (
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Patient • {entity.age} yrs • {entity.gender}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant="secondary"
            onClick={() => onReject(request.id)}
            className="flex-1 sm:flex-initial py-1.5 px-3 text-xs bg-transparent border border-red-500/20 text-[var(--danger)] hover:bg-red-500/10 hover:border-red-500/30 gap-1.5 cursor-pointer"
          >
            <X className="h-3.5 w-3.5" /> Decline
          </Button>
          <Button
            variant="primary"
            onClick={() => onAccept(request.id)}
            className="flex-1 sm:flex-initial py-1.5 px-3 text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 focus:ring-emerald-500 cursor-pointer"
          >
            <Check className="h-3.5 w-3.5" /> Accept
          </Button>
        </div>
      </div>
    </Card>
  );
}
