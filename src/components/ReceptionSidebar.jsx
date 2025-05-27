import React, { useState, useEffect } from "react";
import Selector from "./Selector";
import VisiteIcon from "../assets/Visit";
import ArchivioIcon from "../assets/Archive";
import AssignBadge from "../assets/AssignBadge";
import Employee from "../assets/Employee";
import ClockIcon from "../assets/Clock";
import Logout from "../assets/Logout";
import AddVisit from "../assets/AddVisit";
import AddVisitor from "../assets/AddVisitor";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { clearAuthData } from "../utils/apiUtils";

const Sidebar = ({ activeSelector, setActiveSelector }) => {
    const [showOffcanvas, setShowOffcanvas] = useState(false);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        setName(localStorage.getItem("name"));
        setSurname(localStorage.getItem("surname"));
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 768);
            if (window.innerWidth >= 768) setShowOffcanvas(false);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    const handleLogout = () => {
        try {
            // Pulisci anche con la utility per essere sicuri
            clearAuthData();
            logout();
            console.log("Logout ReceptionSidebar completato");
            navigate("/");
        } catch (error) {
            console.error("Errore durante logout:", error);
            // Forza la pulizia e redirect anche in caso di errore
            clearAuthData();
            navigate("/");
        }
    };

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
                            style={{
                                width: "133px",
                                height: "94px",
                                objectFit: "contain",
                            }}
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
                            <h5 className="mb-0">
                                {name} {surname}
                            </h5>
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
                            icon={AddVisit}
                            text="Aggiungi Visita"
                            active={activeSelector === "Aggiungi Visita"}
                            onClick={() => setActiveSelector("Aggiungi Visita")}
                        />{" "}
                        <Selector
                            icon={AddVisitor}
                            text="Aggiungi Visitatore"
                            active={activeSelector === "Aggiungi Visitatore"}
                            onClick={() =>
                                setActiveSelector("Aggiungi Visitatore")
                            }
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
                            onClick={handleLogout}
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
                                xmlns="http://www.w3.org/2000/svg"
                                width="40"
                                height="40"
                                viewBox="0 0 40 40"
                                fill="none"
                            >
                                <path
                                    d="M6.66699 15H33.3337"
                                    stroke="#1E1E1E"
                                    stroke-width="1.5"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                                <path
                                    d="M6.66699 25H23.3337"
                                    stroke="#1E1E1E"
                                    stroke-width="1.5"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
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
                        <div
                            className="offcanvas-header flex-column align-items-center justify-content-center position-relative p-0"
                            style={{ minHeight: 100, paddingBottom: 0 }}
                        >
                            <img
                                src="/transparent-logo.png"
                                alt="Logo"
                                style={{
                                    width: "145px",
                                    height: "auto",
                                    objectFit: "contain",
                                    margin: "70px auto 0 auto",
                                    display: "block",
                                    maxHeight: 110,
                                }}
                            />
                            <button
                                type="button"
                                className="btn-close text-reset position-absolute"
                                aria-label="Close"
                                onClick={() => setShowOffcanvas(false)}
                                style={{ top: 24, right: 24 }}
                            ></button>
                        </div>
                        {/* User profile section mobile */}
                        <div
                            className="d-flex flex-row align-items-center mb-1 justify-content-start"
                            style={{
                                minHeight: 56,
                                marginLeft: 16,
                                marginRight: 16,
                                marginTop: 38,
                                height: 56,
                            }}
                        >
                            <img
                                src="https://placehold.co/40x40"
                                alt="Profile"
                                className="rounded-circle"
                                style={{
                                    width: 40,
                                    height: 40,
                                    minWidth: 32,
                                    minHeight: 32,
                                    maxWidth: 48,
                                    maxHeight: 48,
                                    objectFit: "cover",
                                    marginRight: 14,
                                    alignSelf: "center",
                                }}
                            />
                            <div
                                style={{
                                    minWidth: 0,
                                    textAlign: "left",
                                    alignSelf: "center",
                                    lineHeight: 1.1,
                                }}
                            >
                                <h6
                                    className="mb-0 text-truncate"
                                    style={{
                                        fontSize: "clamp(16px, 3.5vw, 1.25rem)",
                                        marginBottom: 2,
                                    }}
                                >
                                    {name} {surname}
                                </h6>
                                <small
                                    className="text-muted text-truncate"
                                    style={{
                                        fontSize: "clamp(12px, 2.5vw, 1.05rem)",
                                    }}
                                >
                                    Portineria
                                </small>
                            </div>
                        </div>
                        <hr
                            className="my-1"
                            style={{ marginLeft: 16, marginRight: 16 }}
                        />
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
                                icon={AddVisit}
                                text="Aggiungi Visita"
                                active={activeSelector === "Aggiungi Visita"}
                                onClick={() => {
                                    setActiveSelector("Aggiungi Visita");
                                    setShowOffcanvas(false);
                                }}
                            />{" "}
                            <Selector
                                icon={AddVisitor}
                                text="Aggiungi Visitatore"
                                active={
                                    activeSelector === "Aggiungi Visitatori"
                                }
                                onClick={() => {
                                    setActiveSelector("Aggiungi Visitatori");
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
                                onClick={handleLogout}
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
