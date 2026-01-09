// import React, { useRef, useEffect, useState } from 'react';
// import Matter from 'matter-js';
// import "./MatterJs.css"

// // Default export React component ready to drop into a CRA/Vite app
// // Tailwind classes are used for quick styling — you can remove them or replace
// // with your own CSS if you don't have Tailwind configured.

// export default function PhysicsMixedDemo() {
//     const sceneRef = useRef(null);
//     const engineRef = useRef(null);
//     const [running, setRunning] = useState(true);
//     const [gravityScale, setGravityScale] = useState(0.1);
//     const [spawnCount, setSpawnCount] = useState(12);

//     useEffect(() => {
//         const Engine = Matter.Engine;
//         const Render = Matter.Render;
//         const World = Matter.World;
//         const Bodies = Matter.Bodies;
//         const Composite = Matter.Composite;
//         const Mouse = Matter.Mouse;
//         const MouseConstraint = Matter.MouseConstraint;

//         const engine = Engine.create();
//         engineRef.current = engine;
//         engine.gravity.y = gravityScale * 1; // default earth-like gravity

//         const width = sceneRef.current.clientWidth;
//         const height = sceneRef.current.clientHeight;

//         const render = Render.create({
//             element: sceneRef.current,
//             engine: engine,
//             options: {
//                 width,
//                 height,
//                 wireframes: false,
//                 background: '#0f172a',
//                 pixelRatio: window.devicePixelRatio || 1,
//             },
//         });
        
//         // Floor and walls
//         const wallThickness = 60;
//         const floor = Bodies.rectangle(width / 2, height + wallThickness / 2, width + 2 * wallThickness, wallThickness, { isStatic: true, render: { fillStyle: '#111827' } });
//         const leftWall = Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height, { isStatic: true, render: { fillStyle: '#111827' } });
//         const rightWall = Bodies.rectangle(width + wallThickness / 2, height / 2, wallThickness, height, { isStatic: true, render: { fillStyle: '#111827' } });
//         const ceiling = Bodies.rectangle(width / 2, -wallThickness / 2, width, wallThickness, { isStatic: true, render: { fillStyle: '#0b1220' } });

//         World.add(engine.world, [floor, leftWall, rightWall, ceiling]);

//         // Utility: random color
//         function randomColor() {
//             const palette = ['#60A5FA', '#F472B6', '#34D399', '#F59E0B', '#A78BFA', '#F87171', '#FCD34D'];
//             return palette[Math.floor(Math.random() * palette.length)];
//         }

//         // Create a mixed bunch of shapes
//         function spawnMixed(x = width / 2, y = 40, count = 8) {
//             const bodies = [];
//             for (let i = 0; i < count; i++) {
//                 const kind = Math.floor(Math.random() * 4);
//                 const size = 20 + Math.random() * 40;
//                 const opts = {
//                     restitution: 0.2 + Math.random() * 0.7,
//                     friction: 0.01 + Math.random() * 0.2,
//                     density: 0.001 + Math.random() * 0.01,
//                     render: { fillStyle: randomColor() },
//                 };

//                 let body;
//                 if (kind === 0) {
//                     body = Bodies.circle(x + Math.random() * 120 - 60, y + Math.random() * 60 - 30, size / 2, opts);
//                 } else if (kind === 1) {
//                     body = Bodies.rectangle(x + Math.random() * 120 - 60, y + Math.random() * 60 - 30, size, size * (0.6 + Math.random() * 1.2), opts);
//                 } else if (kind === 2) {
//                     const sides = 3 + Math.floor(Math.random() * 5); // triangle to heptagon
//                     body = Bodies.polygon(x + Math.random() * 120 - 60, y + Math.random() * 60 - 30, sides, size / 2, opts);
//                 } else {
//                     // compound: two rectangles joined
//                     const a = Bodies.rectangle(x + Math.random() * 120 - 60, y + Math.random() * 60 - 30, size, size / 4, opts);
//                     const b = Bodies.rectangle(a.position.x + size / 2, a.position.y, size / 4, size, opts);
//                     body = Matter.Body.create({
//                         parts: [a, b],
//                         restitution: opts.restitution,
//                         friction: opts.friction,
//                         density: opts.density,
//                         render: { fillStyle: randomColor() },
//                     });
//                 }

//                 bodies.push(body);
//             }
//             World.add(engine.world, bodies);
//         }

//         // spawn initial
//         spawnMixed(width / 2, height / 6, spawnCount);

//         // Mouse control
//         const mouse = Mouse.create(render.canvas);
//         const mouseConstraint = MouseConstraint.create(engine, {
//             mouse,
//             constraint: {
//                 stiffness: 0.2,
//                 render: { visible: false },
//             },
//         });
//         World.add(engine.world, mouseConstraint);
//         render.mouse = mouse;

//         // Run engine + renderer
//         Engine.run(engine);
//         Render.run(render);

//         // Resize handling
//         function handleResize() {
//             const w = sceneRef.current.clientWidth;
//             const h = sceneRef.current.clientHeight;
//             render.bounds.max.x = w;
//             render.bounds.max.y = h;
//             render.options.width = w;
//             render.options.height = h;
//             render.canvas.width = w;
//             render.canvas.height = h;

//             // reposition static walls
//             Matter.Body.setPosition(floor, { x: w / 2, y: h + wallThickness / 2 });
//             Matter.Body.setPosition(leftWall, { x: -wallThickness / 2, y: h / 2 });
//             Matter.Body.setPosition(rightWall, { x: w + wallThickness / 2, y: h / 2 });
//             Matter.Body.setPosition(ceiling, { x: w / 2, y: -wallThickness / 2 });
//         }
//         window.addEventListener('resize', handleResize);

