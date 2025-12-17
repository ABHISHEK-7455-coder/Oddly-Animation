import React from "react";
import "./HeroSection.css";
import { useNavigate, NavLink } from "react-router-dom";

const HeroSection = () => {
    const navigate = useNavigate();

    return (
        <section className="hero-section">
            <div className="hero-content">
                <h1 className="hero-title ">Experience</h1>
                <h1 className="hero-title ">Digital Calm</h1>
                <p className="hero-subtitle ">
                    Dive into the world of smooth, mesmerizing and creative motion.
                </p>
                <button
                    className="hero-btn"
                    onClick={() => navigate("/gallery")}
                >
                    Explore Gallery
                </button>
            </div>

            <div className="navs">
                    <h3>Explore the Collection</h3>
                <nav>
                    <NavLink
                        to="/gallery"
                        className={({ isActive }) =>
                            `nav-link ${isActive ? "active" : ""}`
                        }

                    >
                        Gallery
                    </NavLink>

                    <NavLink
                        to="/piano-player"
                        className={({ isActive }) =>
                            `nav-link ${isActive ? "active" : ""}`
                        }

                    >
                        Piano Player
                    </NavLink>

                    <NavLink
                        to="/matter.js"
                        className={({ isActive }) =>
                            `nav-link ${isActive ? "active" : ""}`
                        }

                    >
                        Matter.js
                    </NavLink>

                    <NavLink
                        to="/about"
                        className={({ isActive }) =>
                            `nav-link ${isActive ? "active" : ""}`
                        }

                    >
                        About
                    </NavLink>

                    <NavLink
                        to="/login"
                        className={({ isActive }) =>
                            `nav-link ${isActive ? "active" : ""}`
                        }

                    >
                        Login
                    </NavLink>
                </nav>
            </div>
        </section>
    );
};

export default HeroSection;
