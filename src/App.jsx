import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import "./App.css";

import Login from "./pages/Login";
import React from 'react';

const Layout = () => {

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />       
        <Route path="/" element={<Home />} />      
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
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