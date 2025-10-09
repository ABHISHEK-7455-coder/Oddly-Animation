// GeometricPatterns.jsx
import React from "react";
import "../../styles/Animation.css";

const GeometricPatterns = ({ color = "#ff4081", size = 100, speed = 4 }) => {
  return (
    <div className="geometric-container">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="polygon"
          style={{
            width: size + "px",
            height: size + "px",
            borderColor: color,
            animationDuration: `${speed + i}s`,
          }}
        />
      ))}
    </div>
  );
};

export default GeometricPatterns;
