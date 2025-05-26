import React, { createContext, useContext, useState, useEffect } from "react";
import { getRoleFromToken } from "../utils/apiUtils";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(
    () => localStorage.getItem("accessToken") || localStorage.getItem("token")
  );

  const role = token ? getRoleFromToken(token) : null;
  const login = (jwt) => {
    localStorage.setItem("accessToken", jwt);
    localStorage.setItem("token", jwt);
    setToken(jwt);
    console.log(
      "Login completato - ruolo estratto dal token:",
      getRoleFromToken(jwt)
    );
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    localStorage.removeItem("surname");

  
    setToken(null);
  

    console.log("Logout completato - localStorage pulito");
  };

  useEffect(() => {
    
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
