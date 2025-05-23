import { useAuth } from "../context/AuthContext"; // adjust path as needed
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/login.css";
import { toast, ToastContainer } from "react-toastify";
import { parseJwt } from "../utils/parseJwt";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Compila tutti i campi");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Risposta login:", data);
      

      if (response.ok && data) {
        toast.success("Accesso effettuato con successo");
        const decodedToken = parseJwt(data.accessToken);
        console.log(decodedToken);
        localStorage.setItem("name", decodedToken?.name);
      localStorage.setItem("surname", decodedToken?.surname);

        const groups = decodedToken?.groups || [];
        const userRole = groups.find((g) => g !== "access-token") || null;
        console.log("Ruolo utente:", userRole);

        login(data.accessToken, userRole);
        

       
        if (userRole === "Admin") navigate("/admin");
        else if (userRole === "Portineria") navigate("/reception");
        else if (userRole === "Dipendente") navigate("/employee");
        else return navigate("/");
      } else {
        toast.error("Credenziali errate o token mancante");
      }
    } catch (error) {
      console.error("Errore durante il login:", error);
      toast.error("Errore di connessione al server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mainContainer">
          <ToastContainer
            position="top-center"
            autoClose={2000}
            hideProgressBar
            closeOnClick
            draggable
            className="toastContainer"
            toastClassName="customToast"
            bodyClassName="toastBody"
            closeButton={false} 
          />
                  
      <div className="formContainer">
        <img
          src="src\assets\logo-blu.jpg"
          alt="Logo"
          width="180"
          height="127"
          className="logo"
        />

        <form onSubmit={handleLogin} className="loginForm">
          <div className="inputGroup">
            <label htmlFor="username" className="inputLabel">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="inputField"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="inputGroup">
            <label htmlFor="password" className="inputLabel">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="inputField"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <button type="submit" className="loginButton" disabled={loading}>
            {loading ? "Caricamento..." : "Accedi"}
          </button>
        </form>
      </div>
    </div>
  );
}