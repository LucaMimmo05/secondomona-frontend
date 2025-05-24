import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ allowedRoles }) => {
  const { token, role } = useAuth();

  // Controlla anche nel localStorage se il token non è nell'AuthContext
  const fallbackToken =
    token ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token");
  const fallbackRole = role || localStorage.getItem("role");

  console.log(
    "ProtectedRoute - Token:",
    !!fallbackToken,
    "Role:",
    fallbackRole
  );

  if (!fallbackToken) {
    console.log("Nessun token trovato - redirect al login");
    return <Navigate to="/" />;
  }

  if (!allowedRoles.includes(fallbackRole)) {
    console.log(
      `Ruolo ${fallbackRole} non autorizzato per ${allowedRoles} - redirect al login`
    );
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
