import React from "react";
import classNames from "classnames";
import "../styles/selector.css";

const Selector = ({ icon: Icon, text, active, onClick, isLogout = false, className }) => {
  return (
    <div
      onClick={onClick}
      style={{ cursor: "pointer" }}
      className={classNames(
        "selector",
        { active },
        { logout: isLogout },
        className
      )}
    >
      <Icon className="selector-icon" active={active} />
      <span className="selector-text">{text}</span>
    </div>
  );
};

export default Selector;
