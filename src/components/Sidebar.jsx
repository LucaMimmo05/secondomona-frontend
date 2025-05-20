import React, { useState } from 'react'
import "../styles/sidebar.css"
import Selector from './Selector'
import  VisiteIcon  from "../assets/Visite"
import  ArchivioIcon  from '../assets/Archivio'
const Sidebar = () => {
  const [activeSelector, setActiveSelector] = useState('Visite Attive')

  
  return (
    <aside className="sidebar">
      <div className="top-logo">
        <img src="public/transparent-logo.png" alt="Logo" className="logo"  />
      </div>
      <div className="sidebar-top">
        <div className="profile-cont">
          <div className="profile">
            <img src="https://placehold.co/20x20" alt="Logo" className="profile-picture"  />
            <div className="profile-text">
              <h1>Luca Rossi</h1>
              <p>Portineria</p>
            </div>
          </div>
          <hr className='profile-row'></hr>
        </div>

        <div className="selectors">
          <Selector
            icon={VisiteIcon}
            text="Visite Attive"
            active={activeSelector === 'Visite Attive'}
            onClick={() => setActiveSelector('Visite Attive')}
          />
          <Selector
            icon={ArchivioIcon}
            text="Archivio Visite"
            active={activeSelector === 'Archivio Visite'}
            onClick={() => setActiveSelector('Archivio Visite')}
          />
          
        </div>
      </div>
    </aside>
  )
}

export default Sidebar