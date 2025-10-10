import React from "react";
import { useNavigate } from "react-router-dom";
import "./About.css";

const About = () => {
  const navigate = useNavigate();

  return (
    <main className="about-container">
      {/* Animated Background Shapes */}
      {/* <div className="about-floating-shapes">
        <span className="shape shape1"></span>
        <span className="shape shape2"></span>
        <span className="shape shape3"></span>
        <span className="shape shape4"></span>
      </div> */}

      <section className="about-intro">
        <h1 className="about-title">About This App</h1>
        <p className="about-description">
          This React application demonstrates <span className="highlight">oddly satisfying animations</span> of pulsing circles, waves, pendulums, and more.
          Built with <span className="highlight">React functional components</span>, <span className="highlight">CSS animations</span>, and <span className="highlight">React Router</span> for seamless navigation.
        </p>
        <p className="about-description">
          The goal is to create visually pleasing, smooth animations that you can <span className="highlight">customize in real-time</span> — colors, sizes, and speed.
        </p>
      </section>

      <section className="about-features">
        <h2 className="key">Key Features</h2>
        <div className="feature-cards">
          <div className="feature-card">
            <h3>Interactive Animations</h3>
            <p>Click any animation card to see it in action with real-time customization.</p>
          </div>
          <div className="feature-card">
            <h3>50+ Animations</h3>
            <p>From waves to pendulums, particles to gradients — a collection of mesmerizing effects.</p>
          </div>
          <div className="feature-card">
            <h3>Fully Customizable</h3>
            <p>Adjust colors, size, and speed to create your own satisfying animation experience.</p>
          </div>
        </div>
      </section>

      {/* <section className="about-skills">
        <h2 className="">Tech Stack & Animation Skills</h2>
        <div className="skill-bars">
          <div className="skill">
            <p>React</p>
            <div className="skill-bar"><div className="skill-progress react"></div></div>
          </div>
          <div className="skill">
            <p>CSS Animations</p>
            <div className="skill-bar"><div className="skill-progress css"></div></div>
          </div>
          <div className="skill">
            <p>JavaScript</p>
            <div className="skill-bar"><div className="skill-progress js"></div></div>
          </div>
        </div>
      </section>

      <section className="about-cta">
        <button className="gallery-button" onClick={() => navigate("/gallery")}>
          Explore Gallery
        </button>
      </section> */}
    </main>
  );
};

export default About;
