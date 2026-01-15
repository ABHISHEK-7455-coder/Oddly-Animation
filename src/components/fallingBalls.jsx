import Matter from "matter-js";

export function fallingBalls({ world }, { count = 10 } = {}) {
  const balls = [];

  for (let i = 0; i < count; i++) {
    const ball = Matter.Bodies.circle(200 + i * 20, 0, 15);
    balls.push(ball);
  }

  Matter.World.add(world, balls);

  return () => balls.forEach(b => Matter.World.remove(world, b));
}

