import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu when a link is clicked
  const handleLinkClick = () => setMenuOpen(false);

  return (
    <header className="header">
      {/* Logo */}
      <div className="logo" onClick={() => navigate("/")}>
        <h2>MeloMotion</h2>
      </div>

      {/* Hamburger Menu (visible on mobile) */}
      <div
        className={`menu-toggle ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span style={{background:"white"}}></span>
        <span style={{background:"white"}}></span>
        <span style={{background:"white"}}></span>
      </div>

      {/* Navigation Links */}
      <nav className={`nav ${menuOpen ? "open" : ""}`}>
        <NavLink
          to="/"
          className={({ isActive }) =>
            `nav-link ${isActive ? "active" : ""}`
          }
          onClick={handleLinkClick}
        >
          Home
        </NavLink>

        <button
          className="nav-link"
          onClick={() => {
            navigate("/gallery");
            handleLinkClick();
          }}
        >
          Gallery
        </button>

        <NavLink
          to="/about"
          className={({ isActive }) =>
            `nav-link ${isActive ? "active" : ""}`
          }
          onClick={handleLinkClick}
        >
          About
        </NavLink>

        <NavLink
          to="/login"
          className={({ isActive }) =>
            `nav-link ${isActive ? "active" : ""}`
          }
          onClick={handleLinkClick}
        >
          Login
        </NavLink>
      </nav>
    </header>
  );
};

export default Header;
