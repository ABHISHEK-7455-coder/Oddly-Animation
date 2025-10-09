import React from "react";
import Gallery from "../components/Gallery"; // Import the Gallery component
import "./Home.css";

const Home = () => {
  return (
    <main className="home-container">
      <h1 className="hero-title">Oddly Satisfying Animations</h1>
      {/* <p className="hero-subtitle">Click on a card to see the animation.</p> */}

      {/* Gallery component */}
      <Gallery />
    </main>
  );
};

export default Home;
