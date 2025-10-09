// src/components/animations/Kaleidoscope.jsx
import React from "react";
import "../../styles/Animation.css";

const Kaleidoscope = ({ color = "#36d1dc", size = 80, speed = 5 }) => {
    return (
        <div className="kaleidoscope-container">
            {[...Array(6)].map((_, i) => (
                <div
                    key={i}
                    className="kaleidoscope-shape"
                    style={{
                        width: size + "px",
                        height: size + "px",
                        backgroundColor: color,
                        animationDuration: `${speed + i}s`,
                        transform: `rotate(${i * 60}deg)`,
                    }}
                />
            ))}
        </div>
    );
};

export default Kaleidoscope;
