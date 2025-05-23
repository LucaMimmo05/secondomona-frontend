import React from "react";
import DataTable from "react-data-table-component";
import "../styles/assignbadge.css";

const AssignBadge = () => {
    const columns = [
        { name: "Data", selector: (row) => row.data, sortable: true },
        { name: "Ora Inizio", selector: (row) => row.oraInizio, sortable: true },
        { name: "Ora Fine", selector: (row) => row.oraFine, sortable: true },
        { name: "Stato", selector: (row) => row.stato, sortable: true },
        { name: "Ospite", selector: (row) => row.ospite, sortable: true },
        { name: "Dipendente", selector: (row) => row.dipendente, sortable: true },
        {
        name: "Badge",
        selector: (row) => row.badge,
        sortable: true,
        cell: (row) => (
          <button className="badge-flag-button">
              <span className="badge-flag-icon" />
          </button>
          ),
      }
    ];

    const data = [
        {
            data: "01/01/2023",
            oraInizio: "08:00",
            oraFine: "17:00",
            stato: "In Corso",
            ospite: "Mario Rossi",
            dipendente: "Luca Bianchi",
            badge: "123456",
        },
        {
            data: "02/01/2023",
            oraInizio: "09:00",
            oraFine: "18:00",
            stato: "Completato",
            ospite: "Anna Verdi",
            dipendente: "Giovanni Neri",
            badge: "654321",
        },
    ];

    return (
        <div className="assign-badge-container">
            <div className="assign-badge-header">
                <h1 className="assign-badge-title">Assegna Badge</h1>
            </div>
            <div className="assign-badge-table-wrapper">
                <DataTable
                    columns={columns}
                    data={data}
                    pagination
                    responsive
                    highlightOnHover
                />
            </div>
        </div>
    );
};

export default AssignBadge;
