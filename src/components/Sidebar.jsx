import React, { useState, useEffect } from "react";
import Selector from "./Selector";
import VisiteIcon from "../assets/Visit";
import ArchivioIcon from "../assets/Archive";
import AssignBadge from "../assets/AssignBadge";
import Employee from "../assets/Employee";
import Logout from "../assets/Logout";

const Sidebar = ({ activeSelector, setActiveSelector }) => {
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
      if (window.innerWidth >= 768) setShowOffcanvas(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Sidebar desktop */}
      {isDesktop && (
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
      )}

      {/* Burger menu mobile/tablet SOLO su mobile/tablet */}
      {!isDesktop && (
        <>
          {!showOffcanvas && (
            <button
              className="navbar-toggler position-fixed"
              style={{
                top: 16,
                left: 16,
                zIndex: 1300,
                border: "none",
                background: "transparent",
                padding: 0,
                width: 40,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              type="button"
              aria-label="Menu"
              onClick={() => setShowOffcanvas(true)}
            >
              {/* Material Design burger icon */}
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="4" y="8" width="24" height="3" rx="1.5" fill="#222" />
                <rect x="4" y="15" width="24" height="3" rx="1.5" fill="#222" />
                <rect x="4" y="22" width="24" height="3" rx="1.5" fill="#222" />
              </svg>
            </button>
          )}
          {/* Offcanvas Bootstrap mobile sidebar */}
          <div
            className={`offcanvas offcanvas-start${
              showOffcanvas ? " show" : ""
            }`}
            tabIndex="-1"
            style={{
              visibility: showOffcanvas ? "visible" : "hidden",
              zIndex: 1200,
              background: "#fff",
              width: "80vw",
              maxWidth: 320,
              height: "100dvh",
            }}
          >
            <div className="offcanvas-header d-flex justify-content-between align-items-center">
              <img
                src="/transparent-logo.png"
                alt="Logo"
                style={{
                  width: "133px",
                  height: "94px",
                  objectFit: "contain",
                }}
              ></img>
              <button
                type="button"
                className="btn-close text-reset"
                aria-label="Close"
                onClick={() => setShowOffcanvas(false)}
              ></button>
            </div>
            <div
              className="offcanvas-body d-flex flex-column gap-2"
              style={{
                height: "100%",
                paddingBottom: 10,
              }}
            >
              <Selector
                icon={VisiteIcon}
                text="Visite"
                active={activeSelector === "Visite Attive"}
                onClick={() => {
                  setActiveSelector("Visite Attive");
                  setShowOffcanvas(false);
                }}
              />
              <Selector
                icon={ArchivioIcon}
                text="Archivio"
                active={activeSelector === "Archivio Visite"}
                onClick={() => {
                  setActiveSelector("Archivio Visite");
                  setShowOffcanvas(false);
                }}
              />
              <Selector
                icon={AssignBadge}
                text="Badge"
                active={activeSelector === "Assegna Badge"}
                onClick={() => {
                  setActiveSelector("Assegna Badge");
                  setShowOffcanvas(false);
                }}
              />
              <Selector
                icon={Employee}
                text="Dipendenti"
                active={activeSelector === "Dipendenti"}
                onClick={() => {
                  setActiveSelector("Dipendenti");
                  setShowOffcanvas(false);
                }}
              />
              <div style={{ flex: 1 }} />
              <Selector
                icon={Logout}
                text="Logout"
                onClick={null}
                isLogout={true}
              />
            </div>
          </div>
          {/* Overlay per chiusura offcanvas */}
          {showOffcanvas && (
            <div
              className="offcanvas-backdrop fade show"
              style={{ zIndex: 1199 }}
              onClick={() => setShowOffcanvas(false)}
            ></div>
          )}
        </>
      )}
    </>
  );
};

export default Sidebar;
