import React, { useState } from "react";
import "../styles/activevisit.css";
import DataTable from "react-data-table-component";
import { useEffect } from "react";
import { apiCall } from "../utils/apiUtils";

const ActiveVisits = () => {
  const [dateFilter, setDateFilter] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const columns = [
    {
      name: "Data Inizio",
      selector: (row) => new Date(row.dataInizio).toLocaleDateString("it-IT"),
      sortable: true,
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

        const response = await apiCall(
          "http://localhost:8080/api/visite/attive",
          {
            method: "GET",
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
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
  // Filtra i dati in base alla data selezionata
  const filteredData = dateFilter
    ? data.filter((row) => {
        const rowDate = new Date(row.dataInizio);
        const filterDate = new Date(dateFilter);
        return rowDate.toDateString() === filterDate.toDateString();
      })
    : data;

  const handleDateChange = (e) => {
    setDateFilter(e.target.value);
  };

  return (
    <div className="active-visit">
      <div className="active-top">
        <h1>Visite Attive</h1>
        <div className="active-filter-box">
          <div className="filters-date">
            <div className="filter-date-text">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M2 4.66663H4"
                  stroke="#7F7F7F"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M2 11.3334H6"
                  stroke="#7F7F7F"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M12 11.3334H14"
                  stroke="#7F7F7F"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M10 4.66663H14"
                  stroke="#7F7F7F"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M4 4.66663C4 4.04537 4 3.73475 4.10149 3.48971C4.23682 3.16301 4.49639 2.90345 4.82309 2.76812C5.06812 2.66663 5.37875 2.66663 6 2.66663C6.62125 2.66663 6.93187 2.66663 7.17693 2.76812C7.5036 2.90345 7.7632 3.16301 7.89853 3.48971C8 3.73475 8 4.04537 8 4.66663C8 5.28788 8 5.59851 7.89853 5.84354C7.7632 6.17024 7.5036 6.42981 7.17693 6.56513C6.93187 6.66663 6.62125 6.66663 6 6.66663C5.37875 6.66663 5.06812 6.66663 4.82309 6.56513C4.49639 6.42981 4.23682 6.17024 4.10149 5.84354C4 5.59851 4 5.28788 4 4.66663Z"
                  stroke="#7F7F7F"
                />
                <path
                  d="M8 11.3334C8 10.7121 8 10.4015 8.10147 10.1564C8.2368 9.82977 8.4964 9.57017 8.82307 9.43484C9.06813 9.33337 9.37873 9.33337 10 9.33337C10.6213 9.33337 10.9319 9.33337 11.1769 9.43484C11.5036 9.57017 11.7632 9.82977 11.8985 10.1564C12 10.4015 12 10.7121 12 11.3334C12 11.9546 12 12.2652 11.8985 12.5103C11.7632 12.837 11.5036 13.0966 11.1769 13.2319C10.9319 13.3334 10.6213 13.3334 10 13.3334C9.37873 13.3334 9.06813 13.3334 8.82307 13.2319C8.4964 13.0966 8.2368 12.837 8.10147 12.5103C8 12.2652 8 11.9546 8 11.3334Z"
                  stroke="#7F7F7F"
                />
              </svg>
              <p>Filtra per data</p>
            </div>{" "}
            <input
              type="date"
              className="input-filter-date"
              placeholder="gg/mm/aaaa"
              value={dateFilter}
              onChange={handleDateChange}
            />
          </div>
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
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333Z"
                stroke="#7F7F7F"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <p>Risultati mostrati: {filteredData.length}</p>
          </div>
        </div>
      </div>{" "}
      <DataTable
        columns={columns}
        data={filteredData}
        pagination
        responsive
        highlightOnHover
        progressPending={loading}
      />
    </div>
  );
};

export default ActiveVisits;
