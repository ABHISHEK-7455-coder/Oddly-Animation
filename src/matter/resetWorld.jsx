// src/matter/resetWorld.js

import Matter from "matter-js";

export function resetWorld({ engine }) {
  const world = engine.world;

  Matter.World.clear(world, false);
  Matter.Engine.clear(engine);

  // reset defaults
  engine.gravity.x = 0;
  engine.gravity.y = 1;
  engine.timing.timeScale = 1;
}
