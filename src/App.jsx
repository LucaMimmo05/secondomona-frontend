import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate
} from "react-router-dom";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import ReceptionDashboard from "./pages/ReceptionDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Component to prevent access to login if already authenticated
const RequireNoAuth = ({ children }) => {
  const { token, role } = useAuth() || {};
  const navigate = useNavigate();

  useEffect(() => {
    if (token && role) {
      if (role === 'Portineria') navigate('/reception', { replace: true });
      if (role === 'Dipendenti') navigate('/employee', { replace: true });
      if (role === 'Admin') navigate('/admin', { replace: true });
    }
  }, [token, role, navigate]);

  // Se non loggato, mostra la login
  return !(token && role) ? children : null;
};

const App = () => (
  <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={
          <RequireNoAuth>
            <Login />
          </RequireNoAuth>
        } />
        {/* Reception */}
        <Route element={<ProtectedRoute allowedRoles={['Portineria']} />}>
          <Route path="/reception" element={<ReceptionDashboard />} />
        </Route>
        {/* Employee */}
        <Route element={<ProtectedRoute allowedRoles={['Dipendente']} />}>
          <Route path="/employee" element={<EmployeeDashboard />} />
        </Route>
        {/* Admin */}
        <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  </AuthProvider>
);

export default App;
