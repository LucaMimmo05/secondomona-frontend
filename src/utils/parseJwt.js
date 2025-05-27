export function parseJwt(token) {
  if (!token) return null;
  try {
    const base64Url = token.split(".")[1]; // prendi la seconda parte del JWT
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64) // decodifica base64
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload); // trasforma la stringa JSON in oggetto JS
  } catch (e) {
    console.error("Invalid JWT token", e);
    return null;
  }
}
