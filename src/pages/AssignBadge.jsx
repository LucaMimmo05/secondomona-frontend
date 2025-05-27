import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import "../styles/assignbadge.css";
import "../styles/datatable-common.css";

const AssignBadge = () => {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Recupera il token JWT da localStorage
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetch("http://localhost:8080/api/terminate", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Errore ${res.status}`);
        return res.json();
      })
      .then((payload) => {
        setVisits(payload);
        setError(null);
      })
      .catch((err) => {
        console.error("Errore nel recupero visite attive:", err);
        setError("Impossibile caricare le visite");
      })
      .finally(() => setLoading(false));
  }, [token, navigate]);

  // Gestisce il click su un badge (assegna badge alla visita)
  const handleAssignBadge = (visit) => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetch(`http://localhost:8080/api/assegna/badge/${visit.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.ok) {
          alert("Badge assegnato con successo!");
          // Aggiorna lista visite
          setVisits((prev) => prev.filter((v) => v.id !== visit.id));
        } else if (res.status === 401) {
          navigate("/login");
        } else {
          alert("Errore nell'assegnazione del badge");
        }
      })
      .catch((err) => {
        console.error("Errore durante il POST badge:", err);
        alert("Errore di connessione al server");
      });
  };

  const columns = [
    { name: "Data", selector: (row) => row.data, sortable: true, width: "120px" },
    { name: "Ora Inizio", selector: (row) => row.oraInizio, sortable: true, width: "100px" },
    { name: "Ora Fine", selector: (row) => row.oraFine, sortable: true, width: "100px" },
    { name: "Stato", selector: (row) => row.stato, sortable: true, width: "100px" },
    { name: "Ospite", selector: (row) => row.ospite, sortable: true, width: "150px" },
    { name: "Dipendente", selector: (row) => row.dipendente, sortable: true, width: "150px" },
    {
      name: "Assegna Badge",
      cell: (row) => (
        <button
          className="badge-flag-button"
          onClick={() => handleAssignBadge(row)}
          title="Assegna badge"
        >
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
        </button>
      ),
      width: "100px",
    },
  ];

  if (loading) return <div className="assign-badge-loading">Caricamento...</div>;
  if (error) return <div className="assign-badge-error">{error}</div>;

  return (
    <div className="assign-badge-container">
      <div className="assign-badge-header">
        <h1 className="assign-badge-title">Assegna Badge</h1>
      </div>
      <div className="filter-results">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M11.3334 11.3334L14 14" stroke="#7F7F7F" strokeLinecap="round" strokeLinejoin="round"/>
          <path
            d="M12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333Z"
            stroke="#7F7F7F"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <p>Visite Attive</p>
      </div>
      <div className="assign-badge-table-wrapper">
        <DataTable
          columns={columns}
          data={visits}
          pagination
          responsive
          highlightOnHover
          noDataComponent="Nessun record da mostrare"
        />
      </div>
    </div>
  );
};

export default AssignBadge;