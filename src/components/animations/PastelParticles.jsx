// src/components/animations/PastelParticles.jsx
import React, { useEffect } from "react";
import "../../styles/Animation.css";

const PastelParticles = ({ color = "#ff8c94", size = 8, speed = 4 }) => {
    useEffect(() => {
        const container = document.querySelector(".pastel-particles-container");
        if (!container) return;

        const particleCount = 50;
        const particles = [];

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement("div");
            particle.classList.add("pastel-particle");
            const randomX = Math.random() * window.innerWidth;
            const randomY = Math.random() * window.innerHeight;
            const delay = Math.random() * speed;

            particle.style.left = `${randomX}px`;
            particle.style.top = `${randomY}px`;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.backgroundColor = color;
            particle.style.animationDuration = `${speed + delay}s`;

            container.appendChild(particle);
            particles.push(particle);
        }

        return () => particles.forEach((p) => p.remove());
    }, [color, size, speed]);

    return <div className="pastel-particles-container"></div>;
};

export default PastelParticles;
