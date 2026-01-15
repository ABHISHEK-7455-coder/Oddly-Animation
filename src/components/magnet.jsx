import Matter from "matter-js";

export function magnet({ engine }) {
  const handler = () => {
    engine.world.bodies.forEach(b => {
      Matter.Body.applyForce(b, b.position, { x: -0.00001, y: 0 });
    });
  };

  Matter.Events.on(engine, "beforeUpdate", handler);

  return () => Matter.Events.off(engine, "beforeUpdate", handler);
}
