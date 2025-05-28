import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/timetracking.css";

const TimeTracking = () => {
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
    const token =
      localStorage.getItem("accessToken") ||
      localStorage.getItem("refreshToken");

    // Ottieni l'ID della persona dal localStorage per recuperare le timbrature
    // idPersona identifica la persona nel sistema
    const idPersona = localStorage.getItem("idPersona");

    try {
      const response = await fetch(
        `http://localhost:8080/api/timbrature/oggi/${idPersona}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        // Ordina le timbrature per timestamp
        const sortedData = data.sort(
          (a, b) =>
            new Date(a.timestamp || a.dataOraTimbratura) -
            new Date(b.timestamp || b.dataOraTimbratura)
        );

        setTodayPunches(sortedData);
      }
    } catch (error) {
      console.error("Errore nel caricamento delle timbrature:", error);
    }
  };
  const handlePunch = async (tipo) => {
    setLoading(true);
    const token =
      localStorage.getItem("accessToken") ||
      localStorage.getItem("refreshToken");

    // Ottieni l'ID tessera dal localStorage (necessario per registrare le timbrature)
    // idTessera identifica la tessera fisica associata alla persona
    const idTessera = localStorage.getItem("idTessera");

    if (!idTessera) {
      alert("Errore: ID tessera non trovato. Contattare l'amministratore.");
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

      const response = await fetch("http://localhost:8080/api/timbrature", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(punchData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Timbratura registrata:", result);

        // Aggiorna lo stato globale delle timbrature
        updateWorkingStatus(tipo === "ENTRATA", {
          tipo: tipo,
          timestamp: now.toISOString(),
          note: punchData.note,
        });

        // Ricarica le timbrature del giorno
        await fetchTodayPunches();

        alert(
          `Timbratura di ${
            tipo === "ENTRATA" ? "entrata" : "uscita"
          } registrata con successo!`
        );
      } else {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Errore sconosciuto" }));
        console.error("Errore dettagliato dal server:", errorData);
        console.error("Status:", response.status);
        console.error("Dati inviati:", punchData);
        alert(
          `Errore nella timbratura: ${
            errorData.message || errorData.error || "Errore sconosciuto"
          }`
        );
      }
    } catch (error) {
      console.error("Errore nella timbratura:", error);
      alert("Errore di connessione. Riprova più tardi.");
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

    // Ordina le timbrature per timestamp
    const sortedPunches = [...todayPunches].sort(
      (a, b) =>
        new Date(a.timestamp || a.dataOraTimbratura) -
        new Date(b.timestamp || b.dataOraTimbratura)
    );

    for (const punch of sortedPunches) {
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
    <div className="timetracking-container">
      <div className="timetracking-header">
        <h1>Timbratura Presenze</h1>
        <div className="current-time">
          <div className="time-display">{formatTime(currentTime)}</div>
          <div className="date-display">{formatDate(currentTime)}</div>
        </div>
      </div>
      <div className="status-card">
        <div className="status-indicator">
          <div
            className={`status-dot ${isWorking ? "working" : "not-working"}`}
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
          className={`punch-btn entry-btn ${isWorking ? "disabled" : ""}`}
          onClick={() => handlePunch("ENTRATA")}
          disabled={loading || isWorking}
        >
          {loading ? "Registrando..." : "Timbra Entrata"}
        </button>

        <button
          className={`punch-btn exit-btn ${!isWorking ? "disabled" : ""}`}
          onClick={() => handlePunch("USCITA")}
          disabled={loading || !isWorking}
        >
          {loading ? "Registrando..." : "Timbra Uscita"}
        </button>
      </div>
      <div className="punches-list">
        <h3>Timbrature di Oggi</h3>
        {todayPunches.length === 0 ? (
          <p className="no-punches">Nessuna timbratura registrata oggi</p>
        ) : (
          <div className="punches-timeline">
            {todayPunches.map((punch, index) => (
              <div
                key={index}
                className={`punch-item ${(
                  punch.tipo || punch.tipoTimbratura
                ).toLowerCase()}`}
              >
                <div className="punch-header">
                  <div className="punch-type">
                    {punch.tipo || punch.tipoTimbratura}
                  </div>
                  <div className="punch-time">
                    {formatPunchTime(
                      punch.timestamp || punch.dataOraTimbratura
                    )}
                  </div>
                </div>
                {punch.note && (
                  <div className="punch-note">
                    <small>{punch.note}</small>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeTracking;
