import React from "react";
import "../../styles/Animation.css";

const WaveAnimation = ({ color, size, speed }) => {
  return (
    <div className="wave-container">
      {[...Array(7)].map((_, i) => (
        <div
          key={i}
          className="circle wave-animation"
          style={{
            animationDelay: `${i * 0.2}s`,
            animationDuration: `${speed}s`,
            backgroundColor: color,
            width: size + "px",
            height: size + "px",
          }}
        />
      ))}
    </div>
  );
};

export default WaveAnimation;
