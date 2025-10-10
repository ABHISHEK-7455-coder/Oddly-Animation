// src/data/animationsData.js

const animationsData = [
  {
    name: "Wavy Motion",
    type: "wavyMotion",
    style: `
      .wavyMotion {
        width: 100px;
        height: 100px;
        background: linear-gradient(45deg, #f0f, #0ff);
        border-radius: 50%;
        animation: wave 2s ease-in-out infinite;
      }

      @keyframes wave {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-20px) scale(1.1); }
      }
    `
  },
  {
    name: "Rotating Square",
    type: "rotateSquare",
    style: `
      .rotateSquare {
        width: 80px;
        height: 80px;
        background: #ff0;
        animation: spin 3s linear infinite;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `
  },
  {
    name: "Pulsing Dot",
    type: "pulsingDot",
    style: `
      .pulsingDot {
        width: 50px;
        height: 50px;
        background: #4caf50;
        border-radius: 50%;
        animation: pulse 1.5s ease-in-out infinite;
      }

      @keyframes pulse {
        0%, 100% { transform: scale(1); opacity: 0.6; }
        50% { transform: scale(1.3); opacity: 1; }
      }
    `
  },
  {
    name: "Orbit Glow",
    type: "orbitGlow",
    style: `
      .orbitGlow {
        position: relative;
        width: 120px;
        height: 120px;
        border-radius: 50%;
        animation: rotate 4s linear infinite;
      }

      .orbitGlow::before {
        content: '';
        position: absolute;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: radial-gradient(circle, #0ff, #00f);
        top: 0;
        left: 50%;
        transform: translateX(-50%);
      }

      @keyframes rotate {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `
  }
];

export default animationsData;
