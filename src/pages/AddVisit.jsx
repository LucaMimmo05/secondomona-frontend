import React from 'react';
import '../styles/addvisit.css';

const AddVisit = () => {
  return (
    <div className="add-visit-container">
      <h1>Aggiungi visita</h1>
      
      <div className="progress-checkboxes">
        <label className="checkbox-item">
          <input type="checkbox" checked={false}/>
          <span className="checkmark"></span>
          Compila i dati anagrafici
        </label>
        
        <label className="checkbox-item">
          <input type="checkbox" checked={true}/>
          <span className="checkmark"></span>
          Dettagli visita
        </label>
      </div>
      <form className="visit-form">
        <div className="form-row">
          <div className="input-group">
            <label>Nome e cognome</label>
            <input type="text" />
          </div>
          <div className="input-group">
            <label>Data visita</label>
            <input type="date" />
          </div>
        </div>

        <div className="form-row">
          <div className="input-group">
            <label>Numero di telefono</label>
            <input type="tel" />
          </div>
          <div className="input-group">
            <label>Orario inizio</label>
            <input type="time" />
          </div>
        </div>

        <div className="form-row">
          <div className="input-group">
            <label>Email</label>
            <input type="email" />
          </div>
          <div className="input-group">
            <label>Orario fine</label>
            <input type="time" />
          </div>
        </div>

        <div className="form-row">
          <div className="input-group">
            <label>Codice fiscale</label>
            <input type="text" />
          </div>
          <button type="submit" className="prenota-button">Prenota</button>
        </div>
      </form>
    </div>
  );
};

export default AddVisit;