import Matter from "matter-js";

export function pendulum({ world }) {
  const bob = Matter.Bodies.circle(500, 300, 20);
  const constraint = Matter.Constraint.create({
    pointA: { x: 500, y: 100 },
    bodyB: bob
  });

  Matter.World.add(world, [bob, constraint]);

  return () => {
    Matter.World.remove(world, bob);
    Matter.World.remove(world, constraint);
  };
}
