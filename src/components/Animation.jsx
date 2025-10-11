import React from "react";
import "../styles/Animation.css";

const Animation = ({ type, color = "#ef8bf4ff", speed = 1.4, size = 50, params = {}, }) => {
    switch (type) {
        case "floatingSpheres":
            return (
                <div className="floatingSpheres" style={{ width: size, height: size }}>
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className="sphere"
                            style={{
                                backgroundColor: color,
                                animationDelay: `${i * 0.4}s`,
                                width: size / 2.5,
                                height: size / 2.5,
                            }}
                        />
                    ))}
                </div>
            );


        case "fluidBlob":
            return <div className="fluidBlob" style={{ backgroundColor: color, width: size, height: size, animationDuration: speed + "s" }} />;
        case "neonSwirl":
            return <div className="neonSwirl" style={{ background: `conic-gradient(${color}, #000)`, width: size, height: size, animationDuration: speed + "s" }} />;
        case "hypnoticRings":
            return <div className="hypnoticRings" style={{ width: size, height: size, animationDuration: speed + "s" }} />;
        case "colorWave":
            return <div className="colorWave" style={{ width: size, height: size, animationDuration: speed + "s" }} />;
        case "orbitSpheres":
            return (
                <div className="orbitSpheres" style={{ width: size, height: size, animationDuration: speed + "s" }}>
                    {[...Array(params.count)].map((_, i) => (
                        <div key={i} className="orbitSphere" style={{ backgroundColor: color }} />
                    ))}
                </div>
            );
        case "gooeyMerge":
            return (
                <div className="gooeyMerge" style={{ width: size, height: size }}>
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="blob" style={{ backgroundColor: color }} />
                    ))}
                </div>
            );
        case "pastelDots":
            return (
                <div className="pastelDots">
                    {colors.map((color, i) => (
                        <div key={i} className="dot" style={{ backgroundColor: color, width: size, height: size }} />
                    ))}
                </div>
            );
        case "rainbowPulse":
            return <div className="rainbowPulse" style={{ width: size, height: size, animationDuration: speed + "s" }} />;
        case "elasticBounce":
            return <div className="elasticBounce" style={{ backgroundColor: color, width: size, height: size, animationDuration: speed + "s" }} />;
        case "spiralMotion":
            return <div className="spiralMotion" style={{ backgroundColor: color, width: size, height: size, animationDuration: speed + "s" }} />;

        // ----------------- remaining 40 animations -----------------
        case "liquidRipple":
            return <div className="liquidRipple" style={{ backgroundColor: color, width: size, height: size, animationDuration: speed + "s" }} />;
        case "starfield":
            return (
                <div className="starfield">
                    {[...Array(params.count)].map((_, i) => (
                        <div key={i} className="star" style={{ backgroundColor: color }} />
                    ))}
                </div>
            );
        case "pulseRings":
            return <div className="pulseRings" style={{ backgroundColor: color, width: size, height: size, animationDuration: speed + "s" }} />;
        case "morphPolygon":
            return <div className="morphPolygon" style={{ backgroundColor: color, width: size, height: size, animationDuration: speed + "s" }} />;
        case "hypnoticGrid":
            return <div className="hypnoticGrid" style={{ backgroundColor: color, width: size, height: size, animationDuration: speed + "s" }} />;
        case "wavyLines":
            return <div className="wavyLines" style={{ backgroundColor: color, width: size, height: size, animationDuration: speed + "s" }} />;
        case "bubbleRise":
            return (
                <div className="bubbleRise">
                    {[...Array(params.count)].map((_, i) => (
                        <div key={i} className="bubble" style={{ backgroundColor: color, width: size, height: size }} />
                    ))}
                </div>
            );
        case "cosmicSwirl":
            return <div className="cosmicSwirl" style={{ width: size, height: size, animationDuration: speed + "s" }} />;
        case "kaleidoscope":
            return <div className="kaleidoscope" style={{ width: size, height: size, animationDuration: speed + "s" }} />;
        case "neonTrail":
            return (
                <div className="neonTrail">
                    {[...Array(params.count)].map((_, i) => (
                        <div key={i} className="trailDot" style={{ backgroundColor: color, width: size, height: size }} />
                    ))}
                </div>
            );
        case "orbitBlobs":
            return (
                <div className="orbitBlobs">
                    {[...Array(params.count)].map((_, i) => (
                        <div key={i} className="orbitBlob" style={{ backgroundColor: color, width: size, height: size }} />
                    ))}
                </div>
            );
        case "colorSpiral":
            return <div className="colorSpiral" style={{ width: size, height: size, animationDuration: speed + "s" }} />;
        case "hypnoticWave":
            return <div className="hypnoticWave" style={{ width: size, height: size, animationDuration: speed + "s" }} />;
        case "softGradientFlow":
            return <div className="softGradientFlow" style={{ width: size, height: size, animationDuration: speed + "s" }} />;
        case "elasticRings":
            return <div className="elasticRings" style={{ width: size, height: size, animationDuration: speed + "s" }} />;
        case "pulsingDots":
            return (
                <div className="pulsingDots">
                    {[...Array(params.count)].map((_, i) => (
                        <div key={i} className="pulseDot" style={{ backgroundColor: color, width: size, height: size }} />
                    ))}
                </div>
            );
        case "fractalSpiral":
            return <div className="fractalSpiral" style={{ width: size, height: size, animationDuration: speed + "s" }} />;
        case "orbitRings":
            return (
                <div className="orbitRings">
                    {[...Array(params.count)].map((_, i) => (
                        <div key={i} className="orbitRing" style={{ backgroundColor: color, width: size, height: size }} />
                    ))}
                </div>
            );
        case "glowCircles":
            return <div className="glowCircles" style={{ width: size, height: size, animationDuration: speed + "s" }} />;
        case "particleExplosion":
            return (
                <div className="particleExplosion">
                    {[...Array(params.count)].map((_, i) => (
                        <div key={i} className="particle" style={{ backgroundColor: color, width: size, height: size }} />
                    ))}
                </div>
            );
        case "pastelSpiral":
            return <div className="pastelSpiral" style={{ width: size, height: size, animationDuration: speed + "s" }} />;
        case "hypnoticRipple":
            return <div className="hypnoticRipple" style={{ width: size, height: size, animationDuration: speed + "s" }} />;
        case "morphingWave":
            return <div className="morphingWave" style={{ width: size, height: size, animationDuration: speed + "s" }} />;
        case "rainbowOrbit":
            return <div className="rainbowOrbit" style={{ width: size, height: size, animationDuration: speed + "s" }} />;
        case "neonRings":
            return <div className="neonRings" style={{ width: size, height: size, animationDuration: speed + "s" }} />;
        case "softPulse":
            return <div className="softPulse" style={{ width: size, height: size, animationDuration: speed + "s" }} />;
        case "waveCircles":
            return <div className="waveCircles" style={{ width: size, height: size, animationDuration: speed + "s" }} />;
        case "hypnoticMotion":
            return <div className="hypnoticMotion" style={{ width: size, height: size, animationDuration: speed + "s" }} />;
        case "gooeyBlobs":
            return (
                <div className="gooeyBlobs">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="blob" style={{ backgroundColor: color, width: size, height: size }} />
                    ))}
                </div>
            );
        case "colorFusion":
            return <div className="colorFusion" style={{ width: size, height: size, animationDuration: speed + "s" }} />;
        case "pulseWave":
            return <div className="pulseWave" style={{ width: size, height: size, animationDuration: speed + "s" }} />;
        case "elasticSpiral":
            return <div className="elasticSpiral" style={{ width: size, height: size, animationDuration: speed + "s" }} />;

        case "liquidOrbs":
            return (
                <div className="liquidOrbs">
                    {[...Array(params.count)].map((_, i) => (
                        <div key={i} className="orb" style={{ backgroundColor: color, width: size, height: size }} />
                    ))}
                </div>
            );
        case "glowingSwirl":
            return <div className="glowingSwirl" style={{ width: size, height: size, animationDuration: speed + "s" }} />;
        case "neonPulse":
            return <div className="neonPulse" style={{ width: size, height: size, animationDuration: speed + "s" }} />;
        case "rippleDots":
            return (
                <div className="rippleDots">
                    {[...Array(params.count)].map((_, i) => (
                        <div key={i} className="rippleDot" style={{ backgroundColor: color, width: size, height: size }} />
                    ))}
                </div>
            );
        case "orbitGlow":
            return (
                <div className="orbitGlow">
                    {[...Array(params.count)].map((_, i) => (
                        <div key={i} className="glowDot" style={{ backgroundColor: color, width: size, height: size }} />
                    ))}
                </div>
            );
        case "hypnoticRibbons":
            return <div className="hypnoticRibbons" style={{ width: size, height: size, animationDuration: speed + "s" }} />;
        case "cosmicPulse":
            return <div className="cosmicPulse" style={{ width: size, height: size, animationDuration: speed + "s" }} />;
        case "lavaFlow":
            return <div className="lavaFlow" style={{ width: size, height: size, animationDuration: speed + "s" }} />;
        case "plasmaOrbs":
            return (
                <div className="plasmaOrbs">
                    {[...Array(params.count)].map((_, i) => (
                        <div key={i} className="plasmaOrb" style={{ backgroundColor: color, width: size, height: size }} />
                    ))}
                </div>
            );
        case "energySwirl":
            return <div className="energySwirl" style={{ width: size, height: size, animationDuration: speed + "s" }} />;

        default:
            return null;
    }
};

export default Animation;
