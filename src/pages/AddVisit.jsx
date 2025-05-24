import React, { useState } from "react";
import "../styles/addvisit.css";

const AddVisit = () => {
  const [formData, setFormData] = useState({
    // Dati Visitatore
    nomeVisitatore: "",
    cognomeVisitatore: "",
    emailVisitatore: "",
    telefonoVisitatore: "",
    codiceFiscaleVisitatore: "",

    // Dati Richiedente
    nomeRichiedente: "",
    cognomeRichiedente: "",
    emailRichiedente: "",

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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dati visita:", formData);
    // Qui implementerai la logica per inviare i dati al backend
  };

  return (
    <div className="add-visit-container">
      <h1>Aggiungi Visita</h1>
      <form className="visit-form" onSubmit={handleSubmit}>
        {/* Sezione Dati Visitatore */}
        <div className="form-section">
          <h3>Dati Visitatore</h3>
          <div className="form-row">
            <div className="input-group">
              <label>Nome Visitatore*</label>
              <input
                type="text"
                name="nomeVisitatore"
                value={formData.nomeVisitatore}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="input-group">
              <label>Cognome Visitatore*</label>
              <input
                type="text"
                name="cognomeVisitatore"
                value={formData.cognomeVisitatore}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="input-group">
              <label>Email Visitatore</label>
              <input
                type="email"
                name="emailVisitatore"
                value={formData.emailVisitatore}
                onChange={handleInputChange}
              />
            </div>
            <div className="input-group">
              <label>Telefono Visitatore</label>
              <input
                type="tel"
                name="telefonoVisitatore"
                value={formData.telefonoVisitatore}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="input-group">
              <label>Codice Fiscale Visitatore</label>
              <input
                type="text"
                name="codiceFiscaleVisitatore"
                value={formData.codiceFiscaleVisitatore}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* Sezione Dati Richiedente */}
        <div className="form-section">
          <h3>Dati Richiedente</h3>
          <div className="form-row">
            <div className="input-group">
              <label>Nome Richiedente*</label>
              <input
                type="text"
                name="nomeRichiedente"
                value={formData.nomeRichiedente}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="input-group">
              <label>Cognome Richiedente*</label>
              <input
                type="text"
                name="cognomeRichiedente"
                value={formData.cognomeRichiedente}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="input-group">
              <label>Email Richiedente</label>
              <input
                type="email"
                name="emailRichiedente"
                value={formData.emailRichiedente}
                onChange={handleInputChange}
              />
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
              <label htmlFor="flagAccessoAutomezzo" className="custom-checkbox">
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
        </div>

        <button type="submit" className="prenota-button">
          Prenota Visita
        </button>
      </form>
    </div>
  );
};

export default AddVisit;
