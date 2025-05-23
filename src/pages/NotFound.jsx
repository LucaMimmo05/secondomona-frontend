import React from "react";
import "../styles/notfound.css"; 

export default function NotFound() {
    return (
        <div className="main-contenitore">
            <div className="gruppo">
                <span className="errore">404</span>
                <span className="paginanontrovata">Pagina Non Trovata!</span>
            </div>
            <div className="sezione">
                <a href="/" className="tornahome">Torna nella home</a>
            </div>
        </div>
    );
}
