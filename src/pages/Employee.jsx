import React from "react";
import "../styles/employee.css";
import "../styles/datatable-common.css";
import DataTable from "react-data-table-component";
import { useEffect } from "react";
const Employee = () => {

  const [data, setData] = React.useState([]);
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

  useEffect(() => {
  const fetchData = async () => {
    const token = localStorage.getItem("accessToken") || localStorage.getItem("refreshToken");
    try {
      const response = await fetch("http://localhost:8080/person", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("Fetched data:", data);
      setData(data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  fetchData();
}, []);


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
