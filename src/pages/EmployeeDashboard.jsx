import React, { useState } from "react";
import EmployeeSidebar from "../components/EmployeeSidebar";
import ActiveVisits from "./ActiveVisits";
import AddVisit from "./AddVisit";
import TimeTracking from "./TimeTracking";
import "../styles/home.css";
import { useTokenValidation } from "../hooks/useTokenValidation";
import { useTokenRefresh } from "../hooks/useTokenRefresh";
import TimbratureMonitor from "./TimbratureMonitor";

const EmployeeDashboard = () => {
  const [activeSelector, setActiveSelector] = useState("Visite Attive");

  // Controllo automatico validità token
  useTokenValidation();

  // Refresh automatico del token
  useTokenRefresh();
  const renderContent = () => {
    switch (activeSelector) {
      case "Visite Attive":
        return <ActiveVisits />;
      case "Aggiungi Visita":
        return <AddVisit />;
      case "Timbrature":
        return <TimeTracking />;
      default:
        return <div>Sezione non trovata</div>;
    }
  };

  return (
    <div className="home">
      <EmployeeSidebar
        activeSelector={activeSelector}
        setActiveSelector={setActiveSelector}
      />

      <div className="home-content">{renderContent()}</div>
    </div>
  );
};

export default EmployeeDashboard;
