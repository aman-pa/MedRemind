
export default function Card({ children, className = "", onClick, hoverable = false }) {
  return (
    <div
      onClick={onClick}
      className={`rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] shadow-[var(--shadow)] transition-all ${
        hoverable ? "hover:border-[var(--border-hover)] hover:shadow-md cursor-pointer" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

Card.Header = function CardHeader({ children, className = "" }) {
  return (
    <div className={`border-b border-[var(--border)] px-5 py-4 ${className}`}>
      {children}
    </div>
  );
};

Card.Body = function CardBody({ children, className = "" }) {
  return <div className={`px-5 py-4 ${className}`}>{children}</div>;
};

Card.Footer = function CardFooter({ children, className = "" }) {
  return (
    <div className={`border-t border-[var(--border)] bg-[var(--bg-soft)]/50 px-5 py-3 rounded-b-xl ${className}`}>
      {children}
    </div>
  );
};
