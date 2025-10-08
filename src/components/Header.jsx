import React from "react";
import { NavLink } from "react-router-dom";
import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      <nav className="nav">
        <NavLink exact="true" to="/" className="nav-link" activeclassname="active">
          Home
        </NavLink>
        <NavLink to="/about" className="nav-link" activeclassname="active">
          About
        </NavLink>
      </nav>
    </header>
  );
};

export default Header;
