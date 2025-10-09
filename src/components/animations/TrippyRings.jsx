// src/components/animations/TrippyRings.jsx
import React from "react";
import "../../styles/Animation.css";

const TrippyRings = ({ size = 80, speed = 4 }) => {
    const rings = [...Array(6)]; // 6 rings for depth

    return (
        <div className="trippy-rings-container">
            {rings.map((_, i) => (
                <div
                    key={i}
                    className="trippy-ring"
                    style={{
                        width: size + i * 40 + "px",
                        height: size + i * 40 + "px",
                        animationDuration: `${speed + i * 0.5}s`,
                        animationDirection: i % 2 === 0 ? "normal" : "reverse",
                    }}
                />
            ))}

            {/* Optional particles */}
            {[...Array(12)].map((_, i) => (
                <div key={i} className="trippy-particle" />
            ))}
        </div>
    );
};

export default TrippyRings;
