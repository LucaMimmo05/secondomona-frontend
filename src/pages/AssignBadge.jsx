import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import "../styles/assignbadge.css";
import "../styles/datatable-common.css";
import { apiCall } from "../utils/apiUtils";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTokenRefresh } from "../hooks/useTokenRefresh";
import UpdateIcon from "../assets/update.tsx";

const AssignBadge = () => {
  // Initialize token refresh hook
  useTokenRefresh();
  const [activeTab, setActiveTab] = useState("assign"); // "assign" or "manage"
  const [visitsData, setVisitsData] = useState([]);
  const [badgeAssignments, setBadgeAssignments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [availableBadges, setAvailableBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [selectedBadge, setSelectedBadge] = useState("");
  const [showPersonBadgesModal, setShowPersonBadgesModal] = useState(false);
  const [personBadges, setPersonBadges] = useState([]);
  const [selectedPersonForView, setSelectedPersonForView] = useState(null);

  const navigate = useNavigate(); // Fetch all data when component mounts or tab changes
  useEffect(() => {
    if (activeTab === "assign") {
      fetchVisitsAndEmployees();
    } else {
      fetchBadgeAssignments();
    }
  }, [activeTab]);
  // Fetch visits waiting for badge assignment
  const fetchVisitsAndEmployees = async () => {
    setLoading(true);
    try {
      const [visitsResponse, employeesResponse] = await Promise.all([
        apiCall("/api/visite/in-attesa"),
        apiCall("/api/dipendenti"), // Updated endpoint for employees
      ]);

      setVisitsData(visitsResponse || []);
      setEmployees(employeesResponse || []);
    } catch (error) {
      console.error("Errore nel caricamento dati:", error);
      toast.error("Errore nel caricamento dei dati");
    } finally {
      setLoading(false);
    }
  };

  // Fetch all badge assignments
  const fetchBadgeAssignments = async () => {
    setLoading(true);
    try {
      const response = await apiCall("/api/badge");
      setBadgeAssignments(response || []);
    } catch (error) {
      console.error("Errore nel caricamento assegnazioni badge:", error);
      toast.error("Errore nel caricamento delle assegnazioni badge");
    } finally {
      setLoading(false);
    }
  };

  // Fetch badge assignments for a specific person
  const fetchPersonBadges = async (personId) => {
    try {
      setLoading(true);
      const response = await apiCall(`/api/badge/persona/${personId}`);
      setPersonBadges(response || []);
      setShowPersonBadgesModal(true);
    } catch (error) {
      console.error("Errore nel caricamento badge persona:", error);
      toast.error("Errore nel caricamento dei badge della persona");
    } finally {
      setLoading(false);
    }
  };

  // Generate unique badge code
  const generateBadgeCode = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    return `BDG${timestamp.toString().slice(-6)}${random}`;
  };
  // Assign badge to visitor from visit request
  const handleAssignToVisitor = async (row) => {
    try {
      setLoadingId(row.idRichiesta);

      // Validate visitor data
      if (!row.visitatore?.id && !row.visitatore?.idPersona) {
        toast.error("ID visitatore non disponibile");
        return;
      }

      const badgeCode = generateBadgeCode();
      const payload = {
        idPersona: row.visitatore?.id || row.visitatore?.idPersona,
        codiceBadge: badgeCode,
        dataInizio: new Date().toISOString(),
        tipoAssegnazione: "VISITATORE",
        note: `Assegnato per visita del ${new Date(
          row.dataInizio
        ).toLocaleDateString("it-IT")}`,
      };

      console.log("Assegnazione badge payload:", payload);

      const response = await apiCall("/api/badge/assegna", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      toast.success(
        `Badge ${badgeCode} assegnato a ${row.visitatore?.nome} ${row.visitatore?.cognome}`
      );

      // Remove from visits list
      setVisitsData((prev) =>
        prev.filter((item) => item.idRichiesta !== row.idRichiesta)
      );
    } catch (error) {
      console.error("Errore nell'assegnazione badge:", error);
      const errorMessage =
        error.message || "Errore durante l'assegnazione del badge";
      toast.error(errorMessage);
    } finally {
      setLoadingId(null);
    }
  };
  // Assign badge through modal
  const handleAssignBadge = async () => {
    if (!selectedPerson || !selectedBadge.trim()) {
      toast.error("Seleziona una persona e inserisci un codice badge");
      return;
    }

    try {
      // Validate badge code format (optional - adjust based on your requirements)
      if (selectedBadge.length < 3) {
        toast.error("Il codice badge deve essere di almeno 3 caratteri");
        return;
      }

      const payload = {
        idPersona: selectedPerson.id || selectedPerson.idPersona,
        codiceBadge: selectedBadge.trim().toUpperCase(),
        dataInizio: new Date().toISOString(),
        tipoAssegnazione:
          selectedPerson.tipo ||
          (selectedPerson.ruolo ? "DIPENDENTE" : "VISITATORE"),
        note: `Assegnazione manuale del ${new Date().toLocaleDateString(
          "it-IT"
        )}`,
      };

      console.log("Assegnazione manuale badge payload:", payload);

      await apiCall("/api/badge/assegna", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      toast.success(
        `Badge ${selectedBadge} assegnato a ${selectedPerson.nome} ${selectedPerson.cognome}`
      );
      setShowAssignModal(false);
      setSelectedPerson(null);
      setSelectedBadge("");

      if (activeTab === "manage") {
        fetchBadgeAssignments();
      }
    } catch (error) {
      console.error("Errore nell'assegnazione badge:", error);
      const errorMessage =
        error.message || "Errore durante l'assegnazione del badge";
      toast.error(errorMessage);
    }
  };

  // Open modal with auto-generated badge code
  const openAssignModal = () => {
    setSelectedBadge(generateBadgeCode());
    setShowAssignModal(true);
  };
  // Terminate badge assignment
  const handleTerminateBadge = async (assignmentId) => {
    if (
      !window.confirm(
        "Sei sicuro di voler terminare questa assegnazione badge?"
      )
    ) {
      return;
    }

    try {
      setLoadingId(assignmentId);

      await apiCall(`/api/badge/termina/${assignmentId}`, {
        method: "PUT",
      });

      toast.success("Assegnazione badge terminata con successo");
      fetchBadgeAssignments();
    } catch (error) {
      console.error("Errore nella terminazione badge:", error);
      const errorMessage =
        error.message || "Errore durante la terminazione del badge";
      toast.error(errorMessage);
    } finally {
      setLoadingId(null);
    }
  };

  // Get badge assignment by ID
  const getBadgeAssignmentById = async (assignmentId) => {
    try {
      const response = await apiCall(`/api/badge/${assignmentId}`);
      return response;
    } catch (error) {
      console.error("Errore nel recupero assegnazione badge:", error);
      toast.error("Errore nel recupero dei dettagli dell'assegnazione");
      return null;
    }
  };

  // Refresh data
  const handleRefresh = () => {
    if (activeTab === "assign") {
      fetchVisitsAndEmployees();
    } else {
      fetchBadgeAssignments();
    }
    toast.info("Dati aggiornati");
  };

  // Filter functions
  const filteredVisits = visitsData.filter((visit) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    const visitorName = `${visit.visitatore?.nome || ""} ${
      visit.visitatore?.cognome || ""
    }`.toLowerCase();
    const requesterName = `${visit.richiedente?.nome || ""} ${
      visit.richiedente?.cognome || ""
    }`.toLowerCase();
    return (
      visitorName.includes(searchLower) || requesterName.includes(searchLower)
    );
  });

  const filteredAssignments = badgeAssignments.filter((assignment) => {
    let matches = true;

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const personName = `${assignment.persona?.nome || ""} ${
        assignment.persona?.cognome || ""
      }`.toLowerCase();
      const badgeCode = (assignment.codiceBadge || "").toLowerCase();
      matches =
        personName.includes(searchLower) || badgeCode.includes(searchLower);
    }

    if (filterStatus !== "ALL") {
      matches = matches && assignment.stato === filterStatus;
    }

    return matches;
  });
  // Columns for visits waiting for badge assignment
  const visitsColumns = [
    {
      name: "Data",
      selector: (row) => new Date(row.dataInizio).toLocaleDateString("it-IT"),
      sortable: true,
      width: "120px",
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
    },
    {
      name: "Stato",
      selector: (row) => row.stato || "IN ATTESA",
      sortable: true,
      width: "120px",
      cell: (row) => (
        <span
          className={`status-badge ${(row.stato || "in-attesa")
            .toLowerCase()
            .replace("_", "-")}`}
        >
          {row.stato || "IN ATTESA"}
        </span>
      ),
    },
    {
      name: "Ospite",
      selector: (row) =>
        row.visitatore
          ? `${row.visitatore.nome} ${row.visitatore.cognome}`
          : "N/A",
      sortable: true,
      grow: 1,
    },
    {
      name: "Dipendente",
      selector: (row) =>
        row.richiedente
          ? `${row.richiedente.nome} ${row.richiedente.cognome}`
          : "N/A",
      sortable: true,
      grow: 1,
    },
    {
      name: "Assegna Badge",
      cell: (row) => (
        <button
          className="badge-flag-button assign-btn"
          onClick={() => handleAssignToVisitor(row)}
          disabled={loadingId === row.idRichiesta}
          title="Assegna badge"
        >
          {" "}
          {loadingId === row.idRichiesta ? (
            <UpdateIcon className="loading-icon" />
          ) : (
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
          )}
        </button>
      ),
      width: "140px",
    },
  ];
  // Columns for badge assignments management
  const assignmentsColumns = [
    {
      name: "Badge",
      selector: (row) => row.codiceBadge || "N/A",
      sortable: true,
      width: "120px",
      cell: (row) => (
        <span className="badge-code">{row.codiceBadge || "N/A"}</span>
      ),
    },
    {
      name: "Persona",
      selector: (row) =>
        row.persona ? `${row.persona.nome} ${row.persona.cognome}` : "N/A",
      sortable: true,
      grow: 1,
      cell: (row) => (
        <div className="person-cell">
          <span className="person-name">
            {row.persona ? `${row.persona.nome} ${row.persona.cognome}` : "N/A"}
          </span>
          {row.persona && (
            <button
              className="view-badges-btn"
              onClick={() => {
                setSelectedPersonForView(row.persona);
                fetchPersonBadges(row.persona.id || row.persona.idPersona);
              }}
              title="Visualizza tutti i badge di questa persona"
            >
              👁️
            </button>
          )}
        </div>
      ),
    },
    {
      name: "Tipo",
      selector: (row) => row.tipoAssegnazione || "N/A",
      sortable: true,
      width: "120px",
      cell: (row) => (
        <span
          className={`type-badge ${(row.tipoAssegnazione || "").toLowerCase()}`}
        >
          {row.tipoAssegnazione || "N/A"}
        </span>
      ),
    },
    {
      name: "Data Inizio",
      selector: (row) =>
        row.dataInizio
          ? new Date(row.dataInizio).toLocaleDateString("it-IT")
          : "N/A",
      sortable: true,
      width: "120px",
    },
    {
      name: "Data Fine",
      selector: (row) =>
        row.dataFine
          ? new Date(row.dataFine).toLocaleDateString("it-IT")
          : "Attivo",
      sortable: true,
      width: "120px",
      cell: (row) => (
        <span className={`date-cell ${row.dataFine ? "terminated" : "active"}`}>
          {row.dataFine
            ? new Date(row.dataFine).toLocaleDateString("it-IT")
            : "Attivo"}
        </span>
      ),
    },
    {
      name: "Stato",
      selector: (row) => row.stato || "ATTIVO",
      sortable: true,
      width: "100px",
      cell: (row) => (
        <span
          className={`status-badge ${(row.stato || "attivo").toLowerCase()}`}
        >
          {row.stato || "ATTIVO"}
        </span>
      ),
    },
    {
      name: "Azioni",
      cell: (row) => (
        <div className="action-buttons">
          {!row.dataFine && row.stato !== "TERMINATO" && (
            <button
              className="terminate-btn"
              onClick={() => handleTerminateBadge(row.id)}
              disabled={loadingId === row.id}
              title="Termina assegnazione"
            >
              {" "}
              {loadingId === row.id ? (
                <UpdateIcon className="loading-icon" />
              ) : (
                "Termina"
              )}
            </button>
          )}
        </div>
      ),
      width: "100px",
    },
  ];
  return (
    <div className="assign-badge-container">
      <div className="assign-badge-header">
        <h1>Gestione Badge</h1>

        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button
            className={`tab-btn ${activeTab === "assign" ? "active" : ""}`}
            onClick={() => setActiveTab("assign")}
          >
            Assegna Badge
          </button>
          <button
            className={`tab-btn ${activeTab === "manage" ? "active" : ""}`}
            onClick={() => setActiveTab("manage")}
          >
            Gestisci Assegnazioni
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="filters-section">
        <div className="search-group">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={
              activeTab === "assign"
                ? "Cerca visitatore o dipendente..."
                : "Cerca persona o badge..."
            }
            className="search-input"
          />
        </div>
        {activeTab === "manage" && (
          <div className="filter-group">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="status-select"
            >
              <option value="ALL">Tutti gli stati</option>
              <option value="ATTIVO">Attivi</option>
              <option value="TERMINATO">Terminati</option>
              <option value="SCADUTO">Scaduti</option>
            </select>
          </div>
        )}{" "}
        <button
          className="refresh-btn"
          onClick={handleRefresh}
          title="Aggiorna dati"
        >
          <UpdateIcon />
        </button>
        <div className="results-info">
          {activeTab === "assign"
            ? `${filteredVisits.length} visite in attesa`
            : `${filteredAssignments.length} assegnazioni`}
        </div>
      </div>

      {/* Data Table */}
      <div className="table-container">
        <DataTable
          columns={activeTab === "assign" ? visitsColumns : assignmentsColumns}
          data={activeTab === "assign" ? filteredVisits : filteredAssignments}
          pagination
          responsive
          highlightOnHover
          striped
          progressPending={loading}
          noDataComponent={
            activeTab === "assign"
              ? "Nessuna visita in attesa di badge"
              : "Nessuna assegnazione badge trovata"
          }
          paginationPerPage={15}
          paginationRowsPerPageOptions={[15, 30, 50]}
        />
      </div>

      {/* Assignment Modal */}
      {showAssignModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Nuova Assegnazione Badge</h3>
              <button
                className="close-btn"
                onClick={() => setShowAssignModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Seleziona Persona:</label>
                <select
                  value={selectedPerson?.id || ""}
                  onChange={(e) => {
                    const person = [
                      ...employees,
                      ...visitsData.map((v) => v.visitatore),
                    ].find((p) => p.id == e.target.value);
                    setSelectedPerson(person);
                  }}
                  className="form-select"
                >
                  <option value="">-- Seleziona una persona --</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.nome} {emp.cognome} (Dipendente)
                    </option>
                  ))}
                  {visitsData.map(
                    (visit) =>
                      visit.visitatore && (
                        <option
                          key={`visitor-${visit.visitatore.id}`}
                          value={visit.visitatore.id}
                        >
                          {visit.visitatore.nome} {visit.visitatore.cognome}{" "}
                          (Visitatore)
                        </option>
                      )
                  )}
                </select>
              </div>

              <div className="form-group">
                <label>Codice Badge:</label>
                <input
                  type="text"
                  value={selectedBadge}
                  onChange={(e) => setSelectedBadge(e.target.value)}
                  placeholder="Inserisci codice badge"
                  className="form-input"
                />
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowAssignModal(false)}
              >
                Annulla
              </button>
              <button
                className="confirm-btn"
                onClick={handleAssignBadge}
                disabled={!selectedPerson || !selectedBadge}
              >
                Assegna Badge
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Person Badges Modal */}
      {showPersonBadgesModal && (
        <div className="modal-overlay">
          <div className="modal-content large-modal">
            <div className="modal-header">
              <h3>
                Badge di {selectedPersonForView?.nome}{" "}
                {selectedPersonForView?.cognome}
              </h3>
              <button
                className="close-btn"
                onClick={() => {
                  setShowPersonBadgesModal(false);
                  setPersonBadges([]);
                  setSelectedPersonForView(null);
                }}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              {loading ? (
                <div className="loading-container">
                  <span>Caricamento badge...</span>
                </div>
              ) : personBadges.length > 0 ? (
                <div className="badges-list">
                  {personBadges.map((badge, index) => (
                    <div key={badge.id || index} className="badge-item">
                      <div className="badge-info">
                        <span className="badge-code">{badge.codiceBadge}</span>
                        <span
                          className={`badge-status ${(
                            badge.stato || "attivo"
                          ).toLowerCase()}`}
                        >
                          {badge.stato || "ATTIVO"}
                        </span>
                      </div>
                      <div className="badge-details">
                        <div>
                          <strong>Tipo:</strong>{" "}
                          {badge.tipoAssegnazione || "N/A"}
                        </div>
                        <div>
                          <strong>Data Inizio:</strong>{" "}
                          {badge.dataInizio
                            ? new Date(badge.dataInizio).toLocaleDateString(
                                "it-IT"
                              )
                            : "N/A"}
                        </div>
                        <div>
                          <strong>Data Fine:</strong>{" "}
                          {badge.dataFine
                            ? new Date(badge.dataFine).toLocaleDateString(
                                "it-IT"
                              )
                            : "Attivo"}
                        </div>
                        {badge.note && (
                          <div>
                            <strong>Note:</strong> {badge.note}
                          </div>
                        )}
                      </div>
                      {!badge.dataFine && badge.stato !== "TERMINATO" && (
                        <div className="badge-actions">
                          <button
                            className="terminate-btn small"
                            onClick={() => handleTerminateBadge(badge.id)}
                            disabled={loadingId === badge.id}
                          >
                            {" "}
                            {loadingId === badge.id ? (
                              <UpdateIcon className="loading-icon" />
                            ) : (
                              "Termina"
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-badges">
                  Nessun badge trovato per questa persona
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button
                className="close-btn-secondary"
                onClick={() => {
                  setShowPersonBadgesModal(false);
                  setPersonBadges([]);
                  setSelectedPersonForView(null);
                }}
              >
                Chiudi
              </button>
            </div>
          </div>
        </div>
      )}

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

export default AssignBadge;
