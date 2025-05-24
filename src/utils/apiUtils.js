// Utility per gestire le chiamate API con controllo automatico dei token
import { parseJwt } from "./parseJwt";

export const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const decoded = parseJwt(token);
    if (!decoded || !decoded.exp) return true;

    // Controlla se il token è scaduto (con margine di 30 secondi)
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime + 30;
  } catch (error) {
    console.error("Errore nel controllo scadenza token:", error);
    return true;
  }
};

export const getValidToken = () => {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  // Prova prima accessToken, poi refreshToken
  if (accessToken && !isTokenExpired(accessToken)) {
    return accessToken;
  }

  if (refreshToken && !isTokenExpired(refreshToken)) {
    return refreshToken;
  }

  return null;
};

export const clearAuthData = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("name");
  localStorage.removeItem("surname");
  console.log("Dati di autenticazione rimossi dal localStorage");
};

export const apiCall = async (url, options = {}) => {
  const token = getValidToken();

  if (!token) {
    console.error("Nessun token valido trovato - logout automatico");
    clearAuthData();
    // Ricarica la pagina per mandare al login
    window.location.href = "/";
    throw new Error("Token scaduto o mancante");
  }

  const defaultHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    // Se il server restituisce 401/403, significa che il token non è valido
    if (response.status === 401 || response.status === 403) {
      console.error("Token non autorizzato - logout automatico");
      clearAuthData();
      window.location.href = "/";
      throw new Error("Token non autorizzato");
    }

    return response;
  } catch (error) {
    console.error("Errore nella chiamata API:", error);
    throw error;
  }
};
