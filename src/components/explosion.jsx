import Matter from "matter-js";

export function explosion({ world }) {
  world.bodies.forEach(b =>
    Matter.Body.applyForce(b, b.position, {
      x: (Math.random() - 0.5) * 0.05,
      y: -0.05
    })
  );

  return () => {};
}
