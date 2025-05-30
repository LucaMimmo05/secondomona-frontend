import React from "react";
import "../styles/employee.css";
import "../styles/datatable-common.css";
import DataTable from "react-data-table-component";
import { useEffect } from "react";
import { apiCall } from "../utils/apiUtils";
import { useTokenRefresh } from "../hooks/useTokenRefresh";
import { toast } from "react-toastify";
import { showSuccess, showError } from "../utils/toastConfig";

const Employee = () => {
  // Initialize token refresh hook
  useTokenRefresh();

  const [data, setData] = React.useState([]);
  const [filteredData, setFilteredData] = React.useState([]);
  const [filters, setFilters] = React.useState({
    nome: "",
    cognome: "",
    diminutivo: "",
    email: "",
    ruolo: "",
    idRuna: "",
  });
  const [loading, setLoading] = React.useState(true);
  const columns = [
    {
      name: "ID",
      selector: (row) => row.idPersona,
      sortable: true,
      grow: 1,
      center: true,
    },
    {
      name: "Nome",
      selector: (row) => row.nome,
      sortable: true,
      grow: 2,
      center: true,
    },
    {
      name: "Cognome",
      selector: (row) => row.cognome,
      sortable: true,
      grow: 2,
      center: true,
    },
    {
      name: "Diminutivo",
      selector: (row) => row.diminutivo,
      sortable: true,
      grow: 1.5,
      center: true,
    },
    {
      name: "ID Runa",
      selector: (row) => row.idRuna,
      sortable: true,
      grow: 1,
      center: true,
    },
    {
      name: "Email",
      selector: (row) => row.mail || "N/A",
      sortable: true,
      grow: 3,
      center: true,
    },
    {
      name: "Ruolo",
      selector: (row) => row.ruolo || "N/A",
      sortable: true,
      grow: 2,
      center: true,
    },
  ]; // Apply filters to data
  useEffect(() => {
    let filtered = [...data];

    // Apply text filters
    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        filtered = filtered.filter((employee) => {
          const value = employee[key === "email" ? "mail" : key];
          return (
            value &&
            value.toString().toLowerCase().includes(filters[key].toLowerCase())
          );
        });
      }
    });

    setFilteredData(filtered);
  }, [data, filters]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      nome: "",
      cognome: "",
      diminutivo: "",
      email: "",
      ruolo: "",
      idRuna: "",
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await apiCall("/api/dipendenti");
        console.log("Fetched data:", data);
        setData(data);
        setFilteredData(data);
        showSuccess(`Caricati ${data.length} dipendenti`);
      } catch (error) {
        console.error("Fetch error:", error);
        showError("Errore nel caricamento dei dipendenti");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  return (
    <div className="employee">
      <h1>Dipendenti</h1>

      <div className="employee-filter-box">
        <div className="filter-controls">
          <div className="filter-row">
            <div className="filter-group">
              <label>Nome:</label>
              <input
                type="text"
                placeholder="Cerca per nome..."
                value={filters.nome}
                onChange={(e) => handleFilterChange("nome", e.target.value)}
                className="filter-input"
              />
            </div>
            <div className="filter-group">
              <label>Cognome:</label>
              <input
                type="text"
                placeholder="Cerca per cognome..."
                value={filters.cognome}
                onChange={(e) => handleFilterChange("cognome", e.target.value)}
                className="filter-input"
              />
            </div>
            <div className="filter-group">
              <label>Diminutivo:</label>
              <input
                type="text"
                placeholder="Cerca per diminutivo..."
                value={filters.diminutivo}
                onChange={(e) =>
                  handleFilterChange("diminutivo", e.target.value)
                }
                className="filter-input"
              />
            </div>
          </div>

          <div className="filter-row">
            <div className="filter-group">
              <label>Email:</label>
              <input
                type="text"
                placeholder="Cerca per email..."
                value={filters.email}
                onChange={(e) => handleFilterChange("email", e.target.value)}
                className="filter-input"
              />
            </div>
            <div className="filter-group">
              <label>Ruolo:</label>
              <input
                type="text"
                placeholder="Cerca per ruolo..."
                value={filters.ruolo}
                onChange={(e) => handleFilterChange("ruolo", e.target.value)}
                className="filter-input"
              />
            </div>
            <div className="filter-group">
              <label>ID Runa:</label>
              <input
                type="text"
                placeholder="Cerca per ID Runa..."
                value={filters.idRuna}
                onChange={(e) => handleFilterChange("idRuna", e.target.value)}
                className="filter-input"
              />
            </div>
          </div>

          <div className="filter-actions">
            <button
              onClick={clearFilters}
              className="clear-filters-btn"
              disabled={Object.values(filters).every((filter) => !filter)}
            >
              Cancella Filtri
            </button>
          </div>
        </div>

        <div className="filter-results">
          <p>
            Mostrati {filteredData.length} di {data.length} dipendenti
            {filteredData.length !== data.length && " (filtrati)"}
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredData}
        pagination
        responsive
        highlightOnHover
        progressPending={loading}
        progressComponent={
          <div className="loading-spinner">Caricamento...</div>
        }
        noDataComponent={
          <div className="no-data">
            {data.length === 0
              ? "Nessun dipendente trovato"
              : "Nessun dipendente corrisponde ai filtri"}
          </div>
        }
      />
    </div>
  );
};

export default Employee;
