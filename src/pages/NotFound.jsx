import React from "react";
import "../styles/notfoud.css"; 

export default function NotFound() {
    return (
        <div className="main-contenitore">
            <div className="grouppo">
                <span className="errore">404</span>
                <span className="paginanontrovata">Pagina Non Trovata!</span>
            </div>
            <div className="sectione">
                <a href="/" className="tornahome">Torna nella home</a>
            </div>
        </div>
    );
}
