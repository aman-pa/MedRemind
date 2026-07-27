import Badge from "../common/Badge";

export default function ConnectionStatusBadge({ status = "pending", className = "" }) {
  const configs = {
    pending: { label: "Pending", variant: "warning" },
    accepted: { label: "Connected", variant: "success" },
    rejected: { label: "Declined", variant: "danger" },
  };

  const config = configs[status] || configs.pending;

  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  );
}
