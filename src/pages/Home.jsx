import React from "react";
import HeroSection from "../components/HeroSection";
import "./Home.css";

const Home = () => {
  return (
    <main className="home-container">
      <HeroSection />
      {/* Add more sections below */}
      <section className="animations-intro-section">
        <h2 className="animations-intro-title ">Explore Our Animations</h2>
        <p className="animations-intro-subtitle ">
          Discover 50+ mesmerizing, interactive, and visually stunning animations created to bring peace and satisfaction.
        </p>

        <div className="bubbles">
          <img src="src/assets/bubble.png" />
          <img src="src/assets/bubble.png" />
          <img src="src/assets/bubble.png" />
          <img src="src/assets/bubble.png" />
          <img src="src/assets/bubble.png" />
          <img src="src/assets/bubble.png" />
          <img src="src/assets/bubble.png" /> 
        </div>
      </section>
    </main>
  );
};

export default Home;
