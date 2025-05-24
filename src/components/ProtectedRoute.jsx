import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { validateTokenRole, getRoleFromToken } from "../utils/apiUtils";

const ProtectedRoute = ({ allowedRoles }) => {
  const { token } = useAuth();

  // Controlla anche nel localStorage se il token non è nell'AuthContext
  const fallbackToken =
    token ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token");

  console.log(
    "ProtectedRoute - Token:",
    !!fallbackToken,
    "Allowed Roles:",
    allowedRoles
  );

  if (!fallbackToken) {
    console.log("Nessun token trovato - redirect al login");
    return <Navigate to="/" />;
  }

  // SICUREZZA: Valida il ruolo dal token JWT, non dal localStorage
  const isAuthorized = validateTokenRole(fallbackToken, allowedRoles);
  const tokenRole = getRoleFromToken(fallbackToken);

  console.log(
    "ProtectedRoute - Ruolo dal token:",
    tokenRole,
    "Autorizzato:",
    isAuthorized
  );

  if (!isAuthorized) {
    console.log(
      `Ruolo ${tokenRole} non autorizzato per ${allowedRoles} - redirect al login`
    );
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
