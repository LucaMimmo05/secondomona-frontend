import React, { useState } from "react";
import "../styles/selector.css";

const Selector = ({ icon: Icon, text, active, onClick }) => {
  return (
      <div
      className={`selector ${active ? "active" : ""} `}
      onClick={onClick}
      style={{ cursor: "pointer" }}
      >
      <Icon className="selector-icon" active= {active} />
      <span className="selector-text">{text}</span>
    </div>
  );
};

export default Selector;
