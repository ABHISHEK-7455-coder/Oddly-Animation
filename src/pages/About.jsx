import React from "react";
import "./About.css";

export default function About() {
  return (
    <div className="about-wrapper">
      {/* Navbar */}
      {/* <nav className="navbar">
        <div className="nav-left">
          <div className="brand-icon">〰️</div>
          <span className="brand-text">Oddly Satisfying</span>
        </div>

        <div className="nav-right">
          <a href="#">Home</a>
          <a href="#">Gallery</a>
          <a href="#">Contact</a>
          <div className="avatar">👤</div>
        </div>
      </nav> */}

      {/* Hero Card */}
      <section className="hero-card">
        <span className="pill">VISUAL THERAPY</span>

        <h1>
          <span className="span1">About Our</span> <br />
          <span className="span2">World of Calm</span>
        </h1>

        <p>
          Discover the art and science behind the animations designed to soothe
          your mind and satisfy your senses.
        </p>

        <button className="cta-btn">Explore Animations</button>
      </section>

      {/* Info Cards */}
      <section className="info-section">
        <div className="info-card1">
          <div className="info-icon creators">TYPE<br/>TEAM</div>
          <h3 style={{color:"black"}}>The Creators</h3>
          <div className="underline"></div>
          <p>
            Crafted by a team of artists and developers passionate about digital
            wellness and the power of mesmerizing visuals.
          </p>
        </div>

        <div className="info-card2">
          <div className="info-icon purpose">🌱</div>
          <h3 style={{color:"black"}}>Our Purpose</h3>
          <div className="underline purple"></div>
          <p>
            Our goal is to provide a moment of peace, focus, and visual delight
            in a busy world through meticulously crafted, endlessly looping
            animations designed to soothe your mind.
          </p>
        </div>
      </section>

    </div>
  );
}
