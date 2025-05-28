import React, { useState, useEffect } from "react";
import "../styles/addvisit.css";
import { apiCall } from "../utils/apiUtils";
import { useTokenRefresh } from "../hooks/useTokenRefresh";

const AddVisit = () => {
  // Initialize token refresh hook
  useTokenRefresh();

  const [formData, setFormData] = useState({
    // IDs selezionati
    visitatoreId: "",
    richiedenteId: "",

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
  });
  // Stati per le liste
  const [visitatori, setVisitatori] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  // Fetch dei dati all'avvio del componente
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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Preparo i dati da inviare al backend
    const visitData = {
      visitatoreId: parseInt(formData.visitatoreId),
      richiedenteId: parseInt(formData.richiedenteId),
      dataInizio: formData.dataInizio,
      orarioInizio: formData.orarioInizio,
      dataFine: formData.dataFine,
      orarioFine: formData.orarioFine,
      motivoVisita: formData.motivoVisita,
      flagAccessoAutomezzo: formData.flagAccessoAutomezzo,
      flagRichiestaDpi: formData.flagRichiestaDpi,
      materialeInformatico: formData.materialeInformatico,
    };

    console.log("Dati da inviare:", visitData);

    try {
      const result = await apiCall("/api/visite", {
        method: "POST",
        body: JSON.stringify(visitData),
      });

      console.log("Visita creata con successo:", result);
      alert("Visita prenotata con successo!");

      // Reset del form dopo il successo
      setFormData({
        visitatoreId: "",
        richiedenteId: "",
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
      console.error("Errore nella creazione della visita:", error);
      alert(
        `Errore nella prenotazione: ${error.message || "Errore sconosciuto"}`
      );
    } finally {
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
          {/* Sezione Selezione Visitatore */}
          <div className="form-section">
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
                  <option value="">-- Seleziona un visitatore --</option>
                  {visitatori.map((visitatore) => (
                    <option key={visitatore.id} value={visitatore.id}>
                      {visitatore.nome} {visitatore.cognome} -{" "}
                      {visitatore.email}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          {/* Sezione Dettagli Visita */}
          <div className="form-section">
            <h3>Dettagli Visita</h3>
            <div className="form-row">
              <div className="input-group">
                <label>Data Inizio*</label>
                <input
                  type="date"
                  name="dataInizio"
                  value={formData.dataInizio}
                  onChange={handleInputChange}
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
            </div>
          </div>{" "}
          <button
            type="submit"
            className="prenota-button"
            disabled={submitting}
          >
            {submitting ? "Prenotazione in corso..." : "Prenota Visita"}
          </button>
        </form>
      )}
    </div>
  );
};

export default AddVisit;
