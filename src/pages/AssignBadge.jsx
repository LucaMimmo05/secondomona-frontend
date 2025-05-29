import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import "../styles/assignbadge.css";
import "../styles/datatable-common.css";
import { apiCall } from "../utils/apiUtils";

const AssignBadge = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingId, setLoadingId] = useState(null);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const navigate = useNavigate();

    const handleAssign = async (row) => {
        try {
            setLoadingId(row.idRichiesta);
            setErrorMsg("");
            setSuccessMsg(""); // Chiamata API con apiCall che gestisce automaticamente il token
            const result = await apiCall("/api/badge/assegna", {
                method: "POST",
                body: JSON.stringify(row.visitatore),
            });

            console.log("Payload inviato:", row.visitatore);
            console.log(result);

            setSuccessMsg(
                `Badge assegnato a ${row.visitatore?.nome} ${row.visitatore?.cognome}`
            );
            setData((prev) =>
                prev.filter((item) => item.idRichiesta !== row.idRichiesta)
            );
        } catch (error) {
            console.error(error);
            setErrorMsg("Errore durante l'assegnazione del badge.");
        } finally {
            setLoadingId(null);
        }
    };

    const fetchVisits = async () => {
        setLoading(true);
        try {
            // Chiamata API con apiCall, include Bearer token
            const visitsData = await apiCall("/api/visite/in-attesa");
            setData(visitsData);
        } catch (error) {
            console.error("Errore nel fetch delle visite:", error);
            setErrorMsg("Impossibile caricare le visite.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVisits();
    }, []);

    const columns = [
        {
            name: "Data",
            selector: (row) =>
                new Date(row.dataInizio).toLocaleDateString("it-IT"),
            sortable: true,
            width: "120px",
        },
        {
            name: "Ora Inizio",
            selector: (row) =>
                new Date(row.dataInizio).toLocaleTimeString("it-IT", {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            sortable: true,
            width: "100px",
        },
        {
            name: "Ora Fine",
            selector: (row) =>
                new Date(row.dataFine).toLocaleTimeString("it-IT", {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            sortable: true,
            width: "100px",
        },
        {
            name: "Stato",
            cell: (row) => (
                <span
                    className={`status-badge ${(row.stato || "IN ATTESA")
                        .toLowerCase()
                        .replace(" ", "-")}`}
                >
                    {row.stato || "IN ATTESA"}
                </span>
            ),
            sortable: true,
            width: "140px",
        },
        {
            name: "Ospite",
            selector: (row) =>
                row.visitatore
                    ? `${row.visitatore.nome} ${row.visitatore.cognome}`
                    : "N/A",
            sortable: true,
            grow: 1,
        },
        {
            name: "Dipendente",
            selector: (row) =>
                row.richiedente
                    ? `${row.richiedente.nome} ${row.richiedente.cognome}`
                    : "N/A",
            sortable: true,
            grow: 1,
        },
        {
            name: "Assegna Badge",
            cell: (row) => (
                <button
                    className="badge-flag-button"
                    onClick={() => handleAssign(row)}
                    disabled={loadingId === row.idRichiesta}
                    title="Assegna badge"
                >
                    {loadingId === row.idRichiesta ? (
                        <span className="loader-small" />
                    ) : (
                        <svg
                            className="badge-flag-icon"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M4 22v-7"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    )}
                </button>
            ),
            width: "140px",
        },
    ];

    return (
        <div className="assign-badge-container">
            <div className="assign-badge-header">
                <h1>Assegna Badge</h1>
                <div className="filter-results">
                    <p>Risultati mostrati: {data.length}</p>
                </div>
            </div>

            {successMsg && <div className="success-msg">{successMsg}</div>}
            {errorMsg && <div className="error-msg">{errorMsg}</div>}

            <DataTable
                columns={columns}
                data={data}
                pagination
                responsive
                highlightOnHover
                progressPending={loading}
                noDataComponent="Nessun record da mostrare"
            />
        </div>
    );
};

export default AssignBadge;
