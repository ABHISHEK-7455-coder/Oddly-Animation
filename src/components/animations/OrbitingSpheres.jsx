// src/components/animations/OrbitingSpheres.jsx
import React from "react";
import "../../styles/Animation.css";

const OrbitingSpheres = ({ color = "#ffb347", size = 20, speed = 4 }) => {
    return (
        <div className="orbit-container">
            {[...Array(5)].map((_, i) => (
                <div
                    key={i}
                    className="orbit-sphere"
                    style={{
                        width: size + "px",
                        height: size + "px",
                        backgroundColor: color,
                        animationDuration: `${speed + i}s`,
                        transform: `rotate(${i * 72}deg) translateX(100px)`,
                    }}
                />
            ))}
        </div>
    );
};

export default OrbitingSpheres;
