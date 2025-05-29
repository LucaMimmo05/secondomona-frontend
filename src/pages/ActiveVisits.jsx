import React, { useState } from "react";
import "../styles/activevisit.css";
import DataTable from "react-data-table-component";
import { useEffect } from "react";
import { apiCall } from "../utils/apiUtils";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ActiveVisits = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Funzione per concludere una visita
  const handleConcludiVisita = async (idVisita, visitatorName) => {
    if (
      !window.confirm(
        `Sei sicuro di voler concludere la visita di ${visitatorName}?`
      )
    ) {
      return;
    }

    try {
      await apiCall(`/api/visite/${idVisita}/conclusione`, {
        method: "PUT",
      });

      toast.success(`Visita di ${visitatorName} conclusa con successo!`);

      // Ricarica i dati dopo la conclusione
      fetchData();
    } catch (error) {
      console.error("Errore durante la conclusione della visita:", error);
      toast.error(
        `Errore nella conclusione della visita: ${
          error.message || "Errore sconosciuto"
        }`
      );
    }
  };

  // Funzione separata per caricare i dati
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
      toast.error("Errore durante il caricamento delle visite attive");
    } finally {
      setLoading(false);
    }
  };
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
    {
      name: "Azioni",
      width: "80px",
      center: true,
      cell: (row) => {
        const visitatorName = row.visitatore
          ? `${row.visitatore.nome} ${row.visitatore.cognome}`
          : "Visitatore";

        return (
          <button
            className="conclude-visit-btn"
            onClick={() => handleConcludiVisita(row.idRichiesta, visitatorName)}
            title={`Concludi visita di ${visitatorName}`}
          >
            ✕
          </button>
        );
      },
    },
  ];
  useEffect(() => {
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
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />
    </div>
  );
};

export default ActiveVisits;
