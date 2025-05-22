import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import ReceptionDashboard from "./pages/ReceptionDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import React from 'react';
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";


const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          

          {/* Reception */}
          <Route element={<ProtectedRoute allowedRoles={['Portineria']} />}>
            <Route path="/reception" element={<ReceptionDashboard />} />
          </Route>

          {/* Employee */}
          <Route element={<ProtectedRoute allowedRoles={['Dipendenti']} />}>
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
};

export default App;
