// ===== MegaPhysicsDemo.jsx =====
import React, { useRef, useEffect, useState } from 'react';
import Matter from 'matter-js';
import {
  MixedDemo, ChainsDemo, ConstraintsDemo, AvalancheDemo,
  DoublePendulumDemo, WreckingBallDemo, TimescaleDemo,
  CompoundStackDemo, RopeBridgeDemo, NewtonsCradleDemo,
  ClothDemo, MagnetFieldDemo, HelicopterRescueDemo,
  EventsDemo, FallingBuildings, FloatingLanterns
} from './demos';
import './MatterJs.css';

export default function MegaPhysicsDemo() {
  const sceneRef = useRef(null);
  const engineRef = useRef(null);
  const renderRef = useRef(null);
  const mouseConstraintRef = useRef(null);

  const [activeDemo, setActiveDemo] = useState(null); // ⬅ gallery mode
  const [gravity, setGravity] = useState(0.2);
  const [spawnCount, setSpawnCount] = useState(12);
  const [running, setRunning] = useState(true);

  let TimescaleDemoCleanup = null;

  /* ================= ENGINE INIT ================= */
  useEffect(() => {
    if (!sceneRef.current || !activeDemo) return;

    const { Engine, Render, Mouse, MouseConstraint, Runner } = Matter;

    const engine = Engine.create();
    engine.gravity.y = gravity;
    engineRef.current = engine;

    const width = sceneRef.current.clientWidth;
    const height = sceneRef.current.clientHeight;

    const render = Render.create({
      element: sceneRef.current,
      engine,
      options: {
        width,
        height,
        wireframes: false,
        background: '#0f172a'
      }
    });

    renderRef.current = render;

    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.2 }
    });

    Matter.World.add(engine.world, mouseConstraint);
    mouseConstraintRef.current = mouseConstraint;

    const runner = Runner.create();
    engine.timing.runner = runner;
    Runner.run(runner, engine);
    Render.run(render);

    handleSpawn(); // ⬅ auto spawn on open

    return () => {
      Render.stop(render);
      Matter.World.clear(engine.world, false);
      Matter.Engine.clear(engine);
      render.canvas.remove();
      render.textures = {};
    };
  }, [activeDemo]);

  /* ================= HELPERS ================= */
  const handleClear = () => {
    if (!engineRef.current || !mouseConstraintRef.current) return;

    const engine = engineRef.current;
    const bodies = Matter.Composite.allBodies(engine.world);
    const constraints = Matter.Composite.allConstraints(engine.world);

    bodies.forEach(b => !b.isStatic && Matter.Composite.remove(engine.world, b));
    constraints.forEach(c => Matter.Composite.remove(engine.world, c));
  };

  const handleSpawn = () => {
    if (!engineRef.current || !renderRef.current) return;
    const engine = engineRef.current;
    const render = renderRef.current;

    handleClear();

    switch (activeDemo) {
      case 'mixed': MixedDemo({ engine, render, spawnCount }); break;
      case 'chains': ChainsDemo({ engine, render, spawnCount }); break;
      case 'avalanche': AvalancheDemo({ engine, render, spawnCount }); break;
      case 'constraints': ConstraintsDemo({ engine, render }); break;
      case 'double': DoublePendulumDemo({ engine, render }); break;
      case 'wreckingball': WreckingBallDemo({ engine, render }); break;
      case 'timescale':
        if (TimescaleDemoCleanup) TimescaleDemoCleanup();
        TimescaleDemoCleanup = TimescaleDemo({ engine, render });
        break;
      case 'compound': CompoundStackDemo({ engine, render }); break;
      case 'rope': RopeBridgeDemo({ engine, render }); break;
      case 'cradle': NewtonsCradleDemo({ engine, render }); break;
      case 'cloth': ClothDemo({ engine, render }); break;
      case 'magnet': MagnetFieldDemo({ engine, render }); break;
      case 'helicopter': HelicopterRescueDemo({ engine, render }); break;
      case 'events': EventsDemo({ engine, render }); break;
      case 'fallings': FallingBuildings({ engine, render }); break;
      case 'lanterns': FloatingLanterns({ engine, render }); break;
      default: break;
    }
  };

  const handlePauseResume = () => {
    if (!engineRef.current) return;
    const runner = engineRef.current.timing.runner;
    running ? Matter.Runner.stop(runner) : Matter.Runner.run(runner, engineRef.current);
    setRunning(!running);
  };

  /* ================= UI ================= */

  // -------- GALLERY --------
  if (!activeDemo) {
    return (
      <div className="physics-gallery">
        <h1>Satisfying Physics Demos</h1>
        <p>Click a card to play simulation</p>

        <div className="physics-grid">
          {[
            ['mixed','Mixed'], ['chains','Chains'], ['avalanche','Avalanche'],
            ['constraints','Constraints'], ['double','Pendulum'],
            ['wreckingball','Wrecking Ball'], ['timescale','Time Scale'],
            ['compound','Compound'], ['rope','Rope'],
            ['cradle','Cradle'], ['cloth','Cloth'],
            ['magnet','Magnet'], ['fallings','Falling'],
            ['lanterns','Lanterns']
          ].map(([key, title]) => (
            <div key={key} className="physics-card" onClick={() => setActiveDemo(key)}>
              <div className="card-preview" />
              <h3>{title}</h3>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // -------- VIEWER --------
  return (
    <div className="matter-container">
      <div className="viewer-topbar">
        <button onClick={() => setActiveDemo(null)}>✕</button>
        <button>🎥</button>
        <button>⬇</button>
        <button
          onClick={() =>
            navigator.share?.({ title: 'Physics Demo', url: window.location.href })
          }
        >🔗</button>
      </div>

      <div className="matter-controls">
        <button className="btn btn-indigo" onClick={handleSpawn}>Spawn</button>
        <button className="btn btn-yellow" onClick={handlePauseResume}>
          {running ? 'Pause' : 'Resume'}
        </button>
        <button className="btn btn-rose" onClick={handleClear}>Clear</button>

        <label>
          Gravity
          <input type="range" min="-2" max="3" step="0.1"
            value={gravity}
            onChange={e => setGravity(+e.target.value)}
          />
        </label>

        <label>
          Count
          <input type="number" min="1" max="60"
            value={spawnCount}
            onChange={e => setSpawnCount(+e.target.value)}
          />
        </label>
      </div>

      <div ref={sceneRef} className="scene-area" />
    </div>
  );
}
