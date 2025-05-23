import React from "react";
import "../styles/addemployee.css";

const AddEmployee = () => {
    return (
        <div className="add-visit-container">
            <h1>Aggiungi dipendente</h1>
            <form className="visit-form">
                <div className="input-group">
                    <label>Nome e cognome*</label>
                    <input type="text" />
                </div>
                <div className="input-group">
                    <label>Indirizzo*</label>
                    <input type="text" />
                </div>
                <div className="input-group">
                    <label>Città*</label>
                    <input type="text" />
                </div>
                <div className="input-group">
                    <label>Provincia*</label>
                    <input type="text" />
                </div>
                <div className="input-group">
                    <label>Nazione*</label>
                    <input type="text" />
                </div>
                <div className="input-group">
                    <label>Numero di telefono*</label>
                    <input type="tel" />
                </div>
                <div className="input-group">
                    <label>Partita iva</label>
                    <input type="text" />
                </div>
                <div className="input-group">
                    <label>Codice fiscale*</label>
                    <input type="text" />
                </div>
                <div className="input-group">
                    <label>Mail*</label>
                    <input type="email" />
                </div>
                <div className="input-group">
                    <label>Luogo di nascita*</label>
                    <input type="text" />
                </div>
                <div className="input-group">
                    <label>Data di nascita*</label>
                    <input type="email" />
                </div>
                <div className="input-group">
                    <label>Data scadenza certificato medico*</label>
                    <input type="date" />
                </div>

                <div className="input-group">
                    <label>Preposto</label>
                    <input type="text" />
                </div>
                <div className="input-group">
                    <label>Certificato antincendio</label>
                    <input type="checkbox" />
                </div>
                <div className="input-group">
                    <label>Certificato primo soccorso</label>
                    <input type="text" />
                </div>
                <div className="input-group">
                    <label>Codice fiscale</label>
                    <input type="checkbox" />
                </div>
                <button type="submit" className="prenota-button">
                    Aggiungi
                </button>
            </form>
        </div>
    );
};

export default AddEmployee;
