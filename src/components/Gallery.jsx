import React, { useState } from "react";
import Animation from "../components/Animation";
import {animationData} from "../data/animationConfig.js"; // 50 animations ka data
import "./Gallery.css";

const Gallery = () => {
    const [selectedAnimation, setSelectedAnimation] = useState("fractalLaserGrid");
    const [color, setColor] = useState("#ef8bf4");
    const [size, setSize] = useState(50);
    const [speed, setSpeed] = useState(0.01);

    return (
        <div className="gallery-container">

            {/* <div>
                <h3>Animations</h3>
                {/* Gallery Cards 
            <div className="gallery">
                {animationData.map((animation, index) => (
                    <div
                        key={index}
                        className={`gallery-card ${selectedAnimation === animation.type ? "active" : ""}`}
                        onClick={() => setSelectedAnimation(animation.type)}
                    >
                        <h4>{animation.name}</h4>
                    </div>
                ))}
            </div>
            </div> */}

            {/* Controls */}
            <div className="controls">
                <div className="control-bar">
                    <label className="color">
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
                            max="200"
                            value={size}
                            onChange={(e) => setSize(parseInt(e.target.value))}
                        />
                        {size}px
                    </label>

                    <label>
                        Speed:
                        <input
                            type="range"
                            min="0.01"
                            max="2.5"
                            step="0.1"
                            value={speed}
                            onChange={(e) => setSpeed(parseFloat(e.target.value))}
                        />
                        {speed}s
                    </label>

                </div>
                {/* Selected Animation */}
                <div className="selected-animation">
                    <Animation
                        type={selectedAnimation}
                        color={color}
                        size={size}
                        speed={speed}
                    />
                </div>
            </div>


        </div>
    );
};

export default Gallery;