//         // Cleanup
//         return () => {
//             window.removeEventListener('resize', handleResize);
//             Matter.Render.stop(render);
//             Matter.World.clear(engine.world, false);
//             Matter.Engine.clear(engine);
//             render.canvas.remove();
//             render.textures = {};
//         };
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, []);

//     // Keep gravity in sync when user changes slider
//     useEffect(() => {
//         if (engineRef.current) {
//             engineRef.current.gravity.y = gravityScale;
//         }
//     }, [gravityScale]);

//     // Controls
//     function handleSpawn() {
//         const engine = engineRef.current;
//         if (!engine) return;
//         const width = sceneRef.current.clientWidth;
//         const height = sceneRef.current.clientHeight;
//         // spawn in the top quarter
//         const spawnX = width / 2;
//         const spawnY = height / 8;
//         // create shapes programmatically by calling a small helper inside the canvas's world
//         // we can't call the internal spawnMixed closure, so re-create minimal spawn here
//         const Bodies = Matter.Bodies;
//         const World = Matter.World;
//         const bodies = [];
//         for (let i = 0; i < Math.max(4, Math.min(40, spawnCount)); i++) {
//             const kind = Math.floor(Math.random() * 4);
//             const size = 18 + Math.random() * 48;
//             const opts = {
//                 restitution: 0.2 + Math.random() * 0.7,
//                 friction: 0.01 + Math.random() * 0.2,
//                 density: 0.001 + Math.random() * 0.01,
//                 render: { fillStyle: ['#60A5FA', '#F472B6', '#34D399', '#F59E0B'][Math.floor(Math.random() * 4)] },
//             };
//             let body;
//             if (kind === 0) body = Bodies.circle(spawnX + Math.random() * 120 - 60, spawnY + Math.random() * 40 - 20, size / 2, opts);
//             else if (kind === 1) body = Bodies.rectangle(spawnX + Math.random() * 120 - 60, spawnY + Math.random() * 40 - 20, size, size * (0.6 + Math.random() * 1.2), opts);
//             else if (kind === 2) body = Bodies.polygon(spawnX + Math.random() * 120 - 60, spawnY + Math.random() * 40 - 20, 3 + Math.floor(Math.random() * 5), size / 2, opts);
//             else {
//                 const a = Bodies.rectangle(spawnX + Math.random() * 120 - 60, spawnY + Math.random() * 40 - 20, size, size / 4, opts);
//                 const b = Bodies.rectangle(a.position.x + size / 2, a.position.y, size / 4, size, opts);
//                 body = Matter.Body.create({ parts: [a, b], restitution: opts.restitution, friction: opts.friction, density: opts.density, render: { fillStyle: opts.render.fillStyle } });
//             }
//             bodies.push(body);
//         }
//         World.add(engine.world, bodies);
//     }

//     function handleClear() {
//         const engine = engineRef.current;
//         if (!engine) return;
//         // remove all non-static bodies
//         const all = Matter.Composite.allBodies(engine.world);
//         for (const b of all) {
//             if (!b.isStatic) Matter.Composite.remove(engine.world, b);
//         }
//     }

//     function handlePauseToggle() {
//         const engine = engineRef.current;
//         if (!engine) return;
//         if (running) {
//             Matter.Runner.stop(engine.timing.runner);
//             setRunning(false);
//             // simple way: set engine to sleep by lowering gravity and velocities
//         } else {
//             // start a new runner if needed
//             const runner = Matter.Runner.create();
//             engine.timing.runner = runner;
//             Matter.Runner.run(runner, engine);
//             setRunning(true);
//         }
//     }

//     return (
//         <div className="matter-container">
//             <div className="matter-controls">
//                 <button
//                     onClick={handleSpawn}
//                     className="btn btn-indigo"
//                 >
//                     Spawn {spawnCount}
//                 </button>

//                 <button
//                     onClick={handleClear}
//                     className="btn btn-rose"
//                 >
//                     Clear
//                 </button>

//                 <button
//                     onClick={() => { setRunning(s => !s); handlePauseToggle(); }}
//                     className="btn btn-yellow"
//                 >
//                     {running ? "Pause" : "Resume"}
//                 </button>

//                 <label className="label-row">
//                     Gravity
//                     <input
//                         type="range"
//                         min="-2"
//                         max="3"
//                         step="0.1"
//                         value={gravityScale}
//                         onChange={(e) => setGravityScale(parseFloat(e.target.value))}
//                         className="gravity-slider"
//                     />
//                     <span className="gravity-value">{gravityScale.toFixed(1)}</span>
//                 </label>

//                 <label className="label-row">
//                     Count
//                     <input
//                         type="number"
//                         min="1"
//                         max="60"
//                         value={spawnCount}
//                         onChange={(e) =>
//                             setSpawnCount(Math.max(1, Math.min(60, parseInt(e.target.value || "12", 10))))
//                         }
//                         className="spawn-input"
//                     />
//                 </label>

//                 <div className="hint-text">Drag with mouse to interact</div>
//             </div>

//             <div ref={sceneRef} className="scene-area" />
//         </div>
//     );
// }

// ===== INVISIBLE SIDE RAILS (ANTI-SLIP) =====
const railLeft = Bodies.rectangle(
    w / 2 - 120,
    Y - 12,
    endX - startX,
    6,
    {
        isStatic: true,
        render: { visible: false }
    }
);

const railRight = Bodies.rectangle(
    w / 2 + 120,
    Y - 12,
    endX - startX,
    6,
    {
        isStatic: true,
        render: { visible: false }
    }
);

World.add(engine.world, [railLeft, railRight]);
