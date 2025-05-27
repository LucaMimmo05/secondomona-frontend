import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { isTokenExpired, clearAuthData } from "../utils/apiUtils";

// Hook per controllare periodicamente la validità del token
export const useTokenValidation = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const checkTokenValidity = () => {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      // Se entrambi i token sono scaduti o mancanti
      if (
        (!accessToken || isTokenExpired(accessToken)) &&
        (!refreshToken || isTokenExpired(refreshToken))
      ) {
        console.log("Token scaduti rilevati - logout automatico");
        clearAuthData();
        logout();
        navigate("/");
      }
    };

    // Controlla immediatamente
    checkTokenValidity();

    // Controlla ogni 30 secondi
    const interval = setInterval(checkTokenValidity, 30000);

    return () => clearInterval(interval);
  }, [navigate, logout]);
};

export default useTokenValidation;
