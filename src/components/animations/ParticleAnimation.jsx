import React, { useEffect } from "react";
import "./ParticleAnimation.css"; // Import the CSS for styling

const ParticleAnimation = () => {
  useEffect(() => {
    // Generate particles dynamically in a circular pattern
    const particleContainer = document.querySelector(".particle-container");

    const numberOfParticles = 50;  // Number of particles
    const radius = 150;  // Radius of the circle
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    // Create particles
    for (let i = 0; i < numberOfParticles; i++) {
      const particle = document.createElement("div");
      particle.classList.add("particle");

      // Angle to calculate each particle's position
      const angle = (i / numberOfParticles) * 2 * Math.PI;

      // Calculate x and y position for circular motion
      const xPosition = centerX + radius * Math.cos(angle);
      const yPosition = centerY + radius * Math.sin(angle);

      particle.style.left = `${xPosition}px`;
      particle.style.top = `${yPosition}px`;

      // Append particle to the container
      particleContainer.appendChild(particle);

      // Random animation duration for each particle
      const animationDuration = Math.random() * (5 - 3) + 3; // Between 3s and 5s
      particle.style.animationDuration = `${animationDuration}s`;
    }

    // Clean up particles when component is unmounted
    return () => {
      const particles = document.querySelectorAll(".particle");
      particles.forEach((particle) => {
        particle.remove();
      });
    };
  }, []);

  return <div className="particle-container"></div>;
};

export default ParticleAnimation;
