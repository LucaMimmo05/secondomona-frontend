import React from "react";
import DataTable from "react-data-table-component";
import "../styles/assignbadge.css";
import "../styles/datatable-common.css";

const AssignBadge = () => {
  const columns = [
    {
      name: "Data",
      selector: (row) => row.data,
      sortable: true,
      width: "120px",
    },
    {
      name: "Ora Inizio",
      selector: (row) => row.oraInizio,
      sortable: true,
      width: "100px",
    },
    {
      name: "Ora Fine",
      selector: (row) => row.oraFine,
      sortable: true,
      width: "100px",
    },
    {
      name: "Stato",
      selector: (row) => row.stato,
      sortable: true,
      width: "100px",
    },
    {
      name: "Ospite",
      selector: (row) => row.ospite,
      sortable: true,
      width: "150px",
    },
    {
      name: "Dipendente",
      selector: (row) => row.dipendente,
      sortable: true,
      width: "150px",
    },
    {
      name: "Badge",
      selector: (row) => row.badge,
      sortable: true,
      width: "100px",
      cell: (row) => (
        <button className="badge-flag-button">
          <svg className="badge-flag-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4 22v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      ),
    },
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
      <div className="filter-results">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M11.3334 11.3334L14 14"
            stroke="#7F7F7F"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333Z"
            stroke="#7F7F7F"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <p>Assegna badge</p>
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