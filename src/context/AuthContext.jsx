import React, { createContext, useContext, useState, useEffect } from "react";
import { getRoleFromToken } from "../utils/apiUtils";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(
    () => localStorage.getItem("accessToken") || localStorage.getItem("token")
  );
  const [isWorking, setIsWorking] = useState(() => {
    const stored = localStorage.getItem("isWorking");
    return stored === "true";
  });
  const [lastPunch, setLastPunch] = useState(() => {
    const stored = localStorage.getItem("lastPunch");
    return stored ? JSON.parse(stored) : null;
  });

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
    localStorage.removeItem("idPersona");
    localStorage.removeItem("idTessera");
    localStorage.removeItem("isWorking");
    localStorage.removeItem("lastPunch");

    setToken(null);
    setIsWorking(false);
    setLastPunch(null);

    console.log("Logout completato - localStorage pulito");
  };

  // Funzione per aggiornare lo stato delle timbrature
  const updateWorkingStatus = (working, punchData = null) => {
    setIsWorking(working);
    setLastPunch(punchData);

    // Persisti lo stato nel localStorage
    localStorage.setItem("isWorking", working.toString());
    if (punchData) {
      localStorage.setItem("lastPunch", JSON.stringify(punchData));
    } else {
      localStorage.removeItem("lastPunch");
    }
  };

  // Funzione per controllare lo stato attuale dalle timbrature del server
  const checkWorkingStatus = async () => {
    const idPersona = localStorage.getItem("idPersona");
    const authToken =
      localStorage.getItem("accessToken") ||
      localStorage.getItem("refreshToken");

    if (!idPersona || !authToken) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/timbrature/oggi/${idPersona}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const sortedData = data.sort(
          (a, b) =>
            new Date(a.timestamp || a.dataOraTimbratura) -
            new Date(b.timestamp || b.dataOraTimbratura)
        );

        if (sortedData.length > 0) {
          const lastPunch = sortedData[sortedData.length - 1];
          const isCurrentlyWorking =
            (lastPunch.tipo || lastPunch.tipoTimbratura) === "ENTRATA";
          const punchData = {
            tipo: lastPunch.tipo || lastPunch.tipoTimbratura,
            timestamp: lastPunch.timestamp || lastPunch.dataOraTimbratura,
            note: lastPunch.note,
          };

          setIsWorking(isCurrentlyWorking);
          setLastPunch(punchData);

          // Persisti lo stato nel localStorage
          localStorage.setItem("isWorking", isCurrentlyWorking.toString());
          localStorage.setItem("lastPunch", JSON.stringify(punchData));
        } else {
          setIsWorking(false);
          setLastPunch(null);
          localStorage.setItem("isWorking", "false");
          localStorage.removeItem("lastPunch");
        }
      }
    } catch (error) {
      console.error("Errore nel controllo stato timbrature:", error);
    }
  };

  useEffect(() => {
    const storedToken =
      localStorage.getItem("accessToken") || localStorage.getItem("token");

    if (storedToken) {
      setToken(storedToken);
      // Controlla lo stato delle timbrature al caricamento
      checkWorkingStatus();
    }
  }, []);
  return (
    <AuthContext.Provider
      value={{
        token,
        role,
        login,
        logout,
        isWorking,
        lastPunch,
        updateWorkingStatus,
        checkWorkingStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
