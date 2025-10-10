import React from "react";
import "./HeroSection.css";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1 className="hero-title ">Experience Oddly Satisfying Animations</h1>
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

      {/* <div className="floating-shapes">
        <span className="shape shape1"></span>
        <span className="shape shape2"></span>
        <span className="shape shape3"></span>
        <span className="shape shape4"></span>
      </div> */}
    </section>
  );
};

export default HeroSection;
