import React, { useState } from 'react';
import Sidebar from '../components/ReceptionSidebar';
import "../styles/home.css";
import ActiveVisits from './ActiveVisits';
import ArchiveVisits from './ArchiveVisits';
import AssignBadge from './AssignBadge';
import Employee from './Employee';
const Home = () => {
  const [activeSelector, setActiveSelector] = useState('Visite Attive');

  const renderContent = () => {
    switch (activeSelector) {
      case 'Visite Attive':
        return <ActiveVisits />;
      case 'Archivio Visite':
        return <ArchiveVisits />;
      case 'Assegna Badge':
        return <AssignBadge />;
      case 'Dipendenti':
        return <Employee/>;
      default:
        return <div>Sezione non trovata</div>;
    }
  }

  return (
    <div className='home'>
      <Sidebar 
        activeSelector={activeSelector} 
        setActiveSelector={setActiveSelector} 
      />
      
      <div className="home-content">
       {renderContent()}
      </div>
    </div>
  );
}

export default Home;
