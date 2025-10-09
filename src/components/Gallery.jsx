import React, { useState } from "react";
import Animation from "../components/Animation";
import "./Gallery.css";

const Gallery = () => {
    // Updated animations list (10 total)
    const animationsData = [
        { name: "Fluid Animation", type: "fluid" },
        { name: "Ripple Animation", type: "ripple" },
        { name: "Gradient Transition", type: "gradient" },
        { name: "Soft Wave", type: "softWave" },
        { name: "Pendulum", type: "pendulum" },
        { name: "Fluid Dynamics", type: "fluidDynamics" },
        { name: "Geometric Patterns", type: "geometricPatterns" },
        { name: "Pastel Particles", type: "pastelParticles" },
        { name: "Kaleidoscope Spin", type: "kaleidoscope" },
        { name: "Orbiting Spheres", type: "orbitingSpheres" },
        { name: "Dashing Rings", type: "dashingRings" },
        { name: "Trippy Rings Galaxy", type: "trippyRings" },
    ];

    const [selectedAnimation, setSelectedAnimation] = useState("fluid");
    const [color, setColor] = useState("#4caf50");
    const [size, setSize] = useState(30);
    const [speed, setSpeed] = useState(1.4);

    const handleCardClick = (animationType) => {
        setSelectedAnimation(animationType);
    };

    return (
        <div className="gallery-container">
            {/* Gallery Cards */}
            <div className="gallery">
                {animationsData.map((animation, index) => (
                    <div
                        key={index}
                        className={`gallery-card ${selectedAnimation === animation.type ? "active" : ""
                            }`}
                        onClick={() => handleCardClick(animation.type)}
                    >
                        <h3>{animation.name}</h3>
                    </div>
                ))}
            </div>

            {/* Horizontal Control Bar for Animation Settings */}
            <div className="controls">
                <div className="control-bar">
                    <label>
                        Color:
                        <input
                            type="color"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                        />
                    </label>

                    <label>
                        Size:
                        <input
                            type="range"
                            min="10"
                            max="100"
                            value={size}
                            onChange={(e) => setSize(parseInt(e.target.value))}
                        />
                        {size}px
                    </label>

                    <label>
                        Speed:
                        <input
                            type="range"
                            min="0.5"
                            max="5"
                            step="0.1"
                            value={speed}
                            onChange={(e) => setSpeed(parseFloat(e.target.value))}
                        />
                        {speed}s
                    </label>
                </div>
            </div>

            {/* Render the selected animation */}
            <div className="selected-animation">
                <Animation type={selectedAnimation} color={color} size={size} speed={speed} />
            </div>
        </div>
    );
};

export default Gallery;
