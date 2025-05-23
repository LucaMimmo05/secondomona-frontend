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
    <div className='home'>
      <EmployeeSidebar 
        activeSelector={activeSelector} 
        setActiveSelector={setActiveSelector} 
      />
      
      <div className="home-content">
       {renderContent()}
      </div>
    </div>
  );
};

export default EmployeeDashboard;
