import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Header.css";

const Header = () => {
    const navigate = useNavigate();

    const handleGalleryClick = () => {
        navigate("/gallery");
    };

    return (
        <header className="header">
            <div className="logo">
                <h2>MeloMotion</h2>
            </div>

            <nav className="nav">
                <NavLink
                    exact="true"
                    to="/"
                    className="nav-link"
                    activeclassname="active"
                >
                    Home
                </NavLink>

                <button className="nav-link gallery-btn" onClick={handleGalleryClick}>
                    Gallery
                </button>

                <NavLink
                    to="/about"
                    className="nav-link"
                    activeclassname="active"
                >
                    About
                </NavLink>



                <NavLink
                    to="/login"
                    className="nav-link"
                    activeclassname="active"
                >
                    Login
                </NavLink>


            </nav>
        </header>
    );
};

export default Header;
