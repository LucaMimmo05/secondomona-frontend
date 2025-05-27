import React, { useState, useEffect } from "react";
import "../styles/timetracking.css";

const TimeTracking = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [lastPunch, setLastPunch] = useState(null);
  const [isWorking, setIsWorking] = useState(false);
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

    // Ottieni l'ID dell'utente dal localStorage
    const idPersona =
      localStorage.getItem("idTessera") ||
      localStorage.getItem("idPersona") ||
      "1"; // Fallback per test

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

        // Determina se il dipendente è attualmente al lavoro
        if (sortedData.length > 0) {
          const lastPunch = sortedData[sortedData.length - 1];
          setLastPunch({
            tipo: lastPunch.tipo || lastPunch.tipoTimbratura,
            timestamp: lastPunch.timestamp || lastPunch.dataOraTimbratura,
            note: lastPunch.note,
          });
          setIsWorking(
            (lastPunch.tipo || lastPunch.tipoTimbratura) === "ENTRATA"
          );
        }
      }
    } catch (error) {
      console.error("Errore nel caricamento delle timbrature:", error);
    }
  };
  const handlePunch = async (tipo) => {
    setLoading(true);
    const token =
      localStorage.getItem("accessToken") ||
      localStorage.getItem("refreshToken"); // Ottieni l'ID tessera o ID persona dal localStorage
    const idTessera =
      localStorage.getItem("idTessera") ||
      localStorage.getItem("idPersona") ||
      "1"; // Fallback minimo per test

    try {
      const now = new Date();
      const punchData = {
        idTessera: parseInt(idTessera),
        tipoTimbratura: tipo,
        dataOraTimbratura: now.toISOString().slice(0, 19), // Formato ISO senza millisecondi
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

        // Aggiorna lo stato
        setIsWorking(tipo === "ENTRATA");
        setLastPunch({
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
        alert(
          `Errore nella timbratura: ${
            errorData.message || "Errore sconosciuto"
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
      <div className="today-summary">
        <h3>Riepilogo Giornaliero</h3>
        <div className="summary-grid">
          <div className="summary-item">
            <span className="summary-label">Ore Lavorate</span>
            <span className="summary-value">{calculateWorkHours()}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Timbrature</span>
            <span className="summary-value">{todayPunches.length}</span>
          </div>
        </div>
      </div>{" "}
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
