import React from "react";
import { useNavigate } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import { animationData } from "../data/animationConfig";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <main className="home-container">
      <HeroSection />
      {/* Add more sections below */}
      <section className="animations-intro-section">
        <h2 className="animations-intro-title ">Explore Our Animations</h2>
        <p className="animations-intro-subtitle ">
          Discover 50+ mesmerizing, interactive, and visually stunning animations created to bring peace and satisfaction.
        </p>

        <div className="anim-cards">
          {animationData.map((anim) => (
          <div
          className="anim-card"
          onClick={() => navigate(`/gallery?anim=${anim.id}`)}
        >
          <img src={anim.image} width="200px" height="200px" />
          <h3>{anim.name}</h3>
        </div>
        ))}
        </div>


        {/* <div className="bubbles">
          <img src="src/assets/bubble.png" />
          <img src="src/assets/bubble.png" />
          <img src="src/assets/bubble.png" />
          <img src="src/assets/bubble.png" />
          <img src="src/assets/bubble.png" />
          <img src="src/assets/bubble.png" />
          <img src="src/assets/bubble.png" /> 
        </div> */}
      </section>
    </main>
  );
};

export default Home;
