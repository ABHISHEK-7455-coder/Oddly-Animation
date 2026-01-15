import Matter from "matter-js";

export function wind({ engine }) {
    const handler = () => {
        engine.world.bodies.forEach(b =>
            Matter.Body.applyForce(b, b.position, { x: 0.0005, y: 0 })
        );
    };

    Matter.Events.on(engine, "beforeUpdate", handler);
    return () => Matter.Events.off(engine, "beforeUpdate", handler);
}
