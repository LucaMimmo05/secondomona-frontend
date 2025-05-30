import React, { useState } from "react";
import "../styles/activevisit.css";
import DataTable from "react-data-table-component";
import { useEffect } from "react";
import { apiCall } from "../utils/apiUtils";

const ActiveVisits = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const columns = [
    {
      name: "Data Inizio",
      selector: (row) => new Date(row.dataInizio).toLocaleDateString("it-IT"),
      sortable: true,
      width: "110px",
      cell: (row) => (
        <div title={new Date(row.dataInizio).toLocaleDateString("it-IT")}>
          {new Date(row.dataInizio).toLocaleDateString("it-IT")}
        </div>
      ),
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
      cell: (row) => (
        <div
          title={new Date(row.dataInizio).toLocaleTimeString("it-IT", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        >
          {new Date(row.dataInizio).toLocaleTimeString("it-IT", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      ),
    },
    {
      name: "Data Fine",
      selector: (row) => new Date(row.dataFine).toLocaleDateString("it-IT"),
      sortable: true,
      width: "110px",
      cell: (row) => (
        <div title={new Date(row.dataFine).toLocaleDateString("it-IT")}>
          {new Date(row.dataFine).toLocaleDateString("it-IT")}
        </div>
      ),
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
      cell: (row) => (
        <div
          title={new Date(row.dataFine).toLocaleTimeString("it-IT", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        >
          {new Date(row.dataFine).toLocaleTimeString("it-IT", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      ),
    },
    {
      name: "Motivo",
      selector: (row) => row.motivoVisita || "N/A",
      sortable: true,
      width: "150px",
      grow: 1,
      cell: (row) => (
        <div title={row.motivoVisita || "N/A"}>{row.motivoVisita || "N/A"}</div>
      ),
    },
    {
      name: "Visitatore",
      selector: (row) =>
        row.visitatore
          ? `${row.visitatore.nome} ${row.visitatore.cognome}`
          : "N/A",
      sortable: true,
      width: "150px",
      grow: 1,
      cell: (row) => {
        const fullName = row.visitatore
          ? `${row.visitatore.nome} ${row.visitatore.cognome}`
          : "N/A";
        return <div title={fullName}>{fullName}</div>;
      },
    },
    {
      name: "Richiedente",
      selector: (row) =>
        row.richiedente
          ? `${row.richiedente.nome} ${row.richiedente.cognome}`
          : "N/A",
      sortable: true,
      width: "150px",
      grow: 1,
      cell: (row) => {
        const fullName = row.richiedente
          ? `${row.richiedente.nome} ${row.richiedente.cognome}`
          : "N/A";
        return <div title={fullName}>{fullName}</div>;
      },
    },
    {
      name: "DPI",
      selector: (row) => (row.flagRichiestaDPI ? "Sì" : "No"),
      sortable: true,
      width: "80px",
      cell: (row) => (
        <div title={row.flagRichiestaDPI ? "Sì" : "No"}>
          {row.flagRichiestaDPI ? "Sì" : "No"}
        </div>
      ),
    },
    {
      name: "Automezzo",
      selector: (row) => (row.flagAccessoAutomezzo ? "Sì" : "No"),
      sortable: true,
      width: "100px",
      cell: (row) => (
        <div title={row.flagAccessoAutomezzo ? "Sì" : "No"}>
          {row.flagAccessoAutomezzo ? "Sì" : "No"}
        </div>
      ),
    },
  ];
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const result = await apiCall("/api/visite/attive", {
          method: "GET",
        });

        console.log("Dati visite attive:", result);
        setData(result);
      } catch (error) {
        console.error("Errore durante il recupero dei dati:", error);
        // L'apiCall gestisce automaticamente logout per token scaduti
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="active-visit">
      {" "}
      <div className="active-top">
        <h1>Visite Attive</h1>
        <div className="filter-results">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M11.3334 11.3334L14 14"
              stroke="#7F7F7F"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333Z"
              stroke="#7F7F7F"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p>Risultati mostrati: {data.length}</p>
        </div>
      </div>{" "}
      <DataTable
        columns={columns}
        data={data}
        pagination
        responsive
        highlightOnHover
        progressPending={loading}
      />
    </div>
  );
};

export default ActiveVisits;
