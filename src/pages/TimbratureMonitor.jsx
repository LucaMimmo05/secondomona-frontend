import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import "../styles/timbraturemonitor.css";

const TimbratureMonitor = () => {
  const [timbrature, setTimbrature] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [filterStatus, setFilterStatus] = useState("TUTTI");

  useEffect(() => {
    fetchTimbrature();
  }, [selectedDate, filterStatus]);

  const fetchTimbrature = async () => {
    setLoading(true);
    const token =
      localStorage.getItem("accessToken") ||
      localStorage.getItem("refreshToken");

    try {
      let url = `http://localhost:8080/api/timbrature/date/${selectedDate}`;
      if (filterStatus !== "TUTTI") {
        url += `?status=${filterStatus}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTimbrature(data);
      } else {
        console.error("Errore nel caricamento delle timbrature");
      }
    } catch (error) {
      console.error("Errore nella fetch:", error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      name: "Dipendente",
      selector: (row) => `${row.dipendente.nome} ${row.dipendente.cognome}`,
      sortable: true,
      grow: 2,
      center: true,
    },
    {
      name: "Tipo",
      selector: (row) => row.tipo,
      sortable: true,
      grow: 1,
      center: true,
      cell: (row) => (
        <span className={`status-badge ${row.tipo.toLowerCase()}`}>
          {row.tipo}
        </span>
      ),
    },
    {
      name: "Orario",
      selector: (row) =>
        new Date(row.timestamp).toLocaleTimeString("it-IT", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      sortable: true,
      grow: 1,
      center: true,
    },
    {
      name: "Data",
      selector: (row) => new Date(row.timestamp).toLocaleDateString("it-IT"),
      sortable: true,
      grow: 1,
      center: true,
    },
    {
      name: "Stato Attuale",
      selector: (row) => row.statoAttuale || "N/A",
      sortable: true,
      grow: 1,
      center: true,
      cell: (row) => (
        <span
          className={`current-status ${(row.statoAttuale || "").toLowerCase()}`}
        >
          {row.statoAttuale === "AL_LAVORO"
            ? "Al Lavoro"
            : row.statoAttuale === "NON_AL_LAVORO"
            ? "Non al Lavoro"
            : "N/A"}
        </span>
      ),
    },
  ];

  const getActiveEmployeesCount = () => {
    const uniqueEmployees = {};
    timbrature.forEach((t) => {
      const empId = t.dipendente.idPersona;
      if (
        !uniqueEmployees[empId] ||
        new Date(t.timestamp) > new Date(uniqueEmployees[empId].timestamp)
      ) {
        uniqueEmployees[empId] = t;
      }
    });

    return Object.values(uniqueEmployees).filter((t) => t.tipo === "ENTRATA")
      .length;
  };

  const getTotalPunchesToday = () => {
    return timbrature.length;
  };

  return (
    <div className="timbrature-monitor">
      <div className="monitor-header">
        <h1>Monitoraggio Timbrature</h1>
        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-value">{getActiveEmployeesCount()}</div>
            <div className="stat-label">Dipendenti Presenti</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{getTotalPunchesToday()}</div>
            <div className="stat-label">Timbrature Totali</div>
          </div>
        </div>
      </div>

      <div className="filters-section">
        <div className="filter-group">
          <label>Data:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="date-input"
          />
        </div>

        <div className="filter-group">
          <label>Stato:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="status-select"
          >
            <option value="TUTTI">Tutti</option>
            <option value="AL_LAVORO">Al Lavoro</option>
            <option value="NON_AL_LAVORO">Non al Lavoro</option>
          </select>
        </div>

        <button onClick={fetchTimbrature} className="refresh-btn">
          🔄 Aggiorna
        </button>
      </div>

      <div className="table-container">
        {loading ? (
          <div className="loading">Caricamento timbrature...</div>
        ) : (
          <DataTable
            columns={columns}
            data={timbrature}
            pagination
            responsive
            highlightOnHover
            striped
            noDataComponent="Nessuna timbratura trovata per la data selezionata"
            paginationPerPage={15}
            paginationRowsPerPageOptions={[15, 30, 50]}
          />
        )}
      </div>
    </div>
  );
};

export default TimbratureMonitor;
