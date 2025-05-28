import React, { useState } from "react";
import {
  apiCall,
  refreshAccessToken,
  isTokenExpired,
  getValidToken,
} from "../utils/apiUtils";

const RefreshTokenDebugger = () => {
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (test, status, message) => {
    setTestResults((prev) => [
      ...prev,
      { test, status, message, timestamp: new Date().toLocaleTimeString() },
    ]);
  };

  const runTests = async () => {
    setIsRunning(true);
    setTestResults([]);

    try {
      // Test 1: Verifica token
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      addResult(
        "Token Presence",
        accessToken && refreshToken ? "PASS" : "FAIL",
        `Access: ${!!accessToken}, Refresh: ${!!refreshToken}`
      );

      // Test 2: Scadenza
      const accessExpired = isTokenExpired(accessToken);
      const refreshExpired = isTokenExpired(refreshToken);

      addResult(
        "Token Expiration",
        "INFO",
        `Access expired: ${accessExpired}, Refresh expired: ${refreshExpired}`
      );

      // Test 3: API Call normale
      try {
        const data = await apiCall("/api/dipendenti");
        addResult(
          "Normal API Call",
          "PASS",
          `Received ${Array.isArray(data) ? data.length : "data"} items`
        );
      } catch (error) {
        addResult("Normal API Call", "FAIL", error.message);
      }

      // Test 4: Refresh forzato
      const originalToken = localStorage.getItem("accessToken");
      localStorage.setItem("accessToken", "invalid-token");

      try {
        const data = await apiCall("/api/dipendenti");
        addResult("Forced Refresh", "PASS", "Auto-refresh worked!");
      } catch (error) {
        addResult("Forced Refresh", "FAIL", error.message);
      } finally {
        localStorage.setItem("accessToken", originalToken);
      }

      // Test 5: Refresh manuale
      try {
        const newToken = await refreshAccessToken();
        addResult(
          "Manual Refresh",
          newToken ? "PASS" : "FAIL",
          newToken ? "New token obtained" : "Failed to get new token"
        );
      } catch (error) {
        addResult("Manual Refresh", "FAIL", error.message);
      }
    } catch (error) {
      addResult("Test Framework", "FAIL", error.message);
    } finally {
      setIsRunning(false);
    }
  };

  const clearResults = () => setTestResults([]);

  const getStatusColor = (status) => {
    switch (status) {
      case "PASS":
        return "#28a745";
      case "FAIL":
        return "#dc3545";
      case "INFO":
        return "#17a2b8";
      default:
        return "#6c757d";
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2>🔄 Refresh Token System Debugger</h2>

      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={runTests}
          disabled={isRunning}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginRight: "10px",
          }}
        >
          {isRunning ? "Running Tests..." : "Run Tests"}
        </button>

        <button
          onClick={clearResults}
          style={{
            padding: "10px 20px",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Clear Results
        </button>
      </div>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "5px",
          padding: "15px",
        }}
      >
        <h3>Test Results:</h3>
        {testResults.length === 0 ? (
          <p style={{ color: "#6c757d" }}>
            No tests run yet. Click "Run Tests" to start.
          </p>
        ) : (
          <div>
            {testResults.map((result, index) => (
              <div
                key={index}
                style={{
                  padding: "10px",
                  margin: "5px 0",
                  borderLeft: `4px solid ${getStatusColor(result.status)}`,
                  backgroundColor: "#f8f9fa",
                }}
              >
                <strong style={{ color: getStatusColor(result.status) }}>
                  [{result.status}] {result.test}
                </strong>
                <br />
                <span>{result.message}</span>
                <br />
                <small style={{ color: "#6c757d" }}>
                  Time: {result.timestamp}
                </small>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginTop: "20px", fontSize: "14px", color: "#6c757d" }}>
        <h4>Current Token Status:</h4>
        <p>
          <strong>Access Token:</strong>{" "}
          {localStorage.getItem("accessToken") ? "Present" : "Missing"}
        </p>
        <p>
          <strong>Refresh Token:</strong>{" "}
          {localStorage.getItem("refreshToken") ? "Present" : "Missing"}
        </p>
        <p>
          <strong>Access Expired:</strong>{" "}
          {isTokenExpired(localStorage.getItem("accessToken")) ? "Yes" : "No"}
        </p>
        <p>
          <strong>Refresh Expired:</strong>{" "}
          {isTokenExpired(localStorage.getItem("refreshToken")) ? "Yes" : "No"}
        </p>
      </div>
    </div>
  );
};

export default RefreshTokenDebugger;
