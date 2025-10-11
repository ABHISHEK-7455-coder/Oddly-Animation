const animationsData = [
    {
        name: "Floating Spheres",
        type: "floatingSpheres",

        params: {
            count: 6, color: "#8cf5ff",
            speed: 1.6,
            size: 100,
        }
    },

    {
        name: "Fluid Blob",
        type: "fluidBlob",
        params: {
            color: "#ff3f81",
            size: 120, speed: 1.8
        }
    },
    {
        name: "Neon Swirl",
        type: "neonSwirl",
        params: {
            color: "#0ff",
            size: 100, speed: 1.5
        }
    },
    {
        name: "Hypnotic Rings",
        type: "hypnoticRings",
        params: {
            color: "#f0f",
            size: 150, speed: 2
        }
    },
    {
        name: "Color Wave",
        type: "colorWave",
        params: {
            colors: ["#ff0", "#0f0", "#00f"],
            size: 120, speed: 1.5
        }
    },
    {
        name: "Orbiting Spheres",
        type: "orbitSpheres",
        params: {
            color: "#fff",
            size: 80, speed: 1.2, count: 8
        }
    },
    {
        name: "Gooey Merge",
        type: "gooeyMerge",
        params: {
            color: "#f0f",
            size: 90, speed: 2
        }
    },
    {
        name: "Pastel Dots",
        type: "pastelDots",
        params: {
            colors: ["#ffb3ba", "#ffdfba", "#ffffba"],
            size: 10, speed: 1
        }
    },
    {
        name: "Rainbow Pulse",
        type: "rainbowPulse",
        params: {
            size: 100,
            speed: 1.5
        }
    },
    {
        name: "Elastic Bounce",
        type: "elasticBounce",
        params: {
            color: "#4caf50",
            size: 80, speed: 1.4
        }
    },
    {
        name: "Spiral Motion",
        type: "spiralMotion",
        params: {
            color: "#ff5722",
            size: 120, speed: 1.6
        }
    },
    {
        name: "Liquid Ripple",
        type: "liquidRipple",
        params: {
            color: "#0ff",
            size: 120, speed: 2
        }
    },
    {
        name: "Starfield",
        type: "starfield",
        params: {
            color: "#fff",
            size: 50, speed: 1
        }
    },
    {
        name: "Pulse Rings",
        type: "pulseRings",
        params: {
            color: "#ff0",
            size: 120, speed: 1.8
        }
    },
    {
        name: "Morphing Polygon",
        type: "morphPolygon",
        params: {
            color: "#ff4081",
            size: 100, speed: 1.5
        }
    },
    {
        name: "Hypnotic Grid",
        type: "hypnoticGrid",
        params: {
            color: "#0ff",
            size: 150, speed: 1.4
        }
    },
    {
        name: "Wavy Lines",
        type: "wavyLines",
        params: {
            color: "#f0f",
            size: 100, speed: 1.5
        }
    },
    {
        name: "Bubble Rise",
        type: "bubbleRise",
        params: {
            color: "#4caf50",
            size: 20, count: 30, speed: 1.6
        }
    },
    {
        name: "Cosmic Swirl",
        type: "cosmicSwirl",
        params: {
            colors: ["#ff0", "#f0f", "#0ff"],
            size: 150, speed: 1.8
        }
    },
    {
        name: "Kaleidoscope",
        type: "kaleidoscope",
        params: { colors: ["#ff0", "#0f0", "#00f"], size: 150, speed: 2 }
    },
    {
        name: "Neon Trail",
        type: "neonTrail",
        params: {
            color: "#0ff",
            size: 50, count: 50, speed: 1.5
        }
    },
    {
        name: "Orbiting Blobs",
        type: "orbitBlobs",
        params: {
            color: "#ff4081",
            size: 30, count: 8, speed: 1.6
        }
    },
    {
        name: "Color Spiral",
        type: "colorSpiral",
        params: {
            colors: ["#ff0", "#f0f", "#0ff"],
            size: 120, speed: 1.7
        }
    },
    {
        name: "Hypnotic Wave",
        type: "hypnoticWave",
        params: {
            color: "#4caf50",
            size: 100, speed: 1.6
        }
    },
    {
        name: "Soft Gradient Flow",
        type: "softGradientFlow",
        params: {
            colors: ["#ffb3ba", "#bae1ff", "#baffc9"],
            size: 150, speed: 1.5
        }
    },
    {
        name: "Elastic Rings",
        type: "elasticRings",
        params: {
            color: "#ff0",
            size: 120, speed: 1.8
        }
    },
    {
        name: "Pulsing Dots",
        type: "pulsingDots",
        params: {
            color: "#0ff",
            size: 15, count: 40, speed: 1.5
        }
    },
    {
        name: "Fractal Spiral",
        type: "fractalSpiral",
        params: {
            color: "#f0f",
            size: 150, speed: 1.6
        }
    },
    {
        name: "Orbit Rings",
        type: "orbitRings",
        params: {
            color: "#ff4081",
            size: 120, speed: 1.5, count: 6
        }
    },
    {
        name: "Glow Circles",
        type: "glowCircles",
        params: {
            color: "#0ff",
            size: 100, speed: 1.4
        }
    },
    {
        name: "Particle Explosion",
        type: "particleExplosion",
        params: {
            color: "#ff0",
            size: 10, count: 50, speed: 1.6
        }
    },
    {
        name: "Pastel Spiral",
        type: "pastelSpiral",
        params: {
            colors: ["#ffb3ba", "#ffdfba", "#ffffba"],
            size: 120, speed: 1.5
        }
    },
    {
        name: "Hypnotic Ripple",
        type: "hypnoticRipple",
        params: {
            color: "#4caf50",
            size: 120, speed: 1.6
        }
    },
    {
        name: "Morphing Wave",
        type: "morphingWave",
        params: {
            color: "#0ff",
            size: 120, speed: 1.5
        }
    },
    {
        name: "Rainbow Orbit",
        type: "rainbowOrbit",
        params: {
            colors: ["#f00", "#0f0", "#00f"],
            size: 120, speed: 1.6
        }
    },
    {
        name: "Neon Rings",
        type: "neonRings",
        params: {
            color: "#ff0",
            size: 120, speed: 1.5
        }
    },
    {
        name: "Soft Pulse",
        type: "softPulse",
        params: {
            color: "#f0f",
            size: 120, speed: 1.4
        }
    },
    {
        name: "Wave Circles",
        type: "waveCircles",
        params: {
            color: "#4caf50",
            size: 100, speed: 1.5
        }
    },
    {
        name: "Hypnotic Motion",
        type: "hypnoticMotion",
        params: {
            colors: ["#ff0", "#0ff", "#f0f"],
            size: 120, speed: 1.6
        }
    },
    {
        name: "Gooey Blobs",
        type: "gooeyBlobs",
        params: {
            color: "#ff4081",
            size: 90, speed: 1.5
        }
    },
    {
        name: "Color Fusion",
        type: "colorFusion",
        params: {
            colors: ["#ff0", "#f0f", "#0ff"],
            size: 120, speed: 1.5
        }
    },
    {
        name: "Pulse Wave",
        type: "pulseWave",
        params: {
            color: "#0ff",
            size: 120, speed: 1.6
        }
    },
    {
        name: "Elastic Spiral",
        type: "elasticSpiral",
        params: {
            color: "#ff0",
            size: 120, speed: 1.5
        }
    },
    {
        name: "Orbit Glow",
        type: "orbitGlow",
        params: {
            color: "#4caf50",
            size: 120, speed: 1.4, count: 8
        }
    },
    {
        name: "Soft Blobs",
        type: "softBlobs",
        params: {
            color: "#0ff",
            size: 120, speed: 1.5
        }
    },
    {
        name: "Rainbow Flow",
        type: "rainbowFlow",
        params: {
            colors: ["#f00", "#0f0", "#00f"],
            size: 120, speed: 1.6
        }
    },
    {
        name: "Hypnotic Rings 2",
        type: "hypnoticRings2",
        params: {
            color: "#ff4081",
            size: 150, speed: 1.5
        }
    },
    {
        name: "Neon Spiral",
        type: "neonSpiral",
        params: {
            color: "#0ff",
            size: 120, speed: 1.6
        }
    },
    {
        name: "Pastel Glow",
        type: "pastelGlow",
        params: {
            colors: ["#ffb3ba", "#ffdfba", "#ffffba"],
            size: 120, speed: 1.5
        }
    },
    {
        name: "Elastic Motion",
        type: "elasticMotion",
        params: {
            color: "#f0f",
            size: 120, speed: 1.4
        }
    },
];

export default animationsData;
