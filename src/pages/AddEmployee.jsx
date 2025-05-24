import React, { useState } from "react";
import "../styles/addemployee.css";

const AddEmployee = () => {
  const [formData, setFormData] = useState({
    // Informazioni personali obbligatorie
    nome: "",
    cognome: "",
    cf: "",
    mail: "",
    passwordHash: "",
    ruolo: "EMPLOYEE",
    numeroDocumento: "",
    dataScadenzaDocumento: "",

    // Informazioni personali opzionali
    diminutivo: "",
    luogoNascita: "",
    dataNascita: "",
    foto: "",

    // Informazioni contatto
    indirizzo: "",
    citta: "",
    provincia: "",
    nazione: "",
    telefono: "",
    cellulare: "",
    fax: "",

    // Informazioni aziendali
    azienda: "",
    pIva: "",
    dataAssunzione: "",
    matricola: "",
    idFiliale: "",
    idMansione: "",
    idDeposito: "",
    idRiferimento: "",

    // Documento identità
    tipoDocumento: "",

    // Certificazioni mediche e sicurezza
    dataScadCertificato: "",
    preposto: false,
    antincendio: false,
    primoSoccorso: false,
    duvri: false,

    // Privacy
    flagPrivacy: false,
    dataConsegnaPrivacy: "",

    // Altri campi
    visitatore: false,
    idRuna: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Campi obbligatori secondo il modello backend
  const requiredFields = [
    "nome",
    "cognome",
    "cf",
    "mail",
    "passwordHash",
    "ruolo",
    "numeroDocumento",
    "dataScadenzaDocumento",
  ];

  const validateField = (name, value) => {
    let error = "";

    if (requiredFields.includes(name) && !value.trim()) {
      error = "Questo campo è obbligatorio";
    } else if (name === "cf" && value && value.length !== 16) {
      error = "Il codice fiscale deve essere di 16 caratteri";
    } else if (
      name === "mail" &&
      value &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    ) {
      error = "Inserisci un indirizzo email valido";
    } else if (name === "passwordHash" && value && value.length < 6) {
      error = "La password deve essere di almeno 6 caratteri";
    }

    return error;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Validazione in tempo reale se il campo è stato toccato
    if (touched[name]) {
      const error = validateField(name, newValue);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Marca tutti i campi come toccati
    const allTouched = {};
    Object.keys(formData).forEach((key) => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    // Valida tutti i campi
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);

    // Se ci sono errori, non inviare
    if (Object.keys(newErrors).length > 0) {
      console.log("Form has errors:", newErrors);
      return;
    }

    console.log("Form data:", formData);
    // Qui implementerai la chiamata API per salvare il dipendente
    alert("Dipendente aggiunto con successo!");
  };

  return (
    <div className="add-employee-container">
      <h1>Aggiungi Dipendente</h1>
      <form className="employee-form" onSubmit={handleSubmit}>
        {/* Sezione Informazioni Personali */}
        <div className="form-section">
          <h3>Informazioni Personali</h3>
          <div className="form-row">
            <div className="input-group">
              <label>Nome*</label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={errors.nome ? "error" : ""}
                required
              />
              {errors.nome && (
                <span className="error-message">{errors.nome}</span>
              )}
            </div>
            <div className="input-group">
              <label>Cognome*</label>
              <input
                type="text"
                name="cognome"
                value={formData.cognome}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={errors.cognome ? "error" : ""}
                required
              />
              {errors.cognome && (
                <span className="error-message">{errors.cognome}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="input-group">
              <label>Diminutivo</label>
              <input
                type="text"
                name="diminutivo"
                value={formData.diminutivo}
                onChange={handleInputChange}
                onBlur={handleBlur}
              />
            </div>
            <div className="input-group">
              <label>Codice Fiscale*</label>
              <input
                type="text"
                name="cf"
                value={formData.cf}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={errors.cf ? "error" : ""}
                maxLength="16"
                required
              />
              {errors.cf && <span className="error-message">{errors.cf}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="input-group">
              <label>Email*</label>
              <input
                type="email"
                name="mail"
                value={formData.mail}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={errors.mail ? "error" : ""}
                required
              />
              {errors.mail && (
                <span className="error-message">{errors.mail}</span>
              )}
            </div>
            <div className="input-group">
              <label>Password*</label>
              <input
                type="password"
                name="passwordHash"
                value={formData.passwordHash}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={errors.passwordHash ? "error" : ""}
                required
              />
              {errors.passwordHash && (
                <span className="error-message">{errors.passwordHash}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="input-group">
              <label>Luogo di Nascita</label>
              <input
                type="text"
                name="luogoNascita"
                value={formData.luogoNascita}
                onChange={handleInputChange}
                onBlur={handleBlur}
              />
            </div>
            <div className="input-group">
              <label>Data di Nascita</label>
              <input
                type="date"
                name="dataNascita"
                value={formData.dataNascita}
                onChange={handleInputChange}
                onBlur={handleBlur}
              />
            </div>
          </div>
        </div>
        {/* Sezione Informazioni di Contatto */}
        <div className="form-section">
          <h3>Informazioni di Contatto</h3>
          <div className="form-row">
            <div className="input-group">
              <label>Indirizzo</label>
              <input
                type="text"
                name="indirizzo"
                value={formData.indirizzo}
                onChange={handleInputChange}
                onBlur={handleBlur}
              />
            </div>
            <div className="input-group">
              <label>Città</label>
              <input
                type="text"
                name="citta"
                value={formData.citta}
                onChange={handleInputChange}
                onBlur={handleBlur}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="input-group">
              <label>Provincia</label>
              <input
                type="text"
                name="provincia"
                value={formData.provincia}
                onChange={handleInputChange}
                onBlur={handleBlur}
              />
            </div>
            <div className="input-group">
              <label>Nazione</label>
              <input
                type="text"
                name="nazione"
                value={formData.nazione}
                onChange={handleInputChange}
                onBlur={handleBlur}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="input-group">
              <label>Telefono</label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
                onBlur={handleBlur}
              />
            </div>
            <div className="input-group">
              <label>Cellulare</label>
              <input
                type="tel"
                name="cellulare"
                value={formData.cellulare}
                onChange={handleInputChange}
                onBlur={handleBlur}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="input-group">
              <label>Fax</label>
              <input
                type="text"
                name="fax"
                value={formData.fax}
                onChange={handleInputChange}
                onBlur={handleBlur}
              />
            </div>
            <div className="input-group">
              <label>Azienda</label>
              <input
                type="text"
                name="azienda"
                value={formData.azienda}
                onChange={handleInputChange}
                onBlur={handleBlur}
              />
            </div>
          </div>
        </div>
        {/* Sezione Informazioni Aziendali */}
        <div className="form-section">
          <h3>Informazioni Aziendali</h3>
          <div className="form-row">
            <div className="input-group">
              <label>Partita IVA</label>
              <input
                type="text"
                name="pIva"
                value={formData.pIva}
                onChange={handleInputChange}
                onBlur={handleBlur}
              />
            </div>
            <div className="input-group">
              <label>Matricola</label>
              <input
                type="text"
                name="matricola"
                value={formData.matricola}
                onChange={handleInputChange}
                onBlur={handleBlur}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="input-group">
              <label>Data Assunzione</label>
              <input
                type="date"
                name="dataAssunzione"
                value={formData.dataAssunzione}
                onChange={handleInputChange}
                onBlur={handleBlur}
              />
            </div>
            <div className="input-group">
              <label>Ruolo*</label>
              <select
                name="ruolo"
                value={formData.ruolo}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={errors.ruolo ? "error" : ""}
                required
              >
                <option value="EMPLOYEE">Dipendente</option>
                <option value="ADMIN">Amministratore</option>
                <option value="RECEPTION">Reception</option>
              </select>
              {errors.ruolo && (
                <span className="error-message">{errors.ruolo}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="input-group">
              <label>ID Filiale</label>
              <input
                type="number"
                name="idFiliale"
                value={formData.idFiliale}
                onChange={handleInputChange}
                onBlur={handleBlur}
              />
            </div>
            <div className="input-group">
              <label>ID Mansione</label>
              <input
                type="number"
                name="idMansione"
                value={formData.idMansione}
                onChange={handleInputChange}
                onBlur={handleBlur}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="input-group">
              <label>ID Deposito</label>
              <input
                type="number"
                name="idDeposito"
                value={formData.idDeposito}
                onChange={handleInputChange}
                onBlur={handleBlur}
              />
            </div>
            <div className="input-group">
              <label>ID Riferimento</label>
              <input
                type="number"
                name="idRiferimento"
                value={formData.idRiferimento}
                onChange={handleInputChange}
                onBlur={handleBlur}
              />
            </div>
          </div>
        </div>
        {/* Sezione Documento di Identità */}
        <div className="form-section">
          <h3>Documento di Identità</h3>
          <div className="form-row">
            <div className="input-group">
              <label>Tipo Documento</label>
              <select
                name="tipoDocumento"
                value={formData.tipoDocumento}
                onChange={handleInputChange}
                onBlur={handleBlur}
              >
                <option value="">Seleziona tipo documento</option>
                <option value="CARTA_IDENTITA">Carta d'Identità</option>
                <option value="PATENTE">Patente</option>
                <option value="PASSAPORTO">Passaporto</option>
              </select>
            </div>
            <div className="input-group">
              <label>Numero Documento*</label>
              <input
                type="text"
                name="numeroDocumento"
                value={formData.numeroDocumento}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={errors.numeroDocumento ? "error" : ""}
                required
              />
              {errors.numeroDocumento && (
                <span className="error-message">{errors.numeroDocumento}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="input-group">
              <label>Data Scadenza Documento*</label>
              <input
                type="date"
                name="dataScadenzaDocumento"
                value={formData.dataScadenzaDocumento}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={errors.dataScadenzaDocumento ? "error" : ""}
                required
              />
              {errors.dataScadenzaDocumento && (
                <span className="error-message">
                  {errors.dataScadenzaDocumento}
                </span>
              )}
            </div>
            <div className="input-group">
              <label>Data Scadenza Certificato Medico</label>
              <input
                type="date"
                name="dataScadCertificato"
                value={formData.dataScadCertificato}
                onChange={handleInputChange}
                onBlur={handleBlur}
              />
            </div>
          </div>
        </div>{" "}
        {/* Sezione Certificazioni e Sicurezza */}
        <div className="form-section">
          <h3>Certificazioni e Sicurezza</h3>
          <div className="checkbox-group">
            <div className="checkbox-item">
              <input
                type="checkbox"
                name="preposto"
                id="preposto"
                checked={formData.preposto}
                onChange={handleInputChange}
              />
              <label htmlFor="preposto" className="custom-checkbox">
                Preposto
              </label>
            </div>
            <div className="checkbox-item">
              <input
                type="checkbox"
                name="antincendio"
                id="antincendio"
                checked={formData.antincendio}
                onChange={handleInputChange}
              />
              <label htmlFor="antincendio" className="custom-checkbox">
                Certificato Antincendio
              </label>
            </div>
          </div>
          <div className="checkbox-group">
            <div className="checkbox-item">
              <input
                type="checkbox"
                name="primoSoccorso"
                id="primoSoccorso"
                checked={formData.primoSoccorso}
                onChange={handleInputChange}
              />
              <label htmlFor="primoSoccorso" className="custom-checkbox">
                Certificato Primo Soccorso
              </label>
            </div>
            <div className="checkbox-item">
              <input
                type="checkbox"
                name="duvri"
                id="duvri"
                checked={formData.duvri}
                onChange={handleInputChange}
              />
              <label htmlFor="duvri" className="custom-checkbox">
                DUVRI
              </label>
            </div>
          </div>{" "}
          <div className="checkbox-group">
            <div className="checkbox-item">
              <input
                type="checkbox"
                name="visitatore"
                id="visitatore"
                checked={formData.visitatore}
                onChange={handleInputChange}
              />
              <label htmlFor="visitatore" className="custom-checkbox">
                Visitatore
              </label>
            </div>
            <div className="checkbox-item">
              <input
                type="checkbox"
                name="flagPrivacy"
                id="flagPrivacy"
                checked={formData.flagPrivacy}
                onChange={handleInputChange}
              />
              <label htmlFor="flagPrivacy" className="custom-checkbox">
                Consenso Privacy
              </label>
            </div>
          </div>
        </div>{" "}
        {/* Sezione Privacy */}
        <div className="form-section">
          <h3>Privacy</h3>
          <div className="form-row">
            <div className="input-group">
              <label>Data Consegna Privacy</label>
              <input
                type="date"
                name="dataConsegnaPrivacy"
                value={formData.dataConsegnaPrivacy}
                onChange={handleInputChange}
                onBlur={handleBlur}
              />
            </div>
          </div>
        </div>
        {/* Sezione Altri Dati */}
        <div className="form-section">
          <h3>Altri Dati</h3>
          <div className="form-row">
            <div className="input-group">
              <label>ID Runa</label>
              <input
                type="text"
                name="idRuna"
                value={formData.idRuna}
                onChange={handleInputChange}
                onBlur={handleBlur}
              />
            </div>
            <div className="input-group">
              <label>Foto (URL)</label>
              <input
                type="url"
                name="foto"
                value={formData.foto}
                onChange={handleInputChange}
                onBlur={handleBlur}
                placeholder="https://..."
              />
            </div>
          </div>
        </div>
        <button type="submit" className="submit-button">
          Aggiungi Dipendente
        </button>
      </form>
    </div>
  );
};

export default AddEmployee;
