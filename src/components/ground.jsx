import Matter from "matter-js";

export function ground({ world, render }) {
  if (!render) return () => {};

  const { width, height } = render.options;

  const groundBody = Matter.Bodies.rectangle(
    width / 2,
    height - 20,
    width,
    40,
    { isStatic: true }
  );

  Matter.World.add(world, groundBody);

  return () => Matter.World.remove(world, groundBody);
}
