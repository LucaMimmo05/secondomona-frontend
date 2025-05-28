import React, { useState } from "react";
import { apiCall } from "../utils/apiUtils";
import "../styles/addvisitor.css";

const initialVisitorData = () => ({
  idRuna: "",
  nome: "",
  cognome: "",
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
  cf: "",
  mail: "",
  foto: "",
  tipoDocumento: "",
  numeroDocumento: "",
  dataScadenzaDocumento: "",
  duvri: false,
  flagPrivacy: false,
  dataConsegnaPrivacy: "",
  centroCosto: "",
  visitatore: true,
  ruolo: "Visitatore",
});

const AddVisitor = () => {
  const [visitorData, setVisitorData] = useState(initialVisitorData());
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setVisitorData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    const errors = [];
    
    if (!visitorData.nome.trim()) errors.push("Nome è obbligatorio");
    if (!visitorData.cognome.trim()) errors.push("Cognome è obbligatorio");
    if (!visitorData.cf.trim()) errors.push("Codice Fiscale è obbligatorio");
    if (!visitorData.mail.trim()) errors.push("Email è obbligatoria");
    if (!visitorData.numeroDocumento.trim()) errors.push("Numero Documento è obbligatorio");
    if (!visitorData.dataScadenzaDocumento) errors.push("Data Scadenza Documento è obbligatoria");
    
    const centroCostoNum = Number(visitorData.centroCosto);
    if (!visitorData.centroCosto || isNaN(centroCostoNum) || centroCostoNum <= 0) {
      errors.push("Centro Costo deve essere un numero positivo");
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (visitorData.mail && !emailRegex.test(visitorData.mail)) {
      errors.push("Formato email non valido");
    }
    
    if (visitorData.cf && visitorData.cf.length !== 16) {
      errors.push("Il Codice Fiscale deve essere di 16 caratteri");
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setIsSubmitting(true);

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrorMsg(validationErrors.join(", "));
      setIsSubmitting(false);
      return;
    }

    try {
      const centroCostoNum = Number(visitorData.centroCosto);
      
      const dataToSend = {
        idRuna: visitorData.idRuna || null,
        nome: visitorData.nome.trim(),
        cognome: visitorData.cognome.trim(),
        diminutivo: visitorData.diminutivo || null,
        cf: visitorData.cf.trim().toUpperCase(),
        mail: visitorData.mail.trim().toLowerCase(),
        foto: visitorData.foto || null,
        
        azienda: visitorData.azienda || null,
        indirizzo: visitorData.indirizzo || null,
        citta: visitorData.citta || null,
        provincia: visitorData.provincia || null,
        nazione: visitorData.nazione || null,
        
        telefono: visitorData.telefono || null,
        cellulare: visitorData.cellulare || null,
        fax: visitorData.fax || null,
        pIva: visitorData.pIva || null,
        
        tipoDocumento: visitorData.tipoDocumento || null,
        numeroDocumento: visitorData.numeroDocumento.trim(),
        dataScadenzaDocumento: visitorData.dataScadenzaDocumento,
        
        duvri: Boolean(visitorData.duvri),
        flagPrivacy: Boolean(visitorData.flagPrivacy),
        dataConsegnaPrivacy: visitorData.flagPrivacy && visitorData.dataConsegnaPrivacy 
          ? visitorData.dataConsegnaPrivacy 
          : null,
        
        centroCosto: {
          idCentroCosto: centroCostoNum
        },
        
        visitatore: true,
        preposto: false,
        antincendio: false,
        primoSoccorso: false,
        
        accessNumber: 0,
        accessCount: 0,
        idFiliale: null,
        idMansione: null,
        idDeposito: null,
        idRiferimento: null,
        dataAssunzione: null,
        matricola: `VIS_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // Matricola univoca per visitatori
        luogoNascita: null,
        dataNascita: null,
        dataScadCertificato: null
      };

      console.log("Dati inviati al backend:", JSON.stringify(dataToSend, null, 2));
      
      const response = await apiCall("http://localhost:8080/api/visitatori", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(dataToSend),
      });

      console.log("Status risposta:", response.status);
      console.log("Headers risposta:", [...response.headers.entries()]);

      if (!response.ok) {
        let errorMessage;
        const contentType = response.headers.get("content-type");
        
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorData.detail || 'Errore sconosciuto';
        } else {
          errorMessage = await response.text();
        }
        
        console.error("Errore dal server:", errorMessage);
        throw new Error(`Errore ${response.status}: ${errorMessage}`);
      }

      const result = await response.json();
      console.log("Visitatore creato con successo:", result);
      
      setSuccessMsg(`Visitatore "${visitorData.nome} ${visitorData.cognome}" creato con successo!`);
      
      setVisitorData(initialVisitorData());
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
    } catch (error) {
      console.error("Errore dettagliato:", error);
      setErrorMsg(error.message || "Errore imprevisto durante la creazione del visitatore");
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setVisitorData(initialVisitorData());
    setErrorMsg("");
    setSuccessMsg("");
  };

  const renderInputGroup = (name, label, type = "text", required = false, options = {}) => (
    <div className="input-group" key={name}>
      <label htmlFor={name}>
        {label}
        {required && <span className="required"> *</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={visitorData[name]}
        onChange={handleChange}
        required={required}
        min={type === "number" ? "1" : undefined}
        maxLength={options.maxLength}
        placeholder={options.placeholder}
        disabled={isSubmitting}
      />
    </div>
  );

  const renderCheckboxGroup = (name, label) => (
    <div className="checkbox-item" key={name}>
      <input
        type="checkbox"
        id={name}
        name={name}
        checked={visitorData[name]}
        onChange={handleChange}
        disabled={isSubmitting}
      />
      <label htmlFor={name} className="custom-checkbox">
        {label}
      </label>
    </div>
  );

  return (
    <div className="add-visitor-container">
      <h1>Aggiungi Nuovo Visitatore</h1>
      
      {successMsg && (
        <div className="success-msg">
          <strong>Successo!</strong> {successMsg}
        </div>
      )}
      
      {errorMsg && (
        <div className="error-msg">
          <strong>Errore:</strong> {errorMsg}
        </div>
      )}

      <form className="visitor-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Dati Anagrafici</h3>
          <div className="form-row">
            {renderInputGroup("nome", "Nome", "text", true, { maxLength: 100 })}
            {renderInputGroup("cognome", "Cognome", "text", true, { maxLength: 100 })}
            {renderInputGroup("diminutivo", "Diminutivo", "text", false, { maxLength: 50 })}
          </div>
          <div className="form-row">
            {renderInputGroup("cf", "Codice Fiscale", "text", true, { 
              maxLength: 16, 
              placeholder: "RSSMRA80A01H501U" 
            })}
            {renderInputGroup("idRuna", "ID Runa", "text", false, { maxLength: 50 })}
            {renderInputGroup("centroCosto", "Centro Costo", "number", true, { 
              placeholder: "Es: 1001" 
            })}
          </div>
          <div className="form-row">
            {renderInputGroup("foto", "URL Foto", "url", false, { 
              placeholder: "https://..." 
            })}
          </div>
        </div>

        <div className="form-section">
          <h3>Dati Aziendali</h3>
          <div className="form-row">
            {renderInputGroup("azienda", "Azienda", "text", false, { maxLength: 200 })}
            {renderInputGroup("pIva", "Partita IVA", "text", false, { maxLength: 20 })}
          </div>
        </div>

        <div className="form-section">
          <h3>Indirizzo</h3>
          <div className="form-row">
            {renderInputGroup("indirizzo", "Indirizzo", "text", false, { maxLength: 200 })}
            {renderInputGroup("citta", "Città", "text", false, { maxLength: 100 })}
          </div>
          <div className="form-row">
            {renderInputGroup("provincia", "Provincia", "text", false, { 
              maxLength: 50, 
              placeholder: "Es: MI" 
            })}
            {renderInputGroup("nazione", "Nazione", "text", false, { 
              maxLength: 100, 
              placeholder: "Es: Italia" 
            })}
          </div>
        </div>

        <div className="form-section">
          <h3>Contatti</h3>
          <div className="form-row">
            {renderInputGroup("mail", "Email", "email", true, { 
              maxLength: 200,
              placeholder: "nome@esempio.com" 
            })}
            {renderInputGroup("telefono", "Telefono Fisso", "tel", false, { maxLength: 50 })}
          </div>
          <div className="form-row">
            {renderInputGroup("cellulare", "Cellulare", "tel", false, { maxLength: 50 })}
            {renderInputGroup("fax", "Fax", "tel", false, { maxLength: 50 })}
          </div>
        </div>

        <div className="form-section">
          <h3>Documenti di Identità</h3>
          <div className="form-row">
            {renderInputGroup("tipoDocumento", "Tipo Documento", "text", false, { 
              maxLength: 50,
              placeholder: "Es: Carta d'Identità" 
            })}
            {renderInputGroup("numeroDocumento", "Numero Documento", "text", true, { 
              maxLength: 100,
              placeholder: "Es: AB1234567" 
            })}
          </div>
          <div className="form-row">
            {renderInputGroup("dataScadenzaDocumento", "Data Scadenza Documento", "date", true)}
          </div>
        </div>

        <div className="form-section">
          <h3>Privacy e Autorizzazioni</h3>
          <div className="checkbox-group">
            {renderCheckboxGroup("duvri", "DUVRI (Documento Unico Valutazione Rischi)")}
            {renderCheckboxGroup("flagPrivacy", "Consenso al trattamento dei dati personali")}
          </div>
          {visitorData.flagPrivacy && (
            <div className="form-row">
              {renderInputGroup("dataConsegnaPrivacy", "Data Consegna Informativa Privacy", "date")}
            </div>
          )}
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-visitor-button" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creazione in corso..." : "Crea Visitatore"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddVisitor;