import React from "react";
import "../../styles/Animation.css"; // Make sure styles are imported

const PendulumAnimation = ({ color, size, speed, type }) => {
  const circles = Array(type === "three" ? 3 : 1).fill(0); // If 'three', create 3 pendulums

  return (
    <div className={`pendulum-container ${type}`}>
      {circles.map((_, i) => (
        <div key={i} className="pendulum">
          <div className="rod" style={{ }}></div>
          <div
            className="circle"
            style={{
                animationDuration: `${speed}s` ,
              backgroundColor: color,
              width: size + "px",
              height: size + "px",
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default PendulumAnimation;
