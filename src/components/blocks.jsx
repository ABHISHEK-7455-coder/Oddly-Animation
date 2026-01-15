import Matter from "matter-js";

export function blocks({ world }) {
  const stack = Matter.Composites.stack(400, 300, 5, 5, 0, 0, (x, y) =>
    Matter.Bodies.rectangle(x, y, 40, 40)
  );

  Matter.World.add(world, stack);

  return () => Matter.Composite.remove(world, stack);
}
