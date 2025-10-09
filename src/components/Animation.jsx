import React from "react";
import "../styles/Animation.css";

import FluidDynamics from "./animations/FluidDynamics";
import GeometricPatterns from "./animations/GeometricPatterns";
import PastelParticles from "./animations/PastelParticles";
import Kaleidoscope from "./animations/Kaleidoscope";
import OrbitingSpheres from "./animations/OrbitingSpheres";
import DashingRings from "./animations/DashingRings";
import TrippyRings from "./animations/TrippyRings";

const Animation = ({ type = "wave", color, speed, size }) => {
    switch (type) {
        case "fluid":
            return <div className="fluid-animation" style={{ backgroundColor: color, animationDuration: `${speed}s` }} />;
        case "ripple":
            return <div className="ripple-animation" style={{ backgroundColor: color, animationDuration: `${speed}s` }} />;
        case "gradient":
            return <div className="gradient-animation" style={{ animationDuration: `${speed}s` }} />;
        case "softWave":
            return (
                <div className="soft-wave-animation">
                    <div className="wave" style={{ backgroundColor: color }} />
                    <div className="wave" style={{ backgroundColor: color }} />
                    <div className="wave" style={{ backgroundColor: color }} />
                </div>
            );
        case "pendulum":
            return <div className="pendulum-container"><div className="pendulum"><div className="rod" style={{ animationDuration: `${speed}s` }}></div><div className="circle" style={{ backgroundColor: color, width: size, height: size }}></div></div></div>;
        case "fluidDynamics":
            return <FluidDynamics color={color} size={size} speed={speed} />;
        case "geometricPatterns":
            return <GeometricPatterns color={color} size={size} speed={speed} />;
        case "pastelParticles":
            return <PastelParticles color={color} size={size} speed={speed} />;
        case "kaleidoscope":
            return <Kaleidoscope color={color} size={size} speed={speed} />;
        case "orbitingSpheres":
            return <OrbitingSpheres color={color} size={size} speed={speed} />;
        case "dashingRings":
            return <DashingRings color={color} size={size} speed={speed} />;
        case "trippyRings":
  return <TrippyRings size={size} speed={speed} />;
        default:
            return null;
    }
};

export default Animation;
