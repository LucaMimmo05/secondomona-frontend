import { useAuth } from "../context/AuthContext";  // adjust path as needed
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/login.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    // const response = await fetch("http://localhost:8080/login", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ email, password }),
    // });
    // const data = await response.json();

    // if (data.token) {
    //   // Puoi anche decodificare il JWT lato client per estrarre il ruolo, se il token lo contiene
    //   const userRole = data.role; // oppure estrai dal token
    //   login(data.token, userRole);

    //   // Redirect alla pagina giusta
    //   if (userRole === "admin") navigate("/admin");
    //   else if (userRole === "reception") navigate("/reception");
    //   else if (userRole === "employee") navigate("/employee");
    //   else navigate("/unauthorized");
    // }
  };

  return (
    <div className="mainContainer">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
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
