// ===== MegaPhysicsDemo.jsx =====
import React, { useRef, useEffect, useState } from 'react';
import Matter from 'matter-js';
import {
  MixedDemo, ChainsDemo, ConstraintsDemo, AvalancheDemo,
  DoublePendulumDemo, WreckingBallDemo, TimescaleDemo,
  CompoundStackDemo, RopeBridgeDemo, NewtonsCradleDemo,
  ClothDemo, MagnetFieldDemo, HelicopterRescueDemo,
  EventsDemo, FallingBuildings, FloatingLanterns,
  SandFunnelDemo, GearSystemCrankDemo,
  // AngryBirdsSlingshotDemo,
  CatapultDemo, JengaPhysicsDemo, SharedPhysicsPlaygroundDemo,
  BridgeStressTestDemo, VehicleSuspensionDemo, MagneticFieldPhysicsDemo,
  ClothWindZoneDemo, GlassShatterDemo, WindTunnelLabDemo,
  CannonDefenseDemo, BalanceGameDemo, WaterFloatingDemo
} from './demos';
import './MatterJs.css';

export default function MegaPhysicsDemo() {
  const sceneRef = useRef(null);
  const engineRef = useRef(null);
  const renderRef = useRef(null);
  const mouseConstraintRef = useRef(null);

  const previewRefs = useRef({});

  const [activeDemo, setActiveDemo] = useState(null);
  const [gravity, setGravity] = useState(0.2);
  const [spawnCount, setSpawnCount] = useState(12);
  const [running, setRunning] = useState(true);

  let TimescaleDemoCleanup = null;

  /* ================= ENGINE INIT (VIEWER) ================= */
  useEffect(() => {
    if (!sceneRef.current || !activeDemo) return;

    const { Engine, Render, Mouse, MouseConstraint, Runner } = Matter;

    const engine = Engine.create();
    engine.gravity.y = gravity;
    engineRef.current = engine;

    const width = sceneRef.current.clientWidth;
    const height = sceneRef.current.clientHeight;

    if (!width || !height) return; // 🔥 FIX: zero size guard

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

    handleSpawn(); // 🔥 now safe

    return () => {
      Render.stop(render);
      Matter.World.clear(engine.world);
      Matter.Engine.clear(engine);
      render.canvas.remove();
      render.textures = {};
    };
  }, [activeDemo]);

  /* ================= APPLY GRAVITY CHANGE ================= */
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.gravity.y = gravity;
    }
  }, [gravity]);

  /* ================= RESPAWN ON COUNT CHANGE ================= */
  useEffect(() => {
    if (activeDemo) handleSpawn();
  }, [spawnCount]);

  /* ================= PREVIEW CANVAS ================= */
  useEffect(() => {
    if (activeDemo) return;

    const { Engine, Render, World, Bodies } = Matter;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const key = entry.target.dataset.key;
        const item = previewRefs.current[key];
        if (!item) return;

        if (entry.isIntersecting) {
          if (item.running) return;
          item.running = true;

          const engine = Engine.create();
          engine.gravity.y = 0.6;
          item.engine = engine;

          const render = Render.create({
            canvas: item.canvas,
            engine,
            options: {
              width: item.canvas.offsetWidth,
              height: item.canvas.offsetHeight,
              wireframes: false,
              background: '#020617'
            }
          });
          item.render = render;

          const w = render.options.width;
          const h = render.options.height;

          World.add(engine.world, [
            Bodies.rectangle(w / 2, h + 10, w, 20, { isStatic: true }),
            Bodies.circle(w / 2 - 20, 20, 10),
            Bodies.circle(w / 2 + 20, 20, 10)
          ]);

          let last = 0;
          const fps = 10;

          const loop = (t) => {
            if (!item.running) return;
            if (t - last > 1000 / fps) {
              Matter.Engine.update(engine, 1000 / fps);
              last = t;
            }
            item.raf = requestAnimationFrame(loop);
          };

          Render.run(render);
          item.raf = requestAnimationFrame(loop);
        } else {
          item.running = false;
          cancelAnimationFrame(item.raf);

          if (item.render) Render.stop(item.render);
          if (item.engine) {
            World.clear(item.engine.world);
            Matter.Engine.clear(item.engine);
          }
        }
      });
    }, { threshold: 0.3 });

    Object.values(previewRefs.current).forEach(p => {
      if (p.canvas) observer.observe(p.canvas);
    });

    return () => observer.disconnect();
  }, [activeDemo]);

  /* ================= HELPERS ================= */
  const handleClear = () => {
    if (!engineRef.current) return;
    const engine = engineRef.current;
    const bodies = Matter.Composite.allBodies(engine.world);
    bodies.forEach(b => !b.isStatic && Matter.Composite.remove(engine.world, b));
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
      case 'sand funnel': SandFunnelDemo({ engine, render }); break;
      case 'gear crank': GearSystemCrankDemo({ engine, render }); break;
      // case 'angry bird': AngryBirdsSlingshotDemo({ engine, render }); break;
      case 'catapult': CatapultDemo({ engine, render }); break;
      case 'jenga physics': JengaPhysicsDemo({ engine, render }); break;
      case 'shared playground': SharedPhysicsPlaygroundDemo({ engine, render }); break;
      case 'bridge stress': BridgeStressTestDemo({ engine, render }); break;
      case 'vehicle suspension': VehicleSuspensionDemo({ engine, render }); break;
      case 'magnetic field': MagneticFieldPhysicsDemo({ engine, render }); break;
      case 'cloth simulation': ClothWindZoneDemo({ engine, render }); break;
      case 'glass shatter': GlassShatterDemo({ engine, render }); break;
      case 'wind tunnel': WindTunnelLabDemo({ engine, render }); break;
      case 'cannon defence': CannonDefenseDemo({ engine, render }); break;
      case 'balance game': BalanceGameDemo({ engine, render }); break;
      case 'water floating': WaterFloatingDemo({ engine, render }); break;
      default: break;
    }
  };

  const handlePauseResume = () => {
    if (!engineRef.current) return;
    const runner = engineRef.current.timing.runner;
    running
      ? Matter.Runner.stop(runner)
      : Matter.Runner.run(runner, engineRef.current);
    setRunning(!running);
  };

  /* ================= UI ================= */

  if (!activeDemo) {
    return (
      <div className="physics-gallery">
        <h1>Satisfying Physics Demos</h1>
        <p>Click a card to play simulation</p>

        <div className="physics-grid">
          {[
            ['mixed', 'Mixed'], ['chains', 'Chains'], ['avalanche', 'Avalanche'],
            ['constraints', 'Constraints'], ['double', 'Pendulum'],
            ['wreckingball', 'Wrecking Ball'], ['timescale', 'Time Scale'],
            ['compound', 'Compound'], ['rope', 'Rope'],
            ['cradle', 'Cradle'], ['cloth', 'Cloth'],
            ['magnet', 'Magnet'], ['fallings', 'Falling'],
            ['lanterns', 'Lanterns'], ['sand funnel', 'Sand Funnel'],
            ['gear crank', 'Gear Crank'],
            // ['angry bird','Angry Bird'],
            ['catapult', 'Catapult'],
            ['shared playground', 'Shared Playground'],
            ['jenga physics', 'Jenga Physics'], ['bridge stress', 'Bridge Stress'],
            ['vehicle suspension','Vehicle Suspension'], ['magnetic field','Magnetic Field'],
            ['cloth simulation','Cloth Simulation'],['glass shatter','Glass Shatter'],
            ['wind tunnel','Wind Tunnel'], ['cannon defence', 'Cannon Defence'],
            ['balance game', 'Balance Game'], ['water floating', 'Water Floating']
          ].map(([key, title]) => (
            <div key={key} className="physics-card" onClick={() => setActiveDemo(key)}>
              <canvas
                className="card-preview"
                data-key={key}
                ref={el => {
                  if (!el) return;
                  previewRefs.current[key] = {
                    canvas: el,
                    running: false,
                    raf: null,
                    engine: null,
                    render: null
                  };
                }}
              />
              <h3>{title}</h3>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="matter-container">
      <div className="matter-controls">
        <button onClick={handleSpawn}>Spawn</button>
        <button onClick={handlePauseResume}>
          {running ? 'Pause' : 'Resume'}
        </button>
        <button onClick={handleClear}>Clear</button>

        <label>
          Gravity
          <input
            type="range"
            min="-2"
            max="3"
            step="0.1"
            value={gravity}
            onChange={e => setGravity(+e.target.value)}
          />
        </label>

        <label>
          Count
          <input
            type="number"
            min="1"
            max="60"
            value={spawnCount}
            onChange={e => setSpawnCount(+e.target.value)}
          />
        </label>

        <button onClick={() => setActiveDemo(null)}>✕</button>
      </div>

      <div ref={sceneRef} className="scene-area" />
    </div>
  );
}
