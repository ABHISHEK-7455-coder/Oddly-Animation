// src/demos/demoList.jsx

/**
 * Each demo is just a CONFIG.
 * No Matter.js code here.
 * Mixer + Renderer will read this.
 */

export const demos = [
  {
    id: "falling-balls-basic",
    name: "Falling Balls",
    duration: 6000,
    components: [
      { name: "ground" },
      { name: "fallingBalls", options: { count: 15 } }
    ]
  },

  {
    id: "blocks-stack",
    name: "Block Stack",
    duration: 6000,
    components: [
      { name: "ground" },
      { name: "blocks" }
    ]
  },

  {
    id: "cannon-vs-blocks",
    name: "Cannon vs Blocks",
    duration: 8000,
    components: [
      { name: "ground" },
      { name: "blocks" },
      { name: "cannon" }
    ]
  },

  {
    id: "chain-demo",
    name: "Chain Physics",
    duration: 6000,
    components: [
      { name: "ground" },
      { name: "chain" }
    ]
  },

  {
    id: "pendulum-demo",
    name: "Pendulum Motion",
    duration: 6000,
    components: [
      { name: "ground" },
      { name: "pendulum" }
    ]
  },

  {
    id: "wind-effect",
    name: "Wind Effect",
    duration: 7000,
    components: [
      { name: "ground" },
      { name: "fallingBalls", options: { count: 10 } },
      { name: "wind" }
    ]
  },

  {
    id: "magnet-attraction",
    name: "Magnetic Attraction",
    duration: 7000,
    components: [
      { name: "ground" },
      { name: "fallingBalls", options: { count: 12 } },
      { name: "magnet" }
    ]
  },

  {
    id: "explosion-chaos",
    name: "Explosion Chaos",
    duration: 5000,
    components: [
      { name: "ground" },
      { name: "blocks" },
      { name: "explosion" }
    ]
  },

  {
    id: "water-floating",
    name: "Water Floating",
    duration: 8000,
    components: [
      { name: "ground" },
      { name: "fallingBalls", options: { count: 8 } },
      { name: "water" }
    ]
  },

  {
    id: "mega-combo",
    name: "Mega Combo Demo",
    duration: 10000,
    components: [
      { name: "ground" },
      { name: "blocks" },
      { name: "cannon" },
      { name: "wind" },
      { name: "magnet" }
    ]
  }
];
