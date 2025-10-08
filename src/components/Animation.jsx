import React from "react";
import "../styles/Animation.css";

const Animation = ({ color = "#4caf50", speed = 1.4 }) => {
  const circles = Array(7).fill(0);

  return (
    <div className="wave-container" role="img" aria-label="Pulsing circles animation">
      {circles.map((_, i) => (
        <div
          key={i}
          className="circle"
          style={{
            animationDelay: `${i * 0.2}s`,
            animationDuration: `${speed}s`,
            backgroundColor: color,
          }}
        />
      ))}
    </div>
  );
};

export default Animation;
