import Matter from "matter-js";

export function water({ engine }) {
  const handler = () => {
    engine.world.bodies.forEach(b => {
      if (b.position.y > 400) {
        Matter.Body.applyForce(b, b.position, { x: 0, y: -0.001 });
      }
    });
  };

  Matter.Events.on(engine, "beforeUpdate", handler);
  return () => Matter.Events.off(engine, "beforeUpdate", handler);
}
