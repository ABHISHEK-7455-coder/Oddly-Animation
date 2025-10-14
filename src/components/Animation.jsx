import React from "react";
import "../styles/Animation.css";

const Animation = ({ type, color, speed, size, params = {} }) => {
  switch (type) {
    case "floatingSpheres":
      return (
        <div
          className="floatingSpheres"
          style={{ width: size, height: size }}
        >
          {[...Array(params.count || 5)].map((_, i) => (
            <div
              key={i}
              className="sphere"
              style={{
                background: color,
                animationDuration: `${speed + i * 0.3}s`,
              }}
            />
          ))}
        </div>
      );

    case "rotatingSquares":
      return (
        <div
          className="rotatingSquares"
          style={{ width: size, height: size }}
        >
          {[...Array(params.count || 4)].map((_, i) => (
            <div
              key={i}
              className="square"
              style={{
                background: color,
                animationDuration: `${speed + i * 0.5}s`,
              }}
            />
          ))}
        </div>
      );

    default:
      return null;
  }
};

export default Animation;
