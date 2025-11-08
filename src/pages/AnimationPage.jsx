import React from "react";
import { useParams } from "react-router-dom";
import Animation from "../components/Animation";
import { animationData } from "../data/animationConfig";
import "./AnimationPage.css"; // (optional styling file)

const AnimationPage = () => {
    const { id } = useParams(); // URL se animation index ya name
    const animation = animationData.find((item) => item.type === id) || animationData[0];

    return (
        <div className="animation-page-container">

            <div className="animation-view">
                <Animation
                    type={animation.type}
                    color={animation.defaultColor || "#ef8bf4"}
                    size={animation.defaultSize || 50}
                    speed={animation.defaultSpeed || 0.01}
                />
            </div>

            <div className="animation-info">
                <h1 className="animation-title">{animation.name}</h1>
                <p className="animation-description">
                    {animation.description || "A smooth and satisfying animation experience."}
                </p>
            </div>

        </div>
    );
};

export default AnimationPage;
