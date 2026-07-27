import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Card from "../common/Card";

// Dashboard "preview" wrapper shown on PatientHome / DoctorDashboard.
// Renders whatever summary content is passed as children, plus a
// "View Analytics" link to the full analytics page for that role.
export default function AnalyticsCard({ title, viewAllHref, children, className = "" }) {
  return (
    <Card className={className}>
      <Card.Header className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-[var(--text)]">{title}</h2>
        <Link
          to={viewAllHref}
          className="flex items-center gap-1 text-xs font-medium text-[var(--primary)] hover:underline"
        >
          View Analytics
          <ArrowRight className="h-3 w-3" />
        </Link>
      </Card.Header>
      <Card.Body>{children}</Card.Body>
    </Card>
  );
}
