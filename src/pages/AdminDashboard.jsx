import React, { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import ActiveVisits from "./ActiveVisits";
import ArchiveVisits from "./ArchiveVisits";
import AssignBadge from "./AssignBadge";
import Employee from "./Employee";
import AddVisit from "./AddVisit";
import AddVisitor from "./AddVisitor";
import TimeTracking from "./TimeTracking";
import TimbratureMonitor from "./TimbratureMonitor";
import "../styles/home.css";
import AddEmployee from "./AddEmployee";
import { useTokenValidation } from "../hooks/useTokenValidation";
import { useTokenRefresh } from "../hooks/useTokenRefresh";
import RefreshTokenDebugger from "../components/RefreshTokenDebugger";

const AdminDashboard = () => {
  const [activeSelector, setActiveSelector] = useState("Visite Attive");

  // Controllo automatico validità token
  useTokenValidation();

  // Refresh automatico del token
  useTokenRefresh();

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
      case "Aggiungi Visitatore":
        return <AddVisitor />;
      case "Aggiungi Dipendente":
        return <AddEmployee />;
      case "Dipendenti":
        return <Employee />;
      case "Timbrature":
        return <TimeTracking />;
      case "Monitora Timbrature":
        return <TimbratureMonitor />;
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
