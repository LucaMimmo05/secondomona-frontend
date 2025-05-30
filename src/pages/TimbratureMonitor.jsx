import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import UpdateIcon from "../assets/update.tsx";
import "../styles/timbraturemonitor.css";
import { apiCall } from "../utils/apiUtils";
import { useTokenRefresh } from "../hooks/useTokenRefresh";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TimbratureMonitor = () => {
  // Initialize token refresh hook
  useTokenRefresh();

  const [timbrature, setTimbrature] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [isCustomDate, setIsCustomDate] = useState(false);
  const [filterStatus, setFilterStatus] = useState("TUTTI");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTimbrature, setFilteredTimbrature] = useState([]);

  useEffect(() => {
    fetchTimbrature();
  }, [selectedDate, filterStatus]);
  useEffect(() => {
    filterTimbrature();
  }, [timbrature, searchTerm, filterStatus]);
  const fetchTimbrature = async () => {
    setLoading(true);

    try {
      // Costruzione dell'URL con data in diversi formati
      const formattedDate = selectedDate.split("-").reverse().join("/"); // Converte da YYYY-MM-DD a DD/MM/YYYY

      // Proviamo diversi endpoint e formati per trovare quello corretto
      let endpoints = [
        // Endpoint specifico per data in vari formati
        `/api/timbrature/data/${selectedDate}`,
        `/api/timbrature/data/${formattedDate}`,
        // Parametri query con vari nomi
        `/api/timbrature?data=${selectedDate}`,
        `/api/timbrature?date=${selectedDate}`,
        `/api/timbrature?giorno=${formattedDate}`,
      ];

      // Se c'è anche un filtro di stato, aggiungiamolo a tutti gli endpoint
      if (filterStatus !== "TUTTI") {
        endpoints = endpoints.map((endpoint) => {
          const separator = endpoint.includes("?") ? "&" : "?";
          return `${endpoint}${separator}status=${filterStatus}`;
        });
      }

      console.log("Tentativi endpoint:", endpoints);

      // Proviamo ogni endpoint fino a trovare quello che funziona
      let data = null;
      let successEndpoint = null;

      for (const endpoint of endpoints) {
        try {
          console.log("Tentativo con endpoint:", endpoint);
          data = await apiCall(endpoint);
          successEndpoint = endpoint;
          console.log("Endpoint funzionante:", endpoint);
          break;
        } catch (error) {
          console.log("Errore con endpoint:", endpoint, error.message);
          continue;
        }
      }
      if (data) {
        console.log("Dati timbrature ricevuti da:", successEndpoint, data);
        console.log("Esempio prima timbratura:", data[0]);
        console.log(
          "Campi disponibili:",
          data[0] ? Object.keys(data[0]) : "Nessun dato"
        );
        setTimbrature(data);
        setFilteredTimbrature(data);
      } else {
        // Se nessun endpoint ha funzionato, proviamo l'endpoint base senza filtri
        console.log("Nessun endpoint ha funzionato, provo endpoint base");
        const baseData = await apiCall("/api/timbrature");
        console.log("Dati ricevuti da endpoint base:", baseData);

        // Filtriamo lato client per data
        const filteredByDate = baseData.filter((item) => {
          const itemDate = new Date(item.dataOraTimbratura || item.timestamp)
            .toISOString()
            .split("T")[0];
          return itemDate === selectedDate;
        });

        console.log("Dati filtrati per data lato client:", filteredByDate);
        setTimbrature(filteredByDate);
        setFilteredTimbrature(filteredByDate);
      }
    } catch (error) {
      console.error("Errore nel caricamento delle timbrature:", error);
      setTimbrature([]);
      setFilteredTimbrature([]);
    } finally {
      setLoading(false);
    }
  };
  const filterTimbrature = () => {
    let filtered = timbrature;

    // Filtro per termine di ricerca
    if (searchTerm.trim()) {
      const searchTermLower = searchTerm.toLowerCase();
      filtered = filtered.filter((item) => {
        // Cerca nel nome/cognome del dipendente
        const fullName = getPersonName(item).toLowerCase();
        if (fullName.includes(searchTermLower)) return true;

        // Cerca nel codice tessera
        const cardCode = (item.codiceTessera || item.idTessera || "")
          .toString()
          .toLowerCase();
        if (cardCode.includes(searchTermLower)) return true;

        // Cerca nel tipo di timbratura
        const punchType = (
          item.tipoTimbratura ||
          item.tipo ||
          ""
        ).toLowerCase();
        if (punchType.includes(searchTermLower)) return true;

        return false;
      });
    } // Filtro per status lavorativo
    if (filterStatus !== "TUTTI") {
      console.log("Applicando filtro status:", filterStatus);

      // Per prima cosa, ottieni l'ultima timbratura di ogni dipendente da TUTTI i dati (non solo quelli filtrati)
      const employeeLastPunch = {};
      timbrature.forEach((punch) => {
        const empId = punch.idPersona || punch.idTessera || punch.id;
        if (!empId) return;

        if (
          !employeeLastPunch[empId] ||
          new Date(punch.dataOraTimbratura || punch.timestamp) >
            new Date(
              employeeLastPunch[empId].dataOraTimbratura ||
                employeeLastPunch[empId].timestamp
            )
        ) {
          employeeLastPunch[empId] = punch;
        }
      });

      console.log("Ultima timbratura per dipendente:", employeeLastPunch); // Raccogli solo le ultime timbrature dei dipendenti che corrispondono al filtro
      const filteredLastPunches = [];

      if (filterStatus === "AL_LAVORO") {
        // Dipendenti la cui ultima timbratura è "ENTRATA"
        Object.values(employeeLastPunch).forEach((lastPunch) => {
          const lastPunchType = lastPunch.tipoTimbratura || lastPunch.tipo;
          if (lastPunchType === "ENTRATA") {
            filteredLastPunches.push(lastPunch);
          }
        });
        console.log(
          "Ultime timbrature dipendenti AL_LAVORO:",
          filteredLastPunches
        );
      } else if (filterStatus === "NON_AL_LAVORO") {
        // Dipendenti la cui ultima timbratura è "USCITA"
        Object.values(employeeLastPunch).forEach((lastPunch) => {
          const lastPunchType = lastPunch.tipoTimbratura || lastPunch.tipo;
          if (lastPunchType === "USCITA") {
            filteredLastPunches.push(lastPunch);
          }
        });
        console.log(
          "Ultime timbrature dipendenti NON_AL_LAVORO:",
          filteredLastPunches
        );
      }

      // Sostituisci completamente il filtered con solo le ultime timbrature
      const beforeFilter = filtered.length;
      filtered = filteredLastPunches;
      console.log(
        `Timbrature filtrate da ${beforeFilter} a ${filtered.length} (solo ultime timbrature)`
      );
    }

    setFilteredTimbrature(filtered);
  };
  // Funzione per scaricare il PDF delle presenze
  const downloadPresenzePdf = async () => {
    try {
      toast.info("Generazione PDF in corso...");

      const response = await fetch(
        "http://localhost:8080/api/sicurezza/presenze/pdf",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            Accept: "application/pdf",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Errore HTTP: ${response.status}`);
      }

      // Converti la risposta in blob
      const blob = await response.blob();

      // Crea un URL temporaneo per il blob
      const url = window.URL.createObjectURL(blob);

      // Crea un elemento <a> temporaneo per scaricare il file
      const link = document.createElement("a");
      link.href = url;

      // Estrai il nome del file dall'header Content-Disposition o usa un nome di default
      const contentDisposition = response.headers.get("Content-Disposition");
      let today = new Date();
      let dateString = today.toISOString().split("T")[0]; // formato YYYY-MM-DD
      let fileName = `Presenze_${dateString}.pdf`;

      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(
          /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
        );
        if (fileNameMatch && fileNameMatch[1]) {
          fileName = fileNameMatch[1].replace(/['"]/g, "");
        }
      }

      link.download = fileName;

      // Aggiungi il link al DOM, clicca e rimuovi
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Pulisci l'URL temporaneo
      window.URL.revokeObjectURL(url);

      toast.success("PDF scaricato con successo!");
    } catch (error) {
      console.error("Errore nel download del PDF:", error);
      toast.error(`Errore nel download del PDF: ${error.message}`);
    }
  };

  // Funzione helper per ottenere il nome della persona in modo consistente
  const getPersonName = (row) => {
    // Prima priorità: campi diretti nomeDipendente e cognomeDipendente
    if (row.nomeDipendente || row.cognomeDipendente) {
      return `${row.nomeDipendente || ""} ${
        row.cognomeDipendente || ""
      }`.trim();
    }

    // Seconda priorità: oggetto dipendente con nome e cognome
    if (row.dipendente && (row.dipendente.nome || row.dipendente.cognome)) {
      return `${row.dipendente.nome || ""} ${
        row.dipendente.cognome || ""
      }`.trim();
    }

    // Terza priorità: campi generici nome e cognome
    if (row.nome || row.cognome) {
      return `${row.nome || ""} ${row.cognome || ""}`.trim();
    }

    // Fallback: mostra ID
    const fallbackId = row.idPersona || row.idTessera || row.id || "N/A";
    return `Dipendente ${fallbackId}`;
  };
  const columns = [
    {
      name: "Dipendente/ Visitatore",
      selector: (row) => {
        // Prima priorità: campi diretti nomeDipendente e cognomeDipendente
        if (row.nomeDipendente || row.cognomeDipendente) {
          return `${row.nomeDipendente || ""} ${
            row.cognomeDipendente || ""
          }`.trim();
        }

        // Seconda priorità: oggetto dipendente con nome e cognome
        if (row.dipendente && (row.dipendente.nome || row.dipendente.cognome)) {
          return `${row.dipendente.nome || ""} ${
            row.dipendente.cognome || ""
          }`.trim();
        }

        // Terza priorità: campi generici nome e cognome
        if (row.nome || row.cognome) {
          return `${row.nome || ""} ${row.cognome || ""}`.trim();
        }

        // Fallback: mostra ID
        const fallbackId = row.idPersona || row.idTessera || row.id || "N/A";
        return `Dipendente ${fallbackId}`;
      },
      sortable: true,
      grow: 2,
      center: true,
    },
    {
      name: "Tipo",
      selector: (row) => row.tipoTimbratura || row.tipo,
      sortable: true,
      grow: 1,
      center: true,
      cell: (row) => (
        <span
          className={`status-badge ${(
            row.tipoTimbratura ||
            row.tipo ||
            ""
          ).toLowerCase()}`}
        >
          {row.tipoTimbratura || row.tipo}
        </span>
      ),
    },
    {
      name: "Orario",
      selector: (row) => {
        const date = new Date(row.dataOraTimbratura || row.timestamp);
        // Aggiungi 2 ore per compensare il fuso orario (UTC+2 per l'Italia)
        const correctedDate = new Date(date.getTime() + 2 * 60 * 60 * 1000);
        return correctedDate.toLocaleTimeString("it-IT", {
          hour: "2-digit",
          minute: "2-digit",
        });
      },
      sortable: true,
      grow: 1,
      center: true,
    },
    {
      name: "Data",
      selector: (row) => {
        const date = new Date(row.dataOraTimbratura || row.timestamp);
        // Aggiungi 2 ore per compensare il fuso orario (UTC+2 per l'Italia)
        const correctedDate = new Date(date.getTime() + 2 * 60 * 60 * 1000);
        return correctedDate.toLocaleDateString("it-IT");
      },
      sortable: true,
      grow: 1,
      center: true,
    },
    {
      name: "Tessera",
      selector: (row) => row.codiceTessera || `ID: ${row.idTessera || "N/A"}`,
      sortable: true,
      grow: 1,
      center: true,
    },
  ];
  const getActiveEmployeesCount = () => {
    // Raggruppa tutte le timbrature per dipendente per trovare l'ultima timbratura
    const uniqueEmployees = {};
    timbrature.forEach((t) => {
      const empId = t.idPersona || t.idTessera || t.id;

      if (
        empId &&
        (!uniqueEmployees[empId] ||
          new Date(t.dataOraTimbratura || t.timestamp) >
            new Date(
              uniqueEmployees[empId].dataOraTimbratura ||
                uniqueEmployees[empId].timestamp
            ))
      ) {
        uniqueEmployees[empId] = t;
      }
    });

    // Conta solo i dipendenti la cui ultima timbratura è "ENTRATA"
    return Object.values(uniqueEmployees).filter(
      (t) => (t.tipoTimbratura || t.tipo) === "ENTRATA"
    ).length;
  };

  const getTotalPunchesToday = () => {
    return filteredTimbrature.length;
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
      </div>{" "}
      <div className="filters-section">
        <div className="filter-group">
          <label>Data:</label>
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setIsCustomDate(true); // Imposta il flag quando l'utente seleziona una data
              }}
              className="date-input"
            />
            {isCustomDate && (
              <div
                style={{
                  marginLeft: "8px",
                  fontSize: "13px",
                  backgroundColor: "#e6f3ff",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  border: "1px solid #b3d7ff",
                  color: "#0066cc",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {new Date(selectedDate).toLocaleDateString("it-IT")}
                <button
                  onClick={() => {
                    // Imposta la data di oggi e resetta il flag della data personalizzata
                    const today = new Date().toISOString().split("T")[0];
                    setSelectedDate(today);
                    setIsCustomDate(false);
                    // Forza la chiamata API immediatamente
                    setTimeout(() => fetchTimbrature(), 10);
                  }}
                  style={{
                    marginLeft: "4px",
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    color: "#0066cc",
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                  title="Reimposta alla data odierna"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
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
        <div className="filter-group search-group">
          <label>Cerca:</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cerca dipendente, tessera..."
            className="search-input"
          />
        </div>{" "}
        <button
          onClick={fetchTimbrature}
          className="refresh-btn"
          title="Aggiorna"
        >
          <UpdateIcon />
        </button>
        <button onClick={downloadPresenzePdf} className="download-pdf-btn">
          Scarica PDF Presenze
        </button>
      </div>{" "}
      <div className="table-container">
        {loading ? (
          <div className="loading">
            <UpdateIcon className="loading-icon" />
            <span>Caricamento timbrature...</span>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filteredTimbrature}
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

export default TimbratureMonitor;
