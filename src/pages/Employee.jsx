import React from "react";
import "../styles/employee.css";
import DataTable from "react-data-table-component";
const Employee = () => {
  const columns = [
    { name: "Nome", selector: (row) => row.nome, sortable: true },
    { name: "Cognome", selector: (row) => row.cognome, sortable: true },
    { name: "Matricola", selector: (row) => row.matricola, sortable: true },
    { name: "Azienda", selector: (row) => row.azienda, sortable: true },
    {
      name: "Data Assunzione",
      selector: (row) => row.dataAssunzione,
      sortable: true,
    },
  ];

  const data = [
    {
      nome: "Luca",
      cognome: "Mimmo",
      matricola: "1",
      azienda: "INCOM S.p.A.",
      dataAssunzione: "15/03/2022",
    },
    {
      nome: "Giulia",
      cognome: "Rossi",
      matricola: "2",
      azienda: "NextGen Solutions",
      dataAssunzione: "01/09/2021",
    },
    {
      nome: "Marco",
      cognome: "Bianchi",
      matricola: "3",
      azienda: "LogiTrans SRL",
      dataAssunzione: "20/06/2020",
    },
    {
      nome: "Sara",
      cognome: "Verdi",
      matricola: "4",
      azienda: "INCOM S.p.A.",
      dataAssunzione: "05/11/2019",
    },
    {
      nome: "Andrea",
      cognome: "Neri",
      matricola: "5",
      azienda: "NextGen Solutions",
      dataAssunzione: "10/02/2023",
    },
  ];

  return (
    <div className="employee">
      <h1>Dipendenti</h1>
      <div className="employee-filter-box">
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
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333Z"
              stroke="#7F7F7F"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p>Filtra per data</p>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={data}
        pagination
        responsive
        highlightOnHover
      />
    </div>
  );
};

export default Employee;
