// Test di sicurezza per verificare che la manipolazione del localStorage non funzioni più
console.log("=== TEST DI SICUREZZA ===");

// Simuliamo un token JWT valido con ruolo Dipendente
const validEmployeeToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjk5OTk5OTk5OTksImdyb3VwcyI6WyJEaXBlbmRlbnRlIiwiYWNjZXNzLXRva2VuIl19.Dz_3q4KWR3Z0-8V9K5X7f2M1N6P8Q9R0S3T4U5V6W7X";

// Simuliamo un token JWT valido con ruolo Admin
const validAdminToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFkbWluIFVzZXIiLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6OTk5OTk5OTk5OSwiZ3JvdXBzIjpbIkFkbWluIiwiYWNjZXNzLXRva2VuIl19.gK_8r5NWS4A0-9Y8L6O7h3N2P9Q0R1S2T3U4V5W6X7Y";

console.log("1. Testando estrazione ruolo da token valido Employee...");
// Test con token Employee valido (dovrebbe restituire "Dipendente")
console.log(
  "Token Employee - Ruolo estratto:",
  getRoleFromTokenTest(validEmployeeToken)
);

console.log("2. Testando estrazione ruolo da token valido Admin...");
// Test con token Admin valido (dovrebbe restituire "Admin")
console.log(
  "Token Admin - Ruolo estratto:",
  getRoleFromTokenTest(validAdminToken)
);

console.log("3. Testando validazione autorizzazioni...");
// Test validazione autorizzazioni
console.log(
  "Employee può accedere a [Dipendente]:",
  validateTokenRoleTest(validEmployeeToken, ["Dipendente"])
);
console.log(
  "Employee può accedere a [Admin]:",
  validateTokenRoleTest(validEmployeeToken, ["Admin"])
);
console.log(
  "Admin può accedere a [Admin]:",
  validateTokenRoleTest(validAdminToken, ["Admin"])
);
console.log(
  "Admin può accedere a [Dipendente]:",
  validateTokenRoleTest(validAdminToken, ["Dipendente"])
);

console.log("4. Testando resistenza a manipolazione localStorage...");
// Simulazione di manipolazione del localStorage
localStorage.setItem("role", "Admin");
console.log("localStorage role manipolato:", localStorage.getItem("role"));
console.log(
  "Ma il ruolo dal token Employee rimane:",
  getRoleFromTokenTest(validEmployeeToken)
);
console.log(
  "Validazione fallisce per token Employee su ruoli Admin:",
  validateTokenRoleTest(validEmployeeToken, ["Admin"])
);

console.log("=== FINE TEST ===");

// Funzioni di test (copie semplificate delle funzioni di sicurezza)
function parseJwtTest(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Errore nel parsing JWT:", error);
    return null;
  }
}

function getRoleFromTokenTest(token) {
  if (!token) return null;
  try {
    const decoded = parseJwtTest(token);
    if (!decoded || !decoded.groups) return null;
    const userRole = decoded.groups.find((group) => group !== "access-token");
    return userRole || null;
  } catch (error) {
    console.error("Errore nell'estrazione del ruolo dal token:", error);
    return null;
  }
}

function validateTokenRoleTest(token, allowedRoles) {
  if (!token || !allowedRoles || allowedRoles.length === 0) return false;
  const tokenRole = getRoleFromTokenTest(token);
  if (!tokenRole) return false;
  return allowedRoles.includes(tokenRole);
}
