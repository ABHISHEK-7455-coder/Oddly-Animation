// src/matter/MatterProvider.js

import React, { createContext, useEffect, useRef } from "react";
import Matter from "matter-js";

export const MatterContext = createContext(null);

export function MatterProvider({ children }) {
  const sceneRef = useRef(null);
  const engineRef = useRef(Matter.Engine.create());
  const renderRef = useRef(null);
  const runnerRef = useRef(null);

  useEffect(() => {
  const engine = engineRef.current;

  const render = Matter.Render.create({
    element: sceneRef.current,
    engine,
    options: {
      width: 800,
      height: 600,
      wireframes: false,
    },
  });

  renderRef.current = render; // 🔥 SET FIRST

  const runner = Matter.Runner.create();

  Matter.Render.run(render);
  Matter.Runner.run(runner, engine);

  runnerRef.current = runner;

  return () => {
    Matter.Render.stop(render);
    Matter.Runner.stop(runner);
    Matter.World.clear(engine.world, false);
    Matter.Engine.clear(engine);
    render.canvas.remove();
  };
}, []);


  return (
    <MatterContext.Provider
  value={{
    engine: engineRef.current,
    world: engineRef.current.world,
    render: renderRef.current
  }}
>

      <div ref={sceneRef} />
      {children}
    </MatterContext.Provider>
  );
}
