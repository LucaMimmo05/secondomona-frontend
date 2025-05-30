import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";

// Import API utilities for testing
import * as apiUtils from "./utils/apiUtils.js";

// Make API utilities available globally for testing
if (typeof window !== "undefined") {
  window.apiUtils = apiUtils;
  Object.assign(window, apiUtils);
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
