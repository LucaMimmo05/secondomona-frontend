// Configurazione toast globale con stili di default
import { toast } from "react-toastify";

// Configurazione di default per tutti i toast
export const defaultToastConfig = {
  position: "top-center",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

// Helper functions per toast comuni
export const showSuccess = (message) => {
  toast.success(message, defaultToastConfig);
};

export const showError = (message) => {
  toast.error(message, defaultToastConfig);
};

export const showInfo = (message) => {
  toast.info(message, defaultToastConfig);
};

export const showWarning = (message) => {
  toast.warn(message, defaultToastConfig);
};
