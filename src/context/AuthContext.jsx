import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(
    () => localStorage.getItem("accessToken") || localStorage.getItem("token")
  );
  const [role, setRole] = useState(() => localStorage.getItem("role"));

  const login = (jwt, userRole) => {
    // Salva sia accessToken che token per compatibilità
    localStorage.setItem("accessToken", jwt);
    localStorage.setItem("token", jwt);
    localStorage.setItem("role", userRole);
    setToken(jwt);
    setRole(userRole);
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
    setRole(null);

    console.log("Logout completato - localStorage pulito");
  };

  useEffect(() => {
    // Controlla sia accessToken che token per compatibilità
    const storedToken =
      localStorage.getItem("accessToken") || localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");

    if (storedToken) {
      setToken(storedToken);
    }
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
