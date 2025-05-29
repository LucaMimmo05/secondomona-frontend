import React, { useState, useEffect } from "react";
import "../styles/addvisit.css";
import { apiCall } from "../utils/apiUtils";
import { useTokenRefresh } from "../hooks/useTokenRefresh";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { showSuccess, showError } from "../utils/toastConfig";
import { useAuth } from "../context/AuthContext";

const AddVisit = () => {
  // Initialize token refresh hook
  useTokenRefresh();
  // Get the logged user ID from auth context
  const { userId } = useAuth();

  // Fallback per userId se il context non funziona
  const actualUserId = userId || localStorage.getItem("idPersona");

  console.log("🔍 User ID debug:", {
    contextUserId: userId,
    localStorageId: localStorage.getItem("idPersona"),
    actualUserId: actualUserId,
  });
  const [formData, setFormData] = useState({
    // IDs selezionati
    visitatoreId: "",
    // richiedenteId viene preso automaticamente dall'utente loggato

    // Dati Visita
    dataInizio: "",
    orarioInizio: "",
    dataFine: "",
    orarioFine: "",
    motivoVisita: "",

    // Flags (checkbox)
    flagAccessoAutomezzo: false,
    flagRichiestaDpi: false,

    // Materiale Informatico
    materialeInformatico: "",
  }); // Stati per le liste
  const [visitatori, setVisitatori] = useState([]);
  // Non serve più dipendenti perché il richiedente è automatico

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false); // Fetch dei dati all'avvio del componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch visitatori
        const visitatoriData = await apiCall("/api/visitatori");
        console.log("Visitatori:", visitatoriData);
        setVisitatori(visitatoriData);
      } catch (error) {
        console.error("Errore nel caricamento dei visitatori:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get today's date in YYYY-MM-DD format for min date validation
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🚀 Submit triggered");
    console.log("Form data:", formData);
    console.log("User ID:", actualUserId);
    console.log("Form element:", e.target);
    console.log("Form validity:", e.target.checkValidity());

    // Controllo esplicito della validità del form HTML5
    if (!e.target.checkValidity()) {
      console.log("❌ Form HTML5 validation failed");
      e.target.reportValidity();
      return;
    }

    setSubmitting(true);

    // Debug dettagliato dei dati del form
    console.log("📋 Dettagli form data:", {
      visitatoreId: formData.visitatoreId,
      dataInizio: formData.dataInizio,
      orarioInizio: formData.orarioInizio,
      dataFine: formData.dataFine,
      orarioFine: formData.orarioFine,
      userId: actualUserId,
    }); // Validazione base
    if (!formData.visitatoreId) {
      console.log("❌ Errore: visitatore non selezionato");
      showError("Seleziona un visitatore");
      setSubmitting(false);
      return;
    }

    // Verifica che l'ID visitatore sia un numero valido
    const visitatoreIdNum = parseInt(formData.visitatoreId);
    if (isNaN(visitatoreIdNum) || visitatoreIdNum <= 0) {
      console.log("❌ Errore: ID visitatore non valido");
      showError("ID visitatore non valido");
      setSubmitting(false);
      return;
    }
    if (!actualUserId) {
      console.log("❌ Errore: utente non autenticato");
      console.log("AuthContext userId:", userId);
      console.log("LocalStorage idPersona:", localStorage.getItem("idPersona"));
      showError("Errore: utente non autenticato");
      setSubmitting(false);
      return;
    }

    // Validazione campi obbligatori del form
    if (
      !formData.dataInizio ||
      !formData.orarioInizio ||
      !formData.dataFine ||
      !formData.orarioFine
    ) {
      console.log("❌ Errore: campi obbligatori mancanti");
      showError("Compila tutti i campi obbligatori (date e orari)");
      setSubmitting(false);
      return;
    }

    // Validazione date e orari
    const dataInizio = new Date(
      `${formData.dataInizio}T${formData.orarioInizio}`
    );
    const dataFine = new Date(`${formData.dataFine}T${formData.orarioFine}`);
    const now = new Date();

    console.log("📅 Date validation:", {
      dataInizio,
      dataFine,
      now,
      isDataInizioFutura: dataInizio > now,
      isDataFineSuccessiva: dataFine > dataInizio,
    });
    if (dataInizio <= now) {
      console.log("❌ Errore: data inizio non futura");
      showError("La data di inizio deve essere futura");
      setSubmitting(false);
      return;
    }

    // Se le date sono uguali, controlla che l'orario di fine sia successivo all'orario di inizio
    if (formData.dataInizio === formData.dataFine) {
      if (formData.orarioFine <= formData.orarioInizio) {
        console.log("❌ Errore: orario fine non successivo (stesso giorno)");
        showError(
          "L'orario di fine deve essere successivo all'orario di inizio"
        );
        setSubmitting(false);
        return;
      }
    } else if (dataFine < dataInizio) {
      // Se le date sono diverse, la data di fine deve essere successiva
      console.log("❌ Errore: data fine precedente alla data inizio");
      showError(
        "La data di fine deve essere uguale o successiva alla data di inizio"
      );
      setSubmitting(false);
      return;
    } // Combina data e orario in formato OffsetDateTime per il backend (ISO format with timezone Europe/Rome)
    const dataInizioOffsetDateTime = `${formData.dataInizio}T${formData.orarioInizio}:00+02:00`;
    const dataFineOffsetDateTime = `${formData.dataFine}T${formData.orarioFine}:00+02:00`;

    // Trova il visitatore selezionato per ottenere i dati completi
    const visitatoreSelezionato = visitatori.find(
      (v) => v.idPersona === visitatoreIdNum
    );
    if (!visitatoreSelezionato) {
      console.log("❌ Errore: visitatore non trovato nella lista");
      showError("Visitatore selezionato non trovato");
      setSubmitting(false);
      return;
    } // Per il richiedente, recuperiamo i dati completi dell'utente loggato
    let richiedenteData;
    try {
      console.log("🔄 Recupero dati richiedente...");
      richiedenteData = await apiCall(`/api/dipendenti/${actualUserId}`);
      console.log("✅ Dati richiedente recuperati:", richiedenteData);
    } catch (error) {
      console.error("❌ Errore nel recupero dati richiedente:", error);
      showError("Errore nel recupero dei dati del richiedente");
      setSubmitting(false);
      return;
    }

    // Preparo i dati da inviare al backend secondo la struttura corretta
    const visitData = {
      visitatore: {
        id: visitatoreSelezionato.idPersona,
        nome: visitatoreSelezionato.nome,
        cognome: visitatoreSelezionato.cognome,
        mail: visitatoreSelezionato.mail,
      },
      richiedente: {
        id: parseInt(actualUserId),
        nome: richiedenteData.nome,
        cognome: richiedenteData.cognome,
        mail: richiedenteData.mail,
      },
      dataInizio: dataInizioOffsetDateTime,
      dataFine: dataFineOffsetDateTime,
      motivoVisita: formData.motivoVisita || null,
      flagRichiestaDPI: formData.flagRichiestaDpi,
      flagAccessoAutomezzo: formData.flagAccessoAutomezzo,
      // Materiale informatico con struttura corretta
      materialeInformatico: formData.materialeInformatico
        ? {
            idMateriale: 1, // TODO: Dovrebbe essere selezionabile o gestito dal backend
            descrizione: formData.materialeInformatico,
          }
        : null,
    };

    console.log(
      "📤 Dati da inviare al backend:",
      JSON.stringify(visitData, null, 2)
    );

    try {
      console.log("🔄 Invio richiesta API...");
      const result = await apiCall("/api/visite", {
        method: "POST",
        body: JSON.stringify(visitData),
      });

      console.log("✅ Visita creata con successo:", result);
      showSuccess("Visita prenotata con successo!");

      // Reset del form dopo il successo
      setFormData({
        visitatoreId: "",
        dataInizio: "",
        orarioInizio: "",
        dataFine: "",
        orarioFine: "",
        motivoVisita: "",
        flagAccessoAutomezzo: false,
        flagRichiestaDpi: false,
        materialeInformatico: "",
      });
    } catch (error) {
      console.error("❌ Errore nella creazione della visita:", error);
      console.error("Dettagli errore:", {
        message: error.message,
        stack: error.stack,
        response: error.response,
        errorData: error.data,
        status: error.status,
      });

      // Log dell'errore completo per debug
      if (error.data) {
        console.error("🔍 Backend error details:", error.data);
      }

      showError(
        `Errore nella prenotazione: ${error.message || "Errore sconosciuto"}`
      );
    } finally {
      console.log("🏁 Submit completato, resetting submitting state");
      setSubmitting(false);
    }
  };
  return (
    <div className="add-visit-container">
      <h1>Aggiungi Visita</h1>
      {loading ? (
        <div className="loading">Caricamento...</div>
      ) : (
        <form className="visit-form" onSubmit={handleSubmit}>
          {" "}
          {/* Sezione Selezione Visitatore */}
          <div className="form-section">
            {" "}
            <h3>Seleziona Visitatore</h3>
            <div className="form-row">
              <div className="input-group">
                <label>Visitatore*</label>
                <select
                  name="visitatoreId"
                  value={formData.visitatoreId}
                  onChange={handleInputChange}
                  required
                >
                  {" "}
                  <option value="">-- Seleziona un visitatore --</option>
                  {visitatori.map((visitatore) => (
                    <option
                      key={visitatore.idPersona}
                      value={visitatore.idPersona}
                    >
                      {visitatore.nome} {visitatore.cognome} - {visitatore.mail}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="info-text">
              <p>
                <small>
                  ℹ️ La visita sarà registrata automaticamente a tuo nome come
                  richiedente
                </small>
              </p>
            </div>
          </div>
          {/* Sezione Dettagli Visita */}
          <div className="form-section">
            <h3>Dettagli Visita</h3>
            <div className="form-row">
              {" "}
              <div className="input-group">
                <label>Data Inizio*</label>
                <input
                  type="date"
                  name="dataInizio"
                  value={formData.dataInizio}
                  onChange={handleInputChange}
                  min={getTodayDate()}
                  required
                />
              </div>
              <div className="input-group">
                <label>Orario Inizio*</label>
                <input
                  type="time"
                  name="orarioInizio"
                  value={formData.orarioInizio}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>Data Fine*</label>
                <input
                  type="date"
                  name="dataFine"
                  value={formData.dataFine}
                  onChange={handleInputChange}
                  min={formData.dataInizio || getTodayDate()}
                  required
                />
              </div>
              <div className="input-group">
                <label>Orario Fine*</label>
                <input
                  type="time"
                  name="orarioFine"
                  value={formData.orarioFine}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>Motivo Visita</label>
                <input
                  type="text"
                  name="motivoVisita"
                  value={formData.motivoVisita}
                  onChange={handleInputChange}
                  placeholder="Descrivi il motivo della visita..."
                />
              </div>
              <div className="input-group">
                <label>Materiale Informatico</label>
                <input
                  type="text"
                  name="materialeInformatico"
                  value={formData.materialeInformatico}
                  onChange={handleInputChange}
                  placeholder="Laptop, tablet, ecc..."
                />
              </div>
            </div>
          </div>
          {/* Sezione Autorizzazioni */}
          <div className="form-section">
            <h3>Autorizzazioni</h3>
            <div className="progress-checkboxes">
              <div className="checkbox-item">
                <input
                  type="checkbox"
                  name="flagAccessoAutomezzo"
                  id="flagAccessoAutomezzo"
                  checked={formData.flagAccessoAutomezzo}
                  onChange={handleInputChange}
                />
                <label
                  htmlFor="flagAccessoAutomezzo"
                  className="custom-checkbox"
                >
                  Accesso con Automezzo
                </label>
              </div>
              <div className="checkbox-item">
                <input
                  type="checkbox"
                  name="flagRichiestaDpi"
                  id="flagRichiestaDpi"
                  checked={formData.flagRichiestaDpi}
                  onChange={handleInputChange}
                />
                <label htmlFor="flagRichiestaDpi" className="custom-checkbox">
                  Richiesta DPI
                </label>
              </div>
            </div>{" "}
          </div>{" "}
          <button
            type="submit"
            className="prenota-button"
            disabled={submitting}
            onClick={(e) => {
              console.log("🖱️ Button clicked!", e);
              // Se per qualche motivo il form submit non funziona, proviamo il submit manuale
              if (e.type === "click") {
                console.log("Attempting manual form submission");
              }
            }}
          >
            {submitting ? "Prenotazione in corso..." : "Prenota Visita"}
          </button>
        </form>
      )}

      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default AddVisit;
