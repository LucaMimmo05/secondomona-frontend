import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/timetracking.css";
import { apiCall } from "../utils/apiUtils";
import { useTokenRefresh } from "../hooks/useTokenRefresh";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UpdateIcon from "../assets/update.tsx";

// Custom toast styles to ensure proper colors
const toastConfig = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    className: "customToast",
    bodyClassName: "toastBody",
    toastClassName: (type) => {
        switch (type?.type) {
            case "success":
                return "Toastify__toast Toastify__toast--success";
            case "error":
                return "Toastify__toast Toastify__toast--error";
            default:
                return "Toastify__toast";
        }
    },
};

const TimeTracking = () => {
    // Initialize token refresh hook
    useTokenRefresh();

    const { isWorking, lastPunch, updateWorkingStatus, checkWorkingStatus } =
        useAuth();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [todayPunches, setTodayPunches] = useState([]);
    const [loading, setLoading] = useState(false);

    // Aggiorna l'orario ogni secondo
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Carica le timbrature del giorno
    useEffect(() => {
        fetchTodayPunches();
    }, []);
    const fetchTodayPunches = async () => {
        // Ottieni l'ID della persona dal localStorage per recuperare le timbrature
        const idPersona = localStorage.getItem("idPersona");
        const idTessera = localStorage.getItem("idTessera");

        console.log("📋 Caricamento timbrature personali per:", {
            idPersona,
            idTessera,
        });

        try {
            // Proviamo diversi endpoint per ottenere le timbrature
            let data = null;
            const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
            const todayFormatted = new Date()
                .toLocaleDateString("it-IT")
                .split("/")
                .reverse()
                .join("/"); // DD/MM/YYYY

            // Lista di endpoint da provare
            const endpoints = [
                `/api/timbrature/persona/${idPersona}`,
                `/api/timbrature/dipendente/${idPersona}`,
                `/api/timbrature/oggi/${idPersona}`,
                `/api/timbrature/data/${today}`,
                `/api/timbrature?data=${today}`,
                `/api/timbrature?idPersona=${idPersona}`,
                `/api/timbrature`, // Endpoint base come fallback
            ];

            // Prova ogni endpoint
            for (const endpoint of endpoints) {
                try {
                    console.log("🔍 Tentativo endpoint:", endpoint);
                    data = await apiCall(endpoint);
                    console.log(
                        "✅ Endpoint funzionante:",
                        endpoint,
                        "Dati ricevuti:",
                        data.length
                    );
                    break;
                } catch (error) {
                    console.log(
                        "❌ Endpoint fallito:",
                        endpoint,
                        error.message
                    );
                    continue;
                }
            }

            if (!data) {
                console.error("❌ Nessun endpoint ha funzionato");
                setTodayPunches([]);
                return;
            }

            // Filtra per la data di oggi e per l'utente corrente
            const todayPunches = data.filter((punch) => {
                // Filtra per data di oggi
                const punchDate = new Date(
                    punch.dataOraTimbratura || punch.timestamp
                )
                    .toISOString()
                    .split("T")[0];

                if (punchDate !== today) return false;

                // Filtra per utente corrente (verifica tutti i possibili ID)
                const punchPersonId = (
                    punch.idPersona ||
                    punch.idTessera ||
                    punch.id
                )?.toString();
                const userPersonId = idPersona?.toString();
                const userTesseraId = idTessera?.toString();

                return (
                    punchPersonId === userPersonId ||
                    punchPersonId === userTesseraId
                );
            });
            console.log("📊 Timbrature filtrate per oggi:", todayPunches);

            // Ordina le timbrature per timestamp (più recenti in alto)
            const sortedData = todayPunches.sort(
                (a, b) =>
                    new Date(b.timestamp || b.dataOraTimbratura) -
                    new Date(a.timestamp || a.dataOraTimbratura)
            );

            setTodayPunches(sortedData);
            console.log("✅ Timbrature caricate:", sortedData.length);
        } catch (error) {
            console.error("❌ Errore nel caricamento delle timbrature:", error);
            setTodayPunches([]);
        }
    };
    const handlePunch = async (tipo) => {
        setLoading(true);

        // Ottieni l'ID tessera dal localStorage (necessario per registrare le timbrature)
        // idTessera identifica la tessera fisica associata alla persona
        const idTessera = localStorage.getItem("idTessera");
        if (!idTessera) {
            toast.error(
                "Errore: ID tessera non trovato. Contattare l'amministratore."
            );
            setLoading(false);
            return;
        }

        try {
            const now = new Date();
            const punchData = {
                idTessera: parseInt(idTessera),
                tipoTimbratura: tipo,
                dataOraTimbratura: now.toISOString(), // Formato ISO standard per OffsetDateTime
                note: `Timbratura di ${
                    tipo === "ENTRATA" ? "entrata" : "uscita"
                } - ${now.toLocaleTimeString("it-IT")}`,
            };

            console.log("Dati timbratura:", punchData);

            const result = await apiCall("/api/timbrature", {
                method: "POST",
                body: JSON.stringify(punchData),
            });

            console.log("Timbratura registrata:", result);

            // Aggiorna lo stato globale delle timbrature
            updateWorkingStatus(tipo === "ENTRATA", {
                tipo: tipo,
                timestamp: now.toISOString(),
                note: punchData.note,
            }); // Ricarica le timbrature del giorno
            await fetchTodayPunches();
            toast.success(
                `Timbratura di ${
                    tipo === "ENTRATA" ? "entrata" : "uscita"
                } registrata con successo!`
            );
        } catch (error) {
            console.error("Errore nella timbratura:", error);
            toast.error(
                `Errore nella timbratura: ${
                    error.message || "Errore sconosciuto"
                }`
            );
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString("it-IT", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
    };

    const formatDate = (date) => {
        return date.toLocaleDateString("it-IT", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const formatPunchTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString("it-IT", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };
    const calculateWorkHours = () => {
        if (todayPunches.length < 2) return "0:00";

        let totalMinutes = 0;
        let currentEntry = null;

        // Ordina le timbrature per timestamp cronologico (crescente) per il calcolo
        const sortedPunchesForCalculation = [...todayPunches].sort(
            (a, b) =>
                new Date(a.timestamp || a.dataOraTimbratura) -
                new Date(b.timestamp || b.dataOraTimbratura)
        );

        for (const punch of sortedPunchesForCalculation) {
            const tipoTimbratura = punch.tipo || punch.tipoTimbratura;
            const timestamp = punch.timestamp || punch.dataOraTimbratura;

            if (tipoTimbratura === "ENTRATA" && !currentEntry) {
                currentEntry = new Date(timestamp);
            } else if (tipoTimbratura === "USCITA" && currentEntry) {
                const uscita = new Date(timestamp);
                totalMinutes += (uscita - currentEntry) / (1000 * 60);
                currentEntry = null;
            }
        }

        const hours = Math.floor(totalMinutes / 60);
        const minutes = Math.floor(totalMinutes % 60);
        return `${hours}:${minutes.toString().padStart(2, "0")}`;
    };
    return (
        <>
            <div className="timetracking-container">
                <div className="timetracking-header">
                    <h1>Timbratura Presenze</h1>
                    <div className="current-time">
                        <div className="time-display">
                            {formatTime(currentTime)}
                        </div>
                        <div className="date-display">
                            {formatDate(currentTime)}
                        </div>
                    </div>
                </div>
                <div className="status-card">
                    <div className="status-indicator">
                        <div
                            className={`status-dot ${
                                isWorking ? "working" : "not-working"
                            }`}
                        ></div>
                        <span className="status-text">
                            {isWorking ? "Al lavoro" : "Non al lavoro"}
                        </span>
                    </div>

                    {lastPunch && (
                        <div className="last-punch">
                            <span>
                                Ultima timbratura: {lastPunch.tipo} alle{" "}
                                {formatPunchTime(lastPunch.timestamp)}
                            </span>
                        </div>
                    )}
                </div>
                <div className="punch-buttons">
                    <button
                        className={`punch-btn entry-btn ${
                            isWorking ? "disabled" : ""
                        }`}
                        onClick={() => handlePunch("ENTRATA")}
                        disabled={loading || isWorking}
                    >
                        {loading ? "Registrando..." : "Timbra Entrata"}
                    </button>

                    <button
                        className={`punch-btn exit-btn ${
                            !isWorking ? "disabled" : ""
                        }`}
                        onClick={() => handlePunch("USCITA")}
                        disabled={loading || !isWorking}
                    >
                        {loading ? "Registrando..." : "Timbra Uscita"}
                    </button>
                </div>{" "}
                <div className="punches-list">
                    <div className="punches-header">
                        <h3>Timbrature di Oggi</h3>
                        <div className="header-actions">
                            {todayPunches.length > 0 && (
                                <div className="work-summary">
                                    <span className="work-hours">
                                        Ore lavorate:{" "}
                                        <strong>{calculateWorkHours()}</strong>
                                    </span>
                                    <span className="punch-count">
                                        Timbrature:{" "}
                                        <strong>{todayPunches.length}</strong>
                                    </span>
                                </div>
                            )}{" "}
                            <button
                                onClick={fetchTodayPunches}
                                className="refresh-punches-btn"
                                title="Ricarica timbrature"
                            >
                                <UpdateIcon />
                            </button>
                        </div>
                    </div>
                    {todayPunches.length === 0 ? (
                        <p className="no-punches">
                            Nessuna timbratura registrata oggi
                        </p>
                    ) : (
                        <div className="punches-timeline">
                            {todayPunches.map((punch, index) => (
                                <div
                                    key={index}
                                    className={`punch-item ${(
                                        punch.tipo || punch.tipoTimbratura
                                    ).toLowerCase()} ${
                                        index === 0 ? "latest-punch" : ""
                                    }`}
                                >
                                    <div className="punch-header">
                                        <div className="punch-type">
                                            <span
                                                className={`type-badge ${(
                                                    punch.tipo ||
                                                    punch.tipoTimbratura
                                                ).toLowerCase()}`}
                                            >
                                                {punch.tipo ||
                                                    punch.tipoTimbratura}
                                            </span>
                                            {index === 0 && (
                                                <span className="latest-indicator">
                                                    Ultima
                                                </span>
                                            )}
                                        </div>
                                        <div className="punch-time">
                                            {formatPunchTime(
                                                punch.timestamp ||
                                                    punch.dataOraTimbratura
                                            )}
                                        </div>
                                    </div>
                                    {punch.note && (
                                        <div className="punch-note">
                                            <small>{punch.note}</small>
                                        </div>
                                    )}
                                    {index < todayPunches.length - 1 && (
                                        <div className="timeline-connector"></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>{" "}
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar
                closeOnClick
                draggable
                className="toastContainer"
                toastClassName="customToast"
                bodyClassName="toastBody"
                closeButton={false}
                style={{
                    "--toastify-color-success": "#d4edda",
                    "--toastify-text-color-success": "#155724",
                }}
            />
        </>
    );
};

export default TimeTracking;
