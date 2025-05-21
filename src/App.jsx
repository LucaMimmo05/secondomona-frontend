import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import React from 'react';

const Layout = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />       
      <Route path="/" element={<Home />} />      
      <Route path="/dashboard" element={<Dashboard />} /> 
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  return (
    <Router>
      <Layout />
    </Router>
  );
};

export default App;
