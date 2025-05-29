import React, { useState, useEffect } from "react";
import { apiCall } from "../utils/apiUtils";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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

    if (!visitorData.nome.trim()) errors.push("Il campo Nome è obbligatorio");
    if (!visitorData.cognome.trim())
      errors.push("Il campo Cognome è obbligatorio");
    if (!visitorData.cf.trim()) errors.push("Il Codice Fiscale è obbligatorio");
    if (!visitorData.mail.trim())
      errors.push("L'indirizzo Email è obbligatorio");
    if (!visitorData.numeroDocumento.trim())
      errors.push("Il Numero del Documento è obbligatorio");
    if (!visitorData.dataScadenzaDocumento)
      errors.push("La Data di Scadenza del Documento è obbligatoria");

    const centroCostoNum = Number(visitorData.centroCosto);
    if (
      !visitorData.centroCosto ||
      isNaN(centroCostoNum) ||
      centroCostoNum <= 0
    ) {
      errors.push("Il Centro Costo deve essere un numero positivo valido");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (visitorData.mail && !emailRegex.test(visitorData.mail)) {
      errors.push("L'indirizzo email non è in un formato valido");
    }

    if (visitorData.cf && visitorData.cf.length !== 16) {
      errors.push(
        "Il Codice Fiscale deve essere composto da esattamente 16 caratteri"
      );
    }

    // Validazione data scadenza documento
    if (visitorData.dataScadenzaDocumento) {
      const scadenzaDate = new Date(visitorData.dataScadenzaDocumento);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (scadenzaDate <= today) {
        errors.push("La Data di Scadenza del Documento deve essere futura");
      }
    }

    return errors;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      const errorMessage =
        validationErrors.length === 1
          ? validationErrors[0]
          : `Sono stati riscontrati ${
              validationErrors.length
            } errori:\n• ${validationErrors.join("\n• ")}`;

      toast.error(errorMessage);
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
        dataConsegnaPrivacy:
          visitorData.flagPrivacy && visitorData.dataConsegnaPrivacy
            ? visitorData.dataConsegnaPrivacy
            : null,

        centroCosto: {
          idCentroCosto: centroCostoNum,
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
        matricola: `VIS_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`, // Matricola univoca per visitatori
        luogoNascita: null,
        dataNascita: null,
        dataScadCertificato: null,
      };

      console.log(
        "Dati inviati al backend:",
        JSON.stringify(dataToSend, null, 2)
      );

      // La funzione apiCall gestisce già gli errori e restituisce i dati parsati
      const result = await apiCall("/api/visitatori", {
        method: "POST",
        body: JSON.stringify(dataToSend),
      });

      console.log("Visitatore creato con successo:", result);

      toast.success(
        `Visitatore "${visitorData.nome} ${visitorData.cognome}" creato con successo! 🎉`
      );

      setVisitorData(initialVisitorData());
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Errore dettagliato:", error);

      // Messaggi di errore più specifici
      let displayError = error.message;

      if (error.message.includes("codice fiscale")) {
        displayError =
          "Il codice fiscale inserito non è valido o è già presente nel sistema.";
      } else if (error.message.includes("email")) {
        displayError =
          "L'indirizzo email inserito non è valido o è già presente nel sistema.";
      } else if (error.message.includes("centro costo")) {
        displayError = "Il centro costo specificato non esiste nel sistema.";
      } else if (
        error.message.includes("409") ||
        error.message.includes("conflict")
      ) {
        displayError =
          "Esiste già un visitatore con questi dati. Controlla codice fiscale e email.";
      } else if (error.message.includes("500")) {
        displayError =
          "Errore interno del server. Riprova più tardi o contatta l'assistenza.";
      } else if (
        error.name === "TypeError" &&
        error.message.includes("fetch")
      ) {
        displayError =
          "Impossibile connettersi al server. Controlla la connessione internet e riprova.";
      } else if (error.message.includes("NetworkError")) {
        displayError = "Errore di rete. Controlla la connessione e riprova.";
      }

      toast.error(displayError);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleReset = () => {
    setVisitorData(initialVisitorData());
  };
  const renderInputGroup = (
    name,
    label,
    type = "text",
    required = false,
    options = {}
  ) => (
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

  const renderSelectGroup = (name, label, options = [], required = false) => (
    <div className="input-group" key={name}>
      <label htmlFor={name}>
        {label}
        {required && <span className="required"> *</span>}
      </label>
      <select
        id={name}
        name={name}
        value={visitorData[name]}
        onChange={handleChange}
        required={required}
        disabled={isSubmitting}
      >
        <option value="">Seleziona...</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
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

      <form className="visitor-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Dati Anagrafici</h3>
          <div className="form-row">
            {renderInputGroup("nome", "Nome", "text", true, { maxLength: 100 })}
            {renderInputGroup("cognome", "Cognome", "text", true, {
              maxLength: 100,
            })}
            {renderInputGroup("diminutivo", "Diminutivo", "text", false, {
              maxLength: 50,
            })}
          </div>
          <div className="form-row">
            {renderInputGroup("cf", "Codice Fiscale", "text", true, {
              maxLength: 16,
              placeholder: "RSSMRA80A01H501U",
            })}
            {renderInputGroup("idRuna", "ID Runa", "text", false, {
              maxLength: 50,
            })}
            {renderInputGroup("centroCosto", "Centro Costo", "number", true, {
              placeholder: "Es: 1001",
            })}
          </div>
          <div className="form-row">
            {renderInputGroup("foto", "URL Foto", "url", false, {
              placeholder: "https://...",
            })}
          </div>
        </div>
        <div className="form-section">
          <h3>Dati Aziendali</h3>
          <div className="form-row">
            {renderInputGroup("azienda", "Azienda", "text", false, {
              maxLength: 200,
            })}
            {renderInputGroup("pIva", "Partita IVA", "text", false, {
              maxLength: 20,
            })}
          </div>
        </div>
        <div className="form-section">
          <h3>Indirizzo</h3>
          <div className="form-row">
            {renderInputGroup("indirizzo", "Indirizzo", "text", false, {
              maxLength: 200,
            })}
            {renderInputGroup("citta", "Città", "text", false, {
              maxLength: 100,
            })}
          </div>
          <div className="form-row">
            {renderInputGroup("provincia", "Provincia", "text", false, {
              maxLength: 50,
              placeholder: "Es: MI",
            })}
            {renderInputGroup("nazione", "Nazione", "text", false, {
              maxLength: 100,
              placeholder: "Es: Italia",
            })}
          </div>
        </div>
        <div className="form-section">
          <h3>Contatti</h3>
          <div className="form-row">
            {renderInputGroup("mail", "Email", "email", true, {
              maxLength: 200,
              placeholder: "nome@esempio.com",
            })}
            {renderInputGroup("telefono", "Telefono Fisso", "tel", false, {
              maxLength: 50,
            })}
          </div>
          <div className="form-row">
            {renderInputGroup("cellulare", "Cellulare", "tel", false, {
              maxLength: 50,
            })}
            {renderInputGroup("fax", "Fax", "tel", false, { maxLength: 50 })}
          </div>
        </div>{" "}
        <div className="form-section">
          <h3>Documenti di Identità</h3>
          <div className="form-row">
            {renderSelectGroup(
              "tipoDocumento",
              "Tipo Documento",
              [
                { value: "Carta d'Identità", label: "Carta d'Identità" },
                { value: "Passaporto", label: "Passaporto" },
                { value: "Patente di Guida", label: "Patente di Guida" },
                {
                  value: "Permesso di Soggiorno",
                  label: "Permesso di Soggiorno",
                },
                { value: "Carta di Soggiorno", label: "Carta di Soggiorno" },
                {
                  value: "Documento d'Identità Straniero",
                  label: "Documento d'Identità Straniero",
                },
              ],
              false
            )}
            {renderInputGroup(
              "numeroDocumento",
              "Numero Documento",
              "text",
              true,
              {
                maxLength: 100,
                placeholder: "Es: AB1234567",
              }
            )}
          </div>
          <div className="form-row">
            {renderInputGroup(
              "dataScadenzaDocumento",
              "Data Scadenza Documento",
              "date",
              true
            )}
          </div>
        </div>
        <div className="form-section">
          <h3>Privacy e Autorizzazioni</h3>
          <div className="checkbox-group">
            {renderCheckboxGroup(
              "duvri",
              "DUVRI (Documento Unico Valutazione Rischi)"
            )}
            {renderCheckboxGroup(
              "flagPrivacy",
              "Consenso al trattamento dei dati personali"
            )}
          </div>
          {visitorData.flagPrivacy && (
            <div className="form-row">
              {renderInputGroup(
                "dataConsegnaPrivacy",
                "Data Consegna Informativa Privacy",
                "date"
              )}
            </div>
          )}
        </div>{" "}
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

export default AddVisitor;
