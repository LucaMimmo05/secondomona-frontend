import React, { useState } from "react";
import { apiCall } from "../utils/apiUtils";
import "../styles/addvisitor.css";

const AddVisitor = () => {
  const [visitorData, setVisitorData] = useState({
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
    dataAssunzione: "",
    matricola: "",
    idFiliale: "",
    idMansione: "",
    idDeposito: "",
    idRiferimento: "",
    tipoDocumento: "",
    numeroDocumento: "",
    dataScadenzaDocumento: "",
    duvri: false,
    flagPrivacy: false,
    dataConsegnaPrivacy: "",
    centroCosto: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setVisitorData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const response = await apiCall("http://localhost:8080/api/visitatori", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(visitorData),
      });
      if (!response.ok) throw new Error("Errore creazione visitatore");
      const result = await response.json();
      setSuccessMsg(`Visitatore creato con ID ${result.id}`);
      setVisitorData({
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
        dataAssunzione: "",
        matricola: "",
        idFiliale: "",
        idMansione: "",
        idDeposito: "",
        idRiferimento: "",
        tipoDocumento: "",
        numeroDocumento: "",
        dataScadenzaDocumento: "",
        duvri: false,
        flagPrivacy: false,
        dataConsegnaPrivacy: "",
        centroCosto: "",
      });
    } catch (error) {
      console.error(error);
      setErrorMsg(error.message);
    }
  };

  return (
    <div className="add-visit-container">
      <h1>Aggiungi Visitatore</h1>
      {successMsg && <div className="success-msg">{successMsg}</div>}
      {errorMsg && <div className="error-msg">{errorMsg}</div>}
      <form className="visit-form" onSubmit={handleSubmit}>
        {/* Sezione Anagrafica */}
        <div className="form-section">
          <h3>Dati Anagrafici</h3>
          <div className="form-row">
            {/* Campi anagrafici */}
            <div className="input-group">
              <label htmlFor="idRuna">ID Runa</label>
              <input type="text" id="idRuna" name="idRuna" value={visitorData.idRuna} onChange={handleChange} />
            </div>
            <div className="input-group">
              <label htmlFor="nome">Nome*</label>
              <input type="text" id="nome" name="nome" value={visitorData.nome} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label htmlFor="cognome">Cognome*</label>
              <input type="text" id="cognome" name="cognome" value={visitorData.cognome} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label htmlFor="diminutivo">Diminutivo</label>
              <input type="text" id="diminutivo" name="diminutivo" value={visitorData.diminutivo} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* Sezione Contatti */}
        <div className="form-section">
          <h3>Contatti</h3>
          <div className="form-row">
            {['azienda','indirizzo','citta','provincia','nazione'].map(field => (
              <div className="input-group" key={field}>
                <label htmlFor={field}>{field.charAt(0).toUpperCase()+field.slice(1)}</label>
                <input type="text" id={field} name={field} value={visitorData[field]} onChange={handleChange} />
              </div>
            ))}
          </div>
          <div className="form-row">
            {['telefono','cellulare','fax'].map(field => (
              <div className="input-group" key={field}>
                <label htmlFor={field}>{field.charAt(0).toUpperCase()+field.slice(1)}</label>
                <input type="tel" id={field} name={field} value={visitorData[field]} onChange={handleChange} />
              </div>
            ))}
            <div className="input-group">
              <label htmlFor="mail">Email</label>
              <input type="email" id="mail" name="mail" value={visitorData.mail} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* Sezione Documenti & Privacy */}
        <div className="form-section">
          <h3>Documenti & Privacy</h3>
          <div className="form-row">
            <div className="input-group">
              <label htmlFor="tipoDocumento">Tipo Documento</label>
              <input type="text" id="tipoDocumento" name="tipoDocumento" value={visitorData.tipoDocumento} onChange={handleChange} />
            </div>
            <div className="input-group">
              <label htmlFor="numeroDocumento">Numero Documento</label>
              <input type="text" id="numeroDocumento" name="numeroDocumento" value={visitorData.numeroDocumento} onChange={handleChange} />
            </div>
            <div className="input-group">
              <label htmlFor="dataScadenzaDocumento">Scadenza Documento</label>
              <input type="date" id="dataScadenzaDocumento" name="dataScadenzaDocumento" value={visitorData.dataScadenzaDocumento} onChange={handleChange} />
            </div>
          </div>
          <div className="form-row">
            <div className="checkbox-item">
              <input type="checkbox" name="duvri" id="duvri" checked={visitorData.duvri} onChange={handleChange} />
              <label htmlFor="duvri" className="custom-checkbox">DUVRI</label>
            </div>
            <div className="checkbox-item">
              <input type="checkbox" name="flagPrivacy" id="flagPrivacy" checked={visitorData.flagPrivacy} onChange={handleChange} />
              <label htmlFor="flagPrivacy" className="custom-checkbox">Consenso Privacy</label>
            </div>
            <div className="input-group">
              <label htmlFor="dataConsegnaPrivacy">Data Consegna Privacy</label>
              <input type="date" id="dataConsegnaPrivacy" name="dataConsegnaPrivacy" value={visitorData.dataConsegnaPrivacy} onChange={handleChange} />
            </div>
          </div>
        </div>

        <button type="submit" className="prenota-button">Crea Visitatore</button>
      </form>
    </div>
  );
};

export default AddVisitor;