import React from "react";
import Selector from "./Selector";
import VisiteIcon from "../assets/Visit";
import ArchivioIcon from "../assets/Archive";
import AssignBadge from "../assets/AssignBadge";
import Employee from "../assets/Employee";
import Logout from "../assets/logout";

const Sidebar = ({ activeSelector, setActiveSelector }) => {
  return (
    <>
      {/* Sidebar desktop */}
      <aside
        className="d-none d-md-flex flex-column bg-light p-4 vh-100"
        style={{ width: "300px" }}
      >
        <div className="d-flex justify-content-center mb-4">
          <img
            src="/transparent-logo.png"
            alt="Logo"
            style={{ width: "133px", height: "94px", objectFit: "contain" }}
          />
        </div>
        <div className="d-flex align-items-center gap-3 mb-3">
          <img
            src="https://placehold.co/50x50"
            alt="Profile"
            className="rounded-circle"
            style={{ width: 50, height: 50 }}
          />
          <div>
            <h5 className="mb-0">Luca Rossi</h5>
            <small className="text-muted">Portineria</small>
          </div>
        </div>
        <hr />
        <div className="flex-grow-1 d-flex flex-column gap-2">
          <Selector
            icon={VisiteIcon}
            text="Visite Attive"
            active={activeSelector === "Visite Attive"}
            onClick={() => setActiveSelector("Visite Attive")}
          />
          <Selector
            icon={ArchivioIcon}
            text="Archivio Visite"
            active={activeSelector === "Archivio Visite"}
            onClick={() => setActiveSelector("Archivio Visite")}
          />
          <Selector
            icon={AssignBadge}
            text="Assegna Badge"
            active={activeSelector === "Assegna Badge"}
            onClick={() => setActiveSelector("Assegna Badge")}
          />
          <Selector
            icon={Employee}
            text="Dipendenti"
            active={activeSelector === "Dipendenti"}
            onClick={() => setActiveSelector("Dipendenti")}
          />
        </div>
        <div className="mt-auto">
          <Selector
            icon={Logout}
            text="Logout"
            active={activeSelector === "Logout"}
            onClick={null}
            isLogout={true}
          />
        </div>
      </aside>

      {/* Sidebar mobile - navbar */}
      <nav className="d-md-none navbar navbar-light bg-light px-3">
        <a className="navbar-brand" href="#">
          <img src="/transparent-logo.png" alt="Logo" height="40" />
        </a>
        <div className="d-flex gap-3">
          <Selector
            icon={VisiteIcon}
            text="Visite"
            active={activeSelector === "Visite Attive"}
            onClick={() => setActiveSelector("Visite Attive")}
          />
          <Selector
            icon={ArchivioIcon}
            text="Archivio"
            active={activeSelector === "Archivio Visite"}
            onClick={() => setActiveSelector("Archivio Visite")}
          />
          <Selector
            icon={AssignBadge}
            text="Badge"
            active={activeSelector === "Assegna Badge"}
            onClick={() => setActiveSelector("Assegna Badge")}
          />
          <Selector
            icon={Employee}
            text="Dipendenti"
            active={activeSelector === "Dipendenti"}
            onClick={() => setActiveSelector("Dipendenti")}
          />
          <Selector
            icon={Logout}
            text="Logout"
            active={activeSelector === "Logout"}
            onClick={null}
            isLogout={true}
          />
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
