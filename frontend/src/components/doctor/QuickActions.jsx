import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, FileSignature, PlusCircle, Users } from "lucide-react";
import AddMedicineModal from "./AddMedicineModal";

export default function QuickActions() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConnectPatient = () => {
    navigate("/doctor/patients?connect=true");
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const actions = [
    { title: "Connect Patient", icon: UserPlus, to: "#", onClick: handleConnectPatient },
    { title: "Create Prescription", icon: FileSignature, to: "#", onClick: handleOpenModal },
    { title: "Add Medicine", icon: PlusCircle, to: "#", onClick: handleOpenModal },
    { title: "View Patients", icon: Users, to: "/doctor/patients" },
  ];

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {actions.map((action, index) => {
          const Component = action.to === "#" ? "button" : Link;
          const props = action.to === "#" ? { onClick: action.onClick, type: "button" } : { to: action.to };

          return (
            <Component
              key={index}
              {...props}
              className="flex flex-col items-center justify-center gap-2 rounded-xl bg-[var(--primary)] p-4 text-white shadow-md transition-all hover:-translate-y-1 hover:bg-[var(--primary-hover)] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 focus:ring-offset-[var(--bg)] cursor-pointer"
            >
              <action.icon size={24} />
              <span className="text-center text-sm font-medium">{action.title}</span>
            </Component>
          );
        })}
      </div>

      <AddMedicineModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          // reload the window to update OverviewCards instantly
          window.location.reload();
        }}
      />
    </>
  );
}
