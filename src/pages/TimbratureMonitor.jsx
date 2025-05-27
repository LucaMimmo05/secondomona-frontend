import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import "../styles/timbraturemonitor.css";

const TimbratureMonitor = () => {
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
  }, [timbrature, searchTerm]);
  const fetchTimbrature = async () => {
    setLoading(true);
    const token =
      localStorage.getItem("accessToken") ||
      localStorage.getItem("refreshToken");

    try {
      // Costruzione dell'URL con data in diversi formati
      const formattedDate = selectedDate.split("-").reverse().join("/"); // Converte da YYYY-MM-DD a DD/MM/YYYY

      // Proviamo diversi endpoint e formati per trovare quello corretto
      let urls = [
        // Endpoint specifico per data in vari formati
        `http://localhost:8080/api/timbrature/data/${selectedDate}`,
        `http://localhost:8080/api/timbrature/data/${formattedDate}`,
        // Parametri query con vari nomi
        `http://localhost:8080/api/timbrature?data=${selectedDate}`,
        `http://localhost:8080/api/timbrature?date=${selectedDate}`,
        `http://localhost:8080/api/timbrature?giorno=${formattedDate}`,
      ];

      // Se c'è anche un filtro di stato, aggiungiamolo a tutti gli URL
      if (filterStatus !== "TUTTI") {
        urls = urls.map((url) => {
          const separator = url.includes("?") ? "&" : "?";
          return `${url}${separator}status=${filterStatus}`;
        });
      }

      console.log("Tentativi URL:", urls);

      // Proviamo ogni URL fino a trovare quello che funziona
      let data = null;
      let successUrl = null;

      for (const url of urls) {
        try {
          console.log("Tentativo con URL:", url);
          const response = await fetch(url, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            // Aggiungiamo un timeout per non bloccarci troppo
            signal: AbortSignal.timeout(5000),
          });

          if (response.ok) {
            data = await response.json();
            successUrl = url;
            console.log("URL funzionante:", url);
            break;
          }
        } catch (error) {
          console.log("Errore con URL:", url, error.message);
          continue;
        }
      }

      if (data) {
        console.log("Dati timbrature ricevuti da:", successUrl, data);
        setTimbrature(data);
        setFilteredTimbrature(data);
      } else {
        // Se nessun URL ha funzionato, proviamo l'URL base senza filtri
        console.log("Nessun URL ha funzionato, provo URL base");
        const baseUrl = `http://localhost:8080/api/timbrature`;
        const response = await fetch(baseUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const baseData = await response.json();
          console.log("Dati ricevuti da URL base:", baseData);

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
        } else {
          console.error("Errore nel caricamento delle timbrature");
          setTimbrature([]);
          setFilteredTimbrature([]);
        }
      }
    } catch (error) {
      console.error("Errore nella fetch:", error);
      setTimbrature([]);
      setFilteredTimbrature([]);
    } finally {
      setLoading(false);
    }
  };

  const filterTimbrature = () => {
    if (!searchTerm.trim()) {
      setFilteredTimbrature(timbrature);
      return;
    }

    const searchTermLower = searchTerm.toLowerCase();
    const filtered = timbrature.filter((item) => {
      // Cerca nel nome/cognome del dipendente
      const fullName = getPersonName(item).toLowerCase();
      if (fullName.includes(searchTermLower)) return true;

      // Cerca nel codice tessera
      const cardCode = (item.codiceTessera || item.idTessera || "")
        .toString()
        .toLowerCase();
      if (cardCode.includes(searchTermLower)) return true;

      // Cerca nel tipo di timbratura
      const punchType = (item.tipoTimbratura || item.tipo || "").toLowerCase();
      if (punchType.includes(searchTermLower)) return true;

      return false;
    });

    setFilteredTimbrature(filtered);
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
      selector: (row) =>
        new Date(row.dataOraTimbratura || row.timestamp).toLocaleTimeString(
          "it-IT",
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        ),
      sortable: true,
      grow: 1,
      center: true,
    },
    {
      name: "Data",
      selector: (row) =>
        new Date(row.dataOraTimbratura || row.timestamp).toLocaleDateString(
          "it-IT"
        ),
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
    const uniqueEmployees = {};
    filteredTimbrature.forEach((t) => {
      // Utilizza l'idPersona dal JSON
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
        </div>

        <button onClick={fetchTimbrature} className="refresh-btn">
          🔄 Aggiorna
        </button>
      </div>{" "}
      <div className="table-container">
        {loading ? (
          <div className="loading">Caricamento timbrature...</div>
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
    </div>
  );
};

export default TimbratureMonitor;
