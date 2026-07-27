import EmptyState from "../common/EmptyState";
import { Users, UserX, Inbox } from "lucide-react";

export default function EmptyConnection({ type = "patients", onAction }) {
  const configs = {
    patients: {
      title: "No patients connected",
      description: "You haven't connected with any patients yet. Search by email to send a request.",
      icon: Users,
    },
    doctors: {
      title: "No doctors connected",
      description: "No doctors are connected to your account. Ask your doctor to send a connection request.",
      icon: UserX,
    },
    requests: {
      title: "No pending requests",
      description: "You are all caught up! There are no incoming connection requests at the moment.",
      icon: Inbox,
    },
  };

  const config = configs[type] || configs.patients;

  return (
    <EmptyState
      title={config.title}
      description={config.description}
      icon={config.icon}
      actionLabel={type === "patients" ? "Search Patients" : type === "doctors" ? "Search Doctors" : null}
      onAction={onAction}
    />
  );
}
