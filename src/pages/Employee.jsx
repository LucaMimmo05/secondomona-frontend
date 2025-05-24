import React from "react";
import "../styles/employee.css";
import "../styles/datatable-common.css";
import DataTable from "react-data-table-component";
const Employee = () => {
  const columns = [
    {
      name: "Nome",
      selector: (row) => row.nome,
      sortable: true,
      width: "130px",
    },
    {
      name: "Cognome",
      selector: (row) => row.cognome,
      sortable: true,
      width: "130px",
    },
    {
      name: "Matricola",
      selector: (row) => row.matricola,
      sortable: true,
      width: "100px",
    },
    {
      name: "Azienda",
      selector: (row) => row.azienda,
      sortable: true,
      width: "200px",
    },
    {
      name: "Data Assunzione",
      selector: (row) => row.dataAssunzione,
      sortable: true,
      width: "140px",
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
      <div className="employee-filter-box"></div>
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
