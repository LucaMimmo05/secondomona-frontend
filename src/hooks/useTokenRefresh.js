import { useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { isTokenExpired, refreshAccessToken } from "../utils/apiUtils";

/**
 * Hook personalizzato per gestire il refresh automatico dei token
 * Controlla periodicamente la scadenza del token e lo rinnova automaticamente
 */
export const useTokenRefresh = () => {
  const { token, updateToken, logout } = useAuth();

  const checkAndRefreshToken = useCallback(async () => {
    if (!token) return;

    // Se il token sta per scadere (entro 5 minuti), prova a fare refresh
    const tokenWillExpireSoon = isTokenExpired(token);

    if (tokenWillExpireSoon) {
      console.log("Token sta per scadere, tentativo di refresh automatico...");

      try {
        const newToken = await refreshAccessToken();
        if (newToken) {
          updateToken(newToken);
          console.log("Token refreshed automaticamente");
        } else {
          console.log("Impossibile fare refresh del token, logout necessario");
          logout();
        }
      } catch (error) {
        console.error("Errore durante il refresh automatico:", error);
        logout();
      }
    }
  }, [token, updateToken, logout]);

  // Controlla il token ogni 2 minuti
  useEffect(() => {
    if (!token) return;

    const interval = setInterval(checkAndRefreshToken, 2 * 60 * 1000); // 2 minuti

    return () => clearInterval(interval);
  }, [checkAndRefreshToken, token]);

  // Controlla il token anche al focus della finestra
  useEffect(() => {
    const handleFocus = () => {
      checkAndRefreshToken();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [checkAndRefreshToken]);

  return {
    checkAndRefreshToken,
  };
};
