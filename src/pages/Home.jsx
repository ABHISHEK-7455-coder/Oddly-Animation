import React from "react";
import HeroSection from "../components/HeroSection";
import { animationData } from "../data/animationConfig";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* BACKGROUND BLOBS */}
      <div className="bg-blob blob-primary"></div>
      <div className="bg-blob blob-accent"></div>
      <div className="bg-blob blob-purple"></div>

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="glass-panel">
          <div className="layout-container">
            <div className="navbar-inner">
              <div className="brand">
                <div className="brand-icon">
                  <span className="material-symbols-outlined">category</span>
                </div>
                <h2 className="brand-title">PhysicsPlay</h2>
              </div>

              <div className="navbar-right">
                <div className="nav-links">
                  <a href="#">Playground</a>
                  <a href="#">Showcase</a>
                  <a href="#">About</a>
                </div>
                <button className="nav-cta">Sign Up</button>
              </div>

              <div className="nav-mobile">
                <span className="material-symbols-outlined">menu</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="layout-container">
          <div className="hero-grid">

            {/* LEFT */}
            <div className="hero-content">
              <div className="version-badge">
                <span className="pulse-dot"></span>
                <span>v2.0 Available Now</span>
              </div>

              <h1 className="hero-title">
                Play. Break.
                <br />
                <span className="text-gradient-primary">
                  Feel the Physics.
                </span>
              </h1>

              <p className="hero-description">
                A professional-grade playground for motion, sound, and realism.
                Experience the web&apos;s physics engine like never before.
              </p>

              <div className="hero-actions">
                <button className="btn-primary">
                  <span>Enter the Playground</span>
                  <span className="material-symbols-outlined">
                    arrow_forward
                  </span>
                </button>

                <button className="btn-secondary">
                  <span className="material-symbols-outlined">
                    play_circle
                  </span>
                  Watch Demo
                </button>
              </div>

              <div className="hero-social-proof">
                <div className="avatar-stack">
                  <div className="avatar"></div>
                  <div className="avatar"></div>
                  <div className="avatar"></div>
                </div>
                <span>Loved by 10k+ developers</span>
              </div>
            </div>

            {/* RIGHT */}
            <div className="hero-visual">
              <div className="visual-card">
                <div className="visual-header">
                  <div className="window-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <span className="file-name">simulation.js</span>
                </div>

                <div className="visual-canvas">
                  <div className="physics-ball"></div>
                  <div className="question-ball">?</div>
                  <div className="pulse-orb"></div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="layout-container footer-grid">
          <div>
            <div className="brand">
              <div className="brand-icon">
                <span className="material-symbols-outlined">category</span>
              </div>
              <span className="brand-title">PhysicsPlay</span>
            </div>
            <p>
              Designed with precision, code, and a passion for interactive web
              experiences.
            </p>
          </div>

          <div className="footer-links">
            <div>
              <h4>Product</h4>
              <a href="#">Features</a>
              <a href="#">Showcase</a>
              <a href="#">Pricing</a>
            </div>
            <div>
              <h4>Resources</h4>
              <a href="#">Documentation</a>
              <a href="#">API</a>
              <a href="#">Community</a>
            </div>
            <div>
              <h4>Company</h4>
              <a href="#">About</a>
              <a href="#">Blog</a>
              <a href="#">Careers</a>
            </div>
          </div>

          <div className="footer-bottom">
            © 2024 PhysicsPlay Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
};

export default Home;
