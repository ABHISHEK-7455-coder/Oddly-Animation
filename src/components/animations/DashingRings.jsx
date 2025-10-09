// src/components/animations/DashingRings.jsx
import React from "react";
import "../../styles/Animation.css";

const DashingRings = ({ color = "#ff4081", size = 50, speed = 3 }) => {
    const rings = [...Array(6)]; // 6 rings for depth

    return (
        <div className="dashing-rings-container">
            {rings.map((_, i) => (
                <div
                    key={i}
                    className="dashing-ring"
                    style={{
                        width: size + i * 20 + "px",
                        height: size + i * 20 + "px",
                        borderColor: color,
                        animationDuration: `${speed + i * 0.5}s`,
                        animationDelay: `${i * 0.2}s`,
                    }}
                />
            ))}
        </div>
    );
};

export default DashingRings;
