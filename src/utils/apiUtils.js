// Utility per gestire le chiamate API con controllo automatico dei token
import { parseJwt } from "./parseJwt";
import {
  handleApiError,
  AppError,
  ERROR_TYPES,
  logError,
} from "./errorHandler";

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

// Funzione per estrarre il ruolo dal token JWT (sicuro)
export const getRoleFromToken = (token) => {
  if (!token) return null;

  try {
    const decoded = parseJwt(token);
    if (!decoded || !decoded.groups) return null;

    // Estrae il ruolo dai groups, escludendo "access-token"
    const userRole = decoded.groups.find((group) => group !== "access-token");
    return userRole || null;
  } catch (error) {
    console.error("Errore nell'estrazione del ruolo dal token:", error);
    return null;
  }
};

// Funzione per estrarre l'ID dell'utente dal token JWT
export const getUserIdFromToken = (token) => {
  if (!token) return null;

  try {
    const decoded = parseJwt(token);
    if (!decoded) return null;

    // L'ID dell'utente potrebbe essere in 'sub', 'userId', 'id', o 'idPersona'
    return decoded.sub || decoded.userId || decoded.id || decoded.idPersona || null;
  } catch (error) {
    console.error("Errore nell'estrazione dell'ID utente dal token:", error);
    return null;
  }
};

// Funzione per validare se il token ha un ruolo autorizzato
export const validateTokenRole = (token, allowedRoles) => {
  if (!token || !allowedRoles || allowedRoles.length === 0) return false;

  const tokenRole = getRoleFromToken(token);
  if (!tokenRole) return false;

  return allowedRoles.includes(tokenRole);
};

// Funzione per ottenere un nuovo access token usando il refresh token
export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken || isTokenExpired(refreshToken)) {
    console.log("Refresh token mancante o scaduto");
    return null;
  }

  try {
    console.log("Tentativo di refresh del token...");
    const response = await fetch(`${BASE_URL}/api/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      const newAccessToken = data.accessToken;

      // Salva il nuovo access token
      localStorage.setItem("accessToken", newAccessToken);
      localStorage.setItem("token", newAccessToken);

      console.log("Token refreshed con successo");
      return newAccessToken;
    } else {
      console.error("Errore nel refresh del token:", response.status);
      return null;
    }
  } catch (error) {
    console.error("Errore nella chiamata di refresh:", error);
    return null;
  }
};

export const getValidToken = async () => {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  // Se l'access token è valido, usalo
  if (accessToken && !isTokenExpired(accessToken)) {
    return accessToken;
  }

  // Se l'access token è scaduto ma abbiamo il refresh token, prova a fare refresh
  if (refreshToken && !isTokenExpired(refreshToken)) {
    const newAccessToken = await refreshAccessToken();
    if (newAccessToken) {
      return newAccessToken;
    }
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
  localStorage.removeItem("idPersona");
  localStorage.removeItem("idTessera");
  localStorage.removeItem("isWorking");
  localStorage.removeItem("lastPunch");
  console.log("Dati di autenticazione rimossi dal localStorage");
};

export const apiCall = async (url, options = {}) => {
  const BASE_URL = "http://localhost:8080";
  const fullUrl = url.startsWith("http") ? url : `${BASE_URL}${url}`;

  let token = await getValidToken();

  if (!token) {
    const error = new AppError(
      "Sessione scaduta. Effettua nuovamente l'accesso.",
      ERROR_TYPES.AUTH
    );
    logError(error, `apiCall to ${url}`);
    clearAuthData();
    window.location.href = "/";
    throw error;
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
    const response = await fetch(fullUrl, config);

    // Se il server restituisce 401/403, potrebbe essere che il token è scaduto
    if (response.status === 401 || response.status === 403) {
      console.log("Token non autorizzato, tentativo di refresh...");

      const newToken = await refreshAccessToken();
      if (newToken) {
        // Riprova la chiamata con il nuovo token
        const retryConfig = {
          ...config,
          headers: {
            ...config.headers,
            Authorization: `Bearer ${newToken}`,
          },
        };

        const retryResponse = await fetch(fullUrl, retryConfig);

        if (retryResponse.status === 401 || retryResponse.status === 403) {
          // Anche dopo il refresh non funziona, logout
          const error = new AppError(
            "Sessione scaduta. Effettua nuovamente l'accesso.",
            ERROR_TYPES.AUTH,
            { status: retryResponse.status }
          );
          logError(error, `apiCall retry to ${url}`);
          clearAuthData();
          window.location.href = "/";
          throw error;
        }

        if (!retryResponse.ok) {
          const errorData = await retryResponse.json().catch(() => ({}));
          const error = new AppError(
            errorData.message || `HTTP ${retryResponse.status}`,
            ERROR_TYPES.SERVER,
            { status: retryResponse.status, data: errorData }
          );
          throw error;
        }

        return retryResponse.json();
      } else {
        // Impossibile fare refresh, logout
        const error = new AppError(
          "Impossibile rinnovare la sessione. Effettua nuovamente l'accesso.",
          ERROR_TYPES.AUTH
        );
        logError(error, `apiCall refresh failed for ${url}`);
        clearAuthData();
        window.location.href = "/";
        throw error;
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new AppError(
        errorData.message || `HTTP ${response.status}`,
        ERROR_TYPES.SERVER,
        { status: response.status, data: errorData }
      );
      throw error;
    }

    return response.json();
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    const handledError = handleApiError(error, `apiCall to ${url}`);
    logError(handledError, `apiCall to ${url}`);
    throw handledError;
  }
};
