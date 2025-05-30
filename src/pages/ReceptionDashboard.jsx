import React, { useState } from "react";
import Sidebar from "../components/ReceptionSidebar";
import "../styles/addvisitor.css";
import ActiveVisits from "./ActiveVisits";
import ArchiveVisits from "./ArchiveVisits";
import AssignBadge from "./AssignBadge";
import Employee from "./Employee";
import AddVisit from "./AddVisit";
import AddVisitor from "./AddVisitor";
import TimbratureMonitor from "./TimbratureMonitor";
import TimeTracking from "./TimeTracking";
import { useTokenValidation } from "../hooks/useTokenValidation";
import { useTokenRefresh } from "../hooks/useTokenRefresh";

const ReceptionDashboard = () => {
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
      <Sidebar
        activeSelector={activeSelector}
        setActiveSelector={setActiveSelector}
      />

      <div className="home-content">{renderContent()}</div>
    </div>
  );
};

export default ReceptionDashboard;
