import React, { useState } from "react";
import EmployeeSidebar from "../components/EmployeeSidebar";
import ActiveVisits from "./ActiveVisits";
import AddVisit from "./AddVisit";
import "../styles/home.css";

const EmployeeDashboard = () => {
  const [activeSelector, setActiveSelector] = useState("Visite Attive");

  const renderContent = () => {
    switch (activeSelector) {
      case "Visite Attive":
        return <ActiveVisits />;
      case "Aggiungi Visita":
        return <AddVisit />;
      default:
        return <div>Sezione non trovata</div>;
    }
  };

  return (
    <div className="employee-dashboard d-flex" style={{ height: "100vh" }}>
      <EmployeeSidebar
        activeSelector={activeSelector}
        setActiveSelector={setActiveSelector}
      />
        <main
        className="dashboard-content"
        style={{
            flex: "1 1 0",
            minWidth: 0,
            minHeight: 0,
            width: "100%",
            padding: "60px 69px 0 69px",
            boxSizing: "border-box",
            overflow: "auto",
        }}
        >
        {renderContent()}
        </main>

    </div>
  );
};

export default EmployeeDashboard;
