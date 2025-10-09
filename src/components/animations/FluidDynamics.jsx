// FluidDynamics.jsx
import React from "react";
import "../../styles/Animation.css";

const FluidDynamics = ({ color = "#4caf50", size = 100, speed = 3 }) => {
  return (
    <div className="fluid-dynamics-container">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="fluid-dynamics-blob"
          style={{
            animationDuration: `${speed + i}s`,
            backgroundColor: color,
            width: size + "px",
            height: size + "px",
          }}
        />
      ))}
    </div>
  );
};

export default FluidDynamics;
