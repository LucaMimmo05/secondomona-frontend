import React from "react";
import "../styles/employee.css";
import "../styles/datatable-common.css";
import DataTable from "react-data-table-component";
import { useEffect } from "react";
const Employee = () => {
  const [data, setData] = React.useState([]);
  const columns = [
    {
      name: "ID",
      selector: (row) => row.idPersona,
      sortable: true,
      grow: 1,
      center: true,
    },
    {
      name: "Nome",
      selector: (row) => row.nome,
      sortable: true,
      grow: 2,
      center: true,
    },
    {
      name: "Cognome",
      selector: (row) => row.cognome,
      sortable: true,
      grow: 2,
      center: true,
    },
    {
      name: "Diminutivo",
      selector: (row) => row.diminutivo,
      sortable: true,
      grow: 1.5,
      center: true,
    },
    {
      name: "ID Runa",
      selector: (row) => row.idRuna,
      sortable: true,
      grow: 1,
      center: true,
    },
    {
      name: "Email",
      selector: (row) => row.mail || "N/A",
      sortable: true,
      grow: 3,
      center: true,
    },
    {
      name: "Ruolo",
      selector: (row) => row.ruolo || "N/A",
      sortable: true,
      grow: 2,
      center: true,
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const token =
        localStorage.getItem("accessToken") ||
        localStorage.getItem("refreshToken");
      try {
        const response = await fetch(
          "http://localhost:8080/api/dipendenti",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
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
