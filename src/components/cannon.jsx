import Matter from "matter-js";

export function cannon({ engine, world }) {
  const interval = setInterval(() => {
    const ball = Matter.Bodies.circle(100, 400, 12);
    Matter.Body.setVelocity(ball, { x: 15, y: -10 });
    Matter.World.add(world, ball);
  }, 800);

  return () => clearInterval(interval);
}
