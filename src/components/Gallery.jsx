import React, { useState } from "react";
import Animation from "../components/Animation";
import { animationData } from "../data/animationConfig.js"; // 50 animations ka data
import "./Gallery.css";

const Gallery = () => {
    const [selectedAnimation, setSelectedAnimation] = useState("fractalLaserGrid");
    const [color, setColor] = useState("#ef8bf4");
    const [size, setSize] = useState(50);
    const [speed, setSpeed] = useState(0.01);

    return (
        <div className="gallery-container">

            <Animation
                type={selectedAnimation}
                color={color}
                size={size}
                speed={speed}
            />

        </div>
    );
};

export default Gallery;
