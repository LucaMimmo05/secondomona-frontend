'use client';

import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/login.css';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      toast.error('Per favore compila tutti i campi.');
      return;
    }
    setLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 1500));
      if (username === 'admin' && password === 'password') {
        toast.success('Login avvenuto con successo!');
        // Redirigi o salva token
      } else {
        toast.error('Credenziali non valide.');
      }
    } catch (error) {
      toast.error('Si è verificato un errore. Riprova più tardi.');
    } finally {
      setLoading(false);
    }
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

        <form onSubmit={handleSubmit} className="loginForm">
          <div className="inputGroup">
            <label htmlFor="username" className="inputLabel">
              Email
            </label>
            <input
              id="username"
              type="text"
              className="inputField"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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

          <button
            type="submit"
            className="loginButton"
            disabled={loading}
          >
            {loading ? 'Caricamento...' : 'Accedi'}
          </button>
        </form>
      </div>
    </div>
  );
}
