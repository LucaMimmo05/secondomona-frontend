import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getRoleFromToken,
  getUserIdFromToken,
  refreshAccessToken,
  apiCall,
} from "../utils/apiUtils";

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
  const userId = token ? getUserIdFromToken(token) : null;

  // Funzione per aggiornare il token
  const updateToken = (newToken) => {
    localStorage.setItem("accessToken", newToken);
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };
  const login = (jwt, refreshJwt = null) => {
    localStorage.setItem("accessToken", jwt);
    localStorage.setItem("token", jwt);
    if (refreshJwt) {
      localStorage.setItem("refreshToken", refreshJwt);
    }
    setToken(jwt);
    console.log(
      "Login completato - ruolo estratto dal token:",
      getRoleFromToken(jwt)
    );

    // Dopo il login, verifica lo stato delle timbrature dal server
    // Aspetta un po' per assicurarsi che i dati della persona siano stati salvati
    setTimeout(() => {
      console.log("[LOADING] Avvio controllo stato timbrature dopo login...");
      checkWorkingStatus();
    }, 500);
  };
  const logout = () => {
    // Salva lo stato delle timbrature prima di pulire tutto
    const currentIsWorking = localStorage.getItem("isWorking");
    const currentLastPunch = localStorage.getItem("lastPunch");

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    localStorage.removeItem("surname");
    localStorage.removeItem("idPersona");
    localStorage.removeItem("idTessera");

    // Ripristina lo stato delle timbrature
    if (currentIsWorking) {
      localStorage.setItem("isWorking", currentIsWorking);
    }
    if (currentLastPunch) {
      localStorage.setItem("lastPunch", currentLastPunch);
    }

    setToken(null);
    // Non resettiamo isWorking e lastPunch se l'utente è ancora al lavoro
    // Lo stato verrà mantenuto per il prossimo login

    console.log("Logout completato - stato timbrature preservato");
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
    const idTessera = localStorage.getItem("idTessera");

    if (!idPersona && !idTessera) {
      console.log("❌ Nessun ID disponibile per il controllo stato timbrature");
      return;
    }

    console.log("🔍 Controllo stato timbrature dal server per:", {
      idPersona,
      idTessera,
    });

    try {
      // Usa l'endpoint corretto per le timbrature di oggi
      const id = idPersona || idTessera;
      const endpoint = `/api/timbrature/oggi/${id}`;
      console.log("🔍 Chiamata all'endpoint:", endpoint);
      let data = null;
      try {
        data = await apiCall(endpoint, { method: "GET" });
        console.log("✅ Dati ricevuti:", data?.length || 0, "timbrature");
      } catch (error) {
        console.log("❌ Errore nel recupero timbrature:", error.message);
        // Non modificare lo stato se c'è un errore di rete
        // Mantieni lo stato attuale per evitare reset involontari
        return;
      }

      if (!data || !Array.isArray(data) || data.length === 0) {
        // Controlla se siamo già in uno stato "al lavoro" nel localStorage
        const currentWorkingState = localStorage.getItem("isWorking");

        if (currentWorkingState === "true") {
          console.log(
            "📭 Nessuna timbratura dal server, ma stato locale indica 'al lavoro' - mantengo stato attuale"
          );
          return; // Non sovrascrivere lo stato esistente
        }

        console.log("📭 Nessuna timbratura oggi - stato: non al lavoro");
        setIsWorking(false);
        setLastPunch(null);
        localStorage.setItem("isWorking", "false");
        localStorage.removeItem("lastPunch");
        return;
      }

      // Ordina per timestamp (più recente per ultimo)
      const sortedData = [...data].sort(
        (a, b) =>
          new Date(a.timestamp || a.dataOraTimbratura) -
          new Date(b.timestamp || b.dataOraTimbratura)
      );

      // Prendi l'ultima timbratura
      const lastPunch = sortedData[sortedData.length - 1];
      const isCurrentlyWorking =
        (lastPunch.tipo || lastPunch.tipoTimbratura) === "ENTRATA";

      const punchData = {
        tipo: lastPunch.tipo || lastPunch.tipoTimbratura,
        timestamp: lastPunch.timestamp || lastPunch.dataOraTimbratura,
        note: lastPunch.note,
      };

      console.log(
        "🎯 Ultima timbratura:",
        punchData,
        "Al lavoro:",
        isCurrentlyWorking
      );

      setIsWorking(isCurrentlyWorking);
      setLastPunch(punchData);

      // Persisti lo stato nel localStorage
      localStorage.setItem("isWorking", isCurrentlyWorking.toString());
      localStorage.setItem("lastPunch", JSON.stringify(punchData));
    } catch (error) {
      console.error("❌ Errore nel controllo stato timbrature:", error);
    }
  };
  useEffect(() => {
    const storedToken =
      localStorage.getItem("accessToken") || localStorage.getItem("token");

    if (storedToken) {
      setToken(storedToken);
      // Controlla lo stato delle timbrature al caricamento
      checkWorkingStatus();
    } else {
      // Anche senza token, ripristina lo stato delle timbrature se presente
      const storedIsWorking = localStorage.getItem("isWorking");
      const storedLastPunch = localStorage.getItem("lastPunch");

      if (storedIsWorking === "true") {
        setIsWorking(true);
      }
      if (storedLastPunch) {
        try {
          setLastPunch(JSON.parse(storedLastPunch));
        } catch (e) {
          console.error("Errore nel parsing di lastPunch:", e);
        }
      }
    }
  }, []);
  return (
    <AuthContext.Provider
      value={{
        token,
        role,
        userId,
        login,
        logout,
        updateToken,
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
