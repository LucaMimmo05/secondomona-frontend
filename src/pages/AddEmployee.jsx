import React, { useState } from "react";
import "../styles/addemployee.css";
import { apiCall } from "../utils/apiUtils";

const AddEmployee = () => {
  const [formData, setFormData] = useState({
    // Campi obbligatori secondo il database    nome: "",
    cognome: "",
    cf: "",
    mail: "",
    passwordHash: "", // Sarà mappato a 'password' nel JSON inviato all'API
    ruolo: "Dipendente",
    numeroDocumento: "",
    dataScadenzaDocumento: "",

    // Campi opzionali che corrispondono al database
    diminutivo: "",
    azienda: "",
    indirizzo: "",
    citta: "",
    provincia: "",
    nazione: "",
    telefono: "",
    cellulare: "",
    fax: "",
    pIva: "",
    dataAssunzione: "",
    matricola: "",
    idFiliale: "",
    idMansione: "",
    idDeposito: "",
    idRiferimento: "",
    visitatore: false,
    accessNumber: "",
    accessCount: "",
    accessUpdate: "",
    luogoNascita: "",
    dataNascita: "",
    dataScadCertificato: "",
    preposto: false,
    antincendio: false,
    primoSoccorso: false,
    tipoDocumento: "",
    duvri: false,
    flagPrivacy: false,
    dataConsegnaPrivacy: "",
    idRuna: "",
    foto: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: "", text: "" });

  // Campi obbligatori secondo il database (Non Null)
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

    if (requiredFields.includes(name) && !value.toString().trim()) {
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
    } else if (name === "pIva" && value && value.length > 20) {
      error = "Partita IVA troppo lunga (max 20 caratteri)";
    } else if (name === "numeroDocumento" && value && value.length > 100) {
      error = "Numero documento troppo lungo (max 100 caratteri)";
    }

    return error;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === "checkbox" ? checked : value; // Conversione dei campi numerici
    if (
      [
        "idFiliale",
        "idMansione",
        "idDeposito",
        "idRiferimento",
        "accessNumber",
        "accessCount",
      ].includes(name)
    ) {
      newValue = value === "" ? "" : parseInt(value) || "";
    }

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
  const prepareDataForSubmission = (data) => {
    // Crea l'oggetto base con i campi obbligatori
    const formattedData = {
      // Campi obbligatori secondo la classe Persona
      nome: data.nome,
      cognome: data.cognome,
      cf: data.cf,
      mail: data.mail,
      password: data.passwordHash, // Usa passwordHash, non password
      ruolo: data.ruolo,
      numeroDocumento: data.numeroDocumento,
      dataScadenzaDocumento: data.dataScadenzaDocumento,

      // Campi con valori di default obbligatori
      visitatore: false, // I dipendenti non sono visitatori
      accessNumber: 0,
      accessCount: 0,
      preposto: data.preposto || false,
      antincendio: data.antincendio || false,
      primoSoccorso: data.primoSoccorso || false,
      duvri: data.duvri || false,
      flagPrivacy: data.flagPrivacy || false,

      // Centro costo obbligatorio
      centroCosto: {
        idCentroCosto: 1,
      },
    };

    // Aggiungi campi opzionali solo se hanno un valore non vuoto
    const optionalFields = [
      "idRuna",
      "diminutivo",
      "azienda",
      "indirizzo",
      "citta",
      "provincia",
      "nazione",
      "telefono",
      "cellulare",
      "fax",
      "pIva",
      "foto",
      "dataAssunzione",
      "matricola",
      "idFiliale",
      "idMansione",
      "idDeposito",
      "idRiferimento",
      "luogoNascita",
      "dataNascita",
      "dataScadCertificato",
      "tipoDocumento",
      "dataConsegnaPrivacy",
    ];

    optionalFields.forEach((field) => {
      if (data[field] && data[field] !== "") {
        // Converti i campi numerici se necessario
        if (
          ["idFiliale", "idMansione", "idDeposito", "idRiferimento"].includes(
            field
          )
        ) {
          formattedData[field] = parseInt(data[field]) || null;
        } else {
          formattedData[field] = data[field];
        }
      }
    });

    return formattedData;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage({ type: "", text: "" });

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
      setSubmitMessage({
        type: "error",
        text: "Correggi gli errori nel form prima di inviare",
      });
      setIsSubmitting(false);
      return;
    }
    try {
      const dataToSend = prepareDataForSubmission(formData);

      console.log("Dati da inviare:", JSON.stringify(dataToSend, null, 2));

      // Utilizziamo apiCall che gestisce automaticamente l'autorizzazione
      const result = await apiCall("http://localhost:8080/api/dipendenti", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });
      console.log("Risposta dal server:", result);

      setSubmitMessage({
        type: "success",
        text: `Dipendente ${result.nome} ${
          result.cognome
        } aggiunto con successo! ID: ${result.id || result.idPersona}`,
      });
      // Reset del form
      setFormData({
        nome: "",
        cognome: "",
        cf: "",
        mail: "",
        passwordHash: "",
        ruolo: "Dipendente",
        numeroDocumento: "",
        dataScadenzaDocumento: "",
        diminutivo: "",
        azienda: "",
        indirizzo: "",
        citta: "",
        provincia: "",
        nazione: "",
        telefono: "",
        cellulare: "",
        fax: "",
        pIva: "",
        dataAssunzione: "",
        matricola: "",
        idFiliale: "",
        idMansione: "",
        idDeposito: "",
        idRiferimento: "",
        visitatore: false,
        accessNumber: "",
        accessCount: "",
        accessUpdate: "",
        luogoNascita: "",
        dataNascita: "",
        dataScadCertificato: "",
        preposto: false,
        antincendio: false,
        primoSoccorso: false,
        tipoDocumento: "",
        duvri: false,
        flagPrivacy: false,
        dataConsegnaPrivacy: "",
        idRuna: "",
        foto: "",
      });
      setTouched({});
    } catch (error) {
      console.error("Errore API:", error);
      setSubmitMessage({
        type: "error",
        text: error.message || "Errore durante l'operazione",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-employee-container">
      <h1>Aggiungi Dipendente</h1>

      {submitMessage.text && (
        <div className={`submit-message ${submitMessage.type}`}>
          {submitMessage.text}
        </div>
      )}

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
                maxLength="100"
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
                maxLength="100"
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
                maxLength="50"
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
                maxLength="200"
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
                maxLength="255"
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
                maxLength="100"
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
                maxLength="200"
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
                maxLength="200"
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
                maxLength="50"
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
                maxLength="100"
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
                maxLength="50"
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
                maxLength="50"
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
                maxLength="50"
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
                maxLength="200"
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
                className={errors.pIva ? "error" : ""}
                maxLength="20"
              />
              {errors.pIva && (
                <span className="error-message">{errors.pIva}</span>
              )}
            </div>
            <div className="input-group">
              <label>Matricola</label>
              <input
                type="text"
                name="matricola"
                value={formData.matricola}
                onChange={handleInputChange}
                onBlur={handleBlur}
                maxLength="50"
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
              <label>Ruolo*</label>{" "}
              <select
                name="ruolo"
                value={formData.ruolo}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={errors.ruolo ? "error" : ""}
              >
                <option value="Dipendente">Dipendente</option>
                <option value="Admin">Amministratore</option>
                <option value="Portineria">Portineria</option>
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
          </div>{" "}
          <div className="form-row">
            <div className="input-group">
              <label>Visitatore</label>
              <input
                type="checkbox"
                name="visitatore"
                checked={formData.visitatore}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* Sezione Accessi */}
        <div className="form-section">
          <h3>Informazioni Accessi</h3>
          <div className="form-row">
            <div className="input-group">
              <label>Numero Accesso</label>
              <input
                type="number"
                name="accessNumber"
                value={formData.accessNumber}
                onChange={handleInputChange}
                onBlur={handleBlur}
              />
            </div>
            <div className="input-group">
              <label>Conteggio Accessi</label>
              <input
                type="number"
                name="accessCount"
                value={formData.accessCount}
                onChange={handleInputChange}
                onBlur={handleBlur}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="input-group">
              <label>Aggiornamento Accesso</label>
              <input
                type="datetime-local"
                name="accessUpdate"
                value={formData.accessUpdate}
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
              <label>Tipo Documento</label>{" "}
              <select
                name="tipoDocumento"
                value={formData.tipoDocumento}
                onChange={handleInputChange}
                onBlur={handleBlur}
              >
                <option value="">Seleziona tipo documento</option>
                <option value="Carta d'identità">Carta d'Identità</option>
                <option value="Patente">Patente</option>
                <option value="Passaporto">Passaporto</option>
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
                maxLength="100"
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
        </div>

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
          </div>
          <div className="checkbox-group">
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
        </div>

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
                maxLength="50"
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

        <button type="submit" className="submit-button" disabled={isSubmitting}>
          {isSubmitting ? "Invio in corso..." : "Aggiungi Dipendente"}
        </button>
      </form>
    </div>
  );
};

export default AddEmployee;
