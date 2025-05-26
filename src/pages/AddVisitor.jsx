import React, { useState } from "react";
import "../styles/addvisitor.css";

const AddVisitor = () => {
  const [visitorData, setVisitorData] = useState({
    nome: "",
    cognome: "",
    email: "",
    telefono: "",
    codiceFiscale: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVisitorData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dati visitatore:", visitorData);
    fetch("/api/persone/visitatore", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(visitorData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Errore invio dati visitatore");
        return res.json();
      })
      .then((data) => {
        alert("Visitatore aggiunto con successo");
        // Reset form
        setVisitorData({ nome: "", cognome: "", email: "", telefono: "", codiceFiscale: "" });
      })
      .catch((err) => alert(err.message));
  };

  return (
    <div className="add-visitor-container">
      <h1>Aggiungi Visitatore</h1>
      <form className="visitor-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <div className="form-row">
            <div className="input-group">
              <label>Nome*</label>
              <input
                type="text"
                name="nome"
                value={visitorData.nome}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="input-group">
              <label>Cognome*</label>
              <input
                type="text"
                name="cognome"
                value={visitorData.cognome}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={visitorData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="input-group">
              <label>Telefono</label>
              <input
                type="tel"
                name="telefono"
                value={visitorData.telefono}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="input-group full-width">
              <label>Codice Fiscale</label>
              <input
                type="text"
                name="codiceFiscale"
                value={visitorData.codiceFiscale}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        <button type="submit" className="submit-visitor-button">
          Aggiungi Visitatore
        </button>
      </form>
    </div>
  );
};

export default AddVisitor;
