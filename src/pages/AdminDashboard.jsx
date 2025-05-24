import React, { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import ActiveVisits from "./ActiveVisits";
import ArchiveVisits from "./ArchiveVisits";
import AssignBadge from "./AssignBadge";
import Employee from "./Employee";
import AddVisit from "./AddVisit";
import "../styles/home.css";
import AddEmployee from "./AddEmployee";
import { useTokenValidation } from "../hooks/useTokenValidation";

const AdminDashboard = () => {
  const [activeSelector, setActiveSelector] = useState("Visite Attive");

  // Controllo automatico validità token
  useTokenValidation();

  const renderContent = () => {
    switch (activeSelector) {
      case "Visite Attive":
        return <ActiveVisits />;
      case "Archivio Visite":
        return <ArchiveVisits />;
      case "Assegna Badge":
        return <AssignBadge />;
      case "Aggiungi Visita":
        return <AddVisit />;
      case "Aggiungi Dipendente":
        return <AddEmployee />;
      case "Dipendenti":
        return <Employee />;
      default:
        return <div>Sezione non trovata</div>;
    }
  };

  return (
    <div className="home">
      <AdminSidebar
        activeSelector={activeSelector}
        setActiveSelector={setActiveSelector}
      />
      <div className="home-content">{renderContent()}</div>
    </div>
  );
};

export default AdminDashboard;
