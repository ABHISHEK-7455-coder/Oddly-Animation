// src/components/AnimationRenderer.jsx

import React from "react";
import animationsData from "../data/animationsData";
import "../styles/Animation.css";

const AnimationRenderer = () => {
  return (
    <div className="animation-gallery">
      {animationsData.map((anim, index) => (
        <div key={index} className="animation-card">
          {/* Inject animation styles dynamically */}
          <style>{anim.style}</style>

          {/* Animation preview */}
          <div className={anim.type}></div>

          {/* Animation title */}
          <p className="animation-name">{anim.name}</p>
        </div>
      ))}
    </div>
  );
};

export default AnimationRenderer;
