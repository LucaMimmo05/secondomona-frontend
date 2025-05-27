import React, { useState, useEffect } from "react";
import Selector         from "./Selector";
import VisiteIcon       from "../assets/Visit";
import ArchivioIcon     from "../assets/Archive";
import AssignBadgeIcon  from "../assets/AssignBadge";
import AddVisitIcon     from "../assets/AddVisit";
import AddEmployeeIcon  from "../assets/AddEmployee";
import EmployeeIcon     from "../assets/Employee";
import ClockIcon        from "../assets/Clock";
import LogoutIcon       from "../assets/Logout";
import { useNavigate }  from "react-router-dom";
import { useAuth }      from "../context/AuthContext";
import { clearAuthData } from "../utils/apiUtils";

const AdminSidebar = ({ activeSelector, setActiveSelector }) => {
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [isDesktop,     setIsDesktop]     = useState(window.innerWidth >= 768);
  const [name,          setName]          = useState("");
  const [surname,       setSurname]       = useState("");
  const { logout }      = useAuth();
  const navigate        = useNavigate();

  // Imposta nome/cognome e gestisce resize
  useEffect(() => {
    setName(localStorage.getItem("name"));
    setSurname(localStorage.getItem("surname"));

    const handleResize = () => {
      const desktop = window.innerWidth >= 768;
      setIsDesktop(desktop);
      if (desktop) setShowOffcanvas(false);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    clearAuthData();
    logout();
    navigate("/");
  };

  const items = [
    { icon: VisiteIcon,   text: "Visite Attive" },
    { icon: ArchivioIcon, text: "Archivio Visite" },
    { icon: AssignBadgeIcon, text: "Assegna Badge" },
    { icon: AddVisitIcon, text: "Aggiungi Visita" },
    { icon: AddEmployeeIcon, text: "Aggiungi Dipendente" },
    { icon: EmployeeIcon, text: "Dipendenti" },
    { icon: ClockIcon,    text: "Timbrature" },
    { icon: ClockIcon,    text: "Monitora Timbrature" },
  ];

  return (
    <>
      {/* — Desktop Sidebar — */}
      {isDesktop && (
        <aside className="d-none d-md-flex flex-column bg-light p-4 vh-100" style={{ width: 300 }}>
          <div className="text-center mb-4">
            <img
              src="/transparent-logo.png"
              alt="Logo"
              style={{ width: 133, height: 94, objectFit: "contain" }}
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
              <h5 className="mb-0">{name} {surname}</h5>
              <small className="text-muted">Admin</small>
            </div>
          </div>
          <hr />
          <div className="flex-grow-1 d-flex flex-column gap-2">
            {items.map(({ icon, text }) => (
              <Selector
                key={text}
                icon={icon}
                text={text}
                active={activeSelector === text}
                onClick={() => setActiveSelector(text)}
              />
            ))}
          </div>
          <div className="mt-auto">
            <Selector
              icon={LogoutIcon}
              text="Logout"
              isLogout
              onClick={handleLogout}
            />
          </div>
        </aside>
      )}

      {/* — Mobile/Tablet Offcanvas + Hamburger — */}
      {!isDesktop && (
        <>
          {/* Bottone “hamburger” */}
          {!showOffcanvas && (
            <button
              className="navbar-toggler position-fixed"
              style={{
                top: 16, left: 16, zIndex: 1300,
                border: "none", background: "transparent",
                width: 40, height: 40, padding: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
              type="button"
              aria-label="Apri menu"
              aria-controls="adminSidebarOffcanvas"
              aria-expanded={showOffcanvas}
              onClick={() => setShowOffcanvas(true)}
            >
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <path d="M6.667 15H33.334" stroke="#1E1E1E" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M6.667 25H23.334" stroke="#1E1E1E" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          )}

          {/* Offcanvas menu */}
          <div
            id="adminSidebarOffcanvas"
            className={`offcanvas offcanvas-start${showOffcanvas ? " show" : ""}`}
            tabIndex={-1}
            style={{
              visibility: showOffcanvas ? "visible" : "hidden",
              zIndex: 1200,
              background: "#fff",
              width: "80vw",
              maxWidth: 320,
              height: "100vh",
            }}
          >
            {/* Header con logo e close */}
            <div className="offcanvas-header position-relative p-0" style={{ minHeight: 100 }}>
              <img
                src="/transparent-logo.png"
                alt="Logo"
                style={{
                  width: 145,
                  objectFit: "contain",
                  margin: "70px auto 0",
                  display: "block",
                  maxHeight: 110,
                }}
              />
              <button
                type="button"
                className="btn-close position-absolute"
                style={{ top: 24, right: 24 }}
                aria-label="Chiudi menu"
                onClick={() => setShowOffcanvas(false)}
              />
            </div>

            {/* Profilo utente */}
            <div className="d-flex align-items-center px-3 mb-1" style={{ marginTop: 38, height: 56 }}>
              <img
                src="https://placehold.co/40x40"
                alt="Profile"
                className="rounded-circle"
                style={{ width: 40, height: 40, objectFit: "cover", marginRight: 14 }}
              />
              <div className="text-truncate">
                <h6 className="mb-0">{name} {surname}</h6>
                <small className="text-muted">Admin</small>
              </div>
            </div>
            <hr className="my-1 mx-3" />

            {/* Voci di menu */}
            <div className="offcanvas-body d-flex flex-column gap-2 px-3" style={{ paddingBottom: 10 }}>
              {items.map(({ icon, text }) => (
                <Selector
                  key={text}
                  icon={icon}
                  text={text}
                  active={activeSelector === text}
                  onClick={() => {
                    setActiveSelector(text);
                    setShowOffcanvas(false);
                  }}
                />
              ))}
              <div style={{ flex: 1 }} />
              <Selector
                icon={LogoutIcon}
                text="Logout"
                isLogout
                onClick={handleLogout}
              />
            </div>
          </div>

          {/* Backdrop per chiusura */}
          {showOffcanvas && (
            <div
              className="offcanvas-backdrop show"
              style={{ zIndex: 1199 }}
              onClick={() => setShowOffcanvas(false)}
            />
          )}
        </>
      )}
    </>
  );
};

export default AdminSidebar;
