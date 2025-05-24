import React, { createContext, useContext, useState, useEffect } from "react";
import { getRoleFromToken } from "../utils/apiUtils";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(
    () => localStorage.getItem("accessToken") || localStorage.getItem("token")
  );

  // Il ruolo viene sempre estratto dal token, non dal localStorage
  const role = token ? getRoleFromToken(token) : null;
  const login = (jwt, userRole) => {
    // Salva solo il token, il ruolo viene estratto dal token stesso
    localStorage.setItem("accessToken", jwt);
    localStorage.setItem("token", jwt);
    // NON salviamo più il role nel localStorage per sicurezza
    // Il ruolo viene sempre estratto dal token JWT
    setToken(jwt);
    console.log(
      "Login completato - ruolo estratto dal token:",
      getRoleFromToken(jwt)
    );
  };

  const logout = () => {
    // Rimuovi TUTTI i dati dell'utente dal localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    localStorage.removeItem("surname");

    // Reset dello stato
    setToken(null);
    // Il role viene automaticamente resettato perché dipende dal token

    console.log("Logout completato - localStorage pulito");
  };

  useEffect(() => {
    // Controlla solo il token, il ruolo viene estratto automaticamente
    const storedToken =
      localStorage.getItem("accessToken") || localStorage.getItem("token");

    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
