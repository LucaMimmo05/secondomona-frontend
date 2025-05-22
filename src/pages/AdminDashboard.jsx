import React, { useEffect, useState } from 'react';

const AdminDashboard = () => {
  const [name, setName] = useState("Admin");
  const [surname, setSurname] = useState("Admin");

  useEffect(() => {
    setName(localStorage.getItem("name"));
    setSurname(localStorage.getItem("surname"));
  }, []);

  return (
    <div>Ciao {name} {surname}</div>
  );
};

export default AdminDashboard;
