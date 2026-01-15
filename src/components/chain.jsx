import Matter from "matter-js";

export function chain({ world }) {
  const group = Matter.Composites.stack(300, 100, 1, 8, 0, 5,
    (x, y) => Matter.Bodies.rectangle(x, y, 20, 20)
  );

  Matter.Composites.chain(group, 0.5, 0, -0.5, 0, { stiffness: 1 });

  Matter.World.add(world, group);

  return () => Matter.Composite.remove(world, group);
}
